import mongoose from "mongoose"

const fileSchema = mongoose.Schema(
  {
    url: String,
    size: Number,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

const FileDB = mongoose.model('File DB', fileSchema)
export default FileDB