import path from "path"
import fs from "fs"
import Message from "../../models/message-model.js"
import {
  forwardMessage,
  sendFiles,
  sendMedia,
  sendText,
  sendUrl,
  sendVoice
} from "./send-message-controller.js"
import Media from "../../models/media-model.js"
import FileDB from "../../models/file-model.js"
import Voice from "../../models/voice-model.js"
import ChatRoom from "../../models/chat-room-model.js"

const getMessage = async (req, res) => {
  const { _id } = req.user
  const { search, page = 1, limit = 10 } = req.query
  const { roomId } = req.params
  const query =
    search && search.length > 0
      ? {
          room: roomId,
          deleted_by: { $nin: [_id] },
          text: new RegExp(search, "i")
        }
      : { room: roomId, deleted_by: { $nin: [_id] } }
  const messages = await Message.user(req.user._id).paginate(query, {
    page,
    limit,
    sort: { created_at: -1 }
  })
  return res.json(messages)
}

const readMessage = async (req, res) => {
  const { _id } = req.user
  const { roomId } = req.params

  try {
    const message = await Message.user(_id).updateMany(
      {
        $and: [
          { room: roomId },
          { sender: { $ne: _id } },
          { read_by: { $nin: [_id] } },
          { deleted_by: { $nin: [_id] } }
        ]
      },
      {
        $addToSet: { read_by: [_id] }
      }
    )
    return res.json(message)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const sendMessage = async (req, res) => {
  const { type } = req.body
  if (!type) return res.status(400).json({ message: "Type is required" })
  switch (type) {
    case "2":
      return sendText(req, res)
    case "3":
      return forwardMessage(req, res)
    case "4":
      return sendVoice(req, res)
    case "5":
      return sendMedia(req, res)
    case "6":
      return sendFiles(req, res)
    case "7":
      return sendUrl(req, res)
    default:
      return res.status(400).json({ message: "Type is invalid" })
  }
}

const editMessage = async (req, res) => {
  const { _id } = req.user
  const { messageId } = req.params
  const { text } = req.body
  if (!text) return res.status(400).json({ message: "Text is required" })
  const message = await Message.user(_id).findById(messageId)
  if (!message)
    return res.status(400).json({ message: "Message id is invalid" })
  message.text = text
  const newMessage = await message.save()
  return res.json(newMessage)
}

const crearHistory = async (req, res) => {
  const { roomId } = req.params
  try {
    await Message.updateMany(
      { $and: [{ room: roomId }, { deleted_by: { $nin: [req.user._id] } }] },
      { $addToSet: { deleted_by: [req.user._id] } }
    )
    return res.json({ message: "Clear" })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const deleteMessage = async (req, res) => {
  const { _id } = req.user
  const { messages, for_everyone } = req.body
  if (!(messages && for_everyone))
    return res
      .status(400)
      .json({ message: "Messages && for_everyone is required" })

  const messagesJson = JSON.parse(messages)
  if (!Array.isArray(messagesJson))
    return res.status(400).json({ message: "Messages must be array" })

  if (for_everyone != 1) {
    try {
      await Message.user(_id).updateMany(
        { _id: { $in: messagesJson } },
        { $addToSet: { deleted_by: [_id] } }
      )
      return res.json({ message: "Deleted" })
    } catch (error) {
      return res.json({ error })
    }
  } else {
    try {
      const messages = await Message.find({
        $and: [{ _id: { $in: messagesJson } }, { sender: _id }]
      })
      for (var i = 0; i < messages.length; i++) {
        const { type, room, media, files, voice } = messages[i]
        if (type == 4) {
          fs.unlinkSync(
            path.normalize(`storage/voice-messages/${room}/${voice.filename}`)
          )
          await Voice.deleteOne({ _id: voice._id })
        }
        if (type == 5) {
          for (var f = 0; f < media.length; f++) {
            const md = media[f]
            fs.unlinkSync(
              path.normalize(`storage/media/${room}/${md.filename}`)
            )
          }
          await Media.deleteMany({
            _id: { $in: media.map((v) => v._id.valueOf()) }
          })
        }
        if (type == 6) {
          for (var f = 0; f < files.length; f++) {
            const fi = files[f]
            fs.unlinkSync(
              path.normalize(`storage/files/${room}/${fi.filename}`)
            )
          }
          await FileDB.deleteMany({
            _id: { $in: files.map((v) => v._id.valueOf()) }
          })
        }
      }
      await Message.deleteMany({
        $and: [{ _id: { $in: messagesJson } }, { sender: _id }]
      })
      await Message.user(_id).updateMany(
        { $and: [{ _id: { $in: messagesJson } }] },
        { $addToSet: { deleted_by: [_id] } }
      )
      return res.json({ message: "Deleted" })
    } catch (error) {
      return res.json({ error })
    }
  }
}

export {
  getMessage,
  readMessage,
  sendMessage,
  editMessage,
  crearHistory,
  deleteMessage
}
