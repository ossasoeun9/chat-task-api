import path from "path"
import fs from "fs"
import { randomBytes } from "crypto"
import ChatRoom from "../models/chat-room-model.js"
import Message from "../models/message-model.js"
import User from "../models/user-model.js"
import messageValidator from "../utils/message-validator.js"

const getChatRoom = async (req, res) => {
  const { _id } = req.user
  const { page = 1, limit = 10 } = req.query

  try {
    const chats = await ChatRoom.user(_id).paginate(
      { $or: [{ people: { $in: [_id] } }, { members: { $in: [_id] } }] },
      {
        select: "-members -deleted_by",
        sort: { latest_message: 1 },
        populate: [
          {
            path: "latest_message",
            match: { deleted_by: { $nin: [_id] } }
          },
          {
            path: "unread",
            match: {
              $and: [
                { read_by: { $nin: [_id] } },
                { deleted_by: { $nin: [_id] } },
                { sender: { $ne: _id } }
              ]
            }
          }
        ],
        page,
        limit
      }
    )

    return res.json(chats)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const getChatRoomDetail = async (req, res) => {
  try {
    const room = await ChatRoom.user(req.user._id).findOne({
      _id: req.params.id
    })

    return res.json(room)
  } catch (error) {
    return res.status(500).json({ error })
  }
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

  const room0 = await ChatRoom.user(sender)
    .findOne({
      people: [sender, receiver]
    })
    .select("-members")

  if (room0) {
    return res.json(room0)
  }

  const message = messageValidator(req)

  if (message) {
    return res.status(400).json({ message })
  }

  const { message_type, text } = req.body

  try {
    const { _id } = await ChatRoom.user(sender).create({
      type: 2,
      people: [sender, receiver]
    })
    await Message.create({
      sender,
      room: _id,
      type: message_type,
      text: text
    })
    const room2 = await ChatRoom.user(sender)
      .findOne({
        people: [sender, receiver]
      })
      .select("-members")
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
    const { _id } = await ChatRoom.user(userId).create({
      type: room_type,
      members: membersJson,
      admin: userId,
      name
    })
    const user = await User.findById(userId).select("username")
    await Message.create({
      sender: userId,
      room: _id,
      type: 1,
      text: `${user.username} created this group`
    })
    const room2 = await ChatRoom.user(userId)
      .findById(_id)
      .select("-people -members")
      .select("-members")
    return res.json(room2)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const editChatRoom = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  const room = await ChatRoom.user(_id)
    .findById(roomId)
    .select("addmin name description")
  if (!room.admin) {
    return res.status(400).json({
      message: "Room is not a group"
    })
  }

  if (room.admin.id != _id) {
    return res.json({
      message: "Can't update, permission denind"
    })
  }

  const { name, description } = req.body
  if (!name) {
    return res.status(400).json({
      name: "Name is required"
    })
  }

  room.name = name
  room.description = description || room.description
  await room.save()
  const roomUpdated = await ChatRoom.findById(roomId).select("-people -members")

  return res.json(roomUpdated)
}

const muteOrUnmute = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  const room = await ChatRoom.user(_id).findById(roomId)
  if (!room) {
    return res.status(400).json({
      message: "Invalid id"
    })
  }
  if (!room.is_muted) {
    await ChatRoom.user(_id).updateOne(
      { _id: roomId },
      { $push: { muted_by: _id } }
    )
    return res.json({
      is_muted: true,
      message: "muted"
    })
  } else {
    await ChatRoom.user(_id).updateOne(
      { _id: roomId },
      { $pull: { muted_by: _id } }
    )
    return res.json({
      is_muted: false,
      message: "Unmuted"
    })
  }
}

const addMembers = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  const room = await ChatRoom.user(_id).findById(roomId).select("admin")
  if (!room.admin) {
    return res.status(400).json({
      message: "Room is not a group"
    })
  }

  // if (room.admin.id != _id) {
  //   return res.json({
  //     message: "Can't update, permission denind"
  //   })
  // }

  const { members } = req.body

  if (!members) {
    return res.status(400).json({
      message: "Member is required"
    })
  }
  const membersJson = JSON.parse(members)
  // membersJson.pop(room.members)

  try {
    await ChatRoom.user(_id).updateOne(
      { _id: roomId },
      { $addToSet: { members: membersJson } }
    )
    const user = await User.findById(_id).select("username")
    const membersObject = await User.find({ _id: { $in: membersJson } }).select(
      "username"
    )
    const messages = membersObject.map((v) => {
      return {
        type: 1,
        text: `@${user.username} added @${v.username} to this group`,
        room: roomId,
        sender: _id
      }
    })
    if (messages.length > 0) {
      await Message.insertMany(messages)
    }
    const newRoom = await ChatRoom.user(_id).findById(roomId).select("-members")
    return res.json(newRoom)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const removeMembers = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  const room = await ChatRoom.user(_id).findById(roomId).select("admin")
  if (!room.admin) {
    return res.status(400).json({
      message: "Room is not a group"
    })
  }

  if (room.admin.id != _id) {
    return res.json({
      message: "Can't update, permission denind"
    })
  }

  const { members } = req.body

  if (!members) {
    return res.status(400).json({
      message: "Member is required"
    })
  }
  const membersJson = JSON.parse(members)

  try {
    await ChatRoom.user(_id).updateOne(
      { _id: roomId },
      { $pullAll: { members: membersJson } }
    )
    const user = await User.findById(_id).select("username")
    const membersObject = await User.find({ _id: { $in: membersJson } }).select(
      "username"
    )
    const messages = membersObject.map((v) => {
      return {
        type: 1,
        text: `@${user.username} removed @${v.username} from this group`,
        room: roomId,
        sender: _id
      }
    })
    if (messages.length > 0) {
      await Message.insertMany(messages)
    }
    const newRoom = await ChatRoom.user(_id).findById(roomId).select("-members")
    return res.json(newRoom)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const joinChatRoom = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  if (!roomId) {
    return res.status(400).json({
      message: "Room ID is required"
    })
  }
  try {
    const myRoom = await ChatRoom.user(_id)
      .findOne({ _id: roomId, members: _id })
      .select("-members")
    if (myRoom) return res.json(myRoom)
    await ChatRoom.user(_id).updateOne(
      { _id: roomId },
      { $addToSet: { members: [_id] } }
    )
    const user = await User.findById(_id)
    await Message.create({
      sender: user.id,
      type: 1,
      room: roomId,
      text: `@${user.username} has joined this group`
    })
    const room = await ChatRoom.user(_id).findById(roomId).select("-members")
    return res.json(room)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const leaveChatRoom = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  if (!roomId) {
    return res.status(400).json({
      message: "Room ID is required"
    })
  }
  try {
    const room = await ChatRoom.user(_id).findById(roomId).select("-members")

    if (room && room.admin == _id) {
      await room.delete()
      await Message.deleteMany({ room: roomId })
      return res.json({
        message: "Room was delete successfully"
      })
    }
    await ChatRoom.user(_id).updateOne(
      { _id: roomId },
      { $pull: { members: { $in: [_id] } } }
    )
    const user = await User.findById(_id)
    await Message.create({
      sender: user.id,
      type: 1,
      room: roomId,
      text: `@${user.username} has leaved this group`
    })
    const room2 = await ChatRoom.user(_id).findById(roomId).select("-members")
    return res.json(room2)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const setChatRommProfile = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  const { profile } = req.files

  if (!profile)
    return res.status(400).json({
      message: "Profile is required"
    })

  const dir = `storage/group-profile/${roomId}/`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const filename =
    Date.now() +
    "." +
    randomBytes(6).toString("hex") +
    path.extname(profile.originalFilename)

  const fullPath = path.normalize(`${dir}/${filename}`)
  try {
    // delete old image
    const oldRoom = await ChatRoom.user(_id).findById(roomId)
    if (oldRoom.profile_url) {
      const deleteFullPath = dir + oldRoom.profile_url
      fs.unlinkSync(deleteFullPath)
    }

    // read
    const content = fs.readFileSync(profile.path)

    // write
    fs.writeFileSync(fullPath, content)
    await ChatRoom.user(_id).updateOne(
      { _id: roomId },
      { profile_url: filename }
    )

    // clear tmp dir
    fs.unlinkSync(profile.path)

    const newRoom = await ChatRoom.user(_id).findById(roomId).select("-members")
    return res.json(newRoom)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const removeChatRoomProfile = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  const oldRoom = await ChatRoom.user(_id).findById(roomId)
  const { profile_url } = oldRoom
  if (!profile_url)
    return res.status(400).json({
      message: "Profile was deleted"
    })

  try {
    await ChatRoom.user(_id).updateOne({ _id: roomId }, { profile_url: null })
    fs.unlinkSync(`storage/group-profile/${roomId}/${profile_url}`)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }

  return res.json({
    message: "Profile is deleted successfuly"
  })
}

export {
  getChatRoom,
  getChatRoomDetail,
  createChatRoom,
  editChatRoom,
  muteOrUnmute,
  addMembers,
  removeMembers,
  joinChatRoom,
  leaveChatRoom,
  setChatRommProfile,
  removeChatRoomProfile
}
