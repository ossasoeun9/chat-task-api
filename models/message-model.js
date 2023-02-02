import mongoose from "mongoose"
import dotenv from "dotenv"
import FileDB from "./file-model.js"
import Media from "./media-model.js"
import User from "./user-model.js"
import Url from "./url-model.js"
import Voice from "./voice-model.js"
import mongooseAutoPopulate from "mongoose-autopopulate"

dotenv.config()
const apiHost = process.env.API_HOST

/*
Note
1 is activity message
2 is text message
3 is forwarded message
4 is voice message
5 is media message
6 is file message
7 is url message
*/

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
      autopopulate: {
        select: "_id first_name last_name profile_url is_online"
      }
    },
    ref_message: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
      default: null,
      autopopulate: true
    },
    room: {
      type: mongoose.Types.ObjectId,
      ref: "Chat Room",
      required: true
    },
    type: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7]
    },
    text: String,
    voice: {
      type: mongoose.Types.ObjectId,
      ref: Voice,
      autopopulate: {
        select: "-created_at -updated_at -owner -room"
      }
    },
    url: {
      type: mongoose.Types.ObjectId,
      ref: Url,
      autopopulate: { select: "-created_at -updated_at -owner -room" }
    },
    media: [
      {
        type: mongoose.Types.ObjectId,
        ref: Media,
        autopopulate: { select: "-created_at -updated_at -owner -room" }
      }
    ],
    files: [
      {
        type: mongoose.Types.ObjectId,
        ref: FileDB,
        autopopulate: { select: "-created_at -updated_at -owner -room" }
      }
    ],
    read_by: [
      {
        type: mongoose.Types.ObjectId,
        ref: User,
        autopopulate: {
          select: "-_id first_name profile_url"
        }
      }
    ],
    deleted_by: [
      {
        type: mongoose.Types.ObjectId,
        ref: User
      }
    ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

messageSchema.set("toObject", { virtuals: true, getters: true })

messageSchema.set("toJSON", {
  virtuals: true,
  getters: true
})

messageSchema.plugin(mongooseAutoPopulate)

const Message = mongoose.model("Message", messageSchema)

export default Message
