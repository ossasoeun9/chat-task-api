import express from 'express'
import { changeUsername, editBio, editName, getProfile, removeProfilePicure, requestChangePhoneNumber, setProfilePicture, verifyChangePhoneNumber } from '../controllers/user-controller.js'

const router = express.Router()

router.get('/profile', getProfile)
router.post('/edit-name', editName)
router.post('/edit-bio', editBio)
router.post('/change-username', changeUsername)
router.post('/request-change-phone-number', requestChangePhoneNumber)
router.post('/verify-change-phone-number', verifyChangePhoneNumber)
router.post('/set-profile-picture', setProfilePicture)
router.delete('/remove-profile-picture', removeProfilePicure)

export default router