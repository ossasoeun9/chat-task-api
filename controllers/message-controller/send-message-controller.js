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
import FileDB from "../../models/file-model.js"
import Url from "../../models/url-model.js"
import { msgToJson } from "../../utils/msg-to-json.js"
import { sendMessageToClient } from "../ws-message-controller.js"

const sendText = async (req, res) => {
  const { _id } = req.user
  const { roomId } = req.params
  const { text, ref_message } = req.body
  if (!text) return res.status(400).json({ message: "Text is required" })
  Message.create({
    sender: _id,
    type: 2,
    text,
    room: roomId,
    ref_message
  })
    .then(async (value) => {
      sendMessageToClient(value, roomId)
      res.json(msgToJson(value, _id))
    })
    .catch((error) => {
      res.status(500).json({ error })
    })
}

const forwardMessage = async (req, res) => {
  const { _id } = req.user
  const { roomId } = req.params
  var ref_message = req.body.ref_message
  if (!ref_message)
    return res.status(400).json({ message: "Ref message is required" })
  const message = await Message.findById(ref_message)
  if (message && message.type == 3 && message.ref_message) {
    ref_message = message.ref_message._id
  }
  Message.create({
    sender: _id,
    room: roomId,
    ref_message,
    type: 3
  })
    .then(async (value) => {
      sendMessageToClient(value, roomId)
      res.json(msgToJson(value, _id))
    })
    .catch((error) => {
      res.status(500).json({ error })
    })
}

const sendVoice = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.roomId
  const { voice } = req.files
  var ref_message = req.body.ref_message

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
    "_" +
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
      duration,
      room: roomId,
      owner: _id
    })

    Message.create({
      sender: _id,
      room: roomId,
      type: 4,
      voice: newVoice._id,
      ref_message
    })
      .then(async (value) => {
        sendMessageToClient(value, roomId)
        res.json(msgToJson(value, _id))
      })
      .catch((error) => {
        res.status(500).json({ error })
      })
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
  var ref_message = req.body.ref_message
  if (!media) return res.status(400).json({ message: "Media is required" })

  try {
    if (Array.isArray(media)) {
      var resMedia = []
      for (let i = 0; i < media.length; i++) {
        const element = media[i]
        var sss = await storeMedia(element.path, roomId, _id)
        sss.original_name = path.basename(element.originalFilename)
        resMedia.push(sss)
      }
      const newMedia = await Media.insertMany(resMedia)
      Message.create({
        sender: _id,
        room: roomId,
        text,
        type: 5,
        media: newMedia,
        ref_message
      })
        .then(async (value) => {
          sendMessageToClient(value, roomId)
          res.json(msgToJson(value, _id))
        })
        .catch((error) => {
          res.status(500).json({ error })
        })
    } else {
      const resMedia = await storeMedia(media.path, roomId, _id)
      var newMedia = await Media.create(resMedia)
      newMedia.original_name = path.basename(media.originalFilename)
      Message.create({
        sender: _id,
        room: roomId,
        text,
        type: 5,
        media: [newMedia._id],
        ref_message
      })
        .then(async (value) => {
          sendMessageToClient(value, roomId)
          res.json(msgToJson(value, _id))
        })
        .catch((error) => {
          res.status(500).json({ error })
        })
    }
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const storeMedia = async (filePath, roomId, userId) => {
  const is_video = isVideo(filePath)
  const size = getFileSize(filePath)

  const dir = `storage/media/${roomId}/`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const filename =
    Date.now() + "_" + randomBytes(6).toString("hex") + path.extname(filePath)

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
      is_video,
      room: roomId,
      owner: userId
    }
  }

  return {
    filename,
    size,
    is_video,
    room: roomId,
    owner: userId
  }
}

const sendFiles = async (req, res) => {
  const { _id } = req.user
  const { text } = req.body
  const { roomId } = req.params
  const { files } = req.files
  var ref_message = req.body.ref_message
  if (!files) return res.status(400).json({ message: "Files is required" })

  try {
    if (Array.isArray(files)) {
      var resFiles = []
      for (let i = 0; i < files.length; i++) {
        const element = files[i]
        var sss = storeFile(element.path, roomId, _id)
        sss.original_name = path.basename(element.originalFilename)
        resFiles.push(sss)
      }
      const newFile = await FileDB.insertMany(resFiles)
      Message.create({
        sender: _id,
        room: roomId,
        text,
        type: 6,
        files: newFile,
        ref_message
      })
        .then(async (value) => {
          sendMessageToClient(value, roomId)
          res.json(msgToJson(value, _id))
        })
        .catch((error) => {
          res.status(500).json({ error })
        })
    } else {
      var resFile = storeFile(files.path, roomId, _id)
      resFile.original_name = path.basename(files.originalFilename)
      const newFile = await FileDB.create(resFile)
      Message.create({
        sender: _id,
        room: roomId,
        text,
        type: 6,
        files: [newFile._id],
        ref_message
      })
        .then(async (value) => {
          sendMessageToClient(value, roomId)
          res.json(msgToJson(value, _id))
        })
        .catch((error) => {
          res.status(500).json({ error })
        })
    }
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const storeFile = (filePath, roomId, userId) => {
  const size = getFileSize(filePath)

  const dir = `storage/files/${roomId}/`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const filename =
    Date.now() + "_" + randomBytes(6).toString("hex") + path.extname(filePath)

  const fullPath = path.normalize(`${dir}/${filename}`)

  const content = fs.readFileSync(filePath)

  // write
  fs.writeFileSync(fullPath, content)

  // clear tmp dir
  fs.unlinkSync(filePath)

  return {
    filename,
    size,
    room: roomId,
    owner: userId
  }
}

const sendUrl = async (req, res) => {
  const { _id } = req.user
  const { url, is_preview, text } = req.body
  var ref_message = req.body.ref_message
  if (!(url && is_preview))
    return res.status(400).json({ message: "Url & is_preview required" })

  try {
    const newUrl = await Url.create({
      link: url,
      is_preview: is_preview == 1,
      room: req.params.roomId,
      owner: _id,
      ref_message
    })
    Message.create({
      sender: _id,
      url: newUrl,
      type: 7,
      text,
      room: req.params.roomId
    })
      .then(async (value) => {
        sendMessageToClient(value, req.params.roomId)
        res.json(msgToJson(value, _id))
      })
      .catch((error) => {
        res.status(500).json({ error })
      })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export { sendText, forwardMessage, sendVoice, sendMedia, sendFiles, sendUrl }
