import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaBriefcase, FaUsers, FaClock, FaCheckCircle, FaEye } from 'react-icons/fa';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/users/dashboard/stats');
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your job postings and applications</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold mt-2">{stats?.totalJobs || 0}</p>
            </div>
            <FaBriefcase className="text-5xl text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Jobs</p>
              <p className="text-3xl font-bold mt-2">{stats?.activeJobs || 0}</p>
            </div>
            <FaCheckCircle className="text-5xl text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Applications</p>
              <p className="text-3xl font-bold mt-2">{stats?.totalApplications || 0}</p>
            </div>
            <FaUsers className="text-5xl text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Reviews</p>
              <p className="text-3xl font-bold mt-2">{stats?.pendingApplications || 0}</p>
            </div>
            <FaClock className="text-5xl text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link 
          to="/recruiter/post-job" 
          className="card hover:shadow-xl transition-shadow cursor-pointer border-2 border-primary-200 hover:border-primary-500"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <FaBriefcase className="text-3xl text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Post a New Job</h3>
              <p className="text-gray-600">Create and publish a new job listing</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/recruiter/applications" 
          className="card hover:shadow-xl transition-shadow cursor-pointer border-2 border-purple-200 hover:border-purple-500"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-4 rounded-full">
              <FaUsers className="text-3xl text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">View Applications</h3>
              <p className="text-gray-600">Review and manage applications</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
          <Link to="/recruiter/applications" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>

        {stats?.recentApplications && stats.recentApplications.length > 0 ? (
          <div className="space-y-4">
            {stats.recentApplications.map((application) => (
              <div 
                key={application._id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={application.candidate?.avatar || 'https://via.placeholder.com/40'} 
                    alt={application.candidate?.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{application.candidate?.name}</h4>
                    <p className="text-sm text-gray-600">{application.job?.title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`badge ${
                    application.status === 'pending' ? 'badge-warning' :
                    application.status === 'shortlisted' ? 'badge-info' :
                    application.status === 'accepted' ? 'badge-success' :
                    'badge-danger'
                  }`}>
                    {application.status}
                  </span>
                  <Link 
                    to={`/recruiter/applications?applicationId=${application._id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <FaEye />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No applications yet</p>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
