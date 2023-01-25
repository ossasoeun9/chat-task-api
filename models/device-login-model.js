import mongoose from "mongoose"
import mongooseAutoPopulate from "mongoose-autopopulate"
import { UAParser } from "ua-parser-js"
import User from "./user-model.js"

const deviceLogginSchema = mongoose.Schema(
  {
    ip_address: String,
    geoip: Object,
    user_agent: String,
    is_online: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: User,
      select: false,
      autopopulate: true,
    },
    token: {
      type: Object,
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

deviceLogginSchema.set("toJSON", {
  transform: (doc, ret, _) => {
    delete ret.id
    const parser = new UAParser(ret.user_agent)
    ret.device_info = parser.getResult()
    delete ret.user_agent
    ret.location = `${ret.geoip.region}, ${ret.geoip.country} ${ret.geoip.country_code}`
    delete ret.geoip
    return ret
  }
})

deviceLogginSchema.plugin(mongooseAutoPopulate)

const DeviceLogin = mongoose.model("device logins", deviceLogginSchema)
export default DeviceLogin
