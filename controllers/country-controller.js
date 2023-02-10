import dotenv from "dotenv"
import axios from "axios"
import Country from "../models/country-model.js"

dotenv.config()
const geoipApi = process.env.GEOIP_API

const getCurrentLocal = async (req, res) => {
  const ip_address = req.headers["x-forwarded-for"].split(",")[0]
  try {
    const resonse = await axios.get(`${geoipApi}&ip_address=${ip_address}`)
    if (resonse.status == 200) {
      const country = await Country.findOne({ code: resonse.data.country_code })
      return res.json(country)
    } else {
      return res.status(res.status).json({ message: resonse.data.error })
    }
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
