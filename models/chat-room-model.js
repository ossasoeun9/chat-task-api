import mongoose from "mongoose"
import Message from "./message-model.js"
import User from "./user-model.js"
import mongoosePaginate from "mongoose-paginate-v2"
import mongooseAutoPopulate from "mongoose-autopopulate"
import Media from "./media-model.js"
import Url from "./url-model.js"
import Voice from "./voice-model.js"
import FileDB from "./file-model.js"

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
        ref: User
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

chatRoomSchema.set("toJSON", {
  virtuals: true,
  getters: true,
})

chatRoomSchema.set("toObject", { virtuals: true, getters: true })

chatRoomSchema.virtual("latest_message", {
  ref: Message,
  localField: "_id",
  foreignField: "room",
  justOne: true,
  options: { sort: { created_at: -1 } },
})
chatRoomSchema.virtual("total_member").get(function() {
  return this.members? this.members.length: 0
})

chatRoomSchema.virtual("unread", {
  ref: Message,
  localField: "_id",
  foreignField: "room",
  justOne: false,
  count: true,
})

chatRoomSchema.plugin(mongooseAutoPopulate)
chatRoomSchema.plugin(mongoosePaginate)

chatRoomSchema.pre("deleteOne", function (next) {
  const query = this.getQuery()
  deleteEverything(query._id)
    .then((_) => {
      next()
    })
    .catch((err) => {
      next()
    })
})

const deleteEverything = async (roomId) => {
  await Message.deleteMany({ room: roomId })
  await FileDB.deleteMany({ room: roomId })
  await Media.deleteMany({ room: roomId })
  await Url.deleteMany({ room: roomId })
  await Voice.deleteMany({ room: roomId })
}

const ChatRoom = mongoose.model("Chat Room", chatRoomSchema)

export default ChatRoom
