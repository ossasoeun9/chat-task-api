import Message from "../../models/message-model.js"
import {
  forwardMessage,
  sendFiles,
  sendMedia,
  sendText,
  sendUrl,
  sendVoice
} from "./send-message-controller.js"

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
      const messageUpdated = await Message.user(_id).updateMany(
        { _id: { $in: messagesJson } },
        { $addToSet: { deleted_by: [_id] } }
      )
      return res.json(messageUpdated)
    } catch (error) {
      return res.json({ error })
    }
  }
}

export { getMessage, sendMessage, editMessage, deleteMessage }
