import Message from "../../models/message-model.js"

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
  res.send("Voice Message")
}

const sendMedia = async (req, res) => {
  res.send("Send Media")
}

const sendFiles = async (req, res) => {
  res.send("Send Files")
}

const sendUrl = async (req, res) => {
  res.send("Send Url")
}

export { sendText, forwardMessage, sendVoice, sendMedia, sendFiles, sendUrl }
