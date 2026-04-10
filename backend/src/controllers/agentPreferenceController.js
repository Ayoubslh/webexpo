import { AgentPreference } from "../models/AgentPreference.js";
import { AppError } from "../utils/appError.js";

// Create agent preferences
export const createAgentPreferences = async (req, res, next) => {
  try {
    const {
      preferredPropertyTypes,
      preferredArea,
      preferredActivities,
      budgetMin,
      budgetMax,
      additionalNotes,
      bookingId,
    } = req.body;

    if (budgetMin != null && budgetMax != null && budgetMin > budgetMax) {
      return next(
        new AppError(
          "Budget minimum cannot be greater than budget maximum.",
          400,
        ),
      );
    }

    // NOTE: the unique index on AgentPreference.user now enforces this at DB level too,
    // so even if this check is bypassed in a race condition, Mongo will reject it.
    const existingPreferences = await AgentPreference.findOne({
      user: req.user._id,
    });
    if (existingPreferences) {
      return next(
        new AppError(
          "You already have agent preferences. Update them instead.",
          400,
        ),
      );
    }

    const preferences = await AgentPreference.create({
      user: req.user._id,
      booking: bookingId || null,
      preferredPropertyTypes: preferredPropertyTypes || [],
      preferredArea: preferredArea || "",
      preferredActivities: preferredActivities || [],
      budgetMin: budgetMin ?? null,
      budgetMax: budgetMax ?? null,
      additionalNotes: additionalNotes || "",
    });

    res.status(201).json({
      status: "success",
      data: { preferences },
    });
  } catch (err) {
    next(err);
  }
};

// Get current user's agent preferences
export const getAgentPreferences = async (req, res, next) => {
  try {
    const preferences = await AgentPreference.findOne({ user: req.user._id })
      .populate("user", "name email")
      .populate("booking", "checkIn checkOut listing");

    if (!preferences) {
      return next(new AppError("No preferences found for this user.", 404));
    }

    res.status(200).json({
      status: "success",
      data: { preferences },
    });
  } catch (err) {
    next(err);
  }
};

// Get preferences by user ID (admin or own user only)
export const getPreferencesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId !== req.user._id.toString() && req.user.role !== "admin") {
      return next(
        new AppError("You are not authorized to view these preferences.", 403),
      );
    }

    const preferences = await AgentPreference.findOne({ user: userId })
      .populate("user", "name email")
      .populate("booking", "checkIn checkOut listing");

    if (!preferences) {
      return next(new AppError("No preferences found for this user.", 404));
    }

    res.status(200).json({
      status: "success",
      data: { preferences },
    });
  } catch (err) {
    next(err);
  }
};

// Update agent preferences (full update)
export const updateAgentPreferences = async (req, res, next) => {
  try {
    const {
      preferredPropertyTypes,
      preferredArea,
      preferredActivities,
      budgetMin,
      budgetMax,
      additionalNotes,
    } = req.body;

    let preferences = await AgentPreference.findOne({ user: req.user._id });

    if (!preferences) {
      return next(
        new AppError("No preferences found. Create preferences first.", 404),
      );
    }

    // FIX: was checking `budgetMin && budgetMax` — falsy for 0.
    // Use `!= null` so that 0 is accepted as a valid budget value.
    if (budgetMin != null && budgetMax != null && budgetMin > budgetMax) {
      return next(
        new AppError(
          "Budget minimum cannot be greater than budget maximum.",
          400,
        ),
      );
    }

    if (preferredPropertyTypes !== undefined)
      preferences.preferredPropertyTypes = preferredPropertyTypes;
    if (preferredArea !== undefined) preferences.preferredArea = preferredArea;
    if (preferredActivities !== undefined)
      preferences.preferredActivities = preferredActivities;
    if (budgetMin !== undefined) preferences.budgetMin = budgetMin;
    if (budgetMax !== undefined) preferences.budgetMax = budgetMax;
    if (additionalNotes !== undefined)
      preferences.additionalNotes = additionalNotes;

    const updatedPreferences = await preferences.save();

    res.status(200).json({
      status: "success",
      message: "Preferences updated successfully.",
      data: { preferences: updatedPreferences },
    });
  } catch (err) {
    next(err);
  }
};

