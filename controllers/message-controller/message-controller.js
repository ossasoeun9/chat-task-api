import Message from "../../models/message-model.js"
import {
  forwardMessage,
  sendFiles,
  sendMedia,
  sendText,
  sendUrl,
  sendVoice
} from "./send-message-controller.js"
import { msgToJson, paginateMessageToJson } from "../../utils/msg-to-json.js"
import {
  sendMesToClient,
  sendMessageToClient,
  sendMessagesToClient
} from "../ws-message-controller.js"
import { sendToClient } from "../ws-chats-controller.js"
import ChatRoom from "../../models/chat-room-model.js"
import JSONStream from "JSONStream"
import FileDB from "../../models/file-model.js"
import Media from "../../models/media-model.js"
import Voice from "../../models/voice-model.js"
import Url from "../../models/url-model.js"

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

  const messages = await Message.paginate(query, {
    page,
    limit,
    sort: { created_at: -1 },
    populate: {
      path: "sender",
      select:
        "_id first_name last_name profile_url is_online phone_number username",
      populate: {
        path: "contact",
        select: "-created_at -updated_at",
        match: { owner: { $eq: _id } }
      }
    }
  })
  return res.json(paginateMessageToJson(messages, _id))
}

const getAllMessages = async (req, res) => {
  const { _id } = req.user
  const { roomId } = req.params
  const { latest_timestamp, is_comment = false } = req.query
  let query = {
    room: roomId,
    is_comment
  }

  if (latest_timestamp) {
    query.updated_at = { $gte: latest_timestamp, $ne: latest_timestamp }
  }

  if (latest_timestamp) {
    Message.findWithDeleted(query)
      .sort({ created_at: -1 })
      .cursor({
        transform: (data) => {
          return msgToJson(data, _id)
        }
      })
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  } else {
    query.deleted_by = { $nin: [_id] }
    Message.find(query)
      .sort({ created_at: -1 })
      .cursor({
        transform: (data) => {
          return msgToJson(data, _id)
        }
      })
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  }
}

const readMessage = async (req, res) => {
  const { _id } = req.user
  const { roomId } = req.params

  try {
    const oldMessage = await Message.find({
      $and: [
        { room: roomId },
        { sender: { $ne: _id } },
        { read_by: { $nin: [_id] } }
      ]
    }).select("_id")
    const messageIds = oldMessage.map((mes) => mes._id)
    const message = await Message.updateMany(
      {
        $and: [
          { room: roomId },
          { sender: { $ne: _id } },
          { read_by: { $nin: [_id] } }
        ]
      },
      {
        $addToSet: { read_by: [_id] }
      }
    )
    ChatRoom.findById(roomId).then((data) => {
      for (let i = 0; i < data.people.length; i++) {
        sendToClient(data.people[i]._id, roomId, 2)
      }
      for (let i = 0; i < data.members.length; i++) {
        sendToClient(data.members[i], roomId, 2)
      }
    })
    Message.find({ _id: messageIds })
      // .populate({
      //   path: "sender",
      //   select: "_id first_name last_name profile_url is_online phone_number",
      //   populate: {
      //     path: "contact",
      //     select: "-created_at -updated_at",
      //     match: { owner: { $eq: _id } }
      //   }
      // })
      .then((mes) => {
        sendMessagesToClient(mes, roomId, 2)
      })
    ChatRoom.updateOne({ _id: roomId }, { recieved_at: new Date() })
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
  const message = await Message.findById(messageId).populate({
    path: "sender",
    select: "_id first_name last_name profile_url is_online phone_number",
    populate: {
      path: "contact",
      select: "-created_at -updated_at",
      match: { owner: { $eq: _id } }
    }
  })
  if (!message)
    return res.status(400).json({ message: "Message id is invalid" })
  message.text = text
  const newMessage = await message.save()
  sendMessageToClient(message, message.room, 2)
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
  const { roomId } = req.params
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
      await Message.updateMany(
        { _id: { $in: messagesJson } },
        { $addToSet: { deleted_by: [_id] } }
      )
      sendMesToClient(_id, { ids: messagesJson }, roomId, 3)
      ChatRoom.updateOne({ _id: roomId }, { recieved_at: new Date() })
      return res.json({ message: "Deleted" })
    } catch (error) {
      return res.json({ error })
    }
  } else {
    try {
      const deletedMessage = await Message.find({
        $and: [{ _id: { $in: messagesJson } }, { sender: _id }]
      })
      let fileIds = []
      let mediaIds = []
      let voiceIds = []
      let urlIds = []
      for (let i = 0; i < deletedMessage.length; i++) {
        if (deletedMessage[i].files)
          for (let j = 0; j < deletedMessage[i].files.length; j++) {
            const file = deletedMessage[i].files[j]
            fileIds.push(file._id)
          }
        if (deletedMessage[i].media)
          for (let j = 0; j < deletedMessage[i].media.length; j++) {
            const m = deletedMessage[i].media[j]
            mediaIds.push(m._id)
          }
        if (deletedMessage[i].voice) voiceIds.push(deletedMessage[i].voice._id)
        if (deletedMessage[i].url) urlIds.push(deletedMessage[i].url._id)
      }
      await FileDB.deleteMany({ _id: fileIds })
      await Media.deleteMany({ _id: mediaIds })
      await Voice.deleteMany({ _id: voiceIds })
      await Url.deleteMany({ _id: urlIds })

      await Message.delete({
        $and: [{ _id: { $in: messagesJson } }, { sender: _id }]
      })
      await Message.updateMany(
        {
          $and: [{ _id: { $in: messagesJson } }, { sender: { $ne: _id } }]
        },
        { $addToSet: { deleted_by: [_id] } }
      )
      sendMesToClient(_id, { ids: messagesJson }, roomId, 3)
      var ids = deletedMessage.map((e) => {
        return e.id
      })
      sendMessageToClient(JSON.stringify({ ids }), roomId, 3)
      // return res.json({ deletedMessage })
      ChatRoom.updateOne({ _id: roomId }, { recieved_at: new Date() })
      return res.json({ message: "Deleted" })
    } catch (error) {
      return res.json({ error })
    }
  }
}

export {
  getMessage,
  getAllMessages,
  readMessage,
  sendMessage,
  editMessage,
  crearHistory,
  deleteMessage
}
