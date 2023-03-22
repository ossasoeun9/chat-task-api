import dotenv from "dotenv"
import axios from "axios"
import Country from "../models/country-model.js"
import JSONStream from "JSONStream"

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

const fetchPhoneCode = (req, res) => {
  try {
    Country.find().cursor().pipe(JSONStream.stringify()).pipe(res.type("json"))
  } catch (error) {
    res.status(500).send({
      message: error
    })
  }
}

export { getCurrentLocal, fetchPhoneCode }
