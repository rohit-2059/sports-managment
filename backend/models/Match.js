const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    matchNumber: {
      type: Number,
      required: true,
    },
    round: {
      type: String,
      required: true,
      // Examples: 'Round 1', 'Round 2', 'Quarter Final', 'Semi Final', 'Final', 'Group A - Round 1'
    },
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: false, // Can be null for future knockout rounds
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: false,
    },
    scheduledDate: {
      type: Date,
      required: false, // Admin can schedule later
    },
    scheduledTime: {
      type: String,
      required: false,
    },
    venue: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "postponed", "cancelled"],
      default: "scheduled",
    },
    homeTeamScore: {
      type: Number,
      default: 0,
    },
    awayTeamScore: {
      type: Number,
      default: 0,
    },
    result: {
      type: String,
      trim: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    nextMatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      // For knockout tournaments - where does winner go
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
matchSchema.index({ tournamentId: 1, matchNumber: 1 });
matchSchema.index({ homeTeam: 1 });
matchSchema.index({ awayTeam: 1 });
matchSchema.index({ status: 1 });

module.exports = mongoose.model("Match", matchSchema);
