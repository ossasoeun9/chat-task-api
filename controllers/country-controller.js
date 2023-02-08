import dotenv from "dotenv"
import axios from "axios"
import Country from "../models/country-model.js"

dotenv.config()
const geoipApi = process.env.GEOIP_API

const getCurrentLocal = async (req, res) => {
  const ip_address = req.headers["x-forwarded-for"]
  try {
    const resonse = await axios.get(`${geoipApi}&ip_address=${ip_address}`)
    return res.json(resonse.data)
  } catch (error) {
    return res.json({ error })
  }
}

const fetchPhoneCode = async (req, res) => {
  try {
    const phoneCodes = await Country.find()
    res.json(phoneCodes)
  } catch (error) {
    res.send({
      message: error
    })
  }
}

export { getCurrentLocal, fetchPhoneCode }
