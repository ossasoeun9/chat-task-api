import express from "express"
import {
  refreshToken,
  requestOTP,
  verifyOTP,
} from "../controllers/auth-countroller-v2.js"

const router = express.Router()

router.post("/request-otp", requestOTP)
router.post("/verify-otp", verifyOTP)
router.post("/refresh-token", refreshToken)

export default router
