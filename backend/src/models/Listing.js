import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A listing must have an owner"],
    },
    title: {
      type: String,
      required: [true, "A listing must have a title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    propertyType: {
      type: String,
      required: [true, "A listing must include a property type"],
      enum: ["home", "apartment", "hotel", "guest_house"],
    },
    pricePerNight: {
      type: Number,
      required: [true, "A listing must include a price"],
      min: [0, "Price cannot be negative"],
    },
    area: {
      type: String,
      required: [true, "A listing must include an area"],
      trim: true,
    },
    activities: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Listing =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);

export default Listing;
