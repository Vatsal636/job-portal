import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import PostJob from './pages/recruiter/PostJob';
import ManageJobs from './pages/recruiter/ManageJobs';
import ViewApplications from './pages/recruiter/ViewApplications';
import EditJob from './pages/recruiter/EditJob';

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard';
import MyApplications from './pages/candidate/MyApplications';
import BookmarkedJobs from './pages/candidate/BookmarkedJobs';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/post-job" element={
            <ProtectedRoute role="recruiter">
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/manage-jobs" element={
            <ProtectedRoute role="recruiter">
              <ManageJobs />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/applications" element={
            <ProtectedRoute role="recruiter">
              <ViewApplications />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/edit-job/:id" element={
            <ProtectedRoute role="recruiter">
              <EditJob />
            </ProtectedRoute>
          } />

          {/* Candidate Routes */}
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute role="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          } />
          <Route path="/candidate/applications" element={
            <ProtectedRoute role="candidate">
              <MyApplications />
            </ProtectedRoute>
          } />
          <Route path="/candidate/bookmarks" element={
            <ProtectedRoute role="candidate">
              <BookmarkedJobs />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
