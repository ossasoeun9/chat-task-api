import express from "express"
import { addMembers, createChatRoom, editChatRoom, getChatRoom, getChatRoomDetail, joinChatRoom, leaveChatRoom, removeMembers } from "../controllers/chat-room-controller.js"

const router = express.Router()

router.get('/', getChatRoom)
router.get('/:id', getChatRoomDetail)
router.post('/create', createChatRoom)
router.post('/:id/edit', editChatRoom)
router.post('/:id/add-members', addMembers)
router.delete('/:id/remove-members', removeMembers)
router.post('/:id/join-group', joinChatRoom)
router.delete('/:id/leave-group', leaveChatRoom)

export default router