import express from "express"
import { createChatRoom, getChatRoom } from "../controllers/chat-room-controller.js"

const router = express.Router()

router.get('/', getChatRoom)
router.post('/create', createChatRoom)

export default router