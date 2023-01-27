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
  const { page = 1, limit = 10 } = req.query
  const { roomId } = req.params
  const messages = await Message.user(req.user._id).paginate(
    { room: roomId },
    { page, limit, sort: { created_at: -1 } }
  )
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
    case "7'":
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
  res.send("Delete Message")
}

export { getMessage, sendMessage, editMessage, deleteMessage }
