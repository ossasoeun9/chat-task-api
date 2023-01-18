import { UAParser } from "ua-parser-js"
import DeviceLoggin from "../models/device-loggin-model.js"

const getDeviceLogin = async (req, res) => {
  const { _id } = req.user
  var devices = await DeviceLoggin.find({ user: _id })
  const newDevice = devices.map((item) => {
    const parser = new UAParser(item.user_agent)
    const { ip_address, loggin_time, geoip } = item
    const newItem = {
      ip_address,
      loggin_time,
      device_info: parser.getResult(),
      address: `${geoip.region}, ${geoip.country}`,
    }
    return newItem
  })
  return res.json(newDevice)
}

export { getDeviceLogin }
