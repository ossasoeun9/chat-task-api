import ChatRoom from "../models/chat-room-model.js"
import User from "../models/user-model.js"
import { roomToJson } from "../utils/chat-room-to-json.js"

var clients = {}

const wsController = async (ws, req) => {
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

const sendToClient = (client, roomId, action = 1) => {
  const ws = clients[client]
  if (ws) {
    if (action == 1 || action == 2) {
      ChatRoom.findOne({
        _id: roomId,
        $or: [{ members: client }, { people: client }]
      })
        .populate([
          {
            path: "latest_message",
            match: { deleted_by: { $nin: [client] } }
          },
          {
            path: "unread",
            match: {
              $and: [
                { read_by: { $nin: [client] } },
                { deleted_by: { $nin: [client] } },
                { sender: { $ne: client } }
              ]
            }
          }
        ])
        .then((s) => {
          if (s) {
            const room = roomToJson(s, client.valueOf())
            ws.send(JSON.stringify({ action, data: room }))
          } else {
            ws.send(JSON.stringify({ action: 3, data: { _id: roomId } }))
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      ws.send(
        JSON.stringify({
          action,
          data: {
            _id: roomId
          }
        })
      )
    }
  }
}

export { wsController, sendToClient }
