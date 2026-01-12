import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { BASE_URL } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaDownload } from 'react-icons/fa';

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [selectedJob, selectedStatus]);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs/recruiter/my-jobs');
      setJobs(data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedJob) params.append('jobId', selectedJob);
      if (selectedStatus) params.append('status', selectedStatus);
      
      const { data } = await api.get(`/applications/recruiter/applications?${params}`);
      setApplications(data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      toast.success('Application status updated');
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'badge-warning',
      reviewed: 'badge-info',
      shortlisted: 'badge-primary',
      interview: 'badge-info',
      accepted: 'badge-success',
      rejected: 'badge-danger'
    };
    return classes[status] || 'badge-warning';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <p className="text-gray-600 mt-2">Review and manage candidate applications</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Job
            </label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="input"
            >
              <option value="">All Jobs</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} ({job.applicationsCount} applications)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application._id} className="card hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <img
                    src={application.candidate?.avatar || 'https://via.placeholder.com/60'}
                    alt={application.candidate?.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {application.candidate?.name}
                    </h3>
                    <p className="text-gray-600">{application.job?.title}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                      <span>📧 {application.candidate?.email}</span>
                      {application.candidate?.phone && (
                        <span>📱 {application.candidate?.phone}</span>
                      )}
                    </div>

                    {application.candidate?.skills && application.candidate.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {application.candidate.skills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="badge badge-info text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {application.coverLetter && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                    {application.status}
                  </span>
                  {application.resume && (
                    <a
                      href={application.resume.startsWith('http') ? application.resume : `${BASE_URL}${application.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary text-sm flex items-center gap-2"
                    >
                      <FaDownload /> Resume
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['reviewed', 'shortlisted', 'interview', 'accepted', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(application._id, status)}
                      disabled={application.status === status}
                      className={`btn text-sm ${
                        application.status === status ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        status === 'accepted' ? 'btn-primary' :
                        status === 'rejected' ? 'btn-danger' :
                        'btn-secondary'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Applied on: {new Date(application.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
