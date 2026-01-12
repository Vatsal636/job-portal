# Job Portal - Application Flow & Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│                  (React + TailwindCSS)                      │
│                   Port: 5173 (Vite)                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ Axios Requests
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    REST API SERVER                          │
│                 (Node.js + Express)                         │
│                     Port: 5000                              │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Auth Routes  │  │  Job Routes  │  │ User Routes  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ App Routes   │  │ Notif Routes │                       │
│  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                            │
│                    (MongoDB)                                │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │   User   │ │   Job    │ │   App    │ │  Notif   │     │
│  │Collection│ │Collection│ │Collection│ │Collection│     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 User Flow Diagrams

### Registration & Login Flow

```
START
  │
  ├─► Visit Home Page (/)
  │     │
  │     ├─► Click "Sign Up"
  │     │     │
  │     │     ├─► Select Role (Recruiter/Candidate)
  │     │     │     │
  │     │     │     ├─► Fill Registration Form
  │     │     │     │     │
  │     │     │     │     ├─► Submit → API: POST /api/auth/register
  │     │     │     │     │                    │
  │     │     │     │     │                    ├─► Hash Password
  │     │     │     │     │                    ├─► Save to DB
  │     │     │     │     │                    └─► Generate JWT Token
  │     │     │     │     │
  │     │     │     │     └─► Redirect to Dashboard
  │     │     │     │           │
  │     │     │     │           ├─► Recruiter → /recruiter/dashboard
  │     │     │     │           └─► Candidate → /candidate/dashboard
  │     │     │     │
  │     │     │     └─► Already have account? → Login
  │     │     │
  │     │     └─► Click "Login"
  │     │           │
  │     │           ├─► Enter Credentials
  │     │           │     │
  │     │           │     └─► API: POST /api/auth/login
  │     │           │              │
  │     │           │              ├─► Verify Password
  │     │           │              └─► Return JWT Token
  │     │           │
  │     │           └─► Store Token → Redirect to Dashboard
  │     │
  │     └─► Browse as Guest → /jobs (no auth needed)
  │
END
```

### Recruiter Workflow

```
Recruiter Dashboard
  │
  ├─► View Stats
  │   ├─► Total Jobs
  │   ├─► Active Jobs
  │   ├─► Total Applications
  │   └─► Pending Applications
  │
  ├─► Post New Job (/recruiter/post-job)
  │   ├─► Fill Job Form
  │   │   ├─► Title, Company, Description
  │   │   ├─► Location, Type, Level
  │   │   ├─► Skills, Salary
  │   │   └─► Requirements
  │   │
  │   └─► Submit → API: POST /api/jobs
  │                      │
  │                      ├─► Save to DB
  │                      └─► Success → Redirect to Manage Jobs
  │
  ├─► Manage Jobs (/recruiter/manage-jobs)
  │   ├─► View All Jobs
  │   ├─► Edit Job → /recruiter/edit-job/:id
  │   │                │
  │   │                └─► Update → API: PUT /api/jobs/:id
  │   │
  │   ├─► Delete Job → API: DELETE /api/jobs/:id
  │   │
  │   └─► View Applications for Job
  │
  └─► View Applications (/recruiter/applications)
      ├─► Filter by Job
      ├─► Filter by Status
      ├─► View Candidate Details
      │   ├─► Name, Email, Phone
      │   ├─► Skills, Experience
      │   ├─► Resume Link
      │   └─► Cover Letter
      │
      └─► Update Application Status
          ├─► Reviewed
          ├─► Shortlisted
          ├─► Interview
          ├─► Accepted
          └─► Rejected
              │
              └─► API: PUT /api/applications/:id/status
                       │
                       ├─► Update Status
                       ├─► Add to History
                       ├─► Send Notification to Candidate
                       └─► Success
```

### Candidate Workflow

```
Candidate Dashboard
  │
  ├─► View Stats
  │   ├─► Total Applications
  │   ├─► Pending
  │   ├─► Shortlisted
  │   ├─► Accepted
  │   └─► Saved Jobs
  │
  ├─► Browse Jobs (/jobs)
  │   ├─► Search by Keyword
  │   ├─► Filter by Location
  │   ├─► Filter by Type
  │   ├─► Filter by Experience
  │   ├─► Filter by Category
  │   │
  │   ├─► View Job Details (/jobs/:id)
  │   │   ├─► Read Description
  │   │   ├─► View Requirements
  │   │   ├─► Check Salary
  │   │   │
  │   │   ├─► Bookmark Job
  │   │   │   └─► API: POST /users/bookmark/:jobId
  │   │   │
  │   │   └─► Apply Now
  │   │       ├─► Enter Resume Link
  │   │       ├─► Write Cover Letter
  │   │       └─► Submit → API: POST /api/applications
  │   │                          │
  │   │                          ├─► Save Application
  │   │                          ├─► Update Job Count
  │   │                          ├─► Notify Recruiter
  │   │                          └─► Redirect to Applications
  │   │
  │   └─► Continue Browsing
  │
  ├─► My Applications (/candidate/applications)
  │   ├─► View All Applications
  │   ├─► Filter by Status
  │   ├─► Track Status History
  │   │   ├─► Pending → Reviewed
  │   │   ├─► Reviewed → Shortlisted
  │   │   ├─► Shortlisted → Interview
  │   │   └─► Interview → Accepted/Rejected
  │   │
  │   └─► Withdraw Application (if pending)
  │       └─► API: DELETE /api/applications/:id
  │
  ├─► Saved Jobs (/candidate/bookmarks)
  │   ├─► View Bookmarked Jobs
  │   ├─► Remove Bookmark
  │   └─► Apply to Saved Job
  │
  └─► Manage Profile (/profile)
      ├─► Edit Personal Info
      ├─► Add Skills
      ├─► Add Resume Link
      ├─► Add Experience
      ├─► Add Education
      └─► Save → API: PUT /api/users/profile
```

