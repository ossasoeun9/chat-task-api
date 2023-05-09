import axios from "axios"
import DeviceLogin from "../models/device-login-model.js"
import LoginQRCode from "../models/login-qr-model.js"
import User from "../models/user-model.js"
import { sendToCodeClient } from "./ws-login-qr-controller.js"
import jsonwebtoken from "jsonwebtoken"
import RevokedToken from "../models/revoked_token.js"

const getDeviceLogin = async (req, res) => {
  const { _id } = req.user
  try {
    const devices = await DeviceLogin.find({ user: _id }).select("-access_token -refresh_token")
    return res.json(devices)
  } catch (error) {
    return res.status(500).json({
      message: error,
    })
  }
}

const updateDeviceLogin = async (req, res) => {
  const { id } = req.params
  const { device_name, device_os } = req.body
  const ip_address =
    req.headers["x-forwarded-for"] &&
    req.headers["x-forwarded-for"].split(",")[0]
  try {
    var device = await DeviceLogin.findById(id)
    if (device) {
      if (device.ip_address != ip_address) {
        device.ip_address = ip_address
        const resonse = await axios.get(`${geoipApi}&ip_address=${ip_address}`)
        if (resonse.status == 200) {
          device.geoip = resonse.data
        }
      }
      device.device_os = device_os
      device.device_name = device_name
      const savedDevice = await device.save()
      res.json(savedDevice)
    }
  } catch (error) {
    res.status(501).json({ error })
  }
}

const terminateDevice = async (req, res) => {
  const id = req.params.id

  const device = await DeviceLogin.findById({ _id: id })

  if (device == null) {
    return res.status(400).json({
      message: "Device Not Found",
    })
  }

  await RevokedToken.create({
    access_token: device.access_token,
    refresh_token: device.refresh_token,
  })

  await DeviceLogin.deleteOne({ _id: id })

  return res.status(200).json({
    message: "Device was terminate successful",
  })
}

const scanLogin = async (req, res) => {
  const { _id } = req.user
  const { id } = req.body

  const result = await LoginQRCode.findById({ _id: id })
  console.log(result)
  if (result == null) {
    // code was not found in the collection

    return res.status(400).json({
      message: "Code not found",
    })
  }

  // code is valid
  console.log("Code is valid")

  const user = await User.findOne({
    _id: _id,
  }).populate("country")

  const accessToken = generateAccessToken(user, "7d")
  const refreshToken = generateRefreshToken(user, "30d")

  let expDate = new Date()
  expDate.setDate(expDate.getDate() + 7)

  sendToCodeClient(result._id, {
    data: user,
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer",
    expires_in: expDate,
  })

  // Delete the LoginQRCode document
  LoginQRCode.deleteOne({ _id: id }, (err) => {
    if (err) {
      // Handle the error
    } else {
      // The document was deleted successfully
    }
  })

  return res.status(200).json({
    message: "Login Successful",
  })
}

const generateAccessToken = (user, expiresIn) => {
  return jsonwebtoken.sign({ user }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: expiresIn,
  })
}

const generateRefreshToken = (user, expiresIn) => {
  return jsonwebtoken.sign({ user }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: expiresIn,
  })
}

export { getDeviceLogin, updateDeviceLogin, terminateDevice, scanLogin }
