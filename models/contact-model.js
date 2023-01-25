import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import User from "./user-model.js"

const contactSchema = mongoose.Schema(
  {
    phone_number: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: User
    },
    first_name: {
      type: String,
      default: null
    },
    last_name: {
      type: String,
      default: null
    },
    is_blocked: {
      type: Boolean,
      default: false
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

contactSchema.index({ owner: 1, phone_number: 1 }, { unique: true })

contactSchema.virtual("user", {
  ref: User,
  localField: "phone_number",
  foreignField: "phone_number",
  justOne: true,
})

contactSchema.set("toObject", { virtuals: true })
contactSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret, _) => {
    delete ret.id
    delete ret.__v
    return ret
  }
})

contactSchema.plugin(mongoosePaginate)

const Contact = mongoose.model("Contact", contactSchema)
export default Contact
