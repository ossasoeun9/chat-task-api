import otpGenerator from 'otp-generator'
import bcryptjs from 'bcryptjs'
import { generateAccessToken, generateOtpToken, generateRefreshToken } from '../utils/token-generator.js'
import { containsOnlyNumbers } from '../utils/validator.js'
import Country from '../models/country-model.js'
import jsonwebtoken from 'jsonwebtoken'
import { generateUsername } from 'unique-username-generator'
import User from '../models/user-model.js'

const requestOTP = async (req, res) => {
  const { phone_number, country_id } = req.body

  if (!(phone_number && country_id)) {
    return res.status(400).json({
      message: 'Phone number and country id is required',
    })
  }

  if (!containsOnlyNumbers(phone_number)) {
    return res.status(400).json({
      message: 'Phone number must be number',
    })
  }

  let country
  try {
    country = await Country.findById(country_id)
  } catch (error) {
    return res.status(400).json(
      { message: error }
    )
  }

  const newPhoneNumber = country.dial_code + phone_number

  const otp_code = otpGenerator.generate(5, {
    specialChars: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  })

  console.log(`Your verifaction code is ${otp_code}`)

  const hashed_otp = await bcryptjs.hash(otp_code, 10)

  const token = generateOtpToken(newPhoneNumber, country, hashed_otp, '600s')

  return res.json({ token })
}

const verifyOTP = async (req, res) => {
  const { token, otp_code } = req.body
  if (!(token && otp_code)) {
    return res.status(400).json({
      message: 'Token and OTP Code is required'
    })
  }

  jsonwebtoken.verify(token, process.env.OTP_TOKEN_KEY, async (error, data) => {
    if (error) {
      return res.status(403).json({
        message: error
      })
    }

    const isCorrect = await bcryptjs.compare(otp_code, data.otp_code)

    if (!isCorrect) {
      return res.status(400).json({
        message: 'Verification code is incorrect'
      })
    }

    const user = await User.findOne({ phone_number: data.phone_number }).populate("country")

    let newUser
    if (!user) {
      const username = generateUsername()
      newUser = await User.create({
        phone_number: data.phone_number,
        country: data.country._id,
        username
      })
      newUser = await User.findById(newUser._id).populate("country")
    }

    const accessToken = generateAccessToken(user || newUser, '7d')
    const refreshToken = generateRefreshToken(user || newUser, '90d')

    let expDate = new Date();
    expDate.setDate(expDate.getDate() + 7)

    return res.json({
      data: user || newUser,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: expDate,
    })
  })
}

const refreshToken = async (req, res) => {
  const {refresh_token} = req.body
  if (!refresh_token) return res.status(401).json({
    message: "Refresh token is required"
  })

  jsonwebtoken.verify(refresh_token, process.env.REFRESH_TOKEN_KEY, async (error, data) => {
    if (error) return res.status(400).json({
      message: error
    })

    const user = await User.findById(data.user._id).populate("country")

    if (!user) return res.status(401).json({
      message: "User not found"
    })

    const accessToken = generateAccessToken(user, '7d')
    const refreshToken = generateRefreshToken(user, '90d')

    let expDate = new Date();
    expDate.setDate(expDate.getDate() + 7)

    return res.json({
      data: user || newUser,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: expDate,
    })
  })
}

export { requestOTP, verifyOTP, refreshToken }
