import { identitytoolkit } from "@googleapis/identitytoolkit"
import axios from "axios"
import dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"
import { generateUsername } from "unique-username-generator"

import Country from "../models/country-model.js"
import DeviceLogin from "../models/device-login-model.js"
import User from "../models/user-model.js"
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token-generator.js"
import { containsOnlyNumbers } from "../utils/validator.js"

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
      return res.status(response.status).json({
        session_info: response.data.sessionInfo,
      })
    })
    .catch((error) => {
      return res.status(500).send(error.response.data.error)
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
      }

      const accessToken = generateAccessToken(user || newUser, "7d")
      const refreshToken = generateRefreshToken(user || newUser, "90d")

      let expDate = new Date()
      expDate.setDate(expDate.getDate() + 7)

      const { id } = user || newUser

      await storeLogin(req, id, {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: expDate,
      })

      return res.json({
        data: user || newUser,
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: expDate,
      })
    })
    .catch((error) => {
      return res.status(500).send(error)
    })
}

const refreshToken = async (req, res) => {
  const { refresh_token } = req.body
  if (!refresh_token)
    return res.status(401).json({
      message: "Refresh token is required",
    })

  jsonwebtoken.verify(
    refresh_token,
    refreshTokenKey,
    async (error, data) => {
      if (error)
        return res.status(400).json({
          message: error,
        })

      const user = await User.findById(data.user._id).populate("country")

      if (!user)
        return res.status(401).json({
          message: "User not found",
        })

      const accessToken = generateAccessToken(user, "7d")
      const refreshToken = generateRefreshToken(user, "90d")

      let expDate = new Date()
      expDate.setDate(expDate.getDate() + 7)

      const { id } = user

      await storeLogin(req, id, {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: expDate,
      })

      return res.json({
        data: user,
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: expDate,
      })
    }
  )
}

const storeLogin = async (req, userId, token) => {
  const user = userId
  const ip_address = req.headers["x-forwarded-for"].split(",")[0]
  const user_agent = req.headers["user-agent"]
  const oldDevice = await DeviceLogin.findOne({
    ip_address,
    user_agent,
    user,
  })

  if (!oldDevice) {
    try {
      const resonse = await axios.get(
        `${geoipApi}&ip_address=${ip_address}`
      )
      if (resonse.status == 200) {
        await DeviceLogin.create({
          ip_address,
          user_agent,
          geoip: resonse.data,
          user,
          token,
        })
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      await DeviceLogin.updateOne(
        { _id: oldDevice._id },
        { token, loggin_time: Date.now() }
      )
    } catch (error) {
      console.log(error)
    }
  }
}

export { requestOTP, verifyOTP, refreshToken }
