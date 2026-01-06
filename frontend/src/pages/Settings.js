import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { AuthContext } from '../App';
import DashboardLayout from '../layouts/DashboardLayout';
import { API_ENDPOINTS } from '../config/api';

export default function Settings() {
  const { setToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name: 'Elliot Appiah', jobTitle: 'Full stack dev', avatar: null });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({ resume: null, coverLetter: null });
  const [uploadState, setUploadState] = useState({ resume: 'idle', coverletter: 'idle' }); // 'idle', 'uploading', 'success'
  const [selectedFiles, setSelectedFiles] = useState({ resume: null, coverletter: null });
  const [emailConfig, setEmailConfig] = useState({ emailUser: '', emailPass: '' });
  const [emailConnecting, setEmailConnecting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const token = localStorage.getItem('token');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'solar:user-id-bold' },
    { id: 'resume', label: 'Resume & Assets', icon: 'solar:file-text-bold' },
    { id: 'smtp', label: 'Email Integration', icon: 'solar:mailbox-bold' },
    { id: 'billing', label: 'Billing', icon: 'solar:card-bold' },
  ];

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(API_ENDPOINTS.USER_PROFILE, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({
          name: res.data.name || 'Elliot Appiah',
          jobTitle: res.data.jobTitle || 'Full stack dev',
          avatar: res.data.avatar || null
        });
        if (res.data.avatar) {
          setAvatarPreview(res.data.avatar);
        }
        // Set uploaded files if available
        if (res.data.documents) {
          setUploadedFiles({
            resume: res.data.documents.resume || null,
            coverLetter: res.data.documents.coverLetter || null
          });
          console.log('[Settings] Loaded uploaded files:', res.data.documents);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    
    // Listen for file uploads to refresh
    const handleFileUploaded = () => {
      fetchProfile();
    };
    window.addEventListener('fileUploaded', handleFileUploaded);
    window.addEventListener('profileUpdated', handleFileUploaded);
    
    return () => {
      window.removeEventListener('fileUploaded', handleFileUploaded);
      window.removeEventListener('profileUpdated', handleFileUploaded);
    };
  }, [token]);

  // Fetch email config when SMTP tab is active
  useEffect(() => {
    const fetchEmailConfig = async () => {
      if (activeTab === 'smtp' && token) {
        try {
          const res = await axios.get(API_ENDPOINTS.CONFIG, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setEmailConfig({
            emailUser: res.data.user || '',
            emailPass: res.data.pass || ''
          });
        } catch (err) {
          console.error('Failed to fetch email config:', err);
        }
      }
    };
    fetchEmailConfig();
  }, [activeTab, token]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleFileUpload = async (file, type) => {
    if (!file) {
      setError('Choose a file before uploading');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Maximum size is 10MB');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setUploadState(prev => ({ ...prev, [type]: 'uploading' }));
    setSaving(true);
    setError('');
    setSuccess('');
    
    if (!token) {
      // Mock upload for dev mode
      setUploadState(prev => ({ ...prev, [type]: 'success' }));
      setSuccess(`${type === 'resume' ? 'Resume' : 'Cover Letter'} uploaded successfully (DEV MODE - Mock)`);
      setTimeout(() => {
        setUploadState(prev => ({ ...prev, [type]: 'idle' }));
        setSuccess('');
      }, 3000);
      setSaving(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append(type === 'resume' ? 'resume' : 'coverLetter', file);
      
      // REAL UPLOAD - sending actual file to server
      console.log(`[UPLOAD] Starting upload: ${type}, File: ${file.name}, Size: ${file.size} bytes`);
      
      const endpoint = type === 'resume' ? API_ENDPOINTS.UPLOAD_CV : API_ENDPOINTS.UPLOAD_COVER_LETTER;
      const res = await axios.post(endpoint, formData, { 
        headers: { 
          Authorization: `Bearer ${token}`
          // Don't set Content-Type - let axios set it with boundary for multipart/form-data
        },
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`[UPLOAD] Progress: ${percentCompleted}%`);
          }
        }
      });
      
      console.log(`[UPLOAD] Response received:`, res.data);
      
      if (res.data.success || res.data.message) {
        // Show success animation
        setUploadState(prev => ({ ...prev, [type]: 'success' }));
        setSuccess(res.data.message || `${type === 'resume' ? 'Resume' : 'Cover Letter'} uploaded successfully!`);
        
        // STEP 1: IMMEDIATELY update uploaded files state - FORCE UPDATE
        const filePath = res.data.path;
        const fileKey = type === 'resume' ? 'resume' : 'coverLetter';
        
        console.log('[UPLOAD] Setting uploaded file:', fileKey, filePath);
        setUploadedFiles(prev => {
          const updated = {
            resume: prev?.resume || null,
            coverLetter: prev?.coverLetter || null,
            [fileKey]: filePath
          };
          console.log('[UPLOAD] Updated uploadedFiles state:', updated);
          return updated;
        });
        
        // STEP 2: Create activity and save to localStorage so DashboardHome can pick it up
        const activityName = type === 'resume' ? 'Resume Uploaded' : 'Cover Letter Uploaded';
        const activity = {
          jobTitle: activityName,
          title: activityName,
          company: 'Profile Update',
          status: 'Uploaded',
          date: new Date()
        };
        
        // Save activity to localStorage with timestamp
        try {
          const uploadEvent = {
            activity: activity,
            timestamp: Date.now()
          };
          localStorage.setItem('lastFileUpload', JSON.stringify(uploadEvent));
          console.log('[UPLOAD] Saved activity to localStorage:', uploadEvent);
        } catch (e) {
          console.error('Failed to save to localStorage:', e);
        }
        
        // STEP 3: Refresh profile from server (this also updates uploadedFiles)
        try {
          const profileRes = await axios.get('http://localhost:5001/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (profileRes.data && profileRes.data.documents) {
            setUploadedFiles({
              resume: profileRes.data.documents.resume || null,
              coverLetter: profileRes.data.documents.coverLetter || null
            });
            console.log('[UPLOAD] Updated from server profile:', profileRes.data.documents);
          }
        } catch (err) {
          console.error('[UPLOAD] Failed to refresh profile:', err);
        }
        
        // STEP 4: Dispatch simple events for DashboardHome
        window.dispatchEvent(new CustomEvent('fileUploaded', { detail: { activity } }));
        window.dispatchEvent(new Event('profileUpdated'));
        
        // Reset after 4 seconds and clear selected file
        setTimeout(() => {
          setUploadState(prev => ({ ...prev, [type]: 'idle' }));
          setSelectedFiles(prev => ({ ...prev, [type]: null }));
          setSuccess('');
        }, 4000);
      } else {
        setUploadState(prev => ({ ...prev, [type]: 'idle' }));
        setError('Upload completed but no confirmation received.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadState(prev => ({ ...prev, [type]: 'idle' }));
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error') || err.code === 'ERR_NETWORK') {
        setError("Cannot connect to server. Make sure the backend is running on port 5001.");
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Session expired. Please login again.");
      } else if (err.response?.data?.error || err.response?.data?.msg) {
        setError(err.response.data.error || err.response.data.msg || 'Upload failed');
      } else if (err.message && err.message.includes('Only PDF')) {
        setError('Only PDF files are allowed');
      } else {
        setError(`Upload failed: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !token) {
      setError('Please select an image file');
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const res = await axios.post(API_ENDPOINTS.UPLOAD_AVATAR, formData, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
        timeout: 30000
      });
      
      if (res.data.success || res.data.avatar) {
        const avatarUrl = res.data.avatar || res.data.path;
        setProfile(prev => ({ ...prev, avatar: avatarUrl }));
        setAvatarPreview(avatarUrl);
        setAvatarFile(null);
        setSuccess('Avatar updated successfully!');
        
        // Update localStorage
        try {
          const savedProfiles = JSON.parse(localStorage.getItem('savedProfiles') || '{}');
          savedProfiles[token] = { ...profile, avatar: avatarUrl };
          localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles));
          window.dispatchEvent(new Event('profileUpdated'));
        } catch (e) {
          console.error('Failed to save avatar to localStorage:', e);
        }
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError("Cannot connect to server. Make sure the backend is running on port 5001.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(`Failed to upload avatar: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please login to save changes');
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await axios.post(
        API_ENDPOINTS.USER_PROFILE,
        {
          name: profile.name,
          jobTitle: profile.jobTitle,
          avatar: profile.avatar
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );
      
      setSuccess(res.data.message || 'Profile updated successfully!');
      // Update profile with response data
      const updatedProfile = {
        name: res.data.user?.name || profile.name || '',
        jobTitle: res.data.user?.jobTitle || profile.jobTitle || '',
        avatar: res.data.user?.avatar || profile.avatar || null
      };
      
      if (res.data.user) {
        setProfile(updatedProfile);
      }
      
        // Save to localStorage to sync with Sidebar
        try {
          const savedProfiles = JSON.parse(localStorage.getItem('savedProfiles') || '{}');
          savedProfiles[token] = updatedProfile;
          localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles));
          if (updatedProfile.avatar) {
            setAvatarPreview(updatedProfile.avatar);
          }
        } catch (e) {
          console.error('Failed to save profile to localStorage:', e);
        }
      
      // Trigger custom event to notify Sidebar
      window.dispatchEvent(new Event('profileUpdated'));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code,
        config: { url: err.config?.url, method: err.config?.method }
      });
      
      // If it's a connection error, save locally as fallback
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error') || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        // Save to localStorage as fallback
        try {
          const savedProfiles = JSON.parse(localStorage.getItem('savedProfiles') || '{}');
          savedProfiles[token] = profile;
          localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles));
          
          // Trigger custom event to notify Sidebar
          window.dispatchEvent(new Event('profileUpdated'));
          
          setSuccess('Profile saved locally (offline mode). Will sync when server is available.');
          setTimeout(() => setSuccess(''), 3000);
          setSaving(false);
          return;
        } catch (localErr) {
          setError('Cannot connect to server. Make sure the backend is running on port 5001.');
        }
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired. Please login again.');
      } else if (err.response?.status === 404) {
        setError('User not found. Please try logging in again.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.response?.status === 405) {
        setError('Method not allowed. The server may need to be restarted.');
      } else {
        setError(`Failed to update profile: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEmailConfigChange = (e) => {
    const { name, value } = e.target;
    setEmailConfig(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleConnectEmail = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please login to connect email');
      return;
    }

    if (!emailConfig.emailUser || !emailConfig.emailPass) {
      setError('Please enter both Gmail address and App Password');
      return;
    }

    setEmailConnecting(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(
        API_ENDPOINTS.CONFIG,
        {
          emailUser: emailConfig.emailUser,
          emailPass: emailConfig.emailPass
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );

      setSuccess(res.data.message || 'Email connected successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to connect email:', err);
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error') || err.code === 'ERR_NETWORK') {
        setError("Cannot connect to server. Make sure the backend is running on port 5001.");
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Session expired. Please login again.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(`Failed to connect email: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setEmailConnecting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Fixed Control Bar - Top Right Corner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 right-6 z-[100] flex items-center gap-4 bg-[#111]/80 backdrop-blur-2xl border border-white/10 px-4 py-2 rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.8)]"
      >
        <Link to="/dashboard" className="relative group">
          <div className={`p-2 rounded-xl transition-all duration-300 ${
            location.pathname === '/dashboard' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}>
            <Icon icon="solar:widget-bold-duotone" width="20" height="20" />
          </div>
          {location.pathname === '/dashboard' && (
            <motion.div 
              layoutId="dot" 
              className="absolute -bottom-1 left-0 right-0 mx-auto w-1 h-1 bg-white rounded-full" 
            />
          )}
        </Link>
        <Link to="/discover" className="relative group">
          <div className={`p-2 rounded-xl transition-all duration-300 ${
            location.pathname === '/discover' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}>
            <Icon icon="solar:radar-bold-duotone" width="20" height="20" />
          </div>
          {location.pathname === '/discover' && (
            <motion.div 
              layoutId="dot" 
              className="absolute -bottom-1 left-0 right-0 mx-auto w-1 h-1 bg-white rounded-full" 
            />
          )}
        </Link>
        <div className="w-px h-6 bg-white/10 mx-1"></div>
        <button 
          onClick={() => { 
            localStorage.removeItem('token'); 
            setToken(null);
            navigate('/auth');
          }} 
          className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <Icon icon="solar:logout-3-bold-duotone" width="20" height="20" />
        </button>
      </motion.div>
      
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 space-y-1">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                 activeTab === tab.id ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5'
               }`}
             >
               <Icon icon={tab.icon} width="18" />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 min-h-[500px]">
           {activeTab === 'profile' && (
             <div className="space-y-6 max-w-lg">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                    <Icon icon="solar:danger-triangle-bold-duotone" className="text-lg" />
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-center gap-2">
                    <Icon icon="solar:check-circle-bold-duotone" className="text-lg" />
                    {success}
                  </div>
                )}
                <div className="flex items-center gap-4 mb-8">
                   <div className="relative">
                     {avatarPreview ? (
                       <img 
                         src={avatarPreview.startsWith('data:') ? avatarPreview : (token ? API_ENDPOINTS.getFileUrl(avatarPreview) : avatarPreview)} 
                         alt="Avatar"
                         className="w-20 h-20 rounded-full object-cover border border-white/10"
                       />
                     ) : (
                       <div className="w-20 h-20 rounded-full bg-orange-500 border border-white/10 flex items-center justify-center text-2xl font-bold text-white">
                         {profile.name ? (profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)) : 'EA'}
                       </div>
                     )}
                     <label className="absolute inset-0 cursor-pointer rounded-full opacity-0 hover:opacity-100 transition-opacity bg-black/50 flex items-center justify-center">
                       <Icon icon="solar:camera-bold-duotone" className="text-white text-xl" />
                     </label>
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="cursor-pointer">
                       <input 
                         type="file" 
                         accept="image/*"
                         onChange={(e) => {
                           const file = e.target.files[0];
                           if (file) {
                             // Validate file type
                             if (!file.type.startsWith('image/')) {
                               setError('Please select an image file');
                               setTimeout(() => setError(''), 3000);
                               return;
                             }
                             // Validate file size (5MB)
                             if (file.size > 5 * 1024 * 1024) {
                               setError('Image size too large. Maximum size is 5MB');
                               setTimeout(() => setError(''), 3000);
                               return;
                             }
                             setAvatarFile(file);
                             const reader = new FileReader();
                             reader.onloadend = () => {
                               setAvatarPreview(reader.result);
                             };
                             reader.readAsDataURL(file);
                             setError('');
                           }
                         }}
                         className="hidden"
                       />
                       <button 
                         type="button"
                         className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white hover:bg-white/10 transition-colors"
                       >
                         Change Avatar
                       </button>
                     </label>
                     {avatarFile && (
                       <button
                         type="button"
                         onClick={handleAvatarUpload}
                         disabled={saving}
                         className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                       >
                         {saving ? 'Uploading...' : 'Upload Avatar'}
                       </button>
                     )}
                   </div>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Icon icon="solar:loading-bold-duotone" className="text-white animate-spin" width="32" />
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile}>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-500 uppercase">Display Name</label>
                       <input 
                         name="name"
                         value={profile.name}
                         onChange={handleProfileChange}
                         className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" 
                         placeholder="Enter your name"
                       />
                    </div>
                    <div className="space-y-2 mt-4">
                       <label className="text-xs text-gray-500 uppercase">Job Title</label>
                       <input 
                         name="jobTitle"
                         value={profile.jobTitle}
                         onChange={handleProfileChange}
                         className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" 
                         placeholder="Enter your job title"
                       />
                    </div>
                    <div className="pt-4">
                       <button 
                         type="submit"
                         disabled={saving}
                         className={`px-6 py-3 bg-white text-black font-bold rounded-lg transition-opacity ${
                           saving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                         }`}
                       >
                         {saving ? (
                           <span className="flex items-center gap-2">
                             <Icon icon="solar:loading-bold-duotone" className="animate-spin" width="18" />
                             Saving...
                           </span>
                         ) : (
                           'Save Changes'
                         )}
                       </button>
                    </div>
                  </form>
                )}
             </div>
           )}
           
           {activeTab === 'smtp' && (
             <div>
               {error && (
                 <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2 mb-6">
                   <Icon icon="solar:danger-triangle-bold-duotone" className="text-lg" />
                   {error}
                 </div>
               )}
               {success && (
                 <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-center gap-2 mb-6">
                   <Icon icon="solar:check-circle-bold-duotone" className="text-lg" />
                   {success}
                 </div>
               )}
               <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6 flex gap-3">
                 <Icon icon="solar:info-circle-bold" className="text-blue-400 shrink-0" width="24" />
                 <p className="text-sm text-blue-200">We use your Gmail App Password to send applications securely. We never store your main password.</p>
               </div>
               <form onSubmit={handleConnectEmail} className="space-y-4 max-w-lg">
                  <input 
                    name="emailUser"
                    type="email"
                    value={emailConfig.emailUser}
                    onChange={handleEmailConfigChange}
                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" 
                    placeholder="Gmail Address" 
                    disabled={emailConnecting}
                  />
                  <input 
                    name="emailPass"
                    type="password"
                    value={emailConfig.emailPass}
                    onChange={handleEmailConfigChange}
                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none" 
                    placeholder="App Password" 
                    disabled={emailConnecting}
                  />
                  <button 
                    type="submit"
                    disabled={emailConnecting}
                    className={`px-6 py-3 bg-green-600 text-white font-bold rounded-lg w-full transition-opacity ${
                      emailConnecting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                    }`}
                  >
                    {emailConnecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Icon icon="solar:loading-bold-duotone" className="animate-spin" width="18" />
                        Connecting...
                      </span>
                    ) : (
                      'Connect Gmail'
                    )}
                  </button>
               </form>
             </div>
           )}

           {activeTab === 'resume' && (
             <div className="space-y-6">
               {error && (
                 <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                   <Icon icon="solar:danger-triangle-bold-duotone" className="text-lg" />
                   {error}
                 </div>
               )}
               {success && (
                 <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-center gap-2">
                   <Icon icon="solar:check-circle-bold-duotone" className="text-lg" />
                   {success}
                 </div>
               )}
               
               {/* Uploaded Files Display Section - Always visible at top */}
               <div className={`rounded-xl p-6 mb-6 transition-all ${
                 (uploadedFiles.resume || uploadedFiles.coverLetter) 
                   ? 'bg-green-500/10 border border-green-500/30' 
                   : 'bg-white/5 border border-white/10'
               }`}>
                 <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                   <Icon icon="solar:folder-bold-duotone" className={uploadedFiles.resume || uploadedFiles.coverLetter ? "text-green-500" : "text-gray-500"} width="20" />
                   Uploaded Files
                 </h3>
                 {(uploadedFiles.resume || uploadedFiles.coverLetter) ? (
                   <div className="space-y-3">
                     {uploadedFiles.resume && (
                       <a
                         href={token ? API_ENDPOINTS.getFileUrl(uploadedFiles.resume) : '#'}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-white/10 hover:border-green-500/30 transition-all group cursor-pointer"
                         onClick={(e) => {
                           if (!token) e.preventDefault();
                         }}
                       >
                         <div className="flex items-center gap-3 flex-1">
                           <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                             <Icon icon="solar:file-text-bold-duotone" className="text-green-500" width="24" />
                           </div>
                           <div>
                             <p className="text-white font-medium group-hover:text-green-400 transition-colors">Resume</p>
                             <p className="text-xs text-gray-400">{(uploadedFiles.resume && uploadedFiles.resume.split('/').pop()) || 'Resume.pdf'}</p>
                           </div>
                         </div>
                         <div
                           onClick={(e) => e.stopPropagation()}
                           className="p-3 rounded-lg bg-white/5 hover:bg-green-500/20 transition-colors"
                           title="Download file"
                         >
                           <Icon icon="solar:download-bold-duotone" width="20" className="text-gray-400 group-hover:text-green-400" />
                         </div>
                       </a>
                     )}
                     {uploadedFiles.coverLetter && (
                       <a
                         href={token ? API_ENDPOINTS.getFileUrl(uploadedFiles.coverLetter) : '#'}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-white/10 hover:border-green-500/30 transition-all group cursor-pointer"
                         onClick={(e) => {
                           if (!token) e.preventDefault();
                         }}
                       >
                         <div className="flex items-center gap-3 flex-1">
                           <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                             <Icon icon="solar:file-text-bold-duotone" className="text-green-500" width="24" />
                           </div>
                           <div>
                             <p className="text-white font-medium group-hover:text-green-400 transition-colors">Cover Letter</p>
                             <p className="text-xs text-gray-400">{(uploadedFiles.coverLetter && uploadedFiles.coverLetter.split('/').pop()) || 'CoverLetter.pdf'}</p>
                           </div>
                         </div>
                         <div
                           onClick={(e) => e.stopPropagation()}
                           className="p-3 rounded-lg bg-white/5 hover:bg-green-500/20 transition-colors"
                           title="Download file"
                         >
                           <Icon icon="solar:download-bold-duotone" width="20" className="text-gray-400 group-hover:text-green-400" />
                         </div>
                       </a>
                     )}
                   </div>
                 ) : (
                   <div className="text-center py-6 text-gray-500">
                     <Icon icon="solar:file-text-bold-duotone" className="text-4xl mx-auto mb-2 opacity-30" />
                     <p className="text-sm">No files uploaded yet</p>
                     <p className="text-xs text-gray-600 mt-1">Upload your resume or cover letter below</p>
                   </div>
                 )}
               </div>
               
               <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                 <h3 className="font-bold text-white mb-4">Upload Resume</h3>
                 <div className="flex items-center gap-3">
                   <label className="flex-1 cursor-pointer">
                     <input 
                       type="file" 
                       name="resume"
                       accept=".pdf" 
                       onChange={(e) => {
                         const file = e.target.files[0];
                         if (file) {
                           setSelectedFiles(prev => ({ ...prev, resume: file }));
                           setError('');
                         }
                       }}
                       className="w-full bg-black border border-white/10 rounded-lg p-3 text-white cursor-pointer" 
                       disabled={uploadState.resume === 'uploading'}
                     />
                   </label>
                   <motion.button
                     type="button"
                     onClick={() => {
                       if (selectedFiles.resume) {
                         handleFileUpload(selectedFiles.resume, 'resume');
                       } else {
                         setError('Please select a file first');
                         setTimeout(() => setError(''), 3000);
                       }
                     }}
                     disabled={uploadState.resume === 'uploading' || !selectedFiles.resume}
                     whileHover={selectedFiles.resume && uploadState.resume !== 'uploading' ? { scale: 1.1 } : {}}
                     whileTap={selectedFiles.resume && uploadState.resume !== 'uploading' ? { scale: 0.95 } : {}}
                     className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                       uploadState.resume === 'uploading' 
                         ? 'bg-orange-500/50 cursor-not-allowed' 
                         : uploadState.resume === 'success'
                         ? 'bg-green-500 text-white shadow-green-500/50'
                         : selectedFiles.resume
                         ? 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                         : 'bg-white/20 text-gray-400 cursor-not-allowed'
                     }`}
                   >
                     {uploadState.resume === 'uploading' ? (
                       <motion.div
                         animate={{ rotate: 360 }}
                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                       >
                         <Icon icon="solar:loading-bold-duotone" width="28" />
                       </motion.div>
                     ) : uploadState.resume === 'success' ? (
                       <motion.div
                         initial={{ scale: 0, rotate: -180 }}
                         animate={{ 
                           scale: [0, 1.3, 1],
                           rotate: [0, 360],
                         }}
                         transition={{ 
                           duration: 0.6,
                           times: [0, 0.6, 1],
                           ease: "easeOut"
                         }}
                         className="relative"
                       >
                         <Icon icon="solar:check-circle-bold-duotone" width="28" />
                         <motion.div
                           initial={{ scale: 0, opacity: 0 }}
                           animate={{ scale: [1.5, 2, 0], opacity: [1, 0.5, 0] }}
                           transition={{ duration: 0.6, delay: 0.2 }}
                           className="absolute inset-0 bg-green-500 rounded-full blur-xl"
                         />
                       </motion.div>
                     ) : (
                       <Icon icon="solar:check-circle-bold-duotone" width="28" />
                     )}
                   </motion.button>
                 </div>
                 {selectedFiles.resume && (
                   <p className="text-xs text-gray-400 mt-2">Selected: {selectedFiles.resume.name}</p>
                 )}
                 <p className="text-xs text-gray-500 mt-2">PDF format only. Max 10MB.</p>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                 <h3 className="font-bold text-white mb-4">Upload Cover Letter</h3>
                 <div className="flex items-center gap-3">
                   <label className="flex-1 cursor-pointer">
                     <input 
                       type="file" 
                       name="coverletter"
                       accept=".pdf" 
                       onChange={(e) => {
                         const file = e.target.files[0];
                         if (file) {
                           setSelectedFiles(prev => ({ ...prev, coverletter: file }));
                           setError('');
                         }
                       }}
                       className="w-full bg-black border border-white/10 rounded-lg p-3 text-white cursor-pointer" 
                       disabled={uploadState.coverletter === 'uploading'}
                     />
                   </label>
                   <motion.button
                     type="button"
                     onClick={() => {
                       if (selectedFiles.coverletter) {
                         handleFileUpload(selectedFiles.coverletter, 'coverletter');
                       } else {
                         setError('Please select a file first');
                         setTimeout(() => setError(''), 3000);
                       }
                     }}
                     disabled={uploadState.coverletter === 'uploading' || !selectedFiles.coverletter}
                     whileHover={selectedFiles.coverletter && uploadState.coverletter !== 'uploading' ? { scale: 1.1 } : {}}
                     whileTap={selectedFiles.coverletter && uploadState.coverletter !== 'uploading' ? { scale: 0.95 } : {}}
                     className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                       uploadState.coverletter === 'uploading' 
                         ? 'bg-orange-500/50 cursor-not-allowed' 
                         : uploadState.coverletter === 'success'
                         ? 'bg-green-500 text-white shadow-green-500/50'
                         : selectedFiles.coverletter
                         ? 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                         : 'bg-white/20 text-gray-400 cursor-not-allowed'
                     }`}
                   >
                     {uploadState.coverletter === 'uploading' ? (
                       <motion.div
                         animate={{ rotate: 360 }}
                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                       >
                         <Icon icon="solar:loading-bold-duotone" width="28" />
                       </motion.div>
                     ) : uploadState.coverletter === 'success' ? (
                       <motion.div
                         initial={{ scale: 0, rotate: -180 }}
                         animate={{ 
                           scale: [0, 1.3, 1],
                           rotate: [0, 360],
                         }}
                         transition={{ 
                           duration: 0.6,
                           times: [0, 0.6, 1],
                           ease: "easeOut"
                         }}
                         className="relative"
                       >
                         <Icon icon="solar:check-circle-bold-duotone" width="28" />
                         <motion.div
                           initial={{ scale: 0, opacity: 0 }}
                           animate={{ scale: [1.5, 2, 0], opacity: [1, 0.5, 0] }}
                           transition={{ duration: 0.6, delay: 0.2 }}
                           className="absolute inset-0 bg-green-500 rounded-full blur-xl"
                         />
                       </motion.div>
                     ) : (
                       <Icon icon="solar:check-circle-bold-duotone" width="28" />
                     )}
                   </motion.button>
                 </div>
                 {selectedFiles.coverletter && (
                   <p className="text-xs text-gray-400 mt-2">Selected: {selectedFiles.coverletter.name}</p>
                 )}
                 <p className="text-xs text-gray-500 mt-2">PDF format only. Max 10MB.</p>
               </div>
             </div>
           )}

           {activeTab === 'billing' && (
             <div className="space-y-6">
               <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                 <h3 className="font-bold text-white mb-4">Current Plan</h3>
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-white font-bold">Pro Plan</p>
                     <p className="text-gray-400 text-sm">$29/month</p>
                   </div>
                   <button className="px-6 py-2 bg-white text-black font-bold rounded-lg">Upgrade</button>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
}