// Partially update a single preference field
export const updatePreferenceField = async (req, res, next) => {
  try {
    const { field, value } = req.body;

    const validFields = [
      "preferredPropertyTypes",
      "preferredArea",
      "preferredActivities",
      "budgetMin",
      "budgetMax",
      "additionalNotes",
    ];

    if (!validFields.includes(field)) {
      return next(
        new AppError(
          `Invalid field. Valid fields are: ${validFields.join(", ")}.`,
          400,
        ),
      );
    }

    const preferences = await AgentPreference.findOne({ user: req.user._id });

    if (!preferences) {
      return next(
        new AppError("No preferences found. Create preferences first.", 404),
      );
    }

    preferences[field] = value;
    const updatedPreferences = await preferences.save();

    res.status(200).json({
      status: "success",
      message: `${field} updated successfully.`,
      data: { preferences: updatedPreferences },
    });
  } catch (err) {
    next(err);
  }
};

// Add an activity to preferences
export const addPreferredActivity = async (req, res, next) => {
  try {
    const { activity } = req.body;

    if (!activity) {
      return next(new AppError("Please provide an activity.", 400));
    }

    const preferences = await AgentPreference.findOne({ user: req.user._id });

    if (!preferences) {
      return next(
        new AppError("No preferences found. Create preferences first.", 404),
      );
    }

    if (preferences.preferredActivities.includes(activity)) {
      return next(
        new AppError("This activity is already in your preferences.", 400),
      );
    }

    preferences.preferredActivities.push(activity);
    const updatedPreferences = await preferences.save();

    res.status(200).json({
      status: "success",
      message: "Activity added successfully.",
      data: { preferences: updatedPreferences },
    });
  } catch (err) {
    next(err);
  }
};

// Remove an activity from preferences
export const removePreferredActivity = async (req, res, next) => {
  try {
    const { activity } = req.body;

    if (!activity) {
      return next(new AppError("Please provide an activity.", 400));
    }

    const preferences = await AgentPreference.findOne({ user: req.user._id });

    if (!preferences) {
      return next(new AppError("No preferences found.", 404));
    }

    const before = preferences.preferredActivities.length;
    preferences.preferredActivities = preferences.preferredActivities.filter(
      (a) => a !== activity,
    );

    // Let the user know if the activity wasn't in the list to begin with
    if (preferences.preferredActivities.length === before) {
      return next(
        new AppError("This activity was not found in your preferences.", 404),
      );
    }

    const updatedPreferences = await preferences.save();

    res.status(200).json({
      status: "success",
      message: "Activity removed successfully.",
      data: { preferences: updatedPreferences },
    });
  } catch (err) {
    next(err);
  }
};

// Delete agent preferences
export const deleteAgentPreferences = async (req, res, next) => {
  try {
    const preferences = await AgentPreference.findOneAndDelete({
      user: req.user._id,
    });

    if (!preferences) {
      return next(new AppError("No preferences found to delete.", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Reset preferences to defaults
export const resetAgentPreferences = async (req, res, next) => {
  try {
    const preferences = await AgentPreference.findOne({ user: req.user._id });

    if (!preferences) {
      return next(new AppError("No preferences found to reset.", 404));
    }

    preferences.preferredPropertyTypes = [];
    preferences.preferredArea = "";
    preferences.preferredActivities = [];
    preferences.budgetMin = null;
    preferences.budgetMax = null;
    preferences.additionalNotes = "";

    const resetPreferences = await preferences.save();

    res.status(200).json({
      status: "success",
      message: "Preferences reset to defaults.",
      data: { preferences: resetPreferences },
    });
  } catch (err) {
    next(err);
  }
};
