import DeviceLogin from "../models/device-login-model.js"
import LoginQRCode from "../models/login-qr-model.js";
import User from '../models/user-model.js';
import { sendToCodeClient } from "./ws-login-qr-controller.js";
import jsonwebtoken from "jsonwebtoken"

const getDeviceLogin = async (req, res) => {
  const { _id } = req.user
  try {
    const devices = await DeviceLogin.find({ user: _id })
    return res.json(devices)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const scanLogin = async (req, res) => {
  const { _id } = req.user
  const { id } = req.body

  const result = await LoginQRCode.findById({_id: id});
  console.log(result)
  if (result == null) {
      // code was not found in the collection
    
      return res.status(400).json({
        message: "Code not found"
      })
  }

  // code is valid
  console.log('Code is valid');
  
  const user = await User.findOne({
    _id: _id
  }).populate("country")

  const accessToken = generateAccessToken(user, "7d")
  const refreshToken = generateRefreshToken(user, "30d")

  let expDate = new Date()
  expDate.setDate(expDate.getDate() + 7)

  sendToCodeClient(result._id,{
    data: user,
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer",
    expires_in: expDate
  })

  return res.status(200).json({
    message: "Login Successful"
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

export { getDeviceLogin, scanLogin }
