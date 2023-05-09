import express from "express"
import { getDeviceLogin, terminateDevice, scanLogin, updateDeviceLogin } from "../controllers/device-controller.js"

const router = express.Router()

router.get("/", getDeviceLogin)
router.post("/update/:id", updateDeviceLogin)
router.delete("/terminate-device/:id", terminateDevice)
router.post("/link-scan-qr", scanLogin)

export default router
