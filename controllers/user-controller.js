import dotenv from "dotenv"
import fs from "fs"
import Country from "../models/country-model.js"
import User from "../models/user-model.js"
import { containsOnlyNumbers } from "../utils/validator.js"
import { randomBytes } from "crypto"
import path from "path"
import { identitytoolkit } from "@googleapis/identitytoolkit"

dotenv.config()
const apiKey = process.env.API_KEY

const googleIdentitytoolkit = identitytoolkit({ auth: apiKey, version: "v3" })

const getProfile = async (req, res) => {
  const {_id} = req.user

  try {
    const user = await User.findById(_id).populate("country")
    return res.json(user)
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
}

const editName = async (req, res) => {
  const { _id } = req.user
  const { first_name, last_name } = req.body

  if (!first_name)
    return res.status(400).json({
      message: "First Name is required"
    })

  try {
    await User.updateOne({ _id: req.user._id }, { first_name, last_name })
    const user = await User.findById(_id).populate("country")
    return res.json(user)
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
}

const editBio = async (req, res) => {
  const { _id } = req.user
  const { bio } = req.body

  try {
    await User.updateOne({ _id }, { bio })
    const user = await User.findById(_id).populate("country")
    return res.json(user)
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
}

const setProfilePicture = async (req, res) => {
  const { _id } = req.user
  const { profile } = req.files

  if (!profile)
    return res.status(400).json({
      message: "Profile is required"
    })

  const dir = `storage/user-profile/${_id}/`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const filename =
    Date.now() +
    "." +
    randomBytes(6).toString("hex") +
    path.extname(profile.originalFilename)

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

    const user = await User.findById(_id).populate("country")
    return res.json(user)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const removeProfilePicure = async (req, res) => {
  const { _id } = req.user
  const user = await User.findById(_id)
  const { profile_url } = user
  if (!profile_url)
    return res.status(400).json({
      message: "Profile was deleted"
    })

  try {
    await User.updateOne({ _id }, { profile_url: null })
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
  const {_id} = req.user
  const { username } = req.body

  if (!username)
    return res.status(400).json({
      message: "Username is required"
    })

  const otherUser = await User.find({ username })
  if (otherUser.length > 0)
    return res.status(400).json("Username is already in used")

  try {
    await User.updateOne({ _id }, { username })
    const user = await User.findById(_id).populate("country")
    return res.json(user)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const requestChangePhoneNumber = async (req, res) => {
  const { recaptcha_token, phone_number, country_id } = req.body

  if (!(recaptcha_token, phone_number && country_id))
    return res.status(400).json({
      message: "Recaptcha token, Phone number and country id is required"
    })

  if (!containsOnlyNumbers(phone_number))
    return res.status(400).json({
      message: "Phone number must be number"
    })

  const getCountry = await Country.findById(country_id)
  const otherUser = await User.find({
    phone_number: getCountry.dial_code + phone_number
  })
  if (otherUser.length > 0)
    return res.status(400).json({
      message: "Phone number is used by another account"
    })

  let country
  try {
    country = await Country.findById(country_id)
  } catch (error) {
    return res.status(400).json({ message: error })
  }

  const newPhoneNumber = country.dial_code + phone_number

  googleIdentitytoolkit.relyingparty
    .sendVerificationCode({
      phoneNumber: newPhoneNumber,
      recaptchaToken: recaptcha_token
    })
    .then((response) => {
      return res.json({
        session_info: response.data.sessionInfo
      })
    })
    .catch((error) => {
      return res.status(500).send(error)
    })
}

const verifyChangePhoneNumber = async (req, res) => {
  const {_id} = req.user
  const { session_info, otp_code, country_id } = req.body
  if (!(session_info && otp_code && country_id)) {
    return res.status(400).json({
      message: "Session info, OTP code and Country id is required"
    })
  }

  googleIdentitytoolkit.relyingparty
    .verifyPhoneNumber({
      sessionInfo: session_info,
      code: otp_code
    })
    .then(async (response) => {
      const { phoneNumber } = response.data
      try {
        await User.updateOne(
          { _id },
          { phone_number: phoneNumber, country: country_id }
        )
        const user = await User.findById(_id).populate("country")
        return res.json(user)
      } catch (error) {
        return res.status(500).json({
          message: error
        })
      }
    })
    .catch((error) => {
      return res.status(500).json(error)
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
  verifyChangePhoneNumber
}
