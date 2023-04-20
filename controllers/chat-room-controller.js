import path from "path"
import fs from "fs"
import { randomBytes } from "crypto"
import ChatRoom from "../models/chat-room-model.js"
import Message from "../models/message-model.js"
import User from "../models/user-model.js"
import { sendMessageToClient } from "./ws-message-controller.js"
import { roomToJson } from "../utils/chat-room-to-json.js"
import { sendToClient } from "./ws-chats-controller.js"
import mongoose from "mongoose"
import JSONStream from "JSONStream"
import es from "event-stream"

const getChatRoom = async (req, res) => {
  const { _id } = req.user
  const { type, latest_timestamp } = req.query

  let query = {
    $or: [{ people: { $in: [_id] } }, { members: { $in: [_id] } }]
  }

  if (latest_timestamp) {
    query.updated_at = { $gte: latest_timestamp, $ne: latest_timestamp }
  }

  if (type) {
    query.type = type
  }

  try {
    ChatRoom.find(query)
      .populate({
        path: "people",
        select:
          "_id first_name last_name username profile_url is_online phone_number",
        populate: {
          path: "contact",
          select: "-created_at -updated_at",
          match: { owner: { $eq: _id } }
        }
      })
      .populate({
        path: "latest_message",
        match: { deleted_by: { $nin: [_id] } },
        populate: {
          path: "sender",
          select:
            "_id first_name last_name username profile_url is_online phone_number",
          populate: {
            path: "contact",
            select: "-created_at -updated_at",
            match: { owner: { $eq: _id } }
          }
        }
      })
      .populate({
        path: "unread",
        match: {
          $and: [
            { read_by: { $nin: [_id] } },
            { deleted_by: { $nin: [_id] } },
            { sender: { $ne: _id } }
          ]
        }
      })
      .cursor()
      .pipe(
        es.map(function (data, cb) {
          cb(null, roomToJson(data, _id))
        })
      )
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  } catch (error) {
    res.status(500).json({ error })
  }
}

