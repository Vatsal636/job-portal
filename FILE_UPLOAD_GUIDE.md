# File Upload Feature - Profile Picture & Resume

## Overview
Updated the job portal to support actual file uploads for profile pictures and resumes instead of URL links.

## Changes Made

### Backend Changes

#### 1. New Upload Middleware (`backend/middleware/upload.js`)
- Created multer configuration for handling file uploads
- Separate handlers for avatar images and resume PDFs
- File validation:
  - **Avatar**: Images only (jpeg, jpg, png, gif, webp), max 5MB
  - **Resume**: PDF only, max 10MB
- Files stored in:
  - `backend/uploads/avatars/` - Profile pictures
  - `backend/uploads/resumes/` - Resume PDFs
- Files automatically named with timestamp to prevent conflicts

#### 2. Updated User Controller (`backend/controllers/userController.js`)
- Modified `updateProfile` function to handle file uploads
- Processes `req.files` from multer middleware
- Saves file paths to database:
  - Avatar: `/uploads/avatars/filename.jpg`
  - Resume: `/uploads/resumes/filename.pdf`

#### 3. Updated User Routes (`backend/routes/userRoutes.js`)
- Added `uploadProfile` middleware to profile update route
- Handles both avatar and resume in single request

#### 4. Updated Server Configuration (`backend/server.js`)
- Added static file serving: `app.use('/uploads', express.static(...))`
- Allows uploaded files to be accessed via URL

### Frontend Changes

#### 1. Profile Page (`frontend/src/pages/Profile.jsx`)
- **New State Variables**:
  - `avatarFile` - Selected avatar file
  - `resumeFile` - Selected resume PDF
  - `avatarPreview` - Preview URL for avatar
  
- **New Functions**:
  - `handleAvatarChange()` - Validates and previews image
  - `handleResumeChange()` - Validates PDF file
  
- **Updated Upload Process**:
  - Uses FormData instead of JSON for file uploads
  - Appends files with `formData.append('avatar', file)`
  - Sets `Content-Type: multipart/form-data` header

- **UI Changes**:
  - Avatar: Image preview with upload button overlay
  - Resume: Shows current resume with "View" link, upload button to change
  - File validation messages (size, type)
  - Visual feedback for selected files

#### 2. API Utility (`frontend/src/utils/api.js`)
- Added `BASE_URL` constant for file URL construction
- Exported for use in components displaying uploaded files

#### 3. Navbar Component (`frontend/src/components/layout/Navbar.jsx`)
- Updated avatar display to use uploaded file path
- Handles both external URLs and uploaded files

#### 4. View Applications (`frontend/src/pages/recruiter/ViewApplications.jsx`)
- Updated resume download link to handle uploaded files
- Supports both legacy URL links and new uploaded files

## File Structure

```
backend/
├── middleware/
│   └── upload.js           # New: Multer configuration
├── uploads/                # New: Created automatically
│   ├── avatars/            # Profile pictures
│   └── resumes/            # Resume PDFs
└── controllers/
    └── userController.js   # Updated: File upload handling

frontend/
└── src/
    ├── pages/
    │   ├── Profile.jsx     # Updated: File upload UI
    │   └── recruiter/
    │       └── ViewApplications.jsx  # Updated: Resume display
    ├── components/
    │   └── layout/
    │       └── Navbar.jsx  # Updated: Avatar display
    └── utils/
        └── api.js          # Updated: Added BASE_URL
```

## Usage

### For Users

#### Uploading Profile Picture:
1. Go to Profile page
2. Click "Edit Profile"
3. Click camera icon on avatar or "Choose Image" button
4. Select image file (jpg, png, gif, webp - max 5MB)
5. Preview appears immediately
6. Click "Save Changes"

#### Uploading Resume:
1. Go to Profile page (must be candidate)
2. Click "Edit Profile"
3. Scroll to "Resume (PDF)" section
4. Click "Upload Resume" button
5. Select PDF file (max 10MB)
6. Click "Save Changes"

