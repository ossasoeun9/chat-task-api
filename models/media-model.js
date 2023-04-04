import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import fs from "fs"
import path from "path"

const mediaSchema = mongoose.Schema(
  {
    filename: String,
    original_name: String,
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
mediaSchema.plugin(mongoosePaginate)

mediaSchema.pre("deleteMany", function (next) {
  const query = this.getQuery()
  Media.find(query)
    .then((media) => {
      for (let i = 0; i < media.length; i++) {
        const m = media[i]
        fs.unlinkSync(path.normalize(`storage/media/${m.room}/${m.filename}`))
      }
      next()
    })
    .catch((error) => {
      console.log("Media DB Error:", error)
      next()
    })
})

mediaSchema.set('toJSON', {
  transform: (doc, ret, opt) => {
    ret.path = `media/${ret.room}/${ret.filename}`
    return ret
  }
})

const Media = mongoose.model("Media", mediaSchema)
export default Media
