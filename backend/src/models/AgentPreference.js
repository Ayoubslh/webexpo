import mongoose from "mongoose";

const agentPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Preferences must belong to a user"],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    preferredPropertyTypes: {
      type: [String],
      default: [],
      enum: ["home", "apartment", "hotel", "guest_house"],
    },
    preferredArea: {
      type: String,
      trim: true,
    },
    preferredActivities: {
      type: [String],
      default: [],
    },
    budgetMin: {
      type: Number,
      min: [0, "Budget minimum cannot be negative"],
    },
    budgetMax: {
      type: Number,
      min: [0, "Budget maximum cannot be negative"],
    },
    additionalNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

agentPreferenceSchema.path("budgetMax").validate(function (value) {
  if (value == null || this.budgetMin == null) return true;
  return value >= this.budgetMin;
}, "Budget maximum must be greater than or equal to budget minimum");

export const AgentPreference =
  mongoose.models.AgentPreference ||
  mongoose.model("AgentPreference", agentPreferenceSchema);

export default AgentPreference;
