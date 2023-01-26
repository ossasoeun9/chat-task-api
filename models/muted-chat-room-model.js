import mongoose from "mongoose"
import mongooseAutoPopulate from "mongoose-autopopulate"
import ChatRoom from "./chat-room-model.js"
import User from "./user-model.js"

const mutedChatRoomSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: User,
    select: false
  },
  room: {
    type: mongoose.Types.ObjectId,
    ref: ChatRoom,
    autopopulate: true
  }
})

mutedChatRoomSchema.plugin(mongooseAutoPopulate)

const MutedChatRoom = mongoose.model("Muted Chat Room", mutedChatRoomSchema)

export default MutedChatRoom
