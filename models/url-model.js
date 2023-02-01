import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const urlSchema = mongoose.Schema(
  {
    link: String,
    is_preview: Boolean,
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

urlSchema.plugin(mongoosePaginate)

const Url = mongoose.model("Url", urlSchema)
export default Url
