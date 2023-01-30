import mongoose from "mongoose"
import dotenv from "dotenv"
import Message from "./message-model.js"
import User from "./user-model.js"
import mongoosePaginate from "mongoose-paginate-v2"
import mongooseAutoPopulate from "mongoose-autopopulate"

dotenv.config()
const apiHost = process.env.API_HOST

/*
Note
1 is saved message room
2 is two people room
3 is private group
4 is public group
*/

let userId

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null
    },
    profile_url: {
      type: String,
      default: null
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: User,
      default: null
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
    people: [
      {
        type: mongoose.Types.ObjectId,
        ref: User,
        default: null,
        autopopulate: {
          select: "_id first_name last_name profile_url is_online"
        }
      }
    ],
    muted_by: [
      {
        type: mongoose.Types.ObjectId,
        ref: User,
        default: null
      }
    ],
    members: [{ type: mongoose.Types.ObjectId, ref: User }]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

chatRoomSchema.virtual("is_muted").get(function () {
  const { muted_by } = this
  const isMuted = muted_by.map((v) => v.valueOf()).indexOf(userId) != -1
  return isMuted
})

chatRoomSchema.set("toJSON", {
  transform: (doc, ret, opt) => {
    const { type, people } = ret
    delete ret.muted_by
    delete ret.people
    delete ret.id
    if (type == 2 || type == 1) {
      delete ret.admin
      delete ret.name
      delete ret.description
      delete ret.profile_url
    }
    if (type == 2 && people.length == 2) {
      const indexOfPerson =
        people.map((v) => v._id.valueOf()).indexOf(userId) == 0 ? 1 : 0
      ret.person = people[indexOfPerson]
    }
    if (ret.profile_url) {
      ret.profile_url = `${apiHost}/group-profile/${ret._id}/${ret.profile_url}`
    }
    return ret
  },
  virtuals: true
})

chatRoomSchema.set("toObject", { virtuals: true })

chatRoomSchema.plugin(mongooseAutoPopulate)
chatRoomSchema.plugin(mongoosePaginate)
const ChatRoom = mongoose.model("Chat Room", chatRoomSchema)
ChatRoom.user = (newUserId) => {
  userId = newUserId
  Message.user(newUserId)
  return ChatRoom
}

export default ChatRoom
