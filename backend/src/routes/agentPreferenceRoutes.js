import express from "express";
import {
  createAgentPreferences,
  getAgentPreferences,
  getPreferencesByUserId,
  updateAgentPreferences,
  updatePreferenceField,
  addPreferredActivity,
  removePreferredActivity,
  deleteAgentPreferences,
  resetAgentPreferences,
} from "../controllers/agentPreferenceController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

// All agent preference routes require authentication
router.use(protect);

// Agent preference CRUD routes
router.post("/", createAgentPreferences);
router.get("/", getAgentPreferences);
router.get("/user/:userId", restrictTo("admin"), getPreferencesByUserId);
router.patch("/", updateAgentPreferences);
router.patch("/field", updatePreferenceField);
router.patch("/activity/add", addPreferredActivity);
router.patch("/activity/remove", removePreferredActivity);
router.patch("/reset", resetAgentPreferences);
router.delete("/", deleteAgentPreferences);

export default router;
