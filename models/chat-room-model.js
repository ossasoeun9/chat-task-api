import mongoose from "mongoose"
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

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    profile_url: {
      type: String,
      default: null,
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: User,
      default: null,
    },
    type: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    description: {
      type: String,
      default: null,
    },
    people: [
      {
        type: mongoose.Types.ObjectId,
        ref: User,
        autopopulate: {
          select: "_id first_name last_name profile_url is_online",
        },
      },
    ],
    muted_by: [
      {
        type: mongoose.Types.ObjectId,
        ref: User,
      },
    ],
    members: [{ type: mongoose.Types.ObjectId, ref: User }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
)

chatRoomSchema.virtual("latest_message", {
  ref: Message,
  localField: "_id",
  foreignField: "room",
  justOne: true,
  options: { sort: { created_at: -1 } },
})

chatRoomSchema.virtual("unread", {
  ref: Message,
  localField: "_id",
  foreignField: "room",
  justOne: false,
  count: true,
})

chatRoomSchema.set("toJSON", {
  virtuals: true,
})

chatRoomSchema.set("toObject", { virtuals: true })

chatRoomSchema.plugin(mongooseAutoPopulate)
chatRoomSchema.plugin(mongoosePaginate)
const ChatRoom = mongoose.model("Chat Room", chatRoomSchema)

ChatRoom.watch().on("change", (data) => {
  const { operationType, documentKey } = data
  if (operationType == "delete") {
    Message.deleteMany({ room: documentKey._id })
  }
})

export default ChatRoom
