# Job Portal - Setup Guide

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

1. **Install all dependencies**
   ```bash
   cd "c:\Users\LENOVO\OneDrive\Desktop\jobs"
   npm install
   cd backend
   npm install
   cd ../frontend
   npm install
   cd ..
   ```

2. **Setup MongoDB**
   - Install MongoDB locally, OR
   - Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Get your connection string

3. **Configure Backend**
   - Open `backend\.env` file
   - Update `MONGO_URI` with your MongoDB connection string
   - Update `JWT_SECRET` with a secure random string

4. **Start the Application**
   
   **Option 1: Start both servers together (Recommended)**
   ```bash
   npm run dev
   ```

   **Option 2: Start servers separately**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Usage

### Register as a Candidate
1. Click "Sign Up" in the navigation
2. Fill in your details
3. Select "Candidate" as your role
4. Complete registration
5. You'll be redirected to the Candidate Dashboard

### Register as a Recruiter
1. Click "Sign Up" in the navigation
2. Fill in your details and company name
3. Select "Recruiter" as your role
4. Complete registration
5. You'll be redirected to the Recruiter Dashboard

### As a Candidate:
- Browse all available jobs
- Apply to jobs with cover letter
- Track application status
- Save/bookmark favorite jobs
- Manage profile and resume
- Receive notifications on application updates

### As a Recruiter:
- Post new job listings
- View and manage all your jobs
- Review applications
- Update application status (reviewed, shortlisted, interview, accepted, rejected)
- View dashboard analytics
- Receive notifications when candidates apply

## Features

✅ Role-based authentication (Candidate/Recruiter)
✅ Job search with filters (location, type, experience, category)
✅ Job application system with resume and cover letter
✅ Application status tracking
✅ Real-time notifications
✅ Job bookmarking (for candidates)
✅ Dashboard with analytics
✅ Profile management
✅ Responsive UI with TailwindCSS

## Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- TailwindCSS for styling
- React Icons
- React Toastify for notifications

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- CORS enabled

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Jobs
- GET `/api/jobs` - Get all jobs (with filters)
- GET `/api/jobs/:id` - Get job details
- POST `/api/jobs` - Create job (Recruiter)
- PUT `/api/jobs/:id` - Update job (Recruiter)
- DELETE `/api/jobs/:id` - Delete job (Recruiter)

### Applications
- POST `/api/applications` - Apply to job (Candidate)
- GET `/api/applications/my-applications` - Get candidate applications
- GET `/api/applications/recruiter/applications` - Get recruiter applications
- PUT `/api/applications/:id/status` - Update application status (Recruiter)

### Notifications
- GET `/api/notifications` - Get user notifications
- PUT `/api/notifications/:id/read` - Mark as read
- PUT `/api/notifications/read-all` - Mark all as read

### Users
- GET `/api/users/profile` - Get profile
- PUT `/api/users/profile` - Update profile
- GET `/api/users/dashboard/stats` - Get dashboard stats
- POST `/api/users/bookmark/:jobId` - Toggle bookmark

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally, or
- Check your Atlas connection string
- Verify firewall/network settings

### Port Already in Use
- Change port in `backend/.env` (PORT=5001)
- Change port in `frontend/vite.config.js` (server.port)

### CORS Errors
- Verify `FRONTEND_URL` in `backend/.env`
- Check CORS configuration in `backend/server.js`

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in .env
2. Use a secure `JWT_SECRET`
3. Use MongoDB Atlas for database
4. Deploy to Heroku, Railway, or DigitalOcean

### Frontend
1. Update API URLs in `frontend/src/utils/api.js`
2. Build: `cd frontend && npm run build`
3. Deploy to Vercel, Netlify, or serve with Nginx

## License
MIT

## Support
For issues or questions, please create an issue in the repository.
