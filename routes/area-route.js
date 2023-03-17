import express from "express"
import {
  addProjects,
  createArea,
  deleteArea,
  editArea,
  getAreas,
  removeProjects
} from "../controllers/area-controller.js"
const router = express.Router()

router.get("/", getAreas)
router.post("/create", createArea)
router.post("/edit/:id", editArea)
router.delete("/delete/:id", deleteArea)
router.post("/add-projects/:id", addProjects)
router.delete("/remove-projects/:id", removeProjects)

export default router
