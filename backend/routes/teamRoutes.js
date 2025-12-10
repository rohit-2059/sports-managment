const express = require("express");
const Team = require("../models/Team");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private (coach only)
const createTeam = async (req, res, next) => {
  try {
    const {
      name,
      shortName,
      description,
      homeGround,
      sport,
      contactEmail,
      contactPhone,
      address,
    } = req.body;

    // Check if user is a coach
    if (req.user.role !== "coach") {
      return res.status(403).json({
        success: false,
        error: "Only coaches can create teams",
      });
    }

    // Check if team name or short name already exists
    const duplicateTeam = await Team.findOne({
      $or: [{ name }, { shortName }],
    });

    if (duplicateTeam) {
      return res.status(400).json({
        success: false,
        error: "Team name or short name already exists",
      });
    }

    // Create team
    const team = await Team.create({
      name,
      shortName,
      description,
      homeGround,
      sport,
      contactEmail,
      contactPhone,
      address,
      coachId: req.user.id,
    });

    // Update user's teamId
    await User.findByIdAndUpdate(req.user.id, { teamId: team._id });

    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
const getTeams = async (req, res, next) => {
  try {
    const { isApproved, isActive, sport, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (isApproved !== undefined) query.isApproved = isApproved === "true";
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (sport) query.sport = sport;

    const teams = await Team.find(query)
      .populate("coachId", "name email phone")
      .populate("captainId", "name email")
      .populate("players.playerId", "name email position jerseyNumber")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Team.countDocuments(query);

    res.status(200).json({
      success: true,
      count: teams.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("coachId", "name email phone")
      .populate("captainId", "name email position")
      .populate(
        "players.playerId",
        "name email position jerseyNumber dateOfBirth height weight"
      );

    if (!team) {
      return res.status(404).json({
        success: false,
        error: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        team,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private (coach of the team or super_admin)
const updateTeam = async (req, res, next) => {
  try {
    let team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: "Team not found",
      });
    }

    // Check ownership or admin rights
    if (
      team.coachId.toString() !== req.user.id &&
      req.user.role !== "super_admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this team",
      });
    }

    const allowedFields = [
      "name",
      "shortName",
      "description",
      "homeGround",
      "sport",
      "contactEmail",
      "contactPhone",
      "address",
      "logo",
    ];

    // Create update object with only allowed fields
    const updateObj = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateObj[key] = req.body[key];
      }
    });

    team = await Team.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
      runValidators: true,
    }).populate("coachId", "name email");

    res.status(200).json({
      success: true,
      data: {
        team,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject team registration
// @route   PUT /api/teams/:id/approval
// @access  Private (super_admin only)
const updateTeamApproval = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      {
        new: true,
        runValidators: true,
      }
    ).populate("coachId", "name email");

    if (!team) {
      return res.status(404).json({
        success: false,
        error: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        team,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add player to team
// @route   POST /api/teams/:id/players
// @access  Private (coach of the team)
const addPlayer = async (req, res, next) => {
  try {
    const {
      playerId,
      isRegistered,
      name,
      email,
      phone,
      position,
      jerseyNumber,
    } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: "Team not found",
      });
    }

    // Check if user is the coach of this team
    if (team.coachId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to add players to this team",
      });
    }

    // Check team capacity
    if (team.players.length >= team.maxPlayers) {
      return res.status(400).json({
        success: false,
        error: "Team has reached maximum player capacity",
      });
    }

    let playerData = {};

    if (isRegistered && playerId) {
      // Adding a registered player
      const player = await User.findById(playerId);
      if (!player || player.role !== "player") {
        return res.status(400).json({
          success: false,
          error: "Invalid player ID or user is not a player",
        });
      }

      // Check if player is already in a team
      if (player.teamId) {
        return res.status(400).json({
          success: false,
          error: "Player is already in a team",
        });
      }

      // Check if player is already in this team
      const existingPlayer = team.players.find(
        (p) => p.playerId && p.playerId.toString() === playerId
      );
      if (existingPlayer) {
        return res.status(400).json({
          success: false,
          error: "Player is already in this team",
        });
      }

      playerData = {
        playerId,
        isRegistered: true,
        position,
        jerseyNumber,
      };

      // Update player's teamId
      await User.findByIdAndUpdate(playerId, { teamId: team._id });
    } else {
      // Adding an unregistered player
      if (!name) {
        return res.status(400).json({
          success: false,
          error: "Name is required for unregistered players",
        });
      }

      playerData = {
        isRegistered: false,
        name,
        email,
        phone,
        position,
        jerseyNumber,
      };
    }

    // Add player to team
    team.players.push(playerData);
    await team.save();

    const updatedTeam = await Team.findById(req.params.id).populate(
      "players.playerId",
      "name email"
    );

    res.status(200).json({
      success: true,
      data: updatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove player from team
// @route   DELETE /api/teams/:id/players/:playerId
// @access  Private (coach of the team)
const removePlayer = async (req, res, next) => {
  try {
    const { id: teamId, playerId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: "Team not found",
      });
    }

    // Check if user is the coach of this team
    if (team.coachId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to remove players from this team",
      });
    }

    // Remove player from team
    team.players = team.players.filter(
      (p) => p.playerId.toString() !== playerId
    );
    await team.save();

    // Update player's teamId to null
    await User.findByIdAndUpdate(playerId, { teamId: null });

    res.status(200).json({
      success: true,
      data: {
        message: "Player removed from team successfully",
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave team (for players)
// @route   POST /api/teams/leave
// @access  Private (player only)
const leaveTeam = async (req, res, next) => {
  try {
    const player = await User.findById(req.user.id);

    if (!player || player.role !== "player") {
      return res.status(403).json({
        success: false,
        error: "Only players can leave teams",
      });
    }

    if (!player.teamId) {
      return res.status(400).json({
        success: false,
        error: "You are not part of any team",
      });
    }

    const team = await Team.findById(player.teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: "Team not found",
      });
    }

    // Remove player from team's players array
    team.players = team.players.filter(
      (p) => p.playerId && p.playerId.toString() !== req.user.id
    );
    await team.save();

    // Update player's teamId to null
    player.teamId = null;
    await player.save();

    res.status(200).json({
      success: true,
      data: {
        message: "Successfully left the team",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Routes
router.post("/", protect, authorize("coach"), createTeam);
router.get("/", protect, getTeams);
router.get("/:id", protect, getTeam);
router.put("/:id", protect, updateTeam);
router.put(
  "/:id/approval",
  protect,
  authorize("super_admin"),
  updateTeamApproval
);
router.post("/:id/players", protect, authorize("coach"), addPlayer);
router.delete(
  "/:id/players/:playerId",
  protect,
  authorize("coach"),
  removePlayer
);
router.post("/leave", protect, authorize("player"), leaveTeam);

module.exports = router;
