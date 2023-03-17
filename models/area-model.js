import mongoose from "mongoose"
import User from "./user-model.js"

const areaSchema = mongoose.Schema(
  {
    label: { type: String, required: true },
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: User,
      select: false
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

const Area = mongoose.model("Area", areaSchema)
export default Area
