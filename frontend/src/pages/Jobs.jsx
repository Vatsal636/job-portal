import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaHeart, FaRegHeart, FaCalendar } from 'react-icons/fa';

const Jobs = () => {
  const { isCandidate, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    category: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchJobs();
    if (isCandidate) {
      fetchBookmarkedJobs();
    }
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        ...filters
      });

      Object.keys(filters).forEach(key => {
        if (!filters[key]) params.delete(key);
      });

      const { data } = await api.get(`/jobs?${params}`);
      setJobs(data.jobs);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.total
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarkedJobs = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setBookmarkedJobs(data.user.bookmarkedJobs || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleToggleBookmark = async (jobId) => {
    if (!isCandidate) {
      toast.info('Please login as a candidate to save jobs');
      return;
    }

    try {
      await api.post(`/users/bookmark/${jobId}`);
      if (bookmarkedJobs.includes(jobId)) {
        setBookmarkedJobs(bookmarkedJobs.filter(id => id !== jobId));
        toast.success('Job removed from saved');
      } else {
        setBookmarkedJobs([...bookmarkedJobs, jobId]);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const isBookmarked = (jobId) => {
    return bookmarkedJobs.some(id => id === jobId || id._id === jobId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-center">Find Your Dream Job</h1>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Job title or keyword"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              
              <button type="submit" className="btn bg-white text-primary-600 hover:bg-gray-100 py-3">
                Search Jobs
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="input"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={filters.experienceLevel}
                    onChange={handleFilterChange}
                    className="input"
                  >
                    <option value="">All Levels</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead">Lead</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="input"
                  >
                    <option value="">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Design">Design</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Operations">Operations</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setFilters({
                      search: '',
                      location: '',
                      jobType: '',
                      experienceLevel: '',
                      category: ''
                    });
                  }}
                  className="btn btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-gray-600">
                Found <span className="font-semibold">{pagination.total}</span> jobs
              </p>
            </div>

            {jobs.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {jobs.map((job) => (
                    <div key={job._id} className="card hover:shadow-xl transition group relative">
                      {isCandidate && (
                        <button
                          onClick={() => handleToggleBookmark(job._id)}
                          className="absolute top-4 right-4 text-2xl z-10"
                        >
                          {isBookmarked(job._id) ? (
                            <FaHeart className="text-red-500 hover:text-red-600" />
                          ) : (
                            <FaRegHeart className="text-gray-400 hover:text-red-500" />
                          )}
                        </button>
                      )}

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

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>👁️ {job.views} views</span>
                        <span>📝 {job.applicationsCount} applications</span>
                      </div>

                      <Link 
                        to={`/jobs/${job._id}`}
                        className="btn btn-primary w-full text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setPagination({ ...pagination, currentPage: page });
                          fetchJobs();
                        }}
                        className={`px-4 py-2 rounded ${
                          page === pagination.currentPage
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
