# Quick Start Commands

## Installation (First Time Only)

### Option 1: Install all at once
```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\jobs"
npm install
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### Option 2: Or install from root (if you have concurrently)
```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\jobs"
npm run install-all
```

## Setup MongoDB

### Option A: Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Keep the default URI in backend\.env: `mongodb://localhost:27017/job-portal`

### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster
3. Get your connection string
4. Update backend\.env:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/job-portal
   ```

## Running the Application

### Start Both Servers (Recommended)
```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\jobs"
npm run dev
```

### Or Start Separately

#### Terminal 1 - Backend
```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\jobs\backend"
npm run dev
```

#### Terminal 2 - Frontend
```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\jobs\frontend"
npm run dev
```

## Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Quick Test

1. Open browser to http://localhost:5173
2. Click "Sign Up"
3. Create a recruiter account
4. Post a job
5. Logout
6. Sign up as candidate
7. Browse jobs and apply

## Stopping the Application

Press `Ctrl + C` in each terminal window

## Troubleshooting

### "Cannot find module"
```powershell
cd backend
npm install
cd ../frontend
npm install
```

### "Port already in use"
- Close any running servers
- Or change port in backend\.env (PORT=5001)

### "MongoDB connection error"
- Check if MongoDB is running
- Verify MONGO_URI in backend\.env
- For Atlas: Check IP whitelist and credentials

### "CORS error"
- Verify FRONTEND_URL in backend\.env is http://localhost:5173
- Check backend is running on port 5000

## Default Test Accounts (Create These)

### Recruiter Account
- Email: recruiter@test.com
- Password: Test@123
- Role: Recruiter
- Company: Tech Corp

### Candidate Account
- Email: candidate@test.com
- Password: Test@123
- Role: Candidate

## File Structure Quick Reference

```
jobs/
├── backend/          # Express API server
├── frontend/         # React Vite application
├── README.md         # Project overview
├── SETUP.md          # Detailed setup guide
└── PROJECT_COMPLETE.md  # Feature documentation
```

## Need Help?

1. Check PROJECT_COMPLETE.md for full documentation
2. Check SETUP.md for detailed setup instructions
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify all environment variables in backend\.env

## Ready to Code?

Everything is set up and ready to go! 🚀

Start the servers and begin testing your job portal!
