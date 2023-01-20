import ChatRoom from "../models/chat-room-model.js"
import Message from "../models/message-model.js"
import messageValidator from "../utils/message-validator.js"

const getChatRoom = async (req, res) => {
  const { _id } = req.user
  const chats = await ChatRoom.find({ members: _id })
    .populate("latest_message")
    .sort("updated_at")
  return res.json(chats)
}

const createChatRoom = async (req, res) => {
  const { room_type } = req.body

  if (!room_type) {
    return res.status(400).json({ message: "Room type is required" })
  }

  if (room_type < 2 || room_type > 4) {
    return res.status(400).json({ message: "Invalid room type (2-4)" })
  }

  if (room_type == 2) {
    return ceateTwoPeopleRoom(req, res)
  }

  if (room_type == 3 || room_type == 4) {
    return createGroupChat(req, res)
  }
}

const ceateTwoPeopleRoom = async (req, res) => {
  const { receiver } = req.body
  const sender = req.user._id
  if (!receiver) {
    return res.status(400).json({ message: "Receiver is required" })
  }

  const room0 = await ChatRoom.findOne({ members: [sender, receiver] })
    .populate("members", "-country -created_at -updated_at")
    .populate("latest_message")

  if (room0) {
    return res.json(room0)
  }

  const message = messageValidator(req)

  if (message) {
    return res.status(400).json({ message })
  }

  const { message_type, text } = req.body

  try {
    const { _id } = await ChatRoom.create({
      type: 2,
      members: [sender, receiver]
    })
    const newMessage = await Message.create({
      sender,
      room: _id,
      type: message_type,
      text: text
    })
    await ChatRoom.updateOne({ _id }, { latest_message: newMessage._id })
    const room2 = await ChatRoom.findById(_id)
      .populate("members", "-country -created_at -updated_at")
      .populate("latest_message")
    return res.json(room2)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const createGroupChat = async (req, res) => {
  const { room_type, members, name } = req.body

  if (!name) {
    return res.status(400).json({
      message: "Name is required"
    })
  }

  if (!members) {
    return res.status(400).json({
      message: "Members is required"
    })
  }

  const membersJson = JSON.parse(members)

  if (!Array.isArray(membersJson)) {
    return res.status(400).json({
      message: "Members field must be array or list"
    })
  }

  const userId = req.user._id
  membersJson.push(userId)

  try {
    const { _id } = await ChatRoom.create({
      type: room_type,
      members: membersJson,
      admin: userId,
      name
    })
    const newMessage = await Message.create({
      sender: userId,
      room: _id,
      type: 1,
      text: "Created this group"
    })
    await ChatRoom.updateOne(
      { _id },
      {
        latest_message: newMessage._id
      }
    )
    const room2 = await ChatRoom.findById(_id)
      .select("-created_at -updated_at")
      .populate("members", "-country -created_at")
      .populate("latest_message")
    return res.json(room2)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const editChatRoom = async (req, res) => {
  res.send("Edit Chat Room")
}

const muteOrUnmute = async (req, res) => {
  res.send("Mute or unmute")
}

const addMembers = async (req, res) => {
  res.send("Add members")
}

const removeMembers = async (req, res) => {
  res.send("Remove members")
}

const leaveChatRoom = async (req, res) => {
  res.send("Leave Chat Room")
}

const setChatRommProfile = async (req, res) => {
  res.send("Set Chat Room Profile")
}

const removeChatRoomProfile = async (req, res) => {
  res.send("Remove Chat Room Profile")
}

const deleteChatRoom = async (req, res) => {
  res.send("Delete chat room")
}

export {
  getChatRoom,
  createChatRoom,
  editChatRoom,
  muteOrUnmute,
  addMembers,
  removeMembers,
  deleteChatRoom,
  leaveChatRoom,
  setChatRommProfile,
  removeChatRoomProfile
}
