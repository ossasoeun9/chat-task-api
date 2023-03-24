import express from "express"
import {
  createHeading,
  deleteHeading,
  editHeading,
  getHeadings
} from "../controllers/heading-controller.js"
const router = express.Router()

router.get("/:roomId", getHeadings)
router.post("/create", createHeading)
router.post("/edit/:headingId", editHeading)
router.delete("/delete/:headingId", deleteHeading)

export default router
