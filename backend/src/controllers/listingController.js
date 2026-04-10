import { Listing } from "../models/Listing.js";
import { AppError } from "../utils/appError.js";

// Create a new listing
export const createListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      pricePerNight,
      area,
      activities,
      amenities,
    } = req.body;

    if (!title || !propertyType || !pricePerNight || !area) {
      return next(
        new AppError(
          "Please provide all required fields: title, propertyType, pricePerNight, area.",
          400,
        ),
      );
    }

    const newListing = await Listing.create({
      title,
      description,
      propertyType,
      pricePerNight,
      area,
      activities: activities || [],
      amenities: amenities || [],
      owner: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: { listing: newListing },
    });
  } catch (err) {
    next(err);
  }
};

// Get all listings with filtering and pagination
export const getAllListings = async (req, res, next) => {
  try {
    const {
      propertyType,
      area,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { isActive: true };

    if (propertyType) filter.propertyType = propertyType;

    if (area) filter.area = { $regex: area, $options: "i" };

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    const listings = await Listing.find(filter)
      .populate("owner", "name email image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Listing.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: listings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { listings },
    });
  } catch (err) {
    next(err);
  }
};

// Get single listing by ID
export const getListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    // FIX: previously used a manual populate path for reviews with hardcoded fields.
    // Since Listing.js now has a virtual `reviews` field, we use populate normally.
    // This works because we enabled `toJSON: { virtuals: true }` in the schema.
    const listing = await Listing.findById(id)
      .populate("owner", "name email image")
      .populate({
        path: "reviews",
        select: "rating review user createdAt",
        populate: { path: "user", select: "name image" },
      });

    if (!listing) {
      return next(new AppError("Listing not found.", 404));
    }

    res.status(200).json({
      status: "success",
      data: { listing },
    });
  } catch (err) {
    next(err);
  }
};

// Update listing
export const updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      propertyType,
      pricePerNight,
      area,
      activities,
      amenities,
      image,
    } = req.body;

    const listing = await Listing.findById(id);

    if (!listing) {
      return next(new AppError("Listing not found.", 404));
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to update this listing.", 403),
      );
    }

    if (title !== undefined) listing.title = title;
    if (description !== undefined) listing.description = description;
    if (propertyType !== undefined) listing.propertyType = propertyType;
    if (pricePerNight !== undefined) listing.pricePerNight = pricePerNight;
    if (area !== undefined) listing.area = area;
    if (activities !== undefined) listing.activities = activities;
    if (amenities !== undefined) listing.amenities = amenities;
    if (image !== undefined) listing.image = image;

    const updatedListing = await listing.save();

    res.status(200).json({
      status: "success",
      data: { listing: updatedListing },
    });
  } catch (err) {
    next(err);
  }
};

// Delete listing (soft delete)
export const deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return next(new AppError("Listing not found.", 404));
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to delete this listing.", 403),
      );
    }

    listing.isActive = false;
    await listing.save();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Toggle listing status (activate/deactivate)
export const toggleListingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return next(new AppError("Listing not found.", 404));
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You are not authorized to update this listing.", 403),
      );
    }

    listing.isActive = !listing.isActive;
    const updatedListing = await listing.save();

    res.status(200).json({
      status: "success",
      message: `Listing ${updatedListing.isActive ? "activated" : "deactivated"} successfully.`,
      data: { listing: updatedListing },
    });
  } catch (err) {
    next(err);
  }
};

// Search listings
export const searchListings = async (req, res, next) => {
  try {
    const {
      query,
      propertyType,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { isActive: true };

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { area: { $regex: query, $options: "i" } },
      ];
    }

    if (propertyType) filter.propertyType = propertyType;

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    const listings = await Listing.find(filter)
      .populate("owner", "name email image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Listing.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: listings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { listings },
    });
  } catch (err) {
    next(err);
  }
};

// Get user's own listings
export const getUserListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ owner: req.user._id })
      .populate("owner", "name email image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: listings.length,
      data: { listings },
    });
  } catch (err) {
    next(err);
  }
};
