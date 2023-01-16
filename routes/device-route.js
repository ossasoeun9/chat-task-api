import express from "express"
import { getDeviceLogin } from "../controllers/device-controller.js"

const router = express.Router()

router.get("/", getDeviceLogin)

export default router
