# Job Portal Website

A modern full-stack job portal with role-based access for Recruiters and Candidates.

## Features

### For Recruiters
- 📊 Dashboard with analytics and statistics
- 📝 Post and manage job listings
- 👥 View and manage job applications
- 🔔 Real-time notifications
- 📈 Track application metrics

### For Candidates
- 🔍 Browse and search all job listings
- 📄 Apply to jobs with resume
- 📊 Track application status
- 🔖 Bookmark favorite jobs
- 🔔 Receive application updates
- 👤 Manage profile and resume

### Common Features
- 🔐 Secure authentication with JWT
- 🎨 Modern, responsive UI with TailwindCSS
- 🔔 Real-time notification system
- 🔍 Advanced job search and filtering
- 📱 Mobile-friendly design

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- React Router for navigation
- Axios for API calls
- React Icons for icons
- Context API for state management

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Express Validator for validation
- Multer for file uploads

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm run install-all
```

3. Create `.env` file in the backend folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the development servers:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`
The backend will run on `http://localhost:5000`

## Project Structure

```
job-portal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   └── index.html
└── package.json
```

## Default Users

You can register new users or use test credentials after seeding the database.

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Jobs
- GET `/api/jobs` - Get all jobs
- POST `/api/jobs` - Create job (Recruiter only)
- GET `/api/jobs/:id` - Get job details
- PUT `/api/jobs/:id` - Update job (Recruiter only)
- DELETE `/api/jobs/:id` - Delete job (Recruiter only)

### Applications
- POST `/api/applications` - Apply to job (Candidate only)
- GET `/api/applications` - Get user applications
- PUT `/api/applications/:id` - Update application status (Recruiter only)

### Notifications
- GET `/api/notifications` - Get user notifications
- PUT `/api/notifications/:id/read` - Mark notification as read

## License

MIT
