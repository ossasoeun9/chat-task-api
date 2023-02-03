import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import fs from "fs"
import path from "path"

const voiceSchema = mongoose.Schema(
  {
    filename: String,
    size: Number,
    duration: Number,
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

voiceSchema.plugin(mongoosePaginate)

voiceSchema.pre("deleteMany", function (next) {
  const query = this.getQuery()
  Voice.find(query)
    .then((voices) => {
      for (let i = 0; i < voices.length; i++) {
        const voice = voices[i]
        fs.unlinkSync(path.normalize(`storage/voice-messages/${voice.room}/${voice.filename}`))
      }
      next()
    })
    .catch((error) => {
      console.log("Media DB Error:", error)
      next()
    })
})

const Voice = mongoose.model("Voice", voiceSchema)
export default Voice
