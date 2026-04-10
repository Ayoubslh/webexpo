import mongoose from "mongoose";
import { Review } from "../models/Review.js";
import { Booking } from "../models/Booking.js";
import { AppError } from "../utils/appError.js";

// Create a new review
export const createReview = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { rating, review, bookingId } = req.body;

    // Validate required fields
    if (!rating || !review) {
      return next(new AppError("Please provide rating and review text.", 400));
    }

    if (rating < 1 || rating > 5) {
      return next(new AppError("Rating must be between 1 and 5.", 400));
    }

    // FIX: bookingId was optional with no real enforcement.
    // Now required — and must be a completed booking owned by the requester
    // for the specific listing. This prevents fake reviews.
    if (!bookingId) {
      return next(
        new AppError("A completed booking is required to leave a review.", 400),
      );
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(new AppError("Booking not found.", 404));
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return next(new AppError("You can only review your own bookings.", 403));
    }

    if (booking.listing.toString() !== listingId) {
      return next(
        new AppError(
          "This booking does not belong to the specified listing.",
          400,
        ),
      );
    }

    if (booking.status !== "completed") {
      return next(
        new AppError(
          "You can only review a listing after your stay is completed.",
          400,
        ),
      );
    }

    // Create review
    const newReview = await Review.create({
      user: req.user._id,
      listing: listingId,
      booking: bookingId,
      rating,
      review,
    });

    await newReview.populate("user", "name image");

    res.status(201).json({
      status: "success",
      data: { review: newReview },
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError("You have already reviewed this listing.", 400));
    }
    next(err);
  }
};

// Get all reviews for a listing
export const getListingReviews = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ listing: listingId })
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({ listing: listingId });

    // FIX: was using require("mongoose") inside an ESM async function — throws ReferenceError.
    // Also was calling Types.ObjectId() without `new`, which is deprecated.
    // Now uses the top-level mongoose import and `new`.
    const avgRatingResult = await Review.aggregate([
      {
        $match: { listing: new mongoose.Types.ObjectId(listingId) },
      },
      {
        $group: { _id: null, avgRating: { $avg: "$rating" } },
      },
    ]);

    const averageRating = avgRatingResult[0]?.avgRating || 0;

    res.status(200).json({
      status: "success",
      results: reviews.length,
      total,
      averageRating: Math.round(averageRating * 10) / 10,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { reviews },
    });
  } catch (err) {
    next(err);
  }
};

// Get reviews by a specific user
export const getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ user: userId })
      .populate("listing", "title area")
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: { reviews },
    });
  } catch (err) {
    next(err);
  }
};

// Get single review
export const getReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId)
      .populate("user", "name image email")
      .populate("listing", "title area pricePerNight")
      .populate("booking", "checkIn checkOut");

    if (!review) {
      return next(new AppError("Review not found.", 404));
    }

    res.status(200).json({
      status: "success",
      data: { review },
    });
  } catch (err) {
    next(err);
  }
};

// Update review
export const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, review } = req.body;

    const existingReview = await Review.findById(reviewId);

    if (!existingReview) {
      return next(new AppError("Review not found.", 404));
    }

    if (existingReview.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to update this review.", 403),
      );
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return next(new AppError("Rating must be between 1 and 5.", 400));
      }
      existingReview.rating = rating;
    }

    if (review !== undefined) {
      existingReview.review = review;
    }

    const updatedReview = await existingReview.save();

    res.status(200).json({
      status: "success",
      data: { review: updatedReview },
    });
  } catch (err) {
    next(err);
  }
};

// Delete review
export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return next(new AppError("Review not found.", 404));
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to delete this review.", 403),
      );
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
