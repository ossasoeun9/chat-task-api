import mongoose from "mongoose"
import User from "./user-model.js"

/*
Note
1 is saved message room
2 is two people room
3 is private group
4 is public group
*/

const chatRoomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: null
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: User
    },
    type: {
      type: String,
      enum: [1, 2, 3, 4]
    },
    description: {
      type: String,
      default: null
    },
    latest_message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

const ChatRoom = mongoose.model("Chat Room", chatRoomSchema)
export default ChatRoom
