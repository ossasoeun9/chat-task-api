import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import fs from "fs"
import path from "path"

const attachmentSchema = mongoose.Schema(
  {
    filename: String,
    size: Number,
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    task: {
      type: mongoose.Types.ObjectId,
      ref: "Task"
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

attachmentSchema.plugin(mongoosePaginate)

attachmentSchema.pre("deleteMany", function (next) {
  const query = this.getQuery()
  Attachment.find(query)
    .then((attachments) => {
      for (let i = 0; i < attachments.length; i++) {
        const file = attachments[i]
        fs.unlinkSync(
          path.normalize(`storage/task-attachments/${file.task}/${file.filename}`)
        )
      }
      next()
    })
    .catch((error) => {
      console.log("Attachemnt Error:", error)
      next()
    })
})

attachmentSchema.set("toJSON", {
  transform: (doc, ret, opt) => {
    ret.path = `task-attchments/${ret.task}/${ret.filename}`
    return ret
  }
})

const Attachment = mongoose.model("Attachment", attachmentSchema)
export default Attachment
