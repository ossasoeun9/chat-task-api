import ChatRoom from "../models/chat-room-model.js"

const getChatRoom = async (req, res) => {
  res.send("Chat Room")
}

const createChatRoom = async (req, res) => {
  res.send("Create Chat Room")
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
