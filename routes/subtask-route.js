import express from "express"
import {
  addSubtask,
  editSubtask,
  markOrUnmarkSubtask,
  removeSubtask,
} from "../controllers/subtask-controller.js"
const router = express.Router()

router.post("/add", addSubtask)
router.post("/edit/:id", editSubtask)
router.delete("/remove/:id", removeSubtask)
router.post("/mark-or-unmark/:id", markOrUnmarkSubtask)

export default router
