const PlayerStats = require('../models/PlayerStats');
const Team = require('../models/Team');

// Add or update player stats
exports.addPlayerStats = async (req, res) => {
  try {
    const { playerId, teamId, matchId, sport, stats, season, notes } = req.body;

    // Verify team belongs to coach
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }

    if (req.user.role === 'coach' && team.coachId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only add stats for your own team players',
      });
    }

    // Create stats object based on sport
    const statsData = {
      playerId,
      teamId,
      matchId,
      sport,
      season: season || new Date().getFullYear().toString(),
      notes,
    };

    // Map stats to appropriate sport category
    switch (sport) {
      case 'Football':
        statsData.footballStats = stats;
        break;
      case 'Cricket':
        statsData.cricketStats = stats;
        break;
      case 'Basketball':
        statsData.basketballStats = stats;
        break;
      case 'Volleyball':
        statsData.volleyballStats = stats;
        break;
      case 'Tennis':
      case 'Badminton':
        statsData.racketStats = stats;
        break;
      case 'Hockey':
        statsData.hockeyStats = stats;
        break;
      default:
        statsData.genericStats = stats;
    }

    const playerStats = await PlayerStats.create(statsData);

    res.status(201).json({
      success: true,
      data: playerStats,
    });
  } catch (err) {
    console.error('Error adding player stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while adding stats',
    });
  }
};

