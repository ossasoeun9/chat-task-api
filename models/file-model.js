import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import fs from "fs"
import path from "path"

const fileSchema = mongoose.Schema(
  {
    filename: String,
    size: Number,
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    room: {
      type: mongoose.Types.ObjectId,
      ref: "Chat Room",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
)

fileSchema.plugin(mongoosePaginate)

fileSchema.pre("deleteMany", function (next) {
  const query = this.getQuery()
  FileDB.find(query)
    .then((files) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        fs.unlinkSync(path.normalize(`storage/files/${file.room}/${file.filename}`))
      }
      next()
    })
    .catch((error) => {
      console.log("File DB Error:", error)
      next()
    })
})

fileSchema.set('toJSON', {
  transform: (doc, ret, opt) => {
    ret.path = `files/${ret.room}/${ret.filename}`
    return ret
  }
})

const FileDB = mongoose.model("File DB", fileSchema)
export default FileDB
