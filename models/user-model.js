import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import Country from "./country-model.js"

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    requried: true,
  },
  phone_number: {
    type: String,
    unique: true,
    requried: true,
  },
  country: {
    type: mongoose.Types.ObjectId,
    ref: Country,
    required: true,
  },
  first_name: {
    type: String,
    default: null,
  },
  last_name: {
    type: String,
    default: null,
  },
  profile_url: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: null,
  },
  latest_online: {
    type: Date,
    default: Date.now,
  },
  is_online: {
    type: Boolean,
    default: false,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

userSchema.plugin(mongoosePaginate)

const User = mongoose.model("User", userSchema)
export default User
