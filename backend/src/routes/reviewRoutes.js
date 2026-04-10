import express from "express";
import {
  createReview,
  getListingReviews,
  getUserReviews,
  getReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.get("/listing/:listingId", getListingReviews);
router.get("/user/:userId", getUserReviews);
router.get("/:reviewId", getReview);

// Protected routes (require authentication)
router.use(protect); // All routes below require authentication

router.post("/listing/:listingId", createReview);
router.patch("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

export default router;
