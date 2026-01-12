import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBriefcase, FaUsers, FaRocket, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated, isRecruiter, isCandidate } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with top employers and discover opportunities that match your skills and aspirations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg">
                    Get Started
                  </Link>
                  <Link to="/jobs" className="btn bg-primary-700 hover:bg-primary-800 px-8 py-4 text-lg">
                    Browse Jobs
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/jobs" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg">
                    Browse Jobs
                  </Link>
                  <Link 
                    to={isRecruiter ? '/recruiter/dashboard' : '/candidate/dashboard'}
                    className="btn bg-primary-700 hover:bg-primary-800 px-8 py-4 text-lg"
                  >
                    Go to Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose JobPortal?</h2>
            <p className="text-xl text-gray-600">Everything you need to find or hire the perfect fit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center hover:shadow-xl transition">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBriefcase className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thousands of Jobs</h3>
              <p className="text-gray-600">
                Access a wide variety of job opportunities across multiple industries
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Top Employers</h3>
              <p className="text-gray-600">
                Connect with leading companies actively seeking talented professionals
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Apply</h3>
              <p className="text-gray-600">
                Apply to multiple jobs with just one click using your profile
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-3xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track Applications</h3>
              <p className="text-gray-600">
                Stay updated with real-time notifications on your application status
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and complete your profile with your skills, experience, and preferences
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Search & Apply</h3>
              <p className="text-gray-600">
                Browse thousands of jobs and apply to positions that match your qualifications
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get Hired</h3>
              <p className="text-gray-600">
                Connect with employers, attend interviews, and land your dream job
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of professionals who have found their dream jobs
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
