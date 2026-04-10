import express from "express";
import {
  signup,
  login,
  logout,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";

const router = express.Router();

// Public auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

// Protected auth routes (require authentication)
router.use(protect); // All routes below require authentication

router.post("/logout", logout);
router.patch("/update-password", updatePassword);

// Admin only routes
router.use(restrictTo("admin")); // All routes below require admin role

export default router;
