import express from "express"
import {
  deleteMessage,
  editMessage,
  getMessage,
  sendMessage
} from "../controllers/message-controller/message-controller.js"

const router = express.Router()

router.get("/:roomId", getMessage)
router.post("/:roomId/send", sendMessage)
router.post("/:messageId/edit", editMessage)
router.delete("/delete", deleteMessage)

export default router
