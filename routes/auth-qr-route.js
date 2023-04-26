import express from "express"
import {
    requestQRCode
} from "../controllers/auth-qr-controller.js"

const router = express.Router()

router.get("/request-qr-code", requestQRCode)

export default router
