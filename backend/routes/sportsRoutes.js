const express = require("express");

const router = express.Router();

// @desc    Get sports data
// @route   GET /api/sports
// @access  Public
router.get("/", (req, res) => {
  res.json({
    message: "Sports routes working",
    sports: ["football", "basketball", "cricket", "tennis"],
  });
});

module.exports = router;
