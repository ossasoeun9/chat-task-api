import mongoose from "mongoose"

const urlSchema = mongoose.Schema(
  {
    link: String,
    is_preview: Boolean
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

const Url = mongoose.model('Url', urlSchema)
export default Url
