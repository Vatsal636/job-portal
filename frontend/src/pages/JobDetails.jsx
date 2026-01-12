import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaBriefcase, FaCalendar, FaDollarSign, FaUsers, FaBuilding, FaHeart, FaRegHeart } from 'react-icons/fa';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCandidate, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: user?.resume || ''
  });

  useEffect(() => {
    fetchJobDetails();
    if (isCandidate) {
      checkBookmarkStatus();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      setJob(data.job);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setIsBookmarked(data.user.bookmarkedJobs?.some(jobId => jobId === id || jobId._id === id));
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const handleToggleBookmark = async () => {
    if (!isCandidate) {
      toast.info('Please login as a candidate to save jobs');
      return;
    }

    try {
      await api.post(`/users/bookmark/${id}`);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? 'Job removed from saved' : 'Job saved successfully');
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (!isCandidate) {
      toast.error('Only candidates can apply for jobs');
      return;
    }

    setApplying(true);

    try {
      await api.post('/applications', {
        jobId: id,
        coverLetter: applicationData.coverLetter,
        resume: applicationData.resume
      });
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      navigate('/candidate/applications');
    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-600">{job.company}</p>
                </div>
                {isCandidate && (
                  <button
                    onClick={handleToggleBookmark}
                    className="text-3xl"
                  >
                    {isBookmarked ? (
                      <FaHeart className="text-red-500 hover:text-red-600" />
                    ) : (
                      <FaRegHeart className="text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-primary-600" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaBriefcase className="mr-2 text-primary-600" />
                  <span>{job.jobType}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendar className="mr-2 text-primary-600" />
                  <span>{job.experienceLevel}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaUsers className="mr-2 text-primary-600" />
                  <span>{job.positions} position(s)</span>
                </div>
              </div>

              {job.salary && (job.salary.min || job.salary.max) && (
                <div className="flex items-center text-green-600 font-semibold text-lg mb-6">
                  <FaDollarSign className="mr-2" />
                  <span>
                    ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()} per year
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>

              {job.responsibilities && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                  <p className="text-gray-700 whitespace-pre-line">{job.responsibilities}</p>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="badge badge-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-500 pt-6 border-t">
                <p>Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
                {job.applicationDeadline && (
                  <p>Application Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              {isCandidate && (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="btn btn-primary w-full mb-4 text-lg py-3"
                >
                  Apply Now
                </button>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Company Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaBuilding className="mr-3 text-primary-600" />
                    <span className="text-gray-700">{job.recruiter?.company || job.company}</span>
                  </div>
                  {job.recruiter?.website && (
                    <div>
                      <a 
                        href={job.recruiter.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  {job.recruiter?.companyDescription && (
                    <p className="text-sm text-gray-600 mt-2">
                      {job.recruiter.companyDescription}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Job Stats</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span className="font-semibold">{job.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Applications:</span>
                    <span className="font-semibold">{job.applicationsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-semibold">{job.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Apply for {job.title}</h2>
              
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={applicationData.resume}
                    onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.value })}
                    className="input"
                    placeholder="https://drive.google.com/your-resume"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Please provide a link to your resume (Google Drive, Dropbox, etc.)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                    rows="6"
                    className="input"
                    placeholder="Tell us why you're a great fit for this position..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={applying}
                    className="btn btn-primary flex-1"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
