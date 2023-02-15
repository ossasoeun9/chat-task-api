import express from "express"
import {
  blockContact,
  createOrEditContact,
  deleteContact,
  getContactDetail,
  getContacts,
  syncContacts
} from "../controllers/contact-controller.js"

const router = express.Router()

router.get("/", getContacts)
router.get("/:id", getContactDetail)
router.post("/create-or-edit", createOrEditContact)
router.post("/sync", syncContacts)
router.delete("/delete/:id", deleteContact)
router.delete("/block-or-unblock/:id", blockContact)

export default router
