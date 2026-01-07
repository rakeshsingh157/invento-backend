const express = require('express');
const router = express.Router();
const {
  registerTeam,
  getAllTeams,
  getTeamById,
  getTeamByName,
  updateTeam,
  deleteTeam,
  getTeamStats
} = require('../controllers/teamController');
const { protect } = require('../middlewares/authMiddleware');

// Public route - No authentication required
router.post('/register', registerTeam);

// Protected routes - Admin only
router.get('/', protect, getAllTeams);
router.get('/stats', protect, getTeamStats);
router.get('/name/:teamName', protect, getTeamByName);
router.get('/:id', protect, getTeamById);
router.put('/:id', protect, updateTeam);
router.delete('/:id', protect, deleteTeam);

module.exports = router;
