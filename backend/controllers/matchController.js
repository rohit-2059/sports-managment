const Match = require("../models/Match");
const Tournament = require("../models/Tournament");

// Generate matches for a tournament based on format
exports.generateSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findById(id).populate("teams");

    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: "Tournament not found",
      });
    }

    // Check if schedule already generated
    if (tournament.scheduleGenerated) {
      return res.status(400).json({
        success: false,
        error: "Schedule already generated for this tournament",
      });
    }

    // Check if tournament has enough teams
    if (tournament.teams.length < 2) {
      return res.status(400).json({
        success: false,
        error: "Tournament needs at least 2 teams to generate schedule",
      });
    }

    let matches = [];

    // Generate matches based on format
    switch (tournament.format) {
      case "knockout":
        matches = generateKnockoutMatches(tournament);
        break;
      case "round_robin":
      case "league":
        matches = generateRoundRobinMatches(tournament);
        break;
      case "group_stage":
        matches = generateGroupStageMatches(tournament);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Invalid tournament format",
        });
    }

    // Save all matches
    const savedMatches = await Match.insertMany(matches);

    // Update tournament
    tournament.scheduleGenerated = true;
    tournament.scheduleGeneratedAt = new Date();
    tournament.scheduleGeneratedBy = req.user.id;
    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Schedule generated successfully",
      data: {
        tournament,
        matchesGenerated: savedMatches.length,
        matches: savedMatches,
      },
    });
  } catch (err) {
    console.error("Error generating schedule:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Server error while generating schedule",
      details:
        process.env.NODE_ENV === "development" ? err.toString() : undefined,
    });
  }
};

// Get all matches for a tournament
exports.getTournamentMatches = async (req, res) => {
  try {
    const { id } = req.params;

    const matches = await Match.find({ tournamentId: id })
      .populate("homeTeam", "name shortName sport")
      .populate("awayTeam", "name shortName sport")
      .populate("tournamentId", "name format")
      .populate("winner", "name shortName")
      .sort({ matchNumber: 1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Get matches for a specific team (for coaches/players)
exports.getTeamMatches = async (req, res) => {
  try {
    const { teamId } = req.params;

    const matches = await Match.find({
      $or: [{ homeTeam: teamId }, { awayTeam: teamId }],
    })
      .populate("tournamentId", "name sport startDate endDate venue")
      .populate("homeTeam", "name shortName sport")
      .populate("awayTeam", "name shortName sport")
      .populate("winner", "name shortName")
      .sort({ scheduledDate: 1, matchNumber: 1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    console.error("Error fetching team matches:", err);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Update match details (date, time, venue)
exports.updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const match = await Match.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("homeTeam", "name shortName")
      .populate("awayTeam", "name shortName");

    if (!match) {
      return res.status(404).json({
        success: false,
        error: "Match not found",
      });
    }

    res.status(200).json({
      success: true,
      data: match,
    });
  } catch (err) {
    console.error("Error updating match:", err);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Update match score
exports.updateMatchScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { homeScore, awayScore, status } = req.body;

    const match = await Match.findById(id)
      .populate("homeTeam")
      .populate("awayTeam");

    if (!match) {
      return res.status(404).json({
        success: false,
        error: "Match not found",
      });
    }

    match.homeTeamScore = homeScore;
    match.awayTeamScore = awayScore;
    match.status = status || "completed";

    // Determine winner and set result
    if (homeScore > awayScore) {
      match.winner = match.homeTeam._id;
      match.result = `${match.homeTeam.name} won ${homeScore}-${awayScore}`;
    } else if (awayScore > homeScore) {
      match.winner = match.awayTeam._id;
      match.result = `${match.awayTeam.name} won ${awayScore}-${homeScore}`;
    } else {
      match.result = `Draw ${homeScore}-${awayScore}`;
    }

    await match.save();

    res.status(200).json({
      success: true,
      data: match,
    });
  } catch (err) {
    console.error("Error updating match score:", err);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// ===== HELPER FUNCTIONS =====

function generateKnockoutMatches(tournament) {
  const teams = tournament.teams;
  const numTeams = teams.length;

  // Find next power of 2
  const slots = Math.pow(2, Math.ceil(Math.log2(numTeams)));
  const matches = [];
  let matchNumber = 1;

  // Round 1 matches
  const roundName = getRoundName(slots);
  for (let i = 0; i < teams.length; i += 2) {
    if (i + 1 < teams.length) {
      matches.push({
        tournamentId: tournament._id,
        matchNumber: matchNumber++,
        round: roundName,
        homeTeam: teams[i]._id,
        awayTeam: teams[i + 1]._id,
        scheduledDate: tournament.startDate,
        venue: tournament.venue,
      });
    }
  }

  // Generate placeholder matches for future rounds
  let currentRoundMatches = Math.floor(teams.length / 2);
  let currentSlots = slots / 2;

  while (currentSlots >= 1) {
    const nextRoundName = getRoundName(currentSlots);
    const nextRoundMatches = currentSlots / 2;

    for (let i = 0; i < nextRoundMatches; i++) {
      matches.push({
        tournamentId: tournament._id,
        matchNumber: matchNumber++,
        round: nextRoundName,
        homeTeam: null, // TBD
        awayTeam: null, // TBD
        venue: tournament.venue,
      });
    }

    currentSlots = currentSlots / 2;
  }

  return matches;
}

function generateRoundRobinMatches(tournament) {
  const teams = tournament.teams;
  const matches = [];
  let matchNumber = 1;

  // Every team plays every other team once
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        tournamentId: tournament._id,
        matchNumber: matchNumber++,
        round: `Round ${matchNumber - 1}`,
        homeTeam: teams[i]._id,
        awayTeam: teams[j]._id,
        scheduledDate: tournament.startDate,
        venue: tournament.venue,
      });
    }
  }

  return matches;
}

function generateGroupStageMatches(tournament) {
  // Simplified: treat as round robin for now
  // In production, you'd split into groups first
  return generateRoundRobinMatches(tournament);
}

function getRoundName(slots) {
  switch (slots) {
    case 2:
      return "Final";
    case 4:
      return "Semi Final";
    case 8:
      return "Quarter Final";
    case 16:
      return "Round of 16";
    case 32:
      return "Round of 32";
    default:
      return `Round 1`;
  }
}
