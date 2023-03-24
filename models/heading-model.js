import mongoose from "mongoose"
import mongooseDelete from "mongoose-delete"

const headingSchema = mongoose.Schema(
  {
    label: { type: String, requried: true },
    room: { type: mongoose.Types.ObjectId, required: true, ref: "Chat Room" }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

headingSchema.plugin(mongooseDelete, {
  overrideMethods: "all"
})
headingSchema.index(
    { updated_at: 1 },
    { partialFilterExpression: { deleted: true }, expireAfterSeconds: 2592000 }
  )
  

const Heading = mongoose.model("Heading", headingSchema)
export default Heading
