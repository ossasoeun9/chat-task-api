import otpGenerator from 'otp-generator'
import bcryptjs from 'bcryptjs'
import dotenv from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'
import fs from 'fs'
import Country from "../models/country-model.js"
import User from "../models/user-model.js"
import { generatePhoneChangeToken } from "../utils/token-generator.js"
import { containsOnlyNumbers } from "../utils/validator.js"
import { randomBytes } from 'crypto'
import path from 'path'

dotenv.config()

const getUser = async (req) => {
  const { _id } = req.user
  const user = await User.findById(_id).populate("country")
  if (user?.profile_url != null) {
    user.profile_url = `${req.protocol}://${req.get('host')}/user-profile/${_id}/${user.profile_url}`
  }
  return user
}

const getProfile = async (req, res) => {
  const data = req.user
  if (!data) return res.status(400).json({
    message: "user not found"
  })

  const user = await getUser(req)

  res.json(user)
}

const editName = async (req, res) => {
  const { first_name, last_name } = req.body

  if (!first_name) return res.status(400).json({
    message: "First Name is required",
  })

  try {
    await User.updateOne({ _id: req.user._id }, { first_name, last_name })
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }

  const user = await getUser(req)

  return res.json(user)
}

const editBio = async (req, res) => {
  const { bio } = req.body

  try {
    await User.updateOne({ _id: req.user._id }, { bio })
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }

  const user = await getUser(req)

  return res.json(user)
}

const setProfilePicture = async (req, res) => {
  const { _id } = req.user
  const { profile } = req.files

  if (!profile) return res.status(400).json({
    message: "Profile is required"
  })

  const dir = `storage/user-profile/${_id}/`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const filename = Date.now() + '.' + randomBytes(6).toString('hex') + path.extname(profile.originalFilename)

  const fullPath = path.normalize(`${dir}/${filename}`)
  try {
    // delete old image
    const oldUser = await User.findById(_id)
    if (oldUser.profile_url) {
      const deleteFullPath = dir + oldUser.profile_url
      fs.unlinkSync(deleteFullPath)
    }

    // read
    const content = fs.readFileSync(profile.path)

    // write
    fs.writeFileSync(fullPath, content)
    await User.updateOne({ _id }, { profile_url: filename })

    // clear tmp dir
    fs.unlinkSync(profile.path)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }

  const user = await getUser(req)
  res.send(user)
}

const removeProfilePicure = async (req, res) => {
  const {_id} = req.user
  const user = await User.findById(_id)
  const { profile_url } = user
  if (!profile_url) return res.status(400).json({
    message: "Profile was deleted"
  })

  try {
    await User.updateOne({_id}, {profile_url: null})
    fs.unlinkSync(`storage/user-profile/${_id}/${profile_url}`)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }

  return res.json({
    message: "Profile is deleted successfuly"
  })
}

const changeUsername = async (req, res) => {
  const { username } = req.body

  if (!username) return res.status(400).json({
    message: "Username is required"
  })

  const otherUser = await User.find({ username })
  if (otherUser.length > 0) return res.status(400).json(
    "Username is already in used"
  )

  try {
    await User.updateOne({ _id: req.user._id }, { username })
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }

  const user = await getUser(req)

  return res.json(user)
}

const requestChangePhoneNumber = async (req, res) => {
  const { phone_number, country_id } = req.body

  if (!(phone_number && country_id)) return res.status(400).json({
    message: 'Phone number and country id is required',
  })

  if (!containsOnlyNumbers(phone_number)) return res.status(400).json({
    message: 'Phone number must be number',
  })

  const getCountry = await Country.findById(country_id)
  const otherUser = await User.find({ phone_number: getCountry.dial_code + phone_number })
  if (otherUser.length > 0) return res.status(400).json({
    message: "Phone number is used by another account"
  })

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

  const token = generatePhoneChangeToken(newPhoneNumber, country, hashed_otp, '600s')

  return res.json({ token })
}

const verifyChangePhoneNumber = async (req, res) => {
  const { token, otp_code } = req.body
  if (!(token && otp_code)) {
    return res.status(400).json({
      message: 'Token and OTP Code is required'
    })
  }

  jsonwebtoken.verify(token, process.env.PHONE_CHANGE_TOKEN_KEY, async (error, data) => {
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

    const { phone_number, country } = data

    try {
      await User.updateOne({ _id: req.user._id }, { phone_number, country_id: country._id })
    } catch (error) {
      return res.status(500).json({
        message: error
      })
    }

    const user = await getUser(req)

    return res.json(user)
  })
}

export {
  getProfile,
  editName,
  editBio,
  setProfilePicture,
  removeProfilePicure,
  requestChangePhoneNumber,
  changeUsername,
  verifyChangePhoneNumber,
}
