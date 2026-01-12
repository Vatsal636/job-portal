import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { BASE_URL } from '../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaSave, FaTimes, FaUpload, FaFilePdf, FaImage } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser, isRecruiter, isCandidate } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    // Candidate fields
    skills: '',
    experience: '',
    education: '',
    // Recruiter fields
    company: '',
    companyDescription: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills?.join(', ') || '',
        experience: user.experience || '',
        education: user.education || '',
        company: user.company || '',
        companyDescription: user.companyDescription || '',
        website: user.website || ''
      });
      // Set avatar preview if exists
      if (user.avatar) {
        setAvatarPreview(user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Resume size should be less than 10MB');
        return;
      }
      setResumeFile(file);
      toast.success('Resume selected: ' + file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('bio', formData.bio);

      // Append avatar file if selected
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      if (isCandidate) {
        const skills = formData.skills.split(',').map(s => s.trim()).filter(s => s);
        formDataToSend.append('skills', JSON.stringify(skills));
        formDataToSend.append('experience', formData.experience);
        formDataToSend.append('education', formData.education);
        
        // Append resume file if selected
        if (resumeFile) {
          formDataToSend.append('resume', resumeFile);
        }
      }

      if (isRecruiter) {
        formDataToSend.append('company', formData.company);
        formDataToSend.append('companyDescription', formData.companyDescription);
        formDataToSend.append('website', formData.website);
      }

      const { data } = await api.put('/users/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      updateUser(data.user);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setAvatarFile(null);
      setResumeFile(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account information</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="card">
          {/* Profile Picture */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="relative">
              <img
                src={avatarPreview || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
                  title="Upload avatar"
                >
                  <FaImage className="w-4 h-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <p className="text-sm text-gray-600 mb-2">
                {avatarFile ? `Selected: ${avatarFile.name}` : 'Upload a profile picture (Max 5MB)'}
              </p>
              {isEditing && (
                <label htmlFor="avatar-upload-btn" className="btn btn-secondary inline-flex items-center gap-2 cursor-pointer">
                  <FaUpload /> Choose Image
                  <input
                    id="avatar-upload-btn"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="input bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows="4"
                className="input"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Candidate Specific Fields */}
          {isCandidate && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input"
                    placeholder="JavaScript, React, Node.js"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume (PDF)
                  </label>
                  {user.resume && !resumeFile && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaFilePdf className="text-red-600 text-xl" />
                        <span className="text-sm text-gray-700">Current Resume</span>
                      </div>
                      <a
                        href={user.resume.startsWith('http') ? user.resume : `${BASE_URL}${user.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </a>
                    </div>
                  )}
                  {resumeFile && (
                    <div className="mb-3 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                      <FaFilePdf className="text-green-600 text-xl" />
                      <span className="text-sm text-gray-700">New: {resumeFile.name}</span>
                    </div>
                  )}
                  {isEditing && (
                    <label className="btn btn-secondary inline-flex items-center gap-2 cursor-pointer">
                      <FaUpload /> {resumeFile ? 'Change Resume' : 'Upload Resume'}
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleResumeChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Upload your resume in PDF format (Max 10MB)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="4"
                    className="input"
                    placeholder="Describe your work experience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="4"
                    className="input"
                    placeholder="Describe your education background..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recruiter Specific Fields */}
          {isRecruiter && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Company Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input"
                    placeholder="https://company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                  </label>
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="4"
                    className="input"
                    placeholder="Describe your company..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex items-center gap-2"
              >
                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setAvatarFile(null);
                  setResumeFile(null);
                  // Reset form to original values
                  if (user) {
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      phone: user.phone || '',
                      location: user.location || '',
                      bio: user.bio || '',
                      skills: user.skills?.join(', ') || '',
                      experience: user.experience || '',
                      education: user.education || '',
                      company: user.company || '',
                      companyDescription: user.companyDescription || '',
                      website: user.website || ''
                    });
                    if (user.avatar) {
                      setAvatarPreview(user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`);
                    }
                  }
                }}
                className="btn btn-secondary flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