#### Viewing Uploaded Files:
- **Avatar**: Automatically displayed in navbar and profile
- **Resume**: Click "View" link to open in new tab
- **For Recruiters**: Resume link available in application details

### For Developers

#### File Upload Request:
```javascript
const formData = new FormData();
formData.append('avatar', avatarFile);
formData.append('resume', resumeFile);
formData.append('name', 'John Doe');

await api.put('/users/profile', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

#### Displaying Uploaded Files:
```javascript
import { BASE_URL } from '../utils/api';

// For avatars and resumes
const fileUrl = user.avatar.startsWith('http') 
  ? user.avatar 
  : `${BASE_URL}${user.avatar}`;
```

## File Validation

### Client-Side (Frontend):
- **Avatar**: Checks `file.type.startsWith('image/')`
- **Resume**: Checks `file.type === 'application/pdf'`
- Size limits enforced before upload

### Server-Side (Backend):
- Multer filters by file extension and MIME type
- File size limits enforced by multer
- Invalid files rejected with error message

## Security Considerations

1. **File Type Validation**: Double-checked on client and server
2. **File Size Limits**: Prevents large file uploads
3. **Unique Filenames**: Timestamp-based naming prevents conflicts
4. **Static File Serving**: Only `/uploads` directory exposed
5. **Authentication**: Profile update requires valid JWT token

## Backward Compatibility

The system supports both methods:
- ✅ New uploaded files (stored in `/uploads/`)
- ✅ Legacy URL links (external URLs still work)

Detection logic: `file.startsWith('http')` checks if external URL

## Error Handling

### Client-Side Errors:
- Invalid file type → Toast notification
- File too large → Toast notification
- Upload failure → Toast notification

### Server-Side Errors:
- Multer validation errors
- File system errors
- Database update errors

## Testing Checklist

- [ ] Upload profile picture (jpg, png, gif)
- [ ] Upload resume PDF
- [ ] File size validation (>5MB avatar, >10MB resume)
- [ ] Invalid file type (try uploading .docx as resume)
- [ ] View uploaded avatar in navbar
- [ ] View uploaded resume (click "View" link)
- [ ] Recruiter can download candidate resume
- [ ] Cancel upload (should reset to previous image)
- [ ] Edit profile multiple times
- [ ] Logout and login (files persist)

## Future Enhancements

1. **Cloud Storage**: Integrate AWS S3 or Cloudinary for production
2. **Image Optimization**: Auto-resize/compress uploaded images
3. **File Deletion**: Clean up old files when new ones uploaded
4. **Multiple Resumes**: Allow candidates to upload multiple versions
5. **Progress Bar**: Show upload progress for large files
6. **Drag & Drop**: Drag and drop file upload interface
7. **Image Cropping**: Allow users to crop/adjust profile pictures

## Troubleshooting

### Upload fails:
1. Check backend `uploads/` folder exists
2. Verify file permissions
3. Check multer dependency installed: `npm install multer`
4. Verify server is serving static files correctly

### Files not displaying:
1. Check `BASE_URL` matches backend server URL
2. Verify file path in database starts with `/uploads/`
3. Check CORS configuration allows file access
4. Verify browser can access `http://localhost:5000/uploads/`

### File validation errors:
1. Check file type matches allowed types
2. Verify file size is within limits
3. Check for corrupted files
4. Try different browser if issues persist

## Production Deployment

When deploying to production:

1. **Update BASE_URL**:
   ```javascript
   export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```

2. **Use Cloud Storage** (Recommended):
   - Configure Cloudinary or AWS S3
   - Update multer to use cloud storage
   - Remove local file storage

3. **Secure File Access**:
   - Implement authenticated file access
   - Use signed URLs for sensitive files
   - Add rate limiting for uploads

4. **File Cleanup**:
   - Implement cron job to delete orphaned files
   - Clean up old files when user uploads new ones

5. **Environment Variables**:
   ```env
   UPLOAD_DIR=./uploads
   MAX_AVATAR_SIZE=5242880
   MAX_RESUME_SIZE=10485760
   ```
