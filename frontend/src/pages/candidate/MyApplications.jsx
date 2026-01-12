import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/applications/my-applications');
      setApplications(data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await api.delete(`/applications/${applicationId}`);
      toast.success('Application withdrawn successfully');
      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to withdraw application');
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

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

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
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-2">Track and manage your job applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'reviewed', 'shortlisted', 'interview', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 text-sm">
                  ({applications.filter(app => app.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No applications found</p>
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <div key={application._id} className="card hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{application.job?.title}</h3>
                      <p className="text-gray-600">{application.job?.company}</p>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                    <span>📍 {application.job?.location}</span>
                    <span>💼 {application.job?.jobType}</span>
                    <span>📅 Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>

                  {application.coverLetter && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter:</p>
                      <p className="text-sm text-gray-600">{application.coverLetter}</p>
                    </div>
                  )}

                  {application.notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <p className="text-sm font-medium text-blue-700 mb-1">Recruiter Notes:</p>
                      <p className="text-sm text-blue-600">{application.notes}</p>
                    </div>
                  )}

                  {application.statusHistory && application.statusHistory.length > 1 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Status History:</p>
                      <div className="space-y-1">
                        {application.statusHistory.slice().reverse().map((history, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            {history.status} - {new Date(history.date).toLocaleDateString()}
                            {history.note && ` (${history.note})`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t">
                <Link 
                  to={`/jobs/${application.job?._id}`}
                  className="btn btn-secondary"
                >
                  View Job
                </Link>
                {application.status === 'pending' && (
                  <button
                    onClick={() => handleDelete(application._id)}
                    className="btn btn-danger flex items-center gap-2"
                  >
                    <FaTrash /> Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
