const mongoose = require('mongoose');

const playerStatsSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: false, // Can be null for overall/season stats
  },
  sport: {
    type: String,
    required: true,
    enum: ['Football', 'Cricket', 'Basketball', 'Volleyball', 'Tennis', 'Badminton', 'Hockey', 'Baseball', 'Rugby', 'Other'],
  },
  
  // Football Stats
  footballStats: {
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    shots: { type: Number, default: 0 },
    shotsOnTarget: { type: Number, default: 0 },
    passes: { type: Number, default: 0 },
    passAccuracy: { type: Number, default: 0 }, // percentage
    tackles: { type: Number, default: 0 },
    fouls: { type: Number, default: 0 },
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 },
    minutesPlayed: { type: Number, default: 0 },
  },
  
  // Cricket Stats
  cricketStats: {
    runs: { type: Number, default: 0 },
    ballsFaced: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    ballsBowled: { type: Number, default: 0 },
    runsConceded: { type: Number, default: 0 },
    catches: { type: Number, default: 0 },
    stumpings: { type: Number, default: 0 },
    runOuts: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    bowlingAverage: { type: Number, default: 0 },
  },
  
  // Basketball Stats
  basketballStats: {
    points: { type: Number, default: 0 },
    rebounds: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    steals: { type: Number, default: 0 },
    blocks: { type: Number, default: 0 },
    turnovers: { type: Number, default: 0 },
    fieldGoalsMade: { type: Number, default: 0 },
    fieldGoalsAttempted: { type: Number, default: 0 },
    threePointersMade: { type: Number, default: 0 },
    threePointersAttempted: { type: Number, default: 0 },
    freeThrowsMade: { type: Number, default: 0 },
    freeThrowsAttempted: { type: Number, default: 0 },
    minutesPlayed: { type: Number, default: 0 },
  },
  
  // Volleyball Stats
  volleyballStats: {
    spikes: { type: Number, default: 0 },
    blocks: { type: Number, default: 0 },
    aces: { type: Number, default: 0 },
    digs: { type: Number, default: 0 },
    sets: { type: Number, default: 0 },
    serviceErrors: { type: Number, default: 0 },
    receptionErrors: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
  },
  
  // Tennis/Badminton Stats
  racketStats: {
    matchesWon: { type: Number, default: 0 },
    matchesLost: { type: Number, default: 0 },
    setsWon: { type: Number, default: 0 },
    setsLost: { type: Number, default: 0 },
    aces: { type: Number, default: 0 },
    doubleFaults: { type: Number, default: 0 },
    winners: { type: Number, default: 0 },
    unforcedErrors: { type: Number, default: 0 },
  },
  
  // Hockey Stats
  hockeyStats: {
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    shots: { type: Number, default: 0 },
    shotsOnGoal: { type: Number, default: 0 },
    penalties: { type: Number, default: 0 },
    penaltyMinutes: { type: Number, default: 0 },
    plusMinus: { type: Number, default: 0 },
    faceoffWins: { type: Number, default: 0 },
    faceoffLosses: { type: Number, default: 0 },
    hits: { type: Number, default: 0 },
  },
  
  // Generic Stats (for any sport)
  genericStats: {
    appearances: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    mvpAwards: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }, // Overall rating out of 10
  },
  
  season: {
    type: String,
    default: () => new Date().getFullYear().toString(),
  },
  
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
playerStatsSchema.index({ playerId: 1, teamId: 1 });
playerStatsSchema.index({ matchId: 1 });
playerStatsSchema.index({ sport: 1, season: 1 });

module.exports = mongoose.model('PlayerStats', playerStatsSchema);
