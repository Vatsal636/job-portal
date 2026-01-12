const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Candidate only)
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      recruiter: job.recruiter,
      resume: resume || req.user.resume,
      coverLetter,
      statusHistory: [{
        status: 'pending',
        date: new Date()
      }]
    });

    // Update job applications count
    job.applicationsCount += 1;
    await job.save();

    // Notify recruiter
    await Notification.create({
      recipient: job.recruiter,
      sender: req.user.id,
      type: 'application',
      title: 'New Application Received',
      message: `${req.user.name} applied for ${job.title}`,
      link: `/recruiter/applications/${application._id}`,
      relatedJob: jobId,
      relatedApplication: application._id
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title company location')
      .populate('candidate', 'name email phone avatar')
      .populate('recruiter', 'name company');

    res.status(201).json({
      success: true,
      application: populatedApplication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.code === 11000 ? 'You have already applied to this job' : 'Server error'
    });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate only)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title company location jobType status')
      .populate('recruiter', 'name company')
      .sort('-createdAt');

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get applications for recruiter's jobs
// @route   GET /api/applications/recruiter/applications
// @access  Private (Recruiter only)
exports.getRecruiterApplications = async (req, res) => {
  try {
    const { jobId, status } = req.query;

    let query = { recruiter: req.user.id };

    if (jobId) {
      query.job = jobId;
    }

    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('job', 'title company location')
      .populate('candidate', 'name email phone resume skills experience avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('candidate', 'name email phone resume skills experience education bio avatar')
      .populate('recruiter', 'name company email phone');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    if (
      application.candidate._id.toString() !== req.user.id &&
      application.recruiter._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('job', 'title')
      .populate('candidate', 'name');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the recruiter
    if (application.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update status
    application.status = status;
    application.statusHistory.push({
      status,
      date: new Date(),
      note
    });

    if (note) {
      application.notes = note;
    }

    await application.save();

    // Notify candidate
    const statusMessages = {
      reviewed: 'Your application has been reviewed',
      shortlisted: 'Congratulations! You have been shortlisted',
      interview: 'You have been selected for an interview',
      accepted: 'Congratulations! Your application has been accepted',
      rejected: 'Unfortunately, your application was not successful this time'
    };

    await Notification.create({
      recipient: application.candidate,
      sender: req.user.id,
      type: 'status_update',
      title: `Application Status Updated - ${application.job.title}`,
      message: statusMessages[status] || 'Your application status has been updated',
      link: `/candidate/applications/${application._id}`,
      relatedJob: application.job._id,
      relatedApplication: application._id
    });

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Candidate only)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the candidate
    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }

    await application.deleteOne();

    // Update job applications count
    await Job.findByIdAndUpdate(application.job, {
      $inc: { applicationsCount: -1 }
    });

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