// Get player stats
exports.getPlayerStats = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { season, matchId, teamId } = req.query;

    const query = { playerId };
    if (season) query.season = season;
    if (matchId) query.matchId = matchId;
    if (teamId) query.teamId = teamId;

    const stats = await PlayerStats.find(query)
      .populate('playerId', 'name email')
      .populate('teamId', 'name shortName sport')
      .populate('matchId', 'scheduledDate round')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stats.length,
      data: stats,
    });
  } catch (err) {
    console.error('Error fetching player stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Get aggregated stats for a player (totals across all matches)
exports.getAggregatedPlayerStats = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { season, teamId } = req.query;

    const matchQuery = { playerId };
    if (season) matchQuery.season = season;
    if (teamId) matchQuery.teamId = teamId;

    const stats = await PlayerStats.find(matchQuery)
      .populate('playerId', 'name email')
      .populate('teamId', 'name shortName sport');

    if (stats.length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No stats found for this player',
      });
    }

    // Aggregate stats based on sport
    const sport = stats[0].sport;
    const aggregated = {
      playerId: stats[0].playerId,
      teamId: stats[0].teamId,
      sport,
      season: season || 'All Time',
      totalMatches: stats.length,
    };

    // Sum up stats based on sport type
    switch (sport) {
      case 'Football':
        aggregated.stats = stats.reduce((acc, stat) => ({
          goals: (acc.goals || 0) + (stat.footballStats?.goals || 0),
          assists: (acc.assists || 0) + (stat.footballStats?.assists || 0),
          shots: (acc.shots || 0) + (stat.footballStats?.shots || 0),
          shotsOnTarget: (acc.shotsOnTarget || 0) + (stat.footballStats?.shotsOnTarget || 0),
          passes: (acc.passes || 0) + (stat.footballStats?.passes || 0),
          tackles: (acc.tackles || 0) + (stat.footballStats?.tackles || 0),
          fouls: (acc.fouls || 0) + (stat.footballStats?.fouls || 0),
          yellowCards: (acc.yellowCards || 0) + (stat.footballStats?.yellowCards || 0),
          redCards: (acc.redCards || 0) + (stat.footballStats?.redCards || 0),
          minutesPlayed: (acc.minutesPlayed || 0) + (stat.footballStats?.minutesPlayed || 0),
        }), {});
        break;
      
      case 'Cricket':
        aggregated.stats = stats.reduce((acc, stat) => ({
          runs: (acc.runs || 0) + (stat.cricketStats?.runs || 0),
          ballsFaced: (acc.ballsFaced || 0) + (stat.cricketStats?.ballsFaced || 0),
          fours: (acc.fours || 0) + (stat.cricketStats?.fours || 0),
          sixes: (acc.sixes || 0) + (stat.cricketStats?.sixes || 0),
          wickets: (acc.wickets || 0) + (stat.cricketStats?.wickets || 0),
          ballsBowled: (acc.ballsBowled || 0) + (stat.cricketStats?.ballsBowled || 0),
          runsConceded: (acc.runsConceded || 0) + (stat.cricketStats?.runsConceded || 0),
          catches: (acc.catches || 0) + (stat.cricketStats?.catches || 0),
          stumpings: (acc.stumpings || 0) + (stat.cricketStats?.stumpings || 0),
          runOuts: (acc.runOuts || 0) + (stat.cricketStats?.runOuts || 0),
        }), {});
        break;
      
      case 'Basketball':
        aggregated.stats = stats.reduce((acc, stat) => ({
          points: (acc.points || 0) + (stat.basketballStats?.points || 0),
          rebounds: (acc.rebounds || 0) + (stat.basketballStats?.rebounds || 0),
          assists: (acc.assists || 0) + (stat.basketballStats?.assists || 0),
          steals: (acc.steals || 0) + (stat.basketballStats?.steals || 0),
          blocks: (acc.blocks || 0) + (stat.basketballStats?.blocks || 0),
          turnovers: (acc.turnovers || 0) + (stat.basketballStats?.turnovers || 0),
          fieldGoalsMade: (acc.fieldGoalsMade || 0) + (stat.basketballStats?.fieldGoalsMade || 0),
          fieldGoalsAttempted: (acc.fieldGoalsAttempted || 0) + (stat.basketballStats?.fieldGoalsAttempted || 0),
          threePointersMade: (acc.threePointersMade || 0) + (stat.basketballStats?.threePointersMade || 0),
          minutesPlayed: (acc.minutesPlayed || 0) + (stat.basketballStats?.minutesPlayed || 0),
        }), {});
        break;
      
      default:
        aggregated.stats = stats.reduce((acc, stat) => ({
          appearances: (acc.appearances || 0) + (stat.genericStats?.appearances || 0),
          wins: (acc.wins || 0) + (stat.genericStats?.wins || 0),
          losses: (acc.losses || 0) + (stat.genericStats?.losses || 0),
          draws: (acc.draws || 0) + (stat.genericStats?.draws || 0),
        }), {});
    }

    res.status(200).json({
      success: true,
      data: aggregated,
    });
  } catch (err) {
    console.error('Error fetching aggregated stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Get team players stats
exports.getTeamPlayersStats = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { season } = req.query;

    // Verify team exists
    const team = await Team.findById(teamId).populate('players.playerId', 'name email');
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }

    // Get stats for all players in the team
    const query = { teamId };
    if (season) query.season = season;

    const allStats = await PlayerStats.find(query)
      .populate('playerId', 'name email')
      .sort({ 'playerId': 1, createdAt: -1 });

    // Group by player
    const playerStatsMap = {};
    allStats.forEach(stat => {
      const playerId = stat.playerId._id.toString();
      if (!playerStatsMap[playerId]) {
        playerStatsMap[playerId] = {
          player: stat.playerId,
          stats: [],
        };
      }
      playerStatsMap[playerId].stats.push(stat);
    });

    res.status(200).json({
      success: true,
      team: {
        _id: team._id,
        name: team.name,
        sport: team.sport,
      },
      data: Object.values(playerStatsMap),
    });
  } catch (err) {
    console.error('Error fetching team stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Update player stats
exports.updatePlayerStats = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const playerStats = await PlayerStats.findById(id).populate('teamId');
    
    if (!playerStats) {
      return res.status(404).json({
        success: false,
        error: 'Stats not found',
      });
    }

    // Verify coach owns the team
    if (req.user.role === 'coach' && playerStats.teamId.coachId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only update stats for your own team players',
      });
    }

    const updatedStats = await PlayerStats.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedStats,
    });
  } catch (err) {
    console.error('Error updating stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Delete player stats
exports.deletePlayerStats = async (req, res) => {
  try {
    const { id } = req.params;

    const playerStats = await PlayerStats.findById(id).populate('teamId');
    
    if (!playerStats) {
      return res.status(404).json({
        success: false,
        error: 'Stats not found',
      });
    }

    // Verify coach owns the team
    if (req.user.role === 'coach' && playerStats.teamId.coachId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete stats for your own team players',
      });
    }

    await PlayerStats.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Stats deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};
