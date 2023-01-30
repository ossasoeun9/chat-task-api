import mongoose from "mongoose"
import dotenv from "dotenv"
import FileDB from "./file-model.js"
import Media from "./media-model.js"
import User from "./user-model.js"
import Url from "./url-model.js"
import Voice from "./voice-model.js"
import mongooseAutoPopulate from "mongoose-autopopulate"
import ChatRoom from "./chat-room-model.js"

dotenv.config()
const apiHost = process.env.API_HOST

let userId

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
        select: "-created_at -updated_at"
      }
    },
    url: {
      type: mongoose.Types.ObjectId,
      ref: Url
    },
    media: [
      {
        type: mongoose.Types.ObjectId,
        ref: Media,
        autopopulate: { select: "-created_at -updated_at" }
      }
    ],
    files: [{ type: mongoose.Types.ObjectId, ref: FileDB }]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

messageSchema.set("toJSON", {
  transform: (_, ret, __) => {
    if (ret.text == null) {
      delete ret.text
    }
    if (ret.ref_message == null) {
      delete ret.ref_message
    }
    if (ret.media.length == 0) {
      delete ret.media
    }
    if (ret.files.length == 0) {
      delete ret.files
    }
    if (ret.url == null) {
      delete ret.url
    }
    ret.is_me = false
    if (ret.sender._id.valueOf() == userId) {
      ret.is_me = true
      delete ret.sender
    }
    if (ret.voice) {
      ret.voice.url = `${apiHost}/voice-messages/${ret.room}/${ret.voice.filename}`
      delete ret.voice.filename
    }
    if (ret.media) {
      for (let i = 0; i < ret.media.length; i++) {
        const element = ret.media[i]
        ret.media[i].url = `${apiHost}/media/${ret.room}/${element.filename}`
        delete ret.media[i].filename
      }
    }
    delete ret.room
    return ret
  }
})

messageSchema.plugin(mongooseAutoPopulate)

const Message = mongoose.model("Message", messageSchema)

Message.user = (newUserId) => {
  userId = newUserId
  return Message
}

Message.watch().on("change", async (data) => {
  const { fullDocument } = data
  await ChatRoom.updateOne(
    { _id: fullDocument.room },
    {
      latest_message: fullDocument._id
    }
  )
})

export default Message
