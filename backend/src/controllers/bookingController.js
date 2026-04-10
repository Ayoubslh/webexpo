import { Booking } from "../models/Booking.js";
import { Listing } from "../models/Listing.js";
import { AppError } from "../utils/appError.js";

// Create a new booking
export const createBooking = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { checkIn, checkOut, guests, notes } = req.body;

    if (!checkIn || !checkOut) {
      return next(
        new AppError("Please provide check-in and check-out dates.", 400),
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return next(new AppError("Invalid date format provided.", 400));
    }

    if (checkOutDate <= checkInDate) {
      return next(
        new AppError("Check-out date must be after check-in date.", 400),
      );
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(new AppError("Listing not found.", 404));
    }

    if (!listing.isActive) {
      return next(new AppError("This listing is not available.", 400));
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      listing: listingId,
      status: { $nin: ["cancelled"] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
        },
      ],
    });

    if (overlappingBooking) {
      return next(
        new AppError("Listing is not available for the selected dates.", 400),
      );
    }

    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = nights * listing.pricePerNight;

    const newBooking = await Booking.create({
      user: req.user._id,
      listing: listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests || 1,
      totalPrice,
      notes: notes || "",
      status: "pending",
    });

    await newBooking.populate("listing", "title area pricePerNight");
    await newBooking.populate("user", "name email");

    res.status(201).json({
      status: "success",
      data: { booking: newBooking },
    });
  } catch (err) {
    next(err);
  }
};

// Get all bookings for a user
export const getUserBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const filter = { user: req.user._id };

    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("listing", "title area pricePerNight propertyType image")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: bookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { bookings },
    });
  } catch (err) {
    next(err);
  }
};

// Get all bookings for a listing (owner only)
export const getListingBookings = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(new AppError("Listing not found.", 404));
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to view these bookings.", 403),
      );
    }

    const skip = (page - 1) * limit;
    const filter = { listing: listingId };

    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("user", "name email phonenum")
      .sort({ checkIn: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: bookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { bookings },
    });
  } catch (err) {
    next(err);
  }
};

// Get single booking
export const getBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("user", "name email phonenum image")
      .populate(
        "listing",
        "title area pricePerNight amenities activities owner",
      );

    if (!booking) {
      return next(new AppError("Booking not found.", 404));
    }

    // FIX: previously fetched listing again separately after already populating it.
    // Now access `owner` directly from the populated listing on the booking document.
    const isBookingUser =
      booking.user._id.toString() === req.user._id.toString();
    const isListingOwner =
      booking.listing.owner.toString() === req.user._id.toString();

    if (!isBookingUser && !isListingOwner) {
      return next(
        new AppError("You are not authorized to view this booking.", 403),
      );
    }

    res.status(200).json({
      status: "success",
      data: { booking },
    });
  } catch (err) {
    next(err);
  }
};

// Update booking
export const updateBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { checkIn, checkOut, guests, notes } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(new AppError("Booking not found.", 404));
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to update this booking.", 403),
      );
    }

    if (booking.status === "confirmed" || booking.status === "completed") {
      return next(
        new AppError(`Cannot update a ${booking.status} booking.`, 400),
      );
    }

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (isNaN(checkInDate) || isNaN(checkOutDate)) {
        return next(new AppError("Invalid date format provided.", 400));
      }

      if (checkOutDate <= checkInDate) {
        return next(
          new AppError("Check-out date must be after check-in date.", 400),
        );
      }

      booking.checkIn = checkInDate;
      booking.checkOut = checkOutDate;

      const listing = await Listing.findById(booking.listing);
      const nights = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
      );
      booking.totalPrice = nights * listing.pricePerNight;
    }

    if (guests !== undefined) booking.guests = guests;
    if (notes !== undefined) booking.notes = notes;

    const updatedBooking = await booking.save();

    res.status(200).json({
      status: "success",
      data: { booking: updatedBooking },
    });
  } catch (err) {
    next(err);
  }
};

// Cancel booking
export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate(
      "listing",
      "owner",
    );

    if (!booking) {
      return next(new AppError("Booking not found.", 404));
    }

    const isBookingUser = booking.user.toString() === req.user._id.toString();
    const isListingOwner =
      booking.listing.owner.toString() === req.user._id.toString();

    if (!isBookingUser && !isListingOwner) {
      return next(
        new AppError("You are not authorized to cancel this booking.", 403),
      );
    }

    if (booking.status === "cancelled" || booking.status === "completed") {
      return next(new AppError(`Booking is already ${booking.status}.`, 400));
    }

    booking.status = "cancelled";
    const updatedBooking = await booking.save();

    res.status(200).json({
      status: "success",
      message: "Booking cancelled successfully.",
      data: { booking: updatedBooking },
    });
  } catch (err) {
    next(err);
  }
};

// Confirm booking (listing owner only)
export const confirmBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate(
      "listing",
      "owner",
    );

    if (!booking) {
      return next(new AppError("Booking not found.", 404));
    }

    if (booking.listing.owner.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to confirm this booking.", 403),
      );
    }

    if (booking.status !== "pending") {
      return next(new AppError("Only pending bookings can be confirmed.", 400));
    }

    booking.status = "confirmed";
    const updatedBooking = await booking.save();

    res.status(200).json({
      status: "success",
      message: "Booking confirmed successfully.",
      data: { booking: updatedBooking },
    });
  } catch (err) {
    next(err);
  }
};

// Complete booking (listing owner only)
export const completeBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate(
      "listing",
      "owner",
    );

    if (!booking) {
      return next(new AppError("Booking not found.", 404));
    }

    if (booking.listing.owner.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to complete this booking.", 403),
      );
    }

    if (booking.status !== "confirmed") {
      return next(
        new AppError("Only confirmed bookings can be completed.", 400),
      );
    }

    booking.status = "completed";
    const updatedBooking = await booking.save();

    res.status(200).json({
      status: "success",
      message:
        "Booking completed successfully. The guest can now leave a review.",
      data: { booking: updatedBooking },
    });
  } catch (err) {
    next(err);
  }
};

// Delete booking
export const deleteBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(new AppError("Booking not found.", 404));
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to delete this booking.", 403),
      );
    }

    if (booking.status === "confirmed" || booking.status === "completed") {
      return next(
        new AppError(`Cannot delete a ${booking.status} booking.`, 400),
      );
    }

    await Booking.findByIdAndDelete(bookingId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
