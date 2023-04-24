import express from "express"
import {
  changeUsername,
  editBio,
  editName,
  getProfile,
  getUsers,
  removeProfilePicure,
  requestChangePhoneNumber,
  setProfilePicture,
  verifyChangePhoneNumber,
  verifyOTPAccountDeletion
} from "../controllers/user-controller.js"

const router = express.Router()

router.get("/", getUsers)
router.get("/profile", getProfile)
router.post("/edit-name", editName)
router.post("/edit-bio", editBio)
router.post("/change-username", changeUsername)
router.post("/check-change-phone-number", checkChangePhoneNumber)
router.post("/verify-change-phone-number", verifyChangePhoneNumber)
router.post("/set-profile-picture", setProfilePicture)
router.delete("/remove-profile-picture", removeProfilePicure)
router.delete("/verify-otp-account-deletion", verifyOTPAccountDeletion)

export default router
