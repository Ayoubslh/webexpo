import { TravelPlan } from "../models/TravelPlan.js";
import { Booking } from "../models/Booking.js";
import { AppError } from "../utils/appError.js";

// Create a new travel plan
export const createTravelPlan = async (req, res, next) => {
  try {
    const { bookingId, destinationArea, itinerary, agentSummary } = req.body;

    if (!bookingId || !destinationArea) {
      return next(
        new AppError("Please provide a booking ID and destination area.", 400),
      );
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new AppError("Booking not found.", 404));
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError(
          "You can only create travel plans for your own bookings.",
          403,
        ),
      );
    }

    // Only allow travel plans for confirmed or completed bookings
    if (!["confirmed", "completed"].includes(booking.status)) {
      return next(
        new AppError(
          "You can only create a travel plan for a confirmed or completed booking.",
          400,
        ),
      );
    }

    const existingPlan = await TravelPlan.findOne({ booking: bookingId });
    if (existingPlan) {
      return next(
        new AppError("A travel plan already exists for this booking.", 400),
      );
    }

    const newTravelPlan = await TravelPlan.create({
      user: req.user._id,
      booking: bookingId,
      listing: booking.listing,
      destinationArea,
      startDate: booking.checkIn,
      endDate: booking.checkOut,
      itinerary: itinerary || [],
      agentSummary: agentSummary || "",
    });

    await newTravelPlan.populate(
      "booking",
      "checkIn checkOut guests totalPrice",
    );
    await newTravelPlan.populate("listing", "title area activities amenities");

    res.status(201).json({
      status: "success",
      data: { travelPlan: newTravelPlan },
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(
        new AppError("A travel plan already exists for this booking.", 400),
      );
    }
    next(err);
  }
};

// Get all travel plans for the current user
export const getUserTravelPlans = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const travelPlans = await TravelPlan.find({ user: req.user._id })
      .populate("booking", "checkIn checkOut guests totalPrice status")
      .populate("listing", "title area propertyType image")
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await TravelPlan.countDocuments({ user: req.user._id });

    res.status(200).json({
      status: "success",
      results: travelPlans.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { travelPlans },
    });
  } catch (err) {
    next(err);
  }
};

// Get single travel plan
export const getTravelPlan = async (req, res, next) => {
  try {
    const { planId } = req.params;

    const travelPlan = await TravelPlan.findById(planId)
      .populate("user", "name email image")
      .populate("booking", "checkIn checkOut guests totalPrice status notes")
      .populate(
        "listing",
        "title area description propertyType amenities activities owner",
      );

    if (!travelPlan) {
      return next(new AppError("Travel plan not found.", 404));
    }

    if (travelPlan.user._id.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to view this travel plan.", 403),
      );
    }

    res.status(200).json({
      status: "success",
      data: { travelPlan },
    });
  } catch (err) {
    next(err);
  }
};

// Update travel plan
export const updateTravelPlan = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { destinationArea, itinerary, agentSummary } = req.body;

    const travelPlan = await TravelPlan.findById(planId);

    if (!travelPlan) {
      return next(new AppError("Travel plan not found.", 404));
    }

    if (travelPlan.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to update this travel plan.", 403),
      );
    }

    // FIX: was using truthy checks — falsy values like empty string or [] were ignored.
    // Use `!== undefined` so that intentional empty values can be set.
    if (destinationArea !== undefined)
      travelPlan.destinationArea = destinationArea;
    if (itinerary !== undefined) travelPlan.itinerary = itinerary;
    if (agentSummary !== undefined) travelPlan.agentSummary = agentSummary;

    const updatedTravelPlan = await travelPlan.save();

    res.status(200).json({
      status: "success",
      data: { travelPlan: updatedTravelPlan },
    });
  } catch (err) {
    next(err);
  }
};

