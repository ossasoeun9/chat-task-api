import dotenv from "dotenv"
import axios from "axios"
import Country from "../models/country-model.js"

dotenv.config()
const geoipApi = process.env.GEOIP_API

const getCurrentLocal = async (req, res) => {
  const ip_address =
    req.headers["x-forwarded-for"] &&
    req.headers["x-forwarded-for"].split(",")[0]
  try {
    const resonse = await axios.get(`${geoipApi}&ip_address=${ip_address}`)
    const country = await Country.findOne({ code: resonse.data.country_code })
    return res.json(country)
  } catch (error) {
    return res.status(500).json({ message: error.message })
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
