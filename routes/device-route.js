import express from "express"
import { getDeviceLogin,scanLogin } from "../controllers/device-controller.js"

const router = express.Router()

router.get("/", getDeviceLogin)
router.post("/link-scan-qr", scanLogin)

export default router
