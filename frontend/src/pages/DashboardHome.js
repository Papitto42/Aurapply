import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import DashboardLayout from '../layouts/DashboardLayout';
import GlowCard from '../components/GlowCard';
import { API_ENDPOINTS } from '../config/api';
import ThemeToggle from '../components/ThemeToggle';

export default function DashboardHome() {
  const [history, setHistory] = useState([]);
  const [emailConfig, setEmailConfig] = useState({ user: '', pass: '' });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadState, setUploadState] = useState({ type: null, status: 'idle' }); // 'idle', 'uploading', 'success'
  const [totalApplications, setTotalApplications] = useState(0); // Replace magic number
  const [receivedEmails, setReceivedEmails] = useState([]);
  const [checkingEmails, setCheckingEmails] = useState(false);
  const token = localStorage.getItem('token');
  const { setToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract fetch functions for reuse
  const fetchHistory = async () => {
    if (!token) {
      // Return empty array instead of mock - let UI show empty state
      return [];
    }
    try {
      const res = await axios.get(API_ENDPOINTS.HISTORY, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      return Array.isArray(res.data) ? res.data : [];
    } catch (e) {
      console.error('[DashboardHome] Error fetching history:', e);
      return []; // Return empty array, don't use mocks
    }
  };

  const fetchConfig = async () => {
    if (!token) {
      return { user: '', pass: '' };
    }
    try {
      const res = await axios.get(API_ENDPOINTS.CONFIG, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      return res.data || { user: '', pass: '' };
    } catch (e) {
      console.error('[DashboardHome] Error fetching config:', e);
      return { user: '', pass: '' };
    }
  };

  const fetchProfile = async () => {
    if (!token) {
      return { documents: null };
    }
    try {
      const res = await axios.get(API_ENDPOINTS.USER_PROFILE, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      return res.data || { documents: null };
    } catch (e) {
      console.error('[DashboardHome] Error fetching profile:', e);
      return { documents: null };
    }
  };

  const fetchEmails = async () => {
    if (!token) {
      return [];
    }
    try {
      const res = await axios.get(API_ENDPOINTS.EMAILS, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      return Array.isArray(res.data) ? res.data : [];
    } catch (e) {
      console.error('[DashboardHome] Error fetching emails:', e);
      return [];
    }
  };

  const checkForNewEmails = async () => {
    if (!token) {
      alert('Please log in to check emails');
      return;
    }
    setCheckingEmails(true);
    try {
      const res = await axios.post(API_ENDPOINTS.CHECK_EMAILS, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.count > 0) {
        alert(`Found ${res.data.count} new email(s)!`);
      } else {
        alert('No new emails found.');
      }
      // Refresh email list
      const emails = await fetchEmails();
      setReceivedEmails(emails);
    } catch (error) {
      console.error('Error checking emails:', error);
      alert(error.response?.data?.error || 'Failed to check emails. Make sure your email config is set up correctly.');
    } finally {
      setCheckingEmails(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all data in parallel
      const [hist, config, profile, emails] = await Promise.all([
        fetchHistory(),
        fetchConfig(),
        fetchProfile(),
        fetchEmails()
      ]);
      
      // Set history - use empty array if backend returns empty, don't override with mocks
      setHistory(hist);
      setTotalApplications(hist.length);
      
      // Set config
      setEmailConfig({ user: config.user || '', pass: config.pass || '' });
      
      // Set uploaded files
      if (profile.documents) {
        const files = [];
        if (profile.documents.resume) {
          files.push({ name: 'Resume', path: profile.documents.resume, type: 'resume' });
        }
        if (profile.documents.coverLetter) {
          files.push({ name: 'Cover Letter', path: profile.documents.coverLetter, type: 'coverLetter' });
        }
        setUploadedFiles(files);
      }

      // Set emails
      setReceivedEmails(emails);
    };
    
    fetchData();
    
    // Listen for profile updates (e.g., file uploads)
    const handleProfileUpdate = async () => {
      const hist = await fetchHistory();
      setHistory(hist);
      setTotalApplications(hist.length);
      
      const profile = await fetchProfile();
      if (profile.documents) {
        const files = [];
        if (profile.documents.resume) {
          files.push({ name: 'Resume', path: profile.documents.resume, type: 'resume' });
        }
        if (profile.documents.coverLetter) {
          files.push({ name: 'Cover Letter', path: profile.documents.coverLetter, type: 'coverLetter' });
        }
        setUploadedFiles(files);
      }
    };
    
    const handleFileUploaded = async (e) => {
      console.log('[DashboardHome] File uploaded event received:', e);
      
      // Get activity from event or localStorage
      let activity = null;
      if (e && e.detail && e.detail.activity) {
        activity = e.detail.activity;
      } else {
        try {
          const lastUpload = localStorage.getItem('lastFileUpload');
          if (lastUpload) {
            const uploadData = JSON.parse(lastUpload);
            // Use uploads from last 30 seconds
            if (uploadData.activity && uploadData.timestamp && (Date.now() - uploadData.timestamp < 30000)) {
              activity = uploadData.activity;
            }
          }
        } catch (err) {
          console.error('Error reading localStorage:', err);
        }
      }
      
      if (activity) {
        const formattedActivity = {
          jobTitle: activity.jobTitle || activity.title || 'File Uploaded',
          title: activity.title || activity.jobTitle || 'File Uploaded',
          company: activity.company || 'Profile Update',
          status: activity.status || 'Uploaded',
          date: activity.date ? new Date(activity.date) : new Date()
        };
        
        console.log('[DashboardHome] Adding activity immediately:', formattedActivity);
        
        // FORCE IMMEDIATE ADD - use functional update
        setHistory(prev => {
          // Check for duplicates by comparing key fields
          const existing = prev.find(item => 
            (item.jobTitle || item.title) === formattedActivity.jobTitle &&
            item.company === formattedActivity.company &&
            Math.abs(new Date(item.date) - formattedActivity.date) < 5000
          );
          
          if (existing) {
            console.log('[DashboardHome] Activity already exists, not adding duplicate');
            return prev;
          }
          
          // Add to front
          const newHistory = [formattedActivity, ...prev];
          console.log('[DashboardHome] New history:', newHistory);
          setTotalApplications(newHistory.length);
          return newHistory;
        });
      }
      
      // Refresh from server after delay
      setTimeout(async () => {
        const hist = await fetchHistory();
        setHistory(hist);
        setTotalApplications(hist.length);
      }, 2000);
    };
    
    // Check localStorage on mount
    const checkRecentUploads = () => {
      try {
        const lastUpload = localStorage.getItem('lastFileUpload');
        if (lastUpload) {
          const uploadData = JSON.parse(lastUpload);
          if (uploadData.activity && uploadData.timestamp && (Date.now() - uploadData.timestamp < 30000)) {
            handleFileUploaded({ detail: { activity: uploadData.activity } });
          }
        }
      } catch (e) {
        console.error('Error checking recent uploads:', e);
      }
    };
    
    // Set up listeners
    window.addEventListener('fileUploaded', handleFileUploaded);
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    // Check for recent uploads on mount
    checkRecentUploads();
    
    // Poll localStorage every 2 seconds to catch uploads
    const pollInterval = setInterval(() => {
      checkRecentUploads();
    }, 2000);
    
    return () => {
      window.removeEventListener('fileUploaded', handleFileUploaded);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      clearInterval(pollInterval);
    };
  }, [token, location.pathname, fetchConfig, fetchEmails, fetchHistory, fetchProfile]); // Re-run when path changes too

  const handleUpload = async (e) => {
    // Validate file input
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      e.target.value = null;
      return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      e.target.value = null;
      return;
    }
    
    // Check authentication
    if (!token) {
      alert('Please log in to upload files.');
      e.target.value = null;
      return;
    }
    
    const fileType = e.target.name === 'resume' ? 'resume' : 'coverletter';
    const uploadType = e.target.name === 'resume' ? 'resume' : 'coverLetter';
    
    // Set uploading state
    setUploadState({ type: uploadType, status: 'uploading' });
    
    // Create FormData with correct field name
    const formData = new FormData();
    formData.append(e.target.name === 'resume' ? 'resume' : 'coverLetter', file);
    
    try {
      const endpoint = fileType === 'resume' ? API_ENDPOINTS.UPLOAD_CV : API_ENDPOINTS.UPLOAD_COVER_LETTER;
      const res = await axios.post(endpoint, formData, { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
      });
      
      // Only proceed if we get a success response
      if (res.data && (res.data.success || res.data.message || res.status === 200)) {
        // Add activity to history if provided
        if (res.data.activity) {
          setHistory(prev => {
            const newHist = [res.data.activity, ...prev];
            setTotalApplications(newHist.length);
            return newHist;
          });
        }
        
        // Update uploaded files list
        setUploadedFiles(prev => {
          const filtered = prev.filter(f => f.type !== uploadType);
          return [{ 
            name: e.target.name === 'resume' ? 'Resume' : 'Cover Letter', 
            path: res.data.path || file.name, 
            type: uploadType, 
            fileName: file.name 
          }, ...filtered];
        });
        
        // Show success animation
        setTimeout(() => {
          setUploadState({ type: uploadType, status: 'success' });
          setTimeout(() => {
            setUploadState({ type: null, status: 'idle' });
          }, 2000);
        }, 500);
        
        // Refetch history from server to ensure sync
        setTimeout(async () => {
          const hist = await fetchHistory();
          setHistory(hist);
          setTotalApplications(hist.length);
          
          // Also refresh uploaded files
          const profile = await fetchProfile();
          if (profile.documents) {
            const files = [];
            if (profile.documents.resume) {
              files.push({ name: 'Resume', path: profile.documents.resume, type: 'resume' });
            }
            if (profile.documents.coverLetter) {
              files.push({ name: 'Cover Letter', path: profile.documents.coverLetter, type: 'coverLetter' });
            }
            setUploadedFiles(files);
          }
        }, 1000);
      } else {
        throw new Error('Upload completed but no confirmation received.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadState({ type: null, status: 'idle' });
      
      let errorMessage = 'Upload failed. ';
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error') || err.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Make sure the backend is running on port 5001.';
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        errorMessage = 'Session expired. Please login again.';
      } else if (err.response?.data?.error || err.response?.data?.msg || err.response?.data?.message) {
        errorMessage = `Upload failed: ${err.response.data.error || err.response.data.msg || err.response.data.message}`;
      } else if (err.message) {
        errorMessage = `Upload failed: ${err.message}`;
      }
      
      alert(errorMessage);
    } finally {
      // Always reset input to allow re-uploads
      e.target.value = null;
    }
  };

  const saveConfig = async (user, pass) => {
    if (!token) {
      alert("Please log in to save configuration.");
      return;
    }
    
    try {
      await axios.post(API_ENDPOINTS.CONFIG, 
        { emailUser: user, emailPass: pass }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refetch config to ensure sync
      const updatedConfig = await fetchConfig();
      setEmailConfig({ user: updatedConfig.user || '', pass: updatedConfig.pass || '' });
      
      alert("Configuration saved successfully");
    } catch (err) {
      console.error('Save config error:', err);
      let errorMessage = 'Failed to save configuration. ';
      if (err.response?.data?.error || err.response?.data?.msg || err.response?.data?.message) {
        errorMessage = `Save failed: ${err.response.data.error || err.response.data.msg || err.response.data.message}`;
      } else if (err.message) {
        errorMessage = `Save failed: ${err.message}`;
      }
      alert(errorMessage);
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

  return (
    <DashboardLayout>
      <div className="min-h-screen relative transition-colors duration-300 bg-[#FAFAFA] dark:bg-[#050505]">
        <div className="bg-noise"></div>
        
        {/* Fixed Control Bar - Top Right Corner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 right-6 z-[100] flex items-center gap-4 backdrop-blur-2xl px-4 py-2 rounded-full transition-all duration-300 bg-white/80 border border-gray-200/50 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] dark:bg-[#111]/80 dark:border-white/10 dark:shadow-[0_0_40px_-10px_rgba(0,0,0,0.8)]"
        >
          <Link to="/dashboard" className="relative group">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              location.pathname === '/dashboard' 
                ? 'bg-[#1F2937] text-white dark:bg-white dark:text-black'
                : 'text-gray-500 hover:text-[#1F2937] hover:bg-gray-100/50 dark:hover:text-white dark:hover:bg-white/5'
            }`}>
              <Icon icon="solar:widget-bold-duotone" width="20" height="20" />
            </div>
            {location.pathname === '/dashboard' && (
              <motion.div 
                layoutId="dot" 
                className="absolute -bottom-1 left-0 right-0 mx-auto w-1 h-1 rounded-full bg-[#1F2937] dark:bg-white"
              />
            )}
          </Link>
          <Link to="/discover" className="relative group">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              location.pathname === '/discover' 
                ? 'bg-[#1F2937] text-white dark:bg-white dark:text-black'
                : 'text-gray-500 hover:text-[#1F2937] hover:bg-gray-100/50 dark:hover:text-white dark:hover:bg-white/5'
            }`}>
              <Icon icon="solar:radar-bold-duotone" width="20" height="20" />
            </div>
            {location.pathname === '/discover' && (
              <motion.div 
                layoutId="dot" 
                className="absolute -bottom-1 left-0 right-0 mx-auto w-1 h-1 rounded-full bg-[#1F2937] dark:bg-white"
              />
            )}
          </Link>
          <div className="w-px h-6 mx-1 bg-gray-300/50 dark:bg-white/10"></div>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          <div className="w-px h-6 mx-1 bg-gray-300/50 dark:bg-white/10"></div>
          
          <button 
            onClick={() => { 
              localStorage.removeItem('token'); 
              setToken(null);
              navigate('/auth');
            }} 
            className="p-2 rounded-xl transition-all text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <Icon icon="solar:logout-3-bold-duotone" width="20" height="20" />
          </button>
        </motion.div>
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-10 px-2">
          <div className="flex items-center gap-4">
             <div>
                <h1 className="text-4xl font-medium tracking-tight mb-1 transition-colors duration-300 text-[#1F2937] dark:text-white">
                  Overview
                </h1>
                <p className="font-mono text-xs uppercase tracking-widest transition-colors duration-300 text-gray-600 dark:text-gray-500">
                  System Status: Online
                </p>
             </div>
             <div className="flex gap-4 ml-8 items-center">
                {/* Theme Toggle - Prominent placement */}
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
                
                <div className="h-10 w-10 rounded-full glass-card flex items-center justify-center cursor-pointer transition hover:bg-gray-100/50 dark:hover:bg-white/10">
                   <Icon 
                     icon="solar:bell-bold-duotone" 
                     className="text-[#1F2937] dark:text-white" 
                     width="20" 
                   />
                </div>
                <div className="h-10 w-10 rounded-full glass-card flex items-center justify-center cursor-pointer transition hover:bg-gray-100/50 dark:hover:bg-white/10">
                   <Icon 
                     icon="solar:settings-bold-duotone" 
                     className="text-[#1F2937] dark:text-white" 
                     width="20" 
                   />
                </div>
             </div>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6">
           
           {/* 1. Main Stats (Large) - With Glow Effect */}
           <motion.div variants={item}>
             <GlowCard
               icon="solar:chart-square-bold-duotone"
               iconSize={120}
               glowColor="rgba(255, 77, 0, 0.4)"
               className="lg:col-span-2 row-span-2 glass-card rounded-[32px] p-8 relative overflow-hidden group"
             >
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-40 transition-opacity pointer-events-none dark:opacity-20">
                  <Icon icon="solar:chart-square-bold-duotone" width="120" />
               </div>
               <h3 className="mb-2 relative z-10 transition-colors duration-300 text-gray-600 dark:text-gray-400">
                 Total Applications
               </h3>
               <h2 className="text-6xl font-medium mb-8 relative z-10 transition-colors duration-300 text-[#1F2937] dark:text-white">
                 {totalApplications || history.length}
               </h2>
               
               <div className="h-32 w-full flex items-end gap-2 relative z-10">
                  {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                     <div 
                       key={i} 
                       style={{ height: `${h}%` }} 
                       className="flex-1 rounded-t-lg hover:bg-orange-500 transition-colors duration-500 bg-gray-300/50 dark:bg-white/10"
                     />
                  ))}
               </div>
             </GlowCard>
           </motion.div>

           {/* 2. Quick Actions - With Glow Effect */}
           <motion.div variants={item}>
             <GlowCard
               icon={uploadState.type === 'resume' && uploadState.status === 'success' ? 'solar:check-circle-bold-duotone' : 'solar:upload-square-bold-duotone'}
               iconSize={24}
               glowColor={uploadState.type === 'resume' && uploadState.status === 'success' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(255, 77, 0, 0.6)'}
               className="glass-card rounded-[32px] p-6 flex flex-col justify-between hover:bg-white/[0.02] transition-colors cursor-pointer relative"
               onClick={() => uploadState.status === 'idle' && document.querySelector('input[name="resume"]')?.click()}
             >
               <div className="h-12 w-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center mb-4 relative z-10 overflow-hidden">
                  {uploadState.type === 'resume' && uploadState.status === 'uploading' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon icon="solar:loading-bold-duotone" width="24" className="relative z-10" />
                    </motion.div>
                  ) : uploadState.type === 'resume' && uploadState.status === 'success' ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, times: [0, 0.5, 1] }}
                      className="bg-green-500/20 text-green-500"
                    >
                      <Icon icon="solar:check-circle-bold-duotone" width="24" className="relative z-10" />
                    </motion.div>
                  ) : (
                    <Icon icon="solar:upload-square-bold-duotone" width="24" className="relative z-10" />
                  )}
               </div>
               <div className="relative z-10">
                  <h3 className="text-xl font-bold transition-colors duration-300 text-[#1F2937] dark:text-white">
                    {uploadState.type === 'resume' && uploadState.status === 'success' ? 'Uploaded!' : 'Upload CV'}
                  </h3>
                  <p className="text-sm mt-1 transition-colors duration-300 text-gray-600 dark:text-gray-500">
                    {uploadState.type === 'resume' && uploadState.status === 'uploading' ? 'Uploading...' : 
                     uploadState.type === 'resume' && uploadState.status === 'success' ? 'File uploaded successfully' :
                     'Update your primary PDF assets.'}
                  </p>
               </div>
               <input 
                 type="file" 
                 name="resume" 
                 accept=".pdf"
                 onChange={handleUpload} 
                 className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                 disabled={uploadState.status === 'uploading'}
               />
             </GlowCard>
           </motion.div>

           {/* 3. Email Config - With Glow Effect */}
           <motion.div variants={item}>
             <GlowCard
               icon="solar:mailbox-bold-duotone"
               iconSize={24}
               glowColor="rgba(59, 130, 246, 0.6)"
               className="glass-card rounded-[32px] p-6 flex flex-col justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
              onClick={() => {
                const user = prompt("Enter Gmail address:", emailConfig.user);
                const pass = prompt("Enter App Password:", emailConfig.pass);
                if (user && pass) {
                  setEmailConfig({ user, pass });
                  saveConfig(user, pass);
                }
              }}
             >
               <div className="h-12 w-12 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center mb-4 relative z-10">
                  <Icon icon="solar:mailbox-bold-duotone" width="24" className="relative z-10" />
               </div>
               <div className="relative z-10">
                  <h3 className="text-xl font-bold transition-colors duration-300 text-[#1F2937] dark:text-white">
                    SMTP Setup
                  </h3>
                  <p className="text-sm mt-1 transition-colors duration-300 text-gray-600 dark:text-gray-500">
                    Connect Gmail for automation.
                  </p>
               </div>
             </GlowCard>
           </motion.div>

           {/* 4. Recent Activity List (Long vertical) */}
           <motion.div variants={item} className="lg:col-span-2 glass-card rounded-[32px] p-8">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold transition-colors duration-300 text-[#1F2937] dark:text-white">
                   Recent Activity
                 </h3>
                 <Icon 
                   icon="solar:menu-dots-bold" 
                   className="text-gray-600 dark:text-gray-500" 
                 />
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                 {history.map((app, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-2xl border transition-all group bg-gray-50/50 border-gray-200/50 hover:bg-gray-100/50 dark:bg-white/[0.02] dark:border-white/5 dark:hover:bg-white/[0.05]"
                    >
                       <div className="flex items-center gap-4">
                          {/* Icon based on activity type */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                            app.status === 'Uploaded' ? 'bg-green-500/20' :
                            app.status === 'Sent' ? 'bg-blue-500/20' :
                            app.status === 'Rejected' ? 'bg-red-500/20' :
                            'bg-white/10'
                          }`}>
                             <Icon 
                               icon={
                                 app.status === 'Uploaded' ? 'solar:document-text-bold-duotone' :
                                 app.company === 'Profile Update' ? 'solar:upload-square-bold-duotone' :
                                 app.status === 'Sent' ? 'solar:letter-bold-duotone' :
                                 app.status === 'Rejected' ? 'solar:close-circle-bold-duotone' :
                                 app.status === 'Viewed' ? 'solar:eye-bold-duotone' :
                                 app.company ? `logos:${app.company.toLowerCase().replace(/\s+/g, '-')}-icon` :
                                 'solar:document-bold-duotone'
                               } 
                               width="20" 
                               className={
                                 app.status === 'Uploaded' ? 'text-green-400' : 
                                 app.status === 'Sent' ? 'text-blue-400' :
                                 app.status === 'Rejected' ? 'text-red-400' :
                                 'text-gray-400 grayscale group-hover:grayscale-0 transition-all'
                               } 
                             />
                          </div>
                          <div>
                             <h4 className="font-bold transition-colors duration-300 text-[#1F2937] dark:text-white">
                               {app.title || app.jobTitle || 'Activity'}
                             </h4>
                             <p className="text-xs transition-colors duration-300 text-gray-600 dark:text-gray-500">
                               {app.company || 'Unknown'}
                             </p>
                             {app.date && (
                               <p className="text-xs mt-0.5 transition-colors duration-300 text-gray-500 dark:text-gray-600">
                                 {new Date(app.date).toLocaleDateString()} {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </p>
                             )}
                          </div>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-xs border ${
                          app.status === 'Sent' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 
                          app.status === 'Rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                          app.status === 'Uploaded' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                          'bg-green-500/10 border-green-500/20 text-green-400'
                       }`}>
                          {app.status}
                       </div>
                    </motion.div>
                 ))}
                 {history.length === 0 && (
                   <div className="text-center py-8 transition-colors duration-300 text-gray-600 dark:text-gray-500">
                     <Icon icon="solar:history-bold-duotone" className="text-4xl mx-auto mb-2 opacity-50" />
                     <p>No activity yet</p>
                   </div>
                 )}
              </div>
           </motion.div>

        </motion.div>

        {/* Received Emails Section */}
        <motion.div variants={item} className="lg:col-span-4 glass-card rounded-[32px] p-8 mt-6">
            <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold transition-colors duration-300 text-[#1F2937] dark:text-white">
                Inbox
              </h3>
              {receivedEmails.filter(e => !e.isRead).length > 0 && (
                <span className="px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-bold">
                  {receivedEmails.filter(e => !e.isRead).length} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={checkForNewEmails}
                disabled={checkingEmails}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition flex items-center gap-2 disabled:opacity-50"
              >
                {checkingEmails ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon icon="solar:loading-bold-duotone" width="16" />
                    </motion.div>
                    Checking...
                  </>
                ) : (
                  <>
                    <Icon icon="solar:refresh-bold-duotone" width="16" />
                    Check Emails
                  </>
                )}
              </motion.button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {receivedEmails.length === 0 ? (
              <div className="text-center py-8 transition-colors duration-300 text-gray-600 dark:text-gray-500">
                <Icon icon="solar:inbox-bold-duotone" className="text-4xl mx-auto mb-2 opacity-50" />
                <p>No emails yet</p>
                <p className="text-xs mt-1 transition-colors duration-300 text-gray-500 dark:text-gray-600">
                  Click "Check Emails" to fetch new messages
                </p>
              </div>
            ) : (
              receivedEmails.map((email, i) => (
                <motion.div
                  key={email.messageId || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    email.type === 'interview' 
                      ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' 
                      : email.type === 'rejection'
                      ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                      : 'bg-gray-50/50 border-gray-200/50 hover:bg-gray-100/50 dark:bg-white/[0.02] dark:border-white/5 dark:hover:bg-white/[0.05]'
                  } ${!email.isRead ? 'ring-2 ring-orange-500/30' : ''}`}
                  onClick={async () => {
                    if (!email.isRead && token) {
                      try {
                        await axios.put(API_ENDPOINTS.MARK_EMAIL_READ(email.messageId), {}, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        setReceivedEmails(prev => prev.map(e => 
                          e.messageId === email.messageId ? { ...e, isRead: true } : e
                        ));
                      } catch (e) {
                        console.error('Error marking email as read:', e);
                      }
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      email.type === 'interview' ? 'bg-green-500/20 text-green-400' :
                      email.type === 'rejection' ? 'bg-red-500/20 text-red-400' :
                      email.type === 'follow-up' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      <Icon 
                        icon={
                          email.type === 'interview' ? 'solar:calendar-bold-duotone' :
                          email.type === 'rejection' ? 'solar:close-circle-bold-duotone' :
                          email.type === 'follow-up' ? 'solar:letter-bold-duotone' :
                          'solar:mailbox-bold-duotone'
                        }
                        width="24"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`font-bold text-base ${
                          email.type === 'interview' 
                            ? 'text-green-400' 
                            : 'text-[#1F2937] dark:text-white'
                        }`}>
                          {email.subject}
                        </h4>
                        {!email.isRead && (
                          <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-xs mb-2 transition-colors duration-300 text-gray-600 dark:text-gray-400">
                        {email.from}
                      </p>
                      {email.company && (
                        <p className="text-xs mb-1 transition-colors duration-300 text-gray-600 dark:text-gray-500">
                          {email.company}{email.jobTitle && ` • ${email.jobTitle}`}
                        </p>
                      )}
                      <p className="text-sm line-clamp-2 transition-colors duration-300 text-gray-700 dark:text-gray-300">
                        {email.body}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          email.type === 'interview' ? 'bg-green-500/20 text-green-400' :
                          email.type === 'rejection' ? 'bg-red-500/20 text-red-400' :
                          email.type === 'follow-up' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {email.type === 'interview' ? '🎉 Interview' :
                           email.type === 'rejection' ? 'Rejection' :
                           email.type === 'follow-up' ? 'Follow-up' :
                           'Other'}
                        </span>
                        {email.importance === 'high' && (
                          <span className="px-2 py-1 rounded-full text-xs bg-orange-500/20 text-orange-400 font-semibold">
                            High Priority
                          </span>
                        )}
                        <span className="text-xs transition-colors duration-300 text-gray-500 dark:text-gray-600">
                          {new Date(email.date).toLocaleDateString()} {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Uploaded Files Section */}
        {uploadedFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 glass-card rounded-[32px] p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold transition-colors duration-300 text-[#1F2937] dark:text-white">
                Uploaded Files
              </h3>
              <Icon 
                icon="solar:folder-bold-duotone" 
                className="text-gray-600 dark:text-gray-500" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedFiles.map((file, i) => (
                <motion.a
                  key={i}
                  href={token ? API_ENDPOINTS.getFileUrl(file.path) : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl border transition-all group cursor-pointer bg-gray-50/50 border-gray-200/50 hover:bg-gray-100/50 hover:border-orange-500/40 dark:bg-white/[0.02] dark:border-white/5 dark:hover:bg-white/[0.05] dark:hover:border-orange-500/30"
                  onClick={(e) => {
                    if (!token) e.preventDefault();
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center">
                    <Icon icon="solar:file-text-bold-duotone" width="24" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate group-hover:text-orange-400 transition-colors text-[#1F2937] dark:text-white">
                      {file.name}
                    </h4>
                    <p className="text-xs truncate transition-colors duration-300 text-gray-600 dark:text-gray-500">
                      {file.fileName || file.path.split('/').pop()}
                    </p>
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg transition-colors bg-gray-100/50 hover:bg-gray-200/50 dark:bg-white/5 dark:hover:bg-white/10"
                    title="Download file"
                  >
                    <Icon 
                      icon="solar:download-bold-duotone" 
                      width="20" 
                      className="transition-colors text-gray-600 group-hover:text-[#1F2937] dark:text-gray-400 dark:group-hover:text-white"
                    />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