// Generate agent summary (AI-powered recommendations placeholder)
export const generateAgentSummary = async (req, res, next) => {
  try {
    const { planId } = req.params;

    const travelPlan = await TravelPlan.findById(planId);

    if (!travelPlan) {
      return next(new AppError("Travel plan not found.", 404));
    }

    if (travelPlan.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to update this travel plan.", 403),
      );
    }

    // TODO: Replace this with a real AI integration (e.g., Anthropic Claude API).
    // The summary should take into account the listing's activities, amenities,
    // destination area, user preferences, and travel dates.
    const agentSummary =
      `Travel recommendations for ${travelPlan.destinationArea} ` +
      `from ${travelPlan.startDate.toLocaleDateString()} ` +
      `to ${travelPlan.endDate.toLocaleDateString()}.`;

    travelPlan.agentSummary = agentSummary;
    const updatedTravelPlan = await travelPlan.save();

    res.status(200).json({
      status: "success",
      message: "Agent summary generated successfully.",
      data: { travelPlan: updatedTravelPlan },
    });
  } catch (err) {
    next(err);
  }
};

// Add an itinerary item
export const addItineraryItem = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { day, title, activities, notes } = req.body;

    if (!day || !title) {
      return next(
        new AppError(
          "Please provide a day number and title for the itinerary item.",
          400,
        ),
      );
    }

    const travelPlan = await TravelPlan.findById(planId);

    if (!travelPlan) {
      return next(new AppError("Travel plan not found.", 404));
    }

    if (travelPlan.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to update this travel plan.", 403),
      );
    }

    travelPlan.itinerary.push({
      day,
      title,
      activities: activities || [],
      notes: notes || "",
    });

    const updatedTravelPlan = await travelPlan.save();

    res.status(200).json({
      status: "success",
      message: "Itinerary item added successfully.",
      data: { travelPlan: updatedTravelPlan },
    });
  } catch (err) {
    next(err);
  }
};

// Update an itinerary item by index
export const updateItineraryItem = async (req, res, next) => {
  try {
    const { planId, itemIndex } = req.params;
    const { day, title, activities, notes } = req.body;

    const travelPlan = await TravelPlan.findById(planId);

    if (!travelPlan) {
      return next(new AppError("Travel plan not found.", 404));
    }

    if (travelPlan.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to update this travel plan.", 403),
      );
    }

    const idx = Number(itemIndex);
    if (isNaN(idx) || !travelPlan.itinerary[idx]) {
      return next(new AppError("Itinerary item not found.", 404));
    }

    if (day !== undefined) travelPlan.itinerary[idx].day = day;
    if (title !== undefined) travelPlan.itinerary[idx].title = title;
    if (activities !== undefined)
      travelPlan.itinerary[idx].activities = activities;
    if (notes !== undefined) travelPlan.itinerary[idx].notes = notes;

    const updatedTravelPlan = await travelPlan.save();

    res.status(200).json({
      status: "success",
      message: "Itinerary item updated successfully.",
      data: { travelPlan: updatedTravelPlan },
    });
  } catch (err) {
    next(err);
  }
};

// Delete an itinerary item by index
export const deleteItineraryItem = async (req, res, next) => {
  try {
    const { planId, itemIndex } = req.params;

    const travelPlan = await TravelPlan.findById(planId);

    if (!travelPlan) {
      return next(new AppError("Travel plan not found.", 404));
    }

    if (travelPlan.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to update this travel plan.", 403),
      );
    }

    const idx = Number(itemIndex);
    if (isNaN(idx) || !travelPlan.itinerary[idx]) {
      return next(new AppError("Itinerary item not found.", 404));
    }

    travelPlan.itinerary.splice(idx, 1);
    const updatedTravelPlan = await travelPlan.save();

    res.status(200).json({
      status: "success",
      message: "Itinerary item deleted successfully.",
      data: { travelPlan: updatedTravelPlan },
    });
  } catch (err) {
    next(err);
  }
};

// Delete a travel plan
export const deleteTravelPlan = async (req, res, next) => {
  try {
    const { planId } = req.params;

    const travelPlan = await TravelPlan.findById(planId);

    if (!travelPlan) {
      return next(new AppError("Travel plan not found.", 404));
    }

    if (travelPlan.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to delete this travel plan.", 403),
      );
    }

    await TravelPlan.findByIdAndDelete(planId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
