import mongoose from "mongoose"
import FileDB from "./file-model.js"
import Media from "./media-model.js"
import User from "./user-model.js"
import Url from "./url-model.js"
import Voice from "./voice-model.js"
import mongooseAutoPopulate from "mongoose-autopopulate"
import mongoosePaginate from "mongoose-paginate-v2"

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
      required: true
    },
    ref_message: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
      default: null,
      autopopulate: true,
    },
    task: {
      type: mongoose.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    room: {
      type: mongoose.Types.ObjectId,
      ref: "Chat Room",
      required: true,
    },
    type: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7],
    },
    text: String,
    voice: {
      type: mongoose.Types.ObjectId,
      ref: Voice,
      autopopulate: {
        select: "-created_at -updated_at -owner",
      },
    },
    url: {
      type: mongoose.Types.ObjectId,
      ref: Url,
      autopopulate: { select: "-created_at -updated_at -owner" },
    },
    media: [
      {
        type: mongoose.Types.ObjectId,
        ref: Media,
        autopopulate: { select: "-created_at -updated_at -owner" },
      },
    ],
    files: [
      {
        type: mongoose.Types.ObjectId,
        ref: FileDB,
        autopopulate: { select: "-created_at -updated_at -owner" },
      },
    ],
    read_by: [
      {
        type: mongoose.Types.ObjectId,
        ref: User,
        autopopulate: {
          select: "-_id first_name profile_url",
        },
      },
    ],
    deleted_by: [
      {
        type: mongoose.Types.ObjectId,
        ref: User,
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
)

messageSchema.set("toObject", { virtuals: true, getters: true })

messageSchema.set("toJSON", {
  virtuals: true,
  getters: true,
})

messageSchema.plugin(mongooseAutoPopulate)
messageSchema.plugin(mongoosePaginate)

messageSchema.pre("deleteMany", function (next) {
  const query = this.getQuery()
  if (query.$and) {
    Message.find(query)
      .then(async (messages) => {
        let fileIds = []
        let mediaIds = []
        let voiceIds = []
        let urlIds = []
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].files)
            for (let j = 0; j < messages[i].files.length; j++) {
              const file = messages[i].files[j]
              fileIds.push(file._id)
            }
          if (messages[i].media)
            for (let j = 0; j < messages[i].media.length; j++) {
              const m = messages[i].media[j]
              mediaIds.push(m._id)
            }
          if (messages[i].voice) voiceIds.push(messages[i].voice._id)
          if (messages[i].url) urlIds.push(messages[i].url._id)
        }
        await FileDB.deleteMany({ _id: fileIds })
        await Media.deleteMany({ _id: mediaIds })
        await Voice.deleteMany({ _id: voiceIds })
        await Url.deleteMany({ _id: urlIds })
        next()
      })
      .catch((error) => {
        console.log("Message Error:", error)
        next()
      })
  } else {
    next()
  }
})

const Message = mongoose.model("Message", messageSchema)

export default Message
