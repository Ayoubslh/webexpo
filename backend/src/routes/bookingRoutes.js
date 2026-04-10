import express from "express";
import {
  createBooking,
  getUserBookings,
  getListingBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  confirmBooking,
  completeBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// Booking CRUD routes
router.post("/listing/:listingId", createBooking);
router.get("/user", getUserBookings);
router.get("/listing/:listingId", getListingBookings);
router.get("/:bookingId", getBooking);
router.patch("/:bookingId", updateBooking);
router.patch("/:bookingId/cancel", cancelBooking);
router.patch("/:bookingId/confirm", confirmBooking);
router.patch("/:bookingId/complete", completeBooking);
router.delete("/:bookingId", deleteBooking);

export default router;
