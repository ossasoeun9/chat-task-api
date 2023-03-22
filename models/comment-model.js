import mongoose from "mongoose"
import Media from "./media-model.js"
import User from "./user-model.js"
import Url from "./url-model.js"
import mongooseAutoPopulate from "mongoose-autopopulate"
import mongoosePaginate from "mongoose-paginate-v2"

/*
Note
1 is activity message
2 is text message
3 is media message
*/

const commentSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
      autopopulate: true
    },
    ref_comment: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
      default: null,
      autopopulate: true
    },
    task: {
      type: mongoose.Types.ObjectId,
      ref: "Task",
      required: true
    },
    type: {
      type: Number,
      enum: [1, 2, 3]
    },
    text: String,
    media: {
      filename: String,
      size: Number,
      duration: Number, // Second
      is_video: Boolean,
      task: {
        type: mongoose.Types.ObjectId,
        ref: "Task"
      }
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

commentSchema.set("toObject", { virtuals: true, getters: true })

commentSchema.set("toJSON", {
  transform: (_, ret, __) => {
    delete ret.id
    if (ret.media) {
        ret.media.path =  `task-media/${ret.media.task}/${ret.media.filename}`
    }
    return ret
  },
  virtuals: true,
  getters: true
})

commentSchema.plugin(mongooseAutoPopulate)
commentSchema.plugin(mongoosePaginate)

const Comment = mongoose.model("Comment", commentSchema)

export default Comment
