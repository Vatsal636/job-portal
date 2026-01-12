import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaEye, FaUsers } from 'react-icons/fa';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs/recruiter/my-jobs');
      setJobs(data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
          <p className="text-gray-600 mt-2">View and manage your job postings</p>
        </div>
        <Link to="/recruiter/post-job" className="btn btn-primary">
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No jobs posted yet</p>
          <Link to="/recruiter/post-job" className="btn btn-primary">
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="card hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <span className={`badge ${
                      job.status === 'active' ? 'badge-success' :
                      job.status === 'closed' ? 'badge-danger' :
                      'badge-warning'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.jobType}</span>
                    <span>📊 {job.experienceLevel}</span>
                    <span className="flex items-center">
                      <FaUsers className="mr-1" />
                      {job.applicationsCount} Applications
                    </span>
                    <span>👁️ {job.views} Views</span>
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="badge badge-primary text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t">
                <Link 
                  to={`/jobs/${job._id}`}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <FaEye /> View
                </Link>
                <Link 
                  to={`/recruiter/edit-job/${job._id}`}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <FaEdit /> Edit
                </Link>
                <Link 
                  to={`/recruiter/applications?jobId=${job._id}`}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <FaUsers /> Applications ({job.applicationsCount})
                </Link>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="btn btn-danger flex items-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
