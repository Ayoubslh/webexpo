import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Each itinerary item must include a day"],
      min: [1, "Itinerary day must start at 1"],
    },
    title: {
      type: String,
      required: [true, "Each itinerary item must include a title"],
      trim: true,
    },
    activities: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const travelPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A travel plan must belong to a user"],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "A travel plan must belong to a booking"],
      unique: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "A travel plan must include a listing"],
    },
    destinationArea: {
      type: String,
      trim: true,
      required: [true, "A travel plan must include destination area"],
    },
    startDate: {
      type: Date,
      required: [true, "A travel plan must include a start date"],
    },
    endDate: {
      type: Date,
      required: [true, "A travel plan must include an end date"],
    },
    itinerary: {
      type: [itineraryItemSchema],
      default: [],
    },
    agentSummary: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

travelPlanSchema.path("endDate").validate(function (value) {
  if (!value || !this.startDate) return true;
  return value >= this.startDate;
}, "End date must be greater than or equal to start date");

export const TravelPlan =
  mongoose.models.TravelPlan || mongoose.model("TravelPlan", travelPlanSchema);

export default TravelPlan;
