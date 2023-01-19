import mongoose from "mongoose"
import dotenv from "dotenv"
import mongoosePaginate from "mongoose-paginate-v2"
import Country from "./country-model.js"

dotenv.config()
const apiHost = process.env.API_HOST

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      requried: true
    },
    phone_number: {
      type: String,
      unique: true,
      requried: true
    },
    country: {
      type: mongoose.Types.ObjectId,
      ref: Country,
      required: true
    },
    first_name: {
      type: String,
      default: null
    },
    last_name: {
      type: String,
      default: null
    },
    profile_url: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: null
    },
    is_online: {
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

userSchema.plugin(mongoosePaginate)

userSchema.set("toJSON", {
  transform: (_, ret, __) => {
    const { _id, profile_url } = ret
    if (profile_url) {
      ret.profile_url = `${apiHost}/user-profile/${_id}/${profile_url}`
    }
    return ret
  }
})

const User = mongoose.model("User", userSchema)
export default User
