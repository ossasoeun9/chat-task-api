import { identitytoolkit } from "@googleapis/identitytoolkit"
import axios from "axios"
import dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"
import { generateUsername } from "unique-username-generator"
import ChatRoom from "../models/chat-room-model.js"
import Contact from "../models/contact-model.js"

import Country from "../models/country-model.js"
import DeviceLogin from "../models/device-login-model.js"
import Message from "../models/message-model.js"
import User from "../models/user-model.js"
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token-generator.js"
import { containsOnlyNumbers } from "../utils/validator.js"
import { sendToClient } from "./ws-chats-controller.js"
import { response } from "express"
import RevokedToken from "../models/revoked_token.js"

dotenv.config()
const apiKey = process.env.API_KEY
const geoipApi = process.env.GEOIP_API
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY

const googleIdentitytoolkit = identitytoolkit({ auth: apiKey, version: "v3" })

const requestOTP = async (req, res) => {
  const { recaptcha_token, phone_number, country_id } = req.body

  if (!(recaptcha_token && phone_number && country_id)) {
    return res.status(400).json({
      message: "Recaptcha token, Phone number and country id is required",
    })
  }

  if (!containsOnlyNumbers(phone_number)) {
    return res.status(400).json({
      message: "Phone number must be number",
    })
  }

  let country
  try {
    country = await Country.findById(country_id)
  } catch (error) {
    return res.status(400).json({ message: error })
  }

  const newPhoneNumber = country.dial_code + phone_number

  googleIdentitytoolkit.relyingparty
    .sendVerificationCode({
      recaptchaToken: recaptcha_token,
      phoneNumber: newPhoneNumber,
    })
    .then((response) => {
      return res.json({
        session_info: response.data.sessionInfo,
      })
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message })
    })
}

const verifyOTP = async (req, res) => {
  const { session_info, otp_code, country_id } = req.body
  if (!(session_info && otp_code && country_id)) {
    return res.status(400).json({
      message: "Session Inf, OTP and Country ID Code is required",
    })
  }

  googleIdentitytoolkit.relyingparty
    .verifyPhoneNumber({
      sessionInfo: session_info,
      code: otp_code,
    })
    .then(async (response) => {
      const { phoneNumber } = response.data
      const user = await User.findOne({
        phone_number: phoneNumber,
      }).populate("country")

      let newUser
      if (!user) {
        const username = generateUsername()
        newUser = await User.create({
          phone_number: phoneNumber,
          country: country_id,
          username,
        })
        newUser = await User.findById(newUser._id).populate("country")
        const contacts = await Contact.find({ phone_number: phoneNumber })
        for (let i = 0; i < contacts.length; i++) {
          var contact = contacts[i]
          var room = await ChatRoom.create({
            type: 2,
            people: [newUser._id, contact.owner],
          })
          await User.updateMany(
            { _id: { $in: [newUser._id, contact.owner] } },
            { $addToSet: { rooms: [room._id] } }
          )
          await Message.create({
            type: 1,
            room: room._id,
            sender: newUser._id,
            text: `@${newUser.username} joined ChatTask`,
          })
          sendToClient(newUser._id, room._id)
          sendToClient(contact.owner, room._id)
        }
      }

      const accessToken = generateAccessToken(user || newUser, "7d")
      const refreshToken = generateRefreshToken(user || newUser, "30d")

      let expDate = new Date()
      expDate.setDate(expDate.getDate() + 7)

      const { id } = user || newUser

      const deviceLogin = await storeLogin(req, id, {
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      return res.json({
        data: user || newUser,
        device_login_id: deviceLogin ? deviceLogin._id : undefined,
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: expDate,
      })
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message })
    })
    .catch((error) => {
      return res.status(500).json({ message: error })
    })
}

const refreshToken = async (req, res) => {
  const { refresh_token } = req.body
  if (!refresh_token)
    return res.status(400).json({
      message: "Refresh token is required",
    })

  var revokedToken = await RevokedToken.findOne({refresh_token})  

  if (revokedToken) {
    return res.status(401).json({
      message: "Unauthenticated",
    })
  }

  jsonwebtoken.verify(refresh_token, refreshTokenKey, async (error, data) => {
    if (error)
      return res.status(401).json({
        message: "Unauthenticated",
      })

    const user = await User.findById(data.user._id).populate("country")

    if (!user)
      return res.status(401).json({
        message: "Unauthenticated",
      })

    // check user deleted account or not
    if (user.is_delete === true) {
      return res.status(401).json({
        message: "Unauthenticated",
      })
    }

    // check refresh_token existing in devices list or not, if not reject access

    // everything look good, user can access
    const accessToken = generateAccessToken(user, "7d")
    const refreshToken = generateRefreshToken(user, "30d")

    let expDate = new Date()
    expDate.setDate(expDate.getDate() + 7)

    const { id } = user

    const deviceLogin = await updateLogin(req, id, refresh_token, {
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    return res.json({
      data: user,
      device_login_id: deviceLogin ? deviceLogin._id : undefined,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: expDate,
    })
  })
}

const storeLogin = async (req, userId, token) => {
  const user = userId
  const ip_address =
    req.headers["x-forwarded-for"] &&
    req.headers["x-forwarded-for"].split(",")[0]
  try {
    const resonse = await axios.get(`${geoipApi}&ip_address=${ip_address}`)
    if (resonse.status == 200) {
      return await DeviceLogin.create({
        ip_address,
        geoip: resonse.data,
        user,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const updateLogin = async (req, userId, oldResfreshToken, token) => {
  const ip_address =
    req.headers["x-forwarded-for"] &&
    req.headers["x-forwarded-for"].split(",")[0]
  try {
    var device = await DeviceLogin.findOne({
      refresh_token: oldResfreshToken,
    })
    if (device) {
      if (device.ip_address != ip_address) {
        device.ip_address = ip_address
        const resonse = await axios.get(`${geoipApi}&ip_address=${ip_address}`)
        if (resonse.status == 200) {
          device.geoip = resonse.data
        }
      }
      device.user = userId
      device.access_token = token.access_token
      device.refresh_token = token.refresh_token
      return await device.save()
    }
  } catch (error) {
    console.log(error)
  }
}

export { requestOTP, verifyOTP, refreshToken }
