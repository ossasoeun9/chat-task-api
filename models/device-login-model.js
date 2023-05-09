import mongoose from "mongoose"
import mongooseAutoPopulate from "mongoose-autopopulate"
import User from "./user-model.js"

const deviceLogginSchema = mongoose.Schema(
  {
    ip_address: String,
    geoip: Object,
    device_name: String,
    device_os: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: User,
      select: false,
    },
    access_token: {
      type: String,
    },
    refresh_token: {
      type: String,
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
    ret.location = `${ret.geoip.region}, ${ret.geoip.country} ${ret.geoip.country_code}`
    delete ret.geoip
    return ret
  }
})

deviceLogginSchema.plugin(mongooseAutoPopulate)

const DeviceLogin = mongoose.model("device logins", deviceLogginSchema)
export default DeviceLogin
