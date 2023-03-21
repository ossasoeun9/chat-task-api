import ChatRoom from "../models/chat-room-model.js"
import User from "../models/user-model.js"
import { messagesToJson, msgToJson } from "../utils/msg-to-json.js"

var clients = {}

const wsMessageController = async (ws, req) => {
  const { _id } = req.user
  clients[_id] = ws
  console.log("client:", _id, "connected")
  ws.on("close", async (message) => {
    delete clients[_id]
    console.log("client:", _id, "disconnected")
    await User.updateOne({ _id }, { is_online: false })
  })

  await User.updateOne({ _id }, { is_online: true })
}

const sendMessagesToClient = (messages, roomId, action = 1) => {
  ChatRoom.findById(roomId).then((data) => {
    if (data.type == 2) {
      for (let i = 0; i < data.people.length; i++) {
        const uId = data.people[i]._id
        sendMesToClient(
          uId,
          action == 3 ? messages : messagesToJson(messages, uId.valueOf()),
          roomId,
          action
        )
      }
    }
    if (data.type == 3 || data.type == 4) {
      for (let i = 0; i < data.members.length; i++) {
        const uId = data.members[i]._id
        sendMesToClient(
          uId,
          action == 3 ? messages : messagesToJson(messages, uId.valueOf()),
          roomId,
          action
        )
      }
    }
  })
}

const sendMessageToClient = (message, roomId, action = 1) => {
  ChatRoom.findById(roomId).then((data) => {
    if (data.type == 2) {
      for (let i = 0; i < data.people.length; i++) {
        const uId = data.people[i]._id
        sendMesToClient(
          uId,
          action == 3 ? message : msgToJson(message, uId.valueOf()),
          roomId,
          action
        )
      }
    }
    if (data.type == 3 || data.type == 4 || data.type == 5) {
      for (let i = 0; i < data.members.length; i++) {
        const uId = data.members[i]._id
        sendMesToClient(
          uId,
          action == 3 ? message : msgToJson(message, uId.valueOf()),
          roomId,
          action
        )
      }
    }
  })
}

const sendMesToClient = (client, message, roomId, action = 1) => {
  const ws = clients[client]
  if (ws) {
    ws.send(JSON.stringify({ action, room: roomId, message }))
  }
}

export {
  wsMessageController,
  sendMesToClient,
  sendMessageToClient,
  sendMessagesToClient,
}
