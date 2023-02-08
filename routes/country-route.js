import express from "express"
import { fetchPhoneCode, getCurrentLocal } from "../controllers/country-controller.js"

const router = express.Router()

router.route("/").get(fetchPhoneCode)
router.route("/current-local").get(getCurrentLocal)

export default router
