import express from "express";
import {
  createTravelPlan,
  getUserTravelPlans,
  getTravelPlan,
  updateTravelPlan,
  generateAgentSummary,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  deleteTravelPlan,
} from "../controllers/travelPlanController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// All travel plan routes require authentication
router.use(protect);

// Travel plan CRUD routes
router.post("/", createTravelPlan);
router.get("/user", getUserTravelPlans);
router.get("/:planId", getTravelPlan);
router.patch("/:planId", updateTravelPlan);
router.patch("/:planId/generate-summary", generateAgentSummary);
router.post("/:planId/itinerary", addItineraryItem);
router.patch("/:planId/itinerary/:itemIndex", updateItineraryItem);
router.delete("/:planId/itinerary/:itemIndex", deleteItineraryItem);
router.delete("/:planId", deleteTravelPlan);

export default router;
