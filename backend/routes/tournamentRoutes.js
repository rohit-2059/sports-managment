const express = require("express");
const Tournament = require("../models/Tournament");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// @desc    Get all tournaments
// @route   GET /api/tournaments
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { sport, status, upcoming } = req.query;

    // Build query
    let query = {};

    if (sport) {
      query.sport = sport;
    }

    if (status) {
      query.status = status;
    }

    // Filter upcoming tournaments
    if (upcoming === "true") {
      query.startDate = { $gte: new Date() };
    }

    const tournaments = await Tournament.find(query)
      .populate("teams", "name sport")
      .populate("createdBy", "name email")
      .sort({ startDate: 1 });

    res.json({
      success: true,
      count: tournaments.length,
      data: tournaments,
    });
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tournaments",
      message: error.message,
    });
  }
});

// @desc    Get single tournament by ID
// @route   GET /api/tournaments/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate("teams", "name sport coach")
      .populate("createdBy", "name email");

    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: "Tournament not found",
      });
    }

    res.json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    console.error("Error fetching tournament:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tournament",
      message: error.message,
    });
  }
});

// @desc    Create new tournament
// @route   POST /api/tournaments
// @access  Private (Super Admin only)
router.post("/", protect, authorize("super_admin"), async (req, res) => {
  try {
    const tournamentData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const tournament = await Tournament.create(tournamentData);

    res.status(201).json({
      success: true,
      data: tournament,
      message: "Tournament created successfully",
    });
  } catch (error) {
    console.error("Error creating tournament:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: "Validation error",
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create tournament",
      message: error.message,
    });
  }
});

// @desc    Update tournament
// @route   PUT /api/tournaments/:id
// @access  Private (Super Admin only)
router.put("/:id", protect, authorize("super_admin"), async (req, res) => {
  try {
    // Don't allow updating createdBy field
    delete req.body.createdBy;

    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: "Tournament not found",
      });
    }

    res.json({
      success: true,
      data: tournament,
      message: "Tournament updated successfully",
    });
  } catch (error) {
    console.error("Error updating tournament:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: "Validation error",
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to update tournament",
      message: error.message,
    });
  }
});

// @desc    Delete tournament
// @route   DELETE /api/tournaments/:id
// @access  Private (Super Admin only)
router.delete("/:id", protect, authorize("super_admin"), async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: "Tournament not found",
      });
    }

    res.json({
      success: true,
      data: {},
      message: "Tournament deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tournament:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete tournament",
      message: error.message,
    });
  }
});

// @desc    Add team to tournament
// @route   POST /api/tournaments/:id/teams/:teamId
// @access  Private (Super Admin or Coach)
router.post("/:id/teams/:teamId", protect, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: "Tournament not found",
      });
    }

    // Check if tournament is full
    if (tournament.teams.length >= tournament.maxTeams) {
      return res.status(400).json({
        success: false,
        error: "Tournament is full",
      });
    }

    // Check if registration deadline has passed
    if (new Date() > tournament.registrationDeadline) {
      return res.status(400).json({
        success: false,
        error: "Registration deadline has passed",
      });
    }

    // Check if team is already registered
    if (tournament.teams.includes(req.params.teamId)) {
      return res.status(400).json({
        success: false,
        error: "Team is already registered for this tournament",
      });
    }

    tournament.teams.push(req.params.teamId);
    await tournament.save();

    res.json({
      success: true,
      data: tournament,
      message: "Team added to tournament successfully",
    });
  } catch (error) {
    console.error("Error adding team to tournament:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add team to tournament",
      message: error.message,
    });
  }
});

// @desc    Remove team from tournament
// @route   DELETE /api/tournaments/:id/teams/:teamId
// @access  Private (Super Admin or Coach)
router.delete("/:id/teams/:teamId", protect, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: "Tournament not found",
      });
    }

    // Remove team from tournament
    tournament.teams = tournament.teams.filter(
      (teamId) => teamId.toString() !== req.params.teamId
    );

    await tournament.save();

    res.json({
      success: true,
      data: tournament,
      message: "Team removed from tournament successfully",
    });
  } catch (error) {
    console.error("Error removing team from tournament:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove team from tournament",
      message: error.message,
    });
  }
});

module.exports = router;