const getChatRoomDetail = async (req, res) => {
  try {
    const room = await ChatRoom.findOne({
      _id: req.params.id
    })

    return res.json(roomToJson(room))
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const createChatRoom = async (req, res) => {
  const { room_type } = req.body

  if (!room_type) {
    return res.status(400).json({ message: "Room type is required" })
  }

  if (room_type < 2 || room_type > 5) {
    return res.status(400).json({ message: "Invalid room type (2-5)" })
  }

  if (room_type == 2) {
    return ceateTwoPeopleRoom(req, res)
  }

  if (room_type == 3 || room_type == 4 || room_type == 5) {
    return createGroupChat(req, res)
  }
}

const ceateTwoPeopleRoom = async (req, res) => {
  const { receiver } = req.body
  const sender = req.user._id
  if (!receiver) {
    return res.status(400).json({ message: "Receiver is required" })
  }

  const room0 = await ChatRoom.findOne({
    people: [sender, receiver]
  })
    .select("-members")
    .populate([
      {
        path: "people",
        select:
          "_id first_name last_name username profile_url is_online phone_number",
        populate: {
          path: "contact",
          select: "-created_at -updated_at",
          match: { owner: { $eq: sender._id } }
        }
      },
      {
        path: "latest_message",
        match: { deleted_by: { $nin: [sender] } }
      },
      {
        path: "unread",
        match: {
          $and: [
            { read_by: { $nin: [sender] } },
            { deleted_by: { $nin: [sender] } },
            { sender: { $ne: sender } }
          ]
        }
      }
    ])

  if (room0) {
    return res.json(roomToJson(room0, sender))
  }

  try {
    const room = await ChatRoom.create({
      type: 2,
      people: [sender, receiver]
    })
    await User.updateMany(
      { _id: { $in: [sender, receiver] } },
      { $addToSet: { rooms: [room._id] } }
    )
    const user = await User.findById(sender).select("username")
    await Message.create({
      type: 1,
      room: room._id,
      sender: sender,
      text: `@${user.username} strated message`
    })
    const room2 = await ChatRoom.findById(room._id).populate([
      {
        path: "people",
        select:
          "_id first_name last_name username profile_url is_online phone_number",
        populate: {
          path: "contact",
          select: "-created_at -updated_at",
          match: { owner: { $eq: sender._id } }
        }
      },
      {
        path: "latest_message",
        match: { deleted_by: { $nin: [sender] } }
      },
      {
        path: "unread",
        match: {
          $and: [
            { read_by: { $nin: [sender] } },
            { deleted_by: { $nin: [sender] } },
            { sender: { $ne: sender } }
          ]
        }
      }
    ])
    sendToClient(sender, room._id)
    sendToClient(receiver, room._id)
    return res.json(roomToJson(room2, sender))
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

  if (!members && room_type != 5) {
    return res.status(400).json({
      message: "Members is required"
    })
  }

  const membersJson = members ? JSON.parse(members) : []

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
    await User.updateMany(
      { _id: { $in: membersJson } },
      { $addToSet: { rooms: [_id] } }
    )
    const user = await User.findById(userId).select("username")
    await Message.create({
      sender: userId,
      room: _id,
      type: 1,
      text: `@${user.username} created ${
        room_type != 5 ? "this group" : `${name} project`
      }`
    })
    const room2 = await findAndSendToClient(_id, userId)
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
  const room = await ChatRoom.findById(roomId)
  if (!room.admin) {
    return res.status(400).json({
      message: "Room is not a group"
    })
  }

  if (room.admin != _id) {
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

  const roomUpdated = await findAndSendToClient(roomId, _id, 2)

  return res.json(roomUpdated)
}

const muteOrUnmute = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  const room = await ChatRoom.findById(roomId)
  if (!room) {
    return res.status(400).json({
      message: "Invalid id"
    })
  }
  if (!room.is_muted) {
    await ChatRoom.updateOne({ _id: roomId }, { $push: { muted_by: _id } })
    sendToClient(_id, roomId, 2)
    return res.json({
      is_muted: true,
      message: "muted"
    })
  } else {
    await ChatRoom.updateOne({ _id: roomId }, { $pull: { muted_by: _id } })
    sendToClient(_id, roomId, 2)
    return res.json({
      is_muted: false,
      message: "Unmuted"
    })
  }
}

const addMembers = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  const room = await ChatRoom.findById(roomId).select("admin")
  if (!room.admin) {
    return res.status(400).json({
      message: "Room is not a group"
    })
  }

  const { members } = req.body

  if (!members) {
    return res.status(400).json({
      message: "Member is required"
    })
  }
  const membersJson = JSON.parse(members)
  // membersJson.pop(room.members)

  try {
    await ChatRoom.updateOne(
      { _id: roomId },
      { $addToSet: { members: membersJson } }
    )
    await User.updateMany(
      { _id: { $in: membersJson } },
      { $addToSet: { rooms: [roomId] } }
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
    const roomUpdated = await findAndSendToClient(roomId, _id, 2)

    return res.json(roomUpdated)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const removeMembers = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  const room = await ChatRoom.findById(roomId)
  if (!room.admin) {
    return res.status(400).json({
      message: "Room is not a group"
    })
  }

  if (room.admin != _id) {
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
    await ChatRoom.updateOne(
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
    for (let i = 0; i < membersJson.length; i++) {
      sendToClient(mongoose.Types.ObjectId(membersJson[i]), roomId, 2)
    }
    const roomUpdated = await findAndSendToClient(roomId, _id, 2)

    return res.json(roomUpdated)
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
    const myRoom = await ChatRoom.findOne({ _id: roomId, members: _id }).select(
      "-members"
    )
    if (myRoom) return res.json(myRoom)
    await ChatRoom.updateOne({ _id: roomId }, { $addToSet: { members: [_id] } })
    await User.updateOne({ _id: _id }, { $addToSet: { rooms: [roomId] } })
    const user = await User.findById(_id)

    await Message.create({
      sender: user.id,
      type: 1,
      room: roomId,
      text: `@${user.username} has joined this group`
    })
    const roomUpdated = await findAndSendToClient(roomId, _id, 2)

    return res.json(roomUpdated)
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
    const room = await ChatRoom.findById(roomId)

    if (room && room.admin == _id) {
      await ChatRoom.deleteOne({ _id: roomId })
      for (let i = 0; i < room.members.length; i++) {
        const id = room.members[i]
        sendToClient(id, roomId, 3)
      }
      await User.updateMany(
        { rooms: { $in: [roomId] } },
        { $pullAll: { rooms: [roomId] } }
      )
      return res.json({
        message: "Room was delete successfully"
      })
    }
    const user = await User.findById(_id)
    var mes = await Message.create({
      sender: user.id,
      type: 1,
      room: roomId,
      text: `@${user.username} has leaved this group`
    })
    await ChatRoom.updateOne(
      { _id: roomId },
      { $pull: { members: { $in: [_id] } } }
    )
    sendMessageToClient(mes, roomId)
    sendToClient(_id, roomId, 3)
    const roomUpdated = await findAndSendToClient(roomId, _id, 2)

    return res.json(roomUpdated)
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
    "_" +
    randomBytes(6).toString("hex") +
    path.extname(profile.originalFilename)

  const fullPath = path.normalize(`${dir}/${filename}`)
  try {
    // delete old image
    const oldRoom = await ChatRoom.findById(roomId)
    if (oldRoom.profile_url) {
      const deleteFullPath = dir + oldRoom.profile_url
      if (!fs.existsSync(deleteFullPath)) {
        fs.unlinkSync(deleteFullPath)
      }
    }

    // read
    const content = fs.readFileSync(profile.path)

    // write
    fs.writeFileSync(fullPath, content)
    await ChatRoom.updateOne({ _id: roomId }, { profile_url: filename })

    // clear tmp dir
    fs.unlinkSync(profile.path)

    const roomUpdated = await findAndSendToClient(roomId, _id, 2)

    return res.json(roomUpdated)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const removeChatRoomProfile = async (req, res) => {
  const { _id } = req.user
  const roomId = req.params.id
  const oldRoom = await ChatRoom.findById(roomId)
  const { profile_url } = oldRoom
  if (!profile_url)
    return res.status(400).json({
      message: "Profile was deleted"
    })

  try {
    await ChatRoom.updateOne({ _id: roomId }, { profile_url: null })
    if (!fs.existsSync(`storage/group-profile/${roomId}/${profile_url}`)) {
      fs.unlinkSync(`storage/group-profile/${roomId}/${profile_url}`)
    }
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }

  const roomUpdated = await findAndSendToClient(roomId, _id, 2)

  return res.json(roomUpdated)
}

const findAndSendToClient = async (roomId, userId, action = 1) => {
  try {
    const room2 = await ChatRoom.findById(roomId).populate([
      {
        path: "latest_message",
        match: { deleted_by: { $nin: [userId] } }
      },
      {
        path: "unread",
        match: {
          $and: [
            { read_by: { $nin: [userId] } },
            { deleted_by: { $nin: [userId] } },
            { sender: { $ne: userId } }
          ]
        }
      }
    ])

    if (room2.type != 2) {
      for (let i = 0; i < room2.members.length; i++) {
        const id = room2.members[i]
        sendToClient(id, room2._id, action)
      }
    } else {
      for (let i = 0; i < room2.people.length; i++) {
        const id = room2.people[i]
        sendToClient(id, room2._id, action)
      }
    }
    return roomToJson(room2, userId)
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getMembers = async (req, res) => {
  const roomId = req.params.roomId
  try {
    const room = await ChatRoom.findById(roomId)
      .select("members")
      .populate("members")
    return res.json(room.members)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export {
  getMembers,
  findAndSendToClient,
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
