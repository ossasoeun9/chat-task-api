import Message from "../../models/message-model.js"
import { randomBytes } from "crypto"
import path from "path"
import fs from "fs"
import Voice from "../../models/voice-model.js"
import { getFileSize } from "../../utils/file-utils.js"
import { getAudioDurationInSeconds } from "get-audio-duration"
import { isVideo } from "../../utils/file-type.js"
import { getVideoDurationInSeconds } from "get-video-duration"
import Media from "../../models/media-model.js"

const sendText = async (req, res) => {
  const { text, ref_message } = req.body
  if (!text) return res.status(400).json({ message: "Text is required" })
  try {
    const message = await Message.create({
      sender: req.user._id,
      type: 2,
      text,
      room: req.params.roomId,
      ref_message
    })
    return res.json(message)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const forwardMessage = async (req, res) => {
  const { _id } = req.user
  const { roomId } = req.params
  var ref_message = req.body.ref_message
  if (!ref_message)
    return res.status(400).json({ message: "Ref message is required" })
  const message = await Message.findById(ref_message)
  if (message.type == 3) {
    ref_message = message.ref_message._id
  }
  const newMessage = await Message.user(_id).create({
    sender: _id,
    room: roomId,
    ref_message,
    type: 3
  })
  return res.json(newMessage)
}

const sendVoice = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.roomId
  const { voice } = req.files

  if (!voice)
    return res.status(400).json({
      message: "Voice is required"
    })

  const dir = `storage/voice-messages/${roomId}/`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const filename =
    Date.now() +
    "." +
    randomBytes(6).toString("hex") +
    path.extname(voice.originalFilename)

  const fullPath = path.normalize(`${dir}/${filename}`)
  try {
    // read
    const content = fs.readFileSync(voice.path)

    // write
    fs.writeFileSync(fullPath, content)
    const size = getFileSize(fullPath)
    const duration = (await getAudioDurationInSeconds(fullPath)) * 1000

    // clear tmp dir
    fs.unlinkSync(voice.path)

    const newVoice = await Voice.create({
      filename,
      size,
      duration
    })

    const newMessage = await Message.user(_id).create({
      sender: _id,
      room: roomId,
      type: 4,
      voice: newVoice._id
    })
    return res.json(newMessage)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const sendMedia = async (req, res) => {
  const { _id } = req.user
  const { text } = req.body
  const { roomId } = req.params
  const { media } = req.files
  if (!media) return res.status(400).json({ message: "Media is required" })

  try {
    if (Array.isArray(media)) {
      var resMedia = []
      for (let i = 0; i < media.length; i++) {
        const element = media[i]
        const sss = await storeMedia(element.path, roomId)
        resMedia.push(sss)
      }
      const newMedia = await Media.insertMany(resMedia)
      const newMessage = await Message.create({
        sender: _id,
        room: roomId,
        text,
        type: 5,
        media: newMedia
      })
      return res.json(newMessage)
    } else {
      const resMedia = await storeMedia(media.path, roomId)
      const newMedia = await Media.create(resMedia)
      const newMessage = await Message.create({
        sender: _id,
        room: roomId,
        text,
        type: 5,
        media: [newMedia._id]
      })
      return res.json(newMessage)
    }
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const storeMedia = async (filePath, roomId) => {
  const is_video = isVideo(filePath)
  const size = getFileSize(filePath)

  const dir = `storage/media/${roomId}/`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const filename =
    Date.now() + "." + randomBytes(6).toString("hex") + path.extname(filePath)

  const fullPath = path.normalize(`${dir}/${filename}`)

  const content = fs.readFileSync(filePath)

  // write
  fs.writeFileSync(fullPath, content)

  // clear tmp dir
  fs.unlinkSync(filePath)

  if (is_video) {
    const duration = (await getVideoDurationInSeconds(fullPath)) * 1000
    return {
      filename,
      size,
      duration,
      is_video
    }
  }

  return {
    filename,
    size,
    is_video
  }
}

const sendFiles = async (req, res) => {
  res.send("Send Files")
}

const sendUrl = async (req, res) => {
  res.send("Send Url")
}

export { sendText, forwardMessage, sendVoice, sendMedia, sendFiles, sendUrl }
