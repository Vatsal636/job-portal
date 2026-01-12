import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBriefcase, FaBell, FaUser, FaSignOutAlt, FaHeart, FaFileAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api, { BASE_URL } from '../../utils/api';

const Navbar = () => {
  const { user, logout, isAuthenticated, isRecruiter, isCandidate } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications/unread-count');
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaBriefcase className="text-3xl text-primary-600" />
            <span className="text-2xl font-bold text-gray-800">JobPortal</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Browse Jobs
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to={isRecruiter ? '/recruiter/dashboard' : '/candidate/dashboard'} 
                  className="text-gray-700 hover:text-primary-600 font-medium transition"
                >
                  Dashboard
                </Link>

                {isCandidate && (
                  <>
                    <Link to="/candidate/applications" className="text-gray-700 hover:text-primary-600 font-medium transition">
                      My Applications
                    </Link>
                    <Link to="/candidate/bookmarks" className="text-gray-700 hover:text-primary-600 font-medium transition">
                      <FaHeart className="inline mr-1" />
                      Saved
                    </Link>
                  </>
                )}

                {isRecruiter && (
                  <>
                    <Link to="/recruiter/manage-jobs" className="text-gray-700 hover:text-primary-600 font-medium transition">
                      My Jobs
                    </Link>
                    <Link to="/recruiter/post-job" className="btn btn-primary">
                      Post Job
                    </Link>
                  </>
                )}

                <Link to="/notifications" className="relative text-gray-700 hover:text-primary-600 transition">
                  <FaBell className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition">
                    <img 
                      src={user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`) : 'https://via.placeholder.com/40'} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{user?.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <FaUser className="inline mr-2" />
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
