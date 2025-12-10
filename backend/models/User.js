const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ["super_admin", "coach", "player"],
      required: [true, "Role is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Profile specific fields
    profileImage: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },

    // Coach specific fields
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    yearsOfExperience: {
      type: Number,
      default: null,
    },

    // Player specific fields
    jerseyNumber: {
      type: Number,
      default: null,
    },
    position: {
      type: String,
      enum: [
        "captain",
        "wicket-keeper",
        "striker",
        "defender",
        "midfielder",
        "goalkeeper",
        "all-rounder",
        "batsman",
        "bowler",
      ],
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    height: {
      type: Number, // in cm
      default: null,
    },
    weight: {
      type: Number, // in kg
      default: null,
    },
    playingHistory: [
      {
        season: String,
        team: String,
        matches: Number,
        achievements: String,
      },
    ],

    // Common metadata
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return;

  // Hash password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create indexes for better query performance
userSchema.index({ role: 1 });
userSchema.index({ teamId: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model("User", userSchema);
