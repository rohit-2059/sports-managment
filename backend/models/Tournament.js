const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tournament name is required"],
      trim: true,
      maxlength: [100, "Tournament name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    sport: {
      type: String,
      required: [true, "Sport type is required"],
      enum: [
        "Football",
        "Basketball",
        "Cricket",
        "Tennis",
        "Volleyball",
        "Hockey",
        "Badminton",
        "Other",
      ],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    registrationDeadline: {
      type: Date,
      required: [true, "Registration deadline is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    maxTeams: {
      type: Number,
      required: [true, "Maximum number of teams is required"],
      min: [2, "Minimum 2 teams required"],
      max: [64, "Maximum 64 teams allowed"],
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    status: {
      type: String,
      enum: [
        "upcoming",
        "registration_open",
        "registration_closed",
        "ongoing",
        "completed",
        "cancelled",
      ],
      default: "upcoming",
    },
    format: {
      type: String,
      enum: ["knockout", "round_robin", "league", "group_stage"],
      default: "knockout",
    },
    prizePool: {
      type: String,
      trim: true,
    },
    rules: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    contactPhone: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    scheduleGenerated: {
      type: Boolean,
      default: false,
    },
    scheduleGeneratedAt: {
      type: Date,
    },
    scheduleGeneratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
tournamentSchema.index({ sport: 1, status: 1 });
tournamentSchema.index({ startDate: 1 });

// Virtual for checking if registration is open
tournamentSchema.virtual("isRegistrationOpen").get(function () {
  const now = new Date();
  return now <= this.registrationDeadline && this.teams.length < this.maxTeams;
});

// Virtual for checking if tournament is full
tournamentSchema.virtual("isFull").get(function () {
  return this.teams.length >= this.maxTeams;
});

// Pre-save hook to validate dates
tournamentSchema.pre("save", async function () {
  // Validate that endDate is after or equal to startDate
  if (this.endDate < this.startDate) {
    throw new Error("End date must be after or equal to start date");
  }

  // Validate that registrationDeadline is before or equal to startDate
  if (this.registrationDeadline > this.startDate) {
    throw new Error(
      "Registration deadline must be before or equal to start date"
    );
  }
});

module.exports = mongoose.model("Tournament", tournamentSchema);
