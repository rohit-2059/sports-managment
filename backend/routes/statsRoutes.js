const express = require('express');
const router = express.Router();
const {
  addPlayerStats,
  getPlayerStats,
  getAggregatedPlayerStats,
  getTeamPlayersStats,
  updatePlayerStats,
  deletePlayerStats,
} = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');

// Add player stats (coach only)
router.post('/', protect, authorize('coach'), addPlayerStats);

// Get player stats (authenticated users)
router.get('/player/:playerId', protect, getPlayerStats);

// Get aggregated player stats (authenticated users)
router.get('/player/:playerId/aggregated', protect, getAggregatedPlayerStats);

// Get team players stats (authenticated users)
router.get('/team/:teamId', protect, getTeamPlayersStats);

// Update player stats (coach only)
router.put('/:id', protect, authorize('coach'), updatePlayerStats);

// Delete player stats (coach only)
router.delete('/:id', protect, authorize('coach'), deletePlayerStats);

module.exports = router;
