import mongoose, { Schema } from "mongoose"
import Message from "./message-model.js"
import User from "./user-model.js"
import mongoosePaginate from "mongoose-paginate-v2"
import mongooseAutoPopulate from "mongoose-autopopulate"

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
      ref: User,
      default: null,
      autopopulate: true
    },
    type: {
      type: Number,
      enum: [1, 2, 3, 4]
    },
    description: {
      type: String,
      default: null
    },
    latest_message: {
      type: mongoose.Types.ObjectId,
      ref: Message,
      default: null,
      autopopulate: true
    },
    people: [{ type: mongoose.Types.ObjectId, ref: User, default: null, autopopulate: true }],
    members: [{ type: mongoose.Types.ObjectId, ref: User, autopopulate: true }]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

chatRoomSchema.set("toJSON", {
  transform: (doc, ret, opt) => {
    const { type } = ret
    if (type == 2 || type == 1) {
      delete ret.admin
      delete ret.name
      delete ret.description
      delete ret.created_at
    } else {
      delete ret.people
    }
    return ret
  }
})

chatRoomSchema.plugin(mongooseAutoPopulate)
chatRoomSchema.plugin(mongoosePaginate)

const ChatRoom = mongoose.model("Chat Room", chatRoomSchema)
export default ChatRoom
