import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A booking must belong to a user"],
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "A booking must include a listing"],
    },
    checkIn: {
      type: Date,
      required: [true, "A booking must include a check-in date"],
    },
    checkOut: {
      type: Date,
      required: [true, "A booking must include a check-out date"],
    },
    guests: {
      type: Number,
      default: 1,
      min: [1, "Guests must be at least 1"],
    },
    totalPrice: {
      type: Number,
      required: [true, "A booking must include the total price"],
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ user: 1, listing: 1, checkIn: 1, checkOut: 1 });

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
