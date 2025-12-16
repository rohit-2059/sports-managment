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
    const { homeScore, awayScore, scoreDetails, status } = req.body;

    const match = await Match.findById(id)
      .populate("homeTeam")
      .populate("awayTeam")
      .populate({ path: "tournamentId", select: "sport" });

    if (!match) {
      return res.status(404).json({
        success: false,
        error: "Match not found",
      });
    }

    const sport = match.tournamentId?.sport || "Other";
    match.sport = sport;

    // If scoreDetails provided (new sport-specific format)
    if (scoreDetails) {
      // Validate score based on sport
      const validation = validateSportScore(sport, scoreDetails);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: validation.error,
        });
      }

      match.scoreDetails = scoreDetails;

      // Calculate simple scores for backward compatibility
      const simpleScores = calculateSimpleScore(sport, scoreDetails);
      match.homeTeamScore = simpleScores.home;
      match.awayTeamScore = simpleScores.away;

      // Determine winner and format result
      const result = determineWinner(sport, scoreDetails, match);
      match.winner = result.winnerId;
      match.result = result.resultText;
    } else {
      // Fallback to simple score format (backward compatibility)
      match.homeTeamScore = homeScore || 0;
      match.awayTeamScore = awayScore || 0;

      if (homeScore > awayScore) {
        match.winner = match.homeTeam._id;
        match.result = `${match.homeTeam.name} won ${homeScore}-${awayScore}`;
      } else if (awayScore > homeScore) {
        match.winner = match.awayTeam._id;
        match.result = `${match.awayTeam.name} won ${awayScore}-${homeScore}`;
      } else {
        match.result = `Draw ${homeScore}-${awayScore}`;
      }
    }

    match.status = status || "completed";
    await match.save();

    // Update team statistics
    if (match.status === 'completed' && match.homeTeam && match.awayTeam) {
      const Team = require('../models/Team');
      
      // Get both teams
      const homeTeam = await Team.findById(match.homeTeam._id);
      const awayTeam = await Team.findById(match.awayTeam._id);

      if (homeTeam && awayTeam) {
        // Initialize stats if not present
        if (!homeTeam.stats) homeTeam.stats = { wins: 0, losses: 0, draws: 0 };
        if (!awayTeam.stats) awayTeam.stats = { wins: 0, losses: 0, draws: 0 };

        // Update stats based on result
        if (match.homeTeamScore > match.awayTeamScore) {
          // Home team wins
          homeTeam.stats.wins += 1;
          awayTeam.stats.losses += 1;
        } else if (match.awayTeamScore > match.homeTeamScore) {
          // Away team wins
          awayTeam.stats.wins += 1;
          homeTeam.stats.losses += 1;
        } else {
          // Draw
          homeTeam.stats.draws += 1;
          awayTeam.stats.draws += 1;
        }

        // Save both teams
        await homeTeam.save();
        await awayTeam.save();
      }
    }

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

// ===== SPORT-SPECIFIC HELPER FUNCTIONS =====

function validateSportScore(sport, scoreDetails) {
  if (!scoreDetails || !scoreDetails.homeTeam || !scoreDetails.awayTeam) {
    return { valid: false, error: "Score details for both teams are required" };
  }

  switch (sport) {
    case "Cricket":
      return validateCricketScore(scoreDetails);
    case "Football":
      return validateFootballScore(scoreDetails);
    case "Basketball":
      return validateBasketballScore(scoreDetails);
    default:
      return { valid: true };
  }
}

function validateCricketScore(scoreDetails) {
  const { homeTeam, awayTeam } = scoreDetails;

  if (homeTeam.runs === undefined || awayTeam.runs === undefined) {
    return { valid: false, error: "Runs are required for cricket matches" };
  }

  if (homeTeam.wickets > 10 || awayTeam.wickets > 10) {
    return { valid: false, error: "Wickets cannot exceed 10" };
  }

  if (homeTeam.runs < 0 || awayTeam.runs < 0) {
    return { valid: false, error: "Runs cannot be negative" };
  }

  return { valid: true };
}

function validateFootballScore(scoreDetails) {
  const { homeTeam, awayTeam } = scoreDetails;

  if (homeTeam.goals === undefined || awayTeam.goals === undefined) {
    return { valid: false, error: "Goals are required for football matches" };
  }

  if (homeTeam.goals < 0 || awayTeam.goals < 0) {
    return { valid: false, error: "Goals cannot be negative" };
  }

  return { valid: true };
}

function validateBasketballScore(scoreDetails) {
  const { homeTeam, awayTeam } = scoreDetails;

  if (homeTeam.points === undefined || awayTeam.points === undefined) {
    return { valid: false, error: "Points are required for basketball matches" };
  }

  if (homeTeam.points < 0 || awayTeam.points < 0) {
    return { valid: false, error: "Points cannot be negative" };
  }

  return { valid: true };
}

function calculateSimpleScore(sport, scoreDetails) {
  const { homeTeam, awayTeam } = scoreDetails;

  switch (sport) {
    case "Cricket":
      return {
        home: homeTeam.runs || 0,
        away: awayTeam.runs || 0,
      };
    case "Football":
      return {
        home: homeTeam.goals || 0,
        away: awayTeam.goals || 0,
      };
    case "Basketball":
      return {
        home: homeTeam.points || 0,
        away: awayTeam.points || 0,
      };
    default:
      return { home: 0, away: 0 };
  }
}

