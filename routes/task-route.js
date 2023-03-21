import express from "express"
import {
  addAttachment,
  assignTaskTo,
  createTask,
  deleteAttachment,
  deleteTask,
  editTask,
  getTasks,
  removeAssignTaskTo,
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

export default router
