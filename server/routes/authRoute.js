import express from "express"

import { protectRoute } from "../middlewares/authMiddleware.js"
import { login, logout, onboard, signup } from "../controllers/authController.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/onboarding", protectRoute, onboard)

// To check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user })
})

export default router
