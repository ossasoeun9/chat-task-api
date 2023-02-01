import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const mediaSchema = mongoose.Schema(
  {
    filename: String,
    size: Number,
    duration: Number, // Second
    is_video: Boolean,
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    room: {
      type: mongoose.Types.ObjectId,
      ref: "Chat Room"
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

mediaSchema.plugin(mongoosePaginate)
mongoose.plugin(mongoosePaginate)

const Media = mongoose.model("Media", mediaSchema)
export default Media
