import { Link } from 'react-router-dom';
import { FaBriefcase, FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaBriefcase className="text-2xl text-primary-500" />
              <span className="text-xl font-bold text-white">JobPortal</span>
            </div>
            <p className="text-sm">
              Connecting talented professionals with amazing opportunities. 
              Your dream job is just a click away.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="hover:text-primary-500 transition">Browse Jobs</Link></li>
              <li><Link to="/register" className="hover:text-primary-500 transition">Sign Up</Link></li>
              <li><Link to="/login" className="hover:text-primary-500 transition">Login</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li><Link to="/register" className="hover:text-primary-500 transition">Post a Job</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-primary-500 transition">Dashboard</Link></li>
              <li><a href="#" className="hover:text-primary-500 transition">Pricing</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-primary-500 transition">
                <FaTwitter />
              </a>
              <a href="#" className="text-2xl hover:text-primary-500 transition">
                <FaLinkedin />
              </a>
              <a href="#" className="text-2xl hover:text-primary-500 transition">
                <FaGithub />
              </a>
              <a href="#" className="text-2xl hover:text-primary-500 transition">
                <FaEnvelope />
              </a>
            </div>
            <p className="mt-4 text-sm">
              <a href="mailto:contact@jobportal.com" className="hover:text-primary-500 transition">
                contact@jobportal.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
