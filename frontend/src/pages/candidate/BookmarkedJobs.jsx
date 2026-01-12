import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaHeart, FaMapMarkerAlt, FaBriefcase, FaCalendar } from 'react-icons/fa';

const BookmarkedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarkedJobs();
  }, []);

  const fetchBookmarkedJobs = async () => {
    try {
      const { data } = await api.get('/users/bookmarks');
      setJobs(data.jobs);
    } catch (error) {
      console.error('Error fetching bookmarked jobs:', error);
      toast.error('Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (jobId) => {
    try {
      await api.post(`/users/bookmark/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      toast.success('Job removed from saved');
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
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
        <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-gray-600 mt-2">Jobs you've bookmarked for later</p>
      </div>

      {jobs.length === 0 ? (
        <div className="card text-center py-12">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No saved jobs yet</p>
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="card hover:shadow-xl transition group relative">
              <button
                onClick={() => handleToggleBookmark(job._id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-600 text-2xl z-10"
              >
                <FaHeart className="fill-current" />
              </button>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 pr-8">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-primary-600" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <FaBriefcase className="mr-2 text-primary-600" />
                  {job.jobType} • {job.experienceLevel}
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-2 text-primary-600" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>

              {job.salary && (job.salary.min || job.salary.max) && (
                <div className="mb-4">
                  <p className="text-green-600 font-semibold">
                    ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                  </p>
                </div>
              )}

              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="badge badge-primary text-xs">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="badge badge-info text-xs">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Link 
                  to={`/jobs/${job._id}`}
                  className="btn btn-primary flex-1 text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedJobs;
