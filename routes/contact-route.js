import express from "express"
import {
  blockContact,
  createContact,
  deleteContact,
  editContact,
  getBlockedContacts,
  getContacts,
  syncContacts
} from "../controllers/contact-controller.js"

const router = express.Router()

router.get("/", getContacts)
router.post("/create", createContact)
router.post("/sync", syncContacts)
router.post("/edit/:id", editContact)
router.delete("/delete/:id", deleteContact)
router.delete("/block-or-unblock/:id", blockContact)
router.get("/blocked", getBlockedContacts)

export default router
