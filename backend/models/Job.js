const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide job description']
  },
  requirements: {
    type: String,
    required: [true, 'Please provide job requirements']
  },
  responsibilities: {
    type: String
  },
  location: {
    type: String,
    required: [true, 'Please provide job location']
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    required: [true, 'Please specify job type']
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'],
    required: [true, 'Please specify experience level']
  },
  salary: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  skills: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['Technology', 'Marketing', 'Sales', 'Design', 'Finance', 'HR', 'Operations', 'Other'],
    default: 'Other'
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationDeadline: {
    type: Date
  },
  positions: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
jobSchema.index({ title: 'text', description: 'text', company: 'text' });

module.exports = mongoose.model('Job', jobSchema);
