const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('bookmarkedJobs');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
      bio: req.body.bio
    };

    // Handle uploaded avatar
    if (req.files && req.files.avatar) {
      fieldsToUpdate.avatar = `/uploads/avatars/${req.files.avatar[0].filename}`;
    }

    // Candidate specific fields
    if (req.user.role === 'candidate') {
      fieldsToUpdate.skills = req.body.skills;
      fieldsToUpdate.experience = req.body.experience;
      fieldsToUpdate.education = req.body.education;
      
      // Handle uploaded resume
      if (req.files && req.files.resume) {
        fieldsToUpdate.resume = `/uploads/resumes/${req.files.resume[0].filename}`;
      }
    }

    // Recruiter specific fields
    if (req.user.role === 'recruiter') {
      fieldsToUpdate.company = req.body.company;
      fieldsToUpdate.companyDescription = req.body.companyDescription;
      fieldsToUpdate.website = req.body.website;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/users/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === 'recruiter') {
      // Recruiter stats
      const totalJobs = await Job.countDocuments({ recruiter: req.user.id });
      const activeJobs = await Job.countDocuments({ 
        recruiter: req.user.id, 
        status: 'active' 
      });
      const totalApplications = await Application.countDocuments({ 
        recruiter: req.user.id 
      });
      const pendingApplications = await Application.countDocuments({ 
        recruiter: req.user.id, 
        status: 'pending' 
      });

      // Get recent applications
      const recentApplications = await Application.find({ 
        recruiter: req.user.id 
      })
        .populate('job', 'title')
        .populate('candidate', 'name avatar')
        .sort('-createdAt')
        .limit(5);

      res.json({
        success: true,
        stats: {
          totalJobs,
          activeJobs,
          totalApplications,
          pendingApplications,
          recentApplications
        }
      });
    } else {
      // Candidate stats
      const totalApplications = await Application.countDocuments({ 
        candidate: req.user.id 
      });
      const pendingApplications = await Application.countDocuments({ 
        candidate: req.user.id, 
        status: 'pending' 
      });
      const shortlistedApplications = await Application.countDocuments({ 
        candidate: req.user.id, 
        status: 'shortlisted' 
      });
      const acceptedApplications = await Application.countDocuments({ 
        candidate: req.user.id, 
        status: 'accepted' 
      });

      // Get bookmarked jobs count
      const user = await User.findById(req.user.id);
      const bookmarkedJobsCount = user.bookmarkedJobs.length;

      // Get recent applications
      const recentApplications = await Application.find({ 
        candidate: req.user.id 
      })
        .populate('job', 'title company')
        .sort('-createdAt')
        .limit(5);

      res.json({
        success: true,
        stats: {
          totalApplications,
          pendingApplications,
          shortlistedApplications,
          acceptedApplications,
          bookmarkedJobsCount,
          recentApplications
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Toggle bookmark job
// @route   POST /api/users/bookmark/:jobId
// @access  Private (Candidate only)
exports.toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.jobId;

    const index = user.bookmarkedJobs.indexOf(jobId);

    if (index > -1) {
      // Remove bookmark
      user.bookmarkedJobs.splice(index, 1);
    } else {
      // Add bookmark
      user.bookmarkedJobs.push(jobId);
    }

    await user.save();

    res.json({
      success: true,
      bookmarkedJobs: user.bookmarkedJobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get bookmarked jobs
// @route   GET /api/users/bookmarks
// @access  Private (Candidate only)
exports.getBookmarkedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'bookmarkedJobs',
        populate: {
          path: 'recruiter',
          select: 'name company'
        }
      });

    res.json({
      success: true,
      jobs: user.bookmarkedJobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
