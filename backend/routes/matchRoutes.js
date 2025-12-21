const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  generateSchedule,
  getTournamentMatches,
  getTeamMatches,
  updateMatch,
  updateMatchScore,
  syncMatchSports,
} = require("../controllers/matchController");

// Generate schedule for a tournament (admin only)
router.post(
  "/tournament/:id/generate-schedule",
  protect,
  authorize("super_admin"),
  generateSchedule
);

// Get all matches for a tournament
router.get("/tournament/:id", protect, getTournamentMatches);

// Get matches for a specific team (for coaches/players)
router.get("/team/:teamId", protect, getTeamMatches);

// Update match details
router.put("/:id", protect, authorize("super_admin"), updateMatch);

// Update match score
router.put("/:id/score", protect, authorize("super_admin"), updateMatchScore);

// Sync sport field from tournaments to matches (utility endpoint)
router.post("/sync-sports", protect, authorize("super_admin"), syncMatchSports);

module.exports = router;
