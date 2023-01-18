import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import User from "./user-model.js"

const contact = mongoose.Schema(
  {
    phone_number: {
      type: String,
      default: null
    },
    owner: {
      type: mongoose.Types.ObjectId,
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
    }
  }
)

contact.virtual("user", {
  ref: User,
  localField: "phone_number",
  foreignField: "phone_number",
  justOne: true
})

contact.set("toObject", { virtuals: true })
contact.set("toJSON", { virtuals: true })

contact.plugin(mongoosePaginate)

const Contact = mongoose.model("Contact", contact)
export default Contact
