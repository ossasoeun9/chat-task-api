import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const voiceSchema = mongoose.Schema(
  {
    filename: String,
    size: Number,
    duration: Number,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

voiceSchema.plugin(mongoosePaginate)

const Voice = mongoose.model('Voice', voiceSchema)
export default Voice
