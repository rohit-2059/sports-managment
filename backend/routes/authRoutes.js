const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email, password, and role",
      });
    }

    // Check if role is valid
    const validRoles = ["super_admin", "coach", "player"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role. Must be one of: super_admin, coach, player",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists with this email",
      });
    }

    // Restrict super_admin creation (only one should exist)
    if (role === "super_admin") {
      const existingSuperAdmin = await User.findOne({ role: "super_admin" });
      if (existingSuperAdmin) {
        return res.status(400).json({
          success: false,
          error: "Super admin already exists. Only one super admin is allowed.",
        });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          registrationDate: user.registrationDate,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }

    // Check for user and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: "Account is deactivated. Please contact administrator.",
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "teamId",
      "name shortName"
    );

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "phone",
      "profileImage",
      "jerseyNumber",
      "position",
      "dateOfBirth",
      "height",
      "weight",
    ];

    // Create update object with only allowed fields
    const updateObj = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateObj[key] = req.body[key];
      }
    });

    // If email is being updated, check for uniqueness
    if (updateObj.email) {
      const existingUser = await User.findOne({ 
        email: updateObj.email,
        _id: { $ne: req.user.id } // Exclude current user
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email already in use by another user",
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateObj, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide current password, new password, and confirm password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select("+password");

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get all users (admin only)
// @route   GET /api/auth/users
// @access  Private (super_admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const users = await User.find(query)
      .populate("teamId", "name shortName")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/users", protect, authorize("super_admin"), getAllUsers);
router.get(
  "/players",
  protect,
  authorize("coach", "super_admin"),
  async (req, res, next) => {
    try {
      const players = await User.find({ role: "player" })
        .select("name email phone teamId isActive")
        .sort({ name: 1 });

      res.status(200).json({
        success: true,
        count: players.length,
        data: {
          players,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
