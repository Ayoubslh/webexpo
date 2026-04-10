import express from "express";
import {
  createListing,
  getAllListings,
  getListing,
  updateListing,
  deleteListing,
  toggleListingStatus,
  searchListings,
  getUserListings,
} from "../controllers/listingController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.get("/", getAllListings);
router.get("/search", searchListings);
router.get("/:id", getListing);

// Protected routes (require authentication)
router.use(protect); // All routes below require authentication

router.post("/", createListing);
router.get("/user/listings", getUserListings);
router.patch("/:id", updateListing);
router.patch("/:id/status", toggleListingStatus);
router.delete("/:id", deleteListing);

export default router;
