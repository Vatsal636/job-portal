const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getDashboardStats,
  toggleBookmark,
  getBookmarkedJobs
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { uploadProfile } = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, uploadProfile, updateProfile);
router.get('/dashboard/stats', protect, getDashboardStats);
router.post('/bookmark/:jobId', protect, authorize('candidate'), toggleBookmark);
router.get('/bookmarks', protect, authorize('candidate'), getBookmarkedJobs);

module.exports = router;
