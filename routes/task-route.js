import express from "express"
import {
  deleteComment,
  editComment,
  getCommnets,
  postCommnent
} from "../controllers/commnent-controller.js"
import {
  addAttachment,
  assignTaskTo,
  createTask,
  deleteAttachment,
  deleteTask,
  editTask,
  getTasks,
  removeAssignTaskTo
} from "../controllers/task-controller.js"
const router = express.Router()

router.get("/", getTasks)
router.post("/create", createTask)
router.post("/edit/:id", editTask)
router.delete("/delete/:id", deleteTask)
router.post("/assign-to/:id", assignTaskTo)
router.delete("/remove-assign-to/:id", removeAssignTaskTo)
router.post("/add-attachment/:id", addAttachment)
router.delete("/remove-attachment/:id", deleteAttachment)
router.get("/comment/:id", getCommnets)
router.post("/comment/:id/post", postCommnent)
router.delete("/comment/:id/delete/:commentId", deleteComment)
router.post("/comment/:id/edit/:commentId", editComment)

export default router
