import mongoose from "mongoose"
import User from "./user-model.js"
import mongooseDelete from "mongoose-delete"

const areaSchema = mongoose.Schema(
  {
    label: { type: String, required: true },
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: User,
      select: false
    },
    rooms: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Chat Room",
      }
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

areaSchema.plugin(mongooseDelete, {
  overrideMethods: "all"
})

areaSchema.index(
  { updated_at: 1 },
  { partialFilterExpression: { deleted: true }, expireAfterSeconds: 2592000 }
)

const Area = mongoose.model("Area", areaSchema)
export default Area
