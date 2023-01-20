import mongoose from "mongoose"

const mediaSchema = mongoose.Schema(
  {
    url: String,
    size: Number,
    duration: Number, // Second
    is_video: Boolean
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

const Media = mongoose.model('Media', mediaSchema)
export default Media
