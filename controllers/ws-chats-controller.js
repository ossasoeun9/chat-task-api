import ChatRoom from "../models/chat-room-model.js"
import User from "../models/user-model.js"
import { roomToJson } from "../utils/chat-room-to-json.js"

var clients = {}

const wsController = async (ws, req) => {
  const { _id } = req.user
  if (!clients[_id] || !Array.isArray(clients[_id])) {
    clients[_id] = []
  }
  clients[_id].push(ws)
  console.log("client:", _id, "connected")
  ws.on("close", async (message) => {
    clients[_id].pop(ws)
    console.log("client:", _id, "disconnected")
    await User.updateOne({ _id }, { is_online: clients[_id].length > 0 })
  })

  await User.updateOne({ _id }, { is_online: true })
}

const sendToClient = (client, roomId, action = 1) => {
  const wsList = clients[client]
  if (wsList && wsList.length > 0) {
    if (action == 1 || action == 2) {
      ChatRoom.findOne({
        _id: roomId,
        $or: [{ members: client }, { people: client }]
      })
        .populate({
          path: "people",
          select:
            "_id first_name username last_name profile_url is_online phone_number",
          populate: {
            path: "contact",
            select: "-created_at -updated_at",
            match: { owner: { $eq: client } }
          }
        })
        .populate([
          {
            path: "latest_message",
            match: { deleted_by: { $nin: [client] } },
            populate: {
              path: "sender",
              select:
                "_id first_name last_name profile_url is_online phone_number",
              populate: {
                path: "contact",
                select: "-created_at -updated_at",
                match: { owner: { $eq: client } }
              }
            }
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
            for (let i = 0; i < wsList.length; i++) {
              wsList[i].send(JSON.stringify({ action, data: room }))
            }
          } else {
            for (let i = 0; i < wsList.length; i++) {
              wsList[i].send(
                JSON.stringify({ action: 3, data: { _id: roomId } })
              )
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      for (let i = 0; i < wsList.length; i++) {
        wsList[i].send(
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
}

export { wsController, sendToClient }
