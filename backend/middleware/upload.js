const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
const avatarDir = path.join(uploadDir, 'avatars');
const resumeDir = path.join(uploadDir, 'resumes');

[uploadDir, avatarDir, resumeDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'avatar') {
      cb(null, avatarDir);
    } else if (file.fieldname === 'resume') {
      cb(null, resumeDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for avatar (images only)
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for avatar!'));
  }
};

// File filter for resume (PDFs only)
const pdfFilter = (req, file, cb) => {
  const allowedTypes = /pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for resume!'));
  }
};

// Upload configurations
const uploadAvatar = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for images
  }
}).single('avatar');

const uploadResume = multer({
  storage: storage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for PDFs
  }
}).single('resume');

// Combined upload for profile (both avatar and resume)
const uploadProfile = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      imageFilter(req, file, cb);
    } else if (file.fieldname === 'resume') {
      pdfFilter(req, file, cb);
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]);

module.exports = {
  uploadAvatar,
  uploadResume,
  uploadProfile
};
