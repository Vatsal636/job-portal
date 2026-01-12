const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getRecruiterApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('candidate'), applyToJob);
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);
router.get('/recruiter/applications', protect, authorize('recruiter'), getRecruiterApplications);

router.route('/:id')
  .get(protect, getApplication)
  .delete(protect, authorize('candidate'), deleteApplication);

router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
