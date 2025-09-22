import express from "express"
import { getAllUsers, login, logout, register, updateProfile, requestPasswordReset, verifyResetCode, resetPasswordWithCode, promoteToAdmin, initializeAdmin } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { singleUpload } from "../middleware/multer.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/profile/update").put(isAuthenticated, singleUpload, updateProfile)
router.get('/all-users', getAllUsers);
router.post('/password/request-reset', requestPasswordReset)
router.post('/password/verify-code', verifyResetCode)
router.post('/password/reset', resetPasswordWithCode)
router.post('/promote-admin', promoteToAdmin) // Development helper
router.post('/initialize-admin', initializeAdmin) // Initialize first admin

export default router;