import mongoose from "mongoose"

const voiceSchema = mongoose.Schema(
  {
    url: String,
    size: Number,
    duration: Number, // Second
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

const Voice = mongoose.model('Voice', voiceSchema)
export default Voice
