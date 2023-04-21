import ChatRoom from "../models/chat-room-model.js"
import User from "../models/user-model.js"
import { roomToJson } from "../utils/chat-room-to-json.js"

var clients = {}

const wsUserController = async (ws, req) => {
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

const sendToUserClient = (client, action = 1) => {
  const wsList = clients[client]
  if (wsList && wsList.length > 0) {
      for (let i = 0; i < wsList.length; i++) {
        wsList[i].send(
          JSON.stringify({
            action,
            data: {
              title: "accountDeleted",
              message: "accountDeletedMessage"
            }
          })
        )
      }
  }
}

export { wsUserController, sendToUserClient }
