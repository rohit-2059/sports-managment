const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Team name cannot exceed 50 characters"],
    },
    shortName: {
      type: String,
      required: [true, "Team short name is required"],
      unique: true,
      trim: true,
      maxlength: [10, "Short name cannot exceed 10 characters"],
    },
    logo: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    founded: {
      type: Date,
      default: null,
    },
    homeGround: {
      type: String,
      default: null,
    },
    sport: {
      type: String,
      required: [true, "Sport type is required"],
      enum: [
        "Football",
        "Cricket",
        "Basketball",
        "Volleyball",
        "Tennis",
        "Badminton",
        "Hockey",
        "Baseball",
        "Rugby",
        "Other",
      ],
    },

    // Team management
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Coach is required"],
    },
    captainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    players: [
      {
        // For registered players
        playerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        // For unregistered players
        isRegistered: {
          type: Boolean,
          default: true,
        },
        name: {
          type: String,
          default: null,
        },
        email: {
          type: String,
          default: null,
        },
        phone: {
          type: String,
          default: null,
        },
        position: {
          type: String,
          default: null,
        },
        jerseyNumber: {
          type: Number,
          default: null,
        },
        joinDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["active", "injured", "suspended", "inactive"],
          default: "active",
        },
      },
    ],

    // Team statistics
    stats: {
      matchesPlayed: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      goalsFor: { type: Number, default: 0 },
      goalsAgainst: { type: Number, default: 0 },
    },

    // Team settings
    isApproved: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxPlayers: {
      type: Number,
      default: 25,
    },

    // Contact information
    contactEmail: {
      type: String,
      default: null,
    },
    contactPhone: {
      type: String,
      default: null,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
teamSchema.index({ coachId: 1 });
teamSchema.index({ isApproved: 1 });
teamSchema.index({ isActive: 1 });

module.exports = mongoose.model("Team", teamSchema);
