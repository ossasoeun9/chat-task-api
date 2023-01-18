import mongoose from "mongoose"
import User from "./user-model.js"

const deviceLoggin = mongoose.Schema({
  ip_address: String,
  geoip: Object,
  user_agent: String,
  user: {
    type: mongoose.Types.ObjectId,
    ref: User,
    select: false,
  },
  loggin_time: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: Object,
    select: false,
  },
})

const DeviceLoggin = mongoose.model("device loggins", deviceLoggin)
export default DeviceLoggin
