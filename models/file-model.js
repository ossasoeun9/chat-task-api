import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const fileSchema = mongoose.Schema(
  {
    filename: String,
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

mongoose.plugin(mongoosePaginate)

const FileDB = mongoose.model("File DB", fileSchema)
export default FileDB
