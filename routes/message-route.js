import express from "express"
import {
  crearHistory,
  deleteMessage,
  editMessage,
  getMessage,
  readMessage,
  sendMessage
} from "../controllers/message-controller/message-controller.js"

const router = express.Router()

router.get("/:roomId", getMessage)
router.post("/:roomId/read", readMessage)
router.post("/:roomId/send", sendMessage)
router.post("/:messageId/edit", editMessage)
router.delete("/:roomId/clear", crearHistory)
router.delete("/delete/:roomId", deleteMessage)

export default router