## 🔔 Notification Flow

```
Trigger Event
  │
  ├─► New Application Submitted
  │   ├─► Create Notification
  │   │   ├─► Recipient: Recruiter
  │   │   ├─► Type: application
  │   │   ├─► Message: "Candidate applied"
  │   │   └─► Link: /recruiter/applications/:id
  │   │
  │   └─► Save to DB → Notify in UI (Badge Count)
  │
  ├─► Application Status Updated
  │   ├─► Create Notification
  │   │   ├─► Recipient: Candidate
  │   │   ├─► Type: status_update
  │   │   ├─► Message: "Status changed to X"
  │   │   └─► Link: /candidate/applications/:id
  │   │
  │   └─► Save to DB → Notify in UI
  │
  └─► User Registration
      ├─► Create Notification
      │   ├─► Recipient: New User
      │   ├─► Type: system
      │   ├─► Message: "Welcome!"
      │   └─► No Link
      │
      └─► Save to DB
```

## 🔐 Authentication & Authorization Flow

```
User Request
  │
  ├─► Include JWT Token in Header
  │   Authorization: Bearer <token>
  │
  ├─► Backend Middleware (auth.js)
  │   │
  │   ├─► Verify Token
  │   │   ├─► Valid → Continue
  │   │   └─► Invalid → 401 Unauthorized
  │   │
  │   └─► Check User Role
  │       ├─► Matches Required Role → Continue
  │       └─► Doesn't Match → 403 Forbidden
  │
  └─► Execute Controller Function
      ├─► Access req.user
      └─► Perform Operation
```

## 📊 Data Relationships

```
User (Recruiter)
  │
  ├──► has many Jobs
  │         │
  │         └──► has many Applications
  │                   │
  │                   └──► belongs to Candidate
  │
  └──► has many Notifications

User (Candidate)
  │
  ├──► has many Applications
  │         │
  │         └──► belongs to Job
  │
  ├──► has many Bookmarked Jobs
  │
  └──► has many Notifications
```

## 🎯 API Endpoint Overview

```
Authentication
├─► POST   /api/auth/register    - Register new user
├─► POST   /api/auth/login       - Login user
└─► GET    /api/auth/me          - Get current user [Protected]

Jobs
├─► GET    /api/jobs             - Get all jobs [Public]
├─► POST   /api/jobs             - Create job [Recruiter]
├─► GET    /api/jobs/:id         - Get job details [Public]
├─► PUT    /api/jobs/:id         - Update job [Recruiter, Owner]
├─► DELETE /api/jobs/:id         - Delete job [Recruiter, Owner]
└─► GET    /api/jobs/recruiter/my-jobs - Get recruiter's jobs [Recruiter]

Applications
├─► POST   /api/applications     - Apply to job [Candidate]
├─► GET    /api/applications/my-applications - Get candidate apps [Candidate]
├─► GET    /api/applications/recruiter/applications - Get recruiter apps [Recruiter]
├─► GET    /api/applications/:id - Get application [Protected, Owner/Recruiter]
├─► PUT    /api/applications/:id/status - Update status [Recruiter]
└─► DELETE /api/applications/:id - Delete application [Candidate, Owner]

Notifications
├─► GET    /api/notifications    - Get notifications [Protected]
├─► GET    /api/notifications/unread-count - Get unread count [Protected]
├─► PUT    /api/notifications/:id/read - Mark as read [Protected]
├─► PUT    /api/notifications/read-all - Mark all read [Protected]
└─► DELETE /api/notifications/:id - Delete notification [Protected]

Users
├─► GET    /api/users/profile    - Get profile [Protected]
├─► PUT    /api/users/profile    - Update profile [Protected]
├─► GET    /api/users/dashboard/stats - Get stats [Protected]
├─► POST   /api/users/bookmark/:jobId - Toggle bookmark [Candidate]
└─► GET    /api/users/bookmarks  - Get bookmarked jobs [Candidate]
```

## 🚀 Deployment Flow

```
Development
  │
  ├─► Frontend (localhost:5173)
  │   └─► Vite Dev Server
  │
  └─► Backend (localhost:5000)
      └─► Nodemon Auto-restart

Production
  │
  ├─► Frontend
  │   ├─► Build: npm run build
  │   ├─► Output: dist/
  │   └─► Deploy to Vercel/Netlify
  │
  └─► Backend
      ├─► Set NODE_ENV=production
      ├─► Use MongoDB Atlas
      └─► Deploy to Heroku/Railway
```

This completes the comprehensive overview of your job portal application!
