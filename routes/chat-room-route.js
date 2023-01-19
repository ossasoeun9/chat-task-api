import express from "express"
import { getChatRoom } from "../controllers/chat-room-controller.js"

const router = express.Router()

router.get('/', getChatRoom)

export default router