function determineWinner(sport, scoreDetails, match) {
  const simpleScores = calculateSimpleScore(sport, scoreDetails);

  if (simpleScores.home > simpleScores.away) {
    return {
      winnerId: match.homeTeam._id,
      resultText: formatResult(sport, scoreDetails, match, "home"),
    };
  } else if (simpleScores.away > simpleScores.home) {
    return {
      winnerId: match.awayTeam._id,
      resultText: formatResult(sport, scoreDetails, match, "away"),
    };
  } else {
    return {
      winnerId: null,
      resultText: formatResult(sport, scoreDetails, match, "draw"),
    };
  }
}

function formatResult(sport, scoreDetails, match, winner) {
  const { homeTeam, awayTeam } = scoreDetails;

  switch (sport) {
    case "Cricket":
      if (winner === "home") {
        const margin = homeTeam.runs - awayTeam.runs;
        return `${match.homeTeam.name} won by ${margin} run${margin !== 1 ? "s" : ""}`;
      } else if (winner === "away") {
        const wickets = 10 - (awayTeam.wickets || 0);
        return `${match.awayTeam.name} won by ${wickets} wicket${wickets !== 1 ? "s" : ""}`;
      }
      return "Match Tied";

    case "Football":
      const homeGoals = homeTeam.goals || 0;
      const awayGoals = awayTeam.goals || 0;
      if (winner === "draw") return `Draw ${homeGoals}-${awayGoals}`;
      return winner === "home"
        ? `${match.homeTeam.name} won ${homeGoals}-${awayGoals}`
        : `${match.awayTeam.name} won ${awayGoals}-${homeGoals}`;

    case "Basketball":
      const homePoints = homeTeam.points || 0;
      const awayPoints = awayTeam.points || 0;
      if (winner === "draw") return `Draw ${homePoints}-${awayPoints}`;
      return winner === "home"
        ? `${match.homeTeam.name} won ${homePoints}-${awayPoints}`
        : `${match.awayTeam.name} won ${awayPoints}-${homePoints}`;

    default:
      return "Result recorded";
  }
}


// ===== HELPER FUNCTIONS =====

// Distribute matches across tournament duration
function distributeMatchDates(matches, startDate, endDate) {
  if (matches.length === 0) return matches;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const totalMatches = matches.length;
  
  // If only one day or one match, assign to start date
  if (durationDays <= 1 || totalMatches === 1) {
    matches.forEach(match => {
      match.scheduledDate = new Date(start);
    });
    return matches;
  }
  
  // Calculate spacing between matches
  const interval = (durationDays - 1) / (totalMatches - 1);
  
  matches.forEach((match, index) => {
    const daysToAdd = Math.round(index * interval);
    const matchDate = new Date(start);
    matchDate.setDate(start.getDate() + daysToAdd);
    match.scheduledDate = matchDate;
  });
  
  return matches;
}

function generateKnockoutMatches(tournament) {
  const teams = tournament.teams;
  const numTeams = teams.length;

  // Find next power of 2
  const slots = Math.pow(2, Math.ceil(Math.log2(numTeams)));
  const matches = [];
  let matchNumber = 1;

  // Calculate tournament duration
  const start = new Date(tournament.startDate);
  const end = new Date(tournament.endDate);
  const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
  // Determine number of rounds
  const numRounds = Math.log2(slots);
  const daysPerRound = Math.max(1, Math.floor(durationDays / numRounds));

  // Round 1 matches
  const roundName = getRoundName(slots);
  const round1Matches = [];
  
  for (let i = 0; i < teams.length; i += 2) {
    if (i + 1 < teams.length) {
      round1Matches.push({
        tournamentId: tournament._id,
        matchNumber: matchNumber++,
        round: roundName,
        homeTeam: teams[i]._id,
        awayTeam: teams[i + 1]._id,
        venue: tournament.venue,
      });
    }
  }

  // Distribute Round 1 matches across first round window
  const round1End = new Date(start);
  round1End.setDate(start.getDate() + daysPerRound - 1);
  distributeMatchDates(round1Matches, start, round1End);
  matches.push(...round1Matches);

  // Generate placeholder matches for future rounds with progressive dates
  let currentRoundMatches = Math.floor(teams.length / 2);
  let currentSlots = slots / 2;
  let currentRoundStart = new Date(start);
  currentRoundStart.setDate(start.getDate() + daysPerRound);

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
        scheduledDate: new Date(currentRoundStart), // Tentative date for this round
        venue: tournament.venue,
      });
    }

    currentSlots = currentSlots / 2;
    currentRoundStart.setDate(currentRoundStart.getDate() + daysPerRound);
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
        round: `Match ${matchNumber - 1}`,
        homeTeam: teams[i]._id,
        awayTeam: teams[j]._id,
        venue: tournament.venue,
      });
    }
  }

  // Distribute matches evenly across tournament duration
  distributeMatchDates(matches, tournament.startDate, tournament.endDate);

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
