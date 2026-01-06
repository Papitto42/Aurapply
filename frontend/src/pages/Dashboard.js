import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { API_ENDPOINTS } from '../config/api';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [emailConfig, setEmailConfig] = useState({ user: '', pass: '' });
  const [totalApplications, setTotalApplications] = useState(0);
  const token = localStorage.getItem('token');

  // Extract fetch functions for reuse
  const fetchHistory = async () => {
    if (!token) {
      return [];
    }
    try {
      const res = await axios.get(API_ENDPOINTS.HISTORY, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      return Array.isArray(res.data) ? res.data : [];
    } catch (e) {
      console.error('[Dashboard] Error fetching history:', e);
      return [];
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
      console.error('[Dashboard] Error fetching config:', e);
      return { user: '', pass: '' };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [hist, config] = await Promise.all([
        fetchHistory(),
        fetchConfig()
      ]);
      
      // Set history - use empty array if backend returns empty, don't override with mocks
      setHistory(hist);
      setTotalApplications(hist.length);
      
      // Set config
      setEmailConfig({ user: config.user || '', pass: config.pass || '' });
    };
    
    fetchData();
  }, [token]);

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
    
    // Create FormData with correct field name
    const formData = new FormData();
    formData.append(e.target.name === 'resume' ? 'resume' : 'coverLetter', file);
    
    try {
      const endpoint = e.target.name === 'resume' ? API_ENDPOINTS.UPLOAD_CV : API_ENDPOINTS.UPLOAD_COVER_LETTER;
      const res = await axios.post(endpoint, formData, { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
      });
      
      // Only proceed if we get a success response
      if (res.data && (res.data.success || res.data.message || res.status === 200)) {
        alert("File uploaded successfully");
        
        // Refetch history from server to ensure sync
        setTimeout(async () => {
          const hist = await fetchHistory();
          setHistory(hist);
          setTotalApplications(hist.length);
        }, 1000);
      } else {
        throw new Error('Upload completed but no confirmation received.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      
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
    <div className="min-h-screen bg-[#050505] p-6 pt-12 pb-32 max-w-[1600px] mx-auto relative">
      <div className="bg-noise"></div>
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-10 px-2">
        <div>
           <h1 className="text-4xl font-medium text-white tracking-tight mb-1">Overview</h1>
           <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">System Status: Online</p>
        </div>
        <div className="flex gap-4">
           <div className="h-10 w-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 cursor-pointer transition">
              <Icon icon="solar:bell-bold-duotone" className="text-white" width="20" />
           </div>
           <div className="h-10 w-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 cursor-pointer transition">
              <Icon icon="solar:settings-bold-duotone" className="text-white" width="20" />
           </div>
        </div>
      </motion.div>

      {/* Bento Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6">
         
         {/* 1. Main Stats (Large) */}
         <motion.div variants={item} className="lg:col-span-2 row-span-2 glass-card rounded-[32px] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
               <Icon icon="solar:chart-square-bold-duotone" width="120" />
            </div>
            <h3 className="text-gray-400 mb-2">Total Applications</h3>
            <h2 className="text-6xl font-medium text-white mb-8">{totalApplications || history.length}</h2>
            
            <div className="h-32 w-full flex items-end gap-2">
               {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-white/10 rounded-t-lg hover:bg-orange-500 transition-colors duration-500"></div>
               ))}
            </div>
         </motion.div>

         {/* 2. Quick Actions */}
         <motion.div variants={item} className="glass-card rounded-[32px] p-6 flex flex-col justify-between hover:bg-white/[0.02] transition-colors relative cursor-pointer">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center mb-4">
               <Icon icon="solar:upload-square-bold-duotone" width="24" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-white">Upload CV</h3>
               <p className="text-sm text-gray-500 mt-1">Update your primary PDF assets.</p>
            </div>
            <input type="file" name="resume" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
         </motion.div>

         {/* 3. Email Config */}
         <motion.div variants={item} className="glass-card rounded-[32px] p-6 flex flex-col justify-between hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => {
           const user = prompt("Enter Gmail address:", emailConfig.user);
           const pass = prompt("Enter App Password:", emailConfig.pass);
           if (user && pass) {
             setEmailConfig({ user, pass });
             saveConfig(user, pass);
           }
         }}>
             <div className="h-12 w-12 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center mb-4">
               <Icon icon="solar:mailbox-bold-duotone" width="24" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-white">SMTP Setup</h3>
               <p className="text-sm text-gray-500 mt-1">Connect Gmail for automation.</p>
            </div>
         </motion.div>

         {/* 4. Recent Activity List (Long vertical) */}
         <motion.div variants={item} className="lg:col-span-2 glass-card rounded-[32px] p-8">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold">Recent Activity</h3>
               <Icon icon="solar:menu-dots-bold" className="text-gray-500" />
            </div>
            <div className="space-y-4">
               {history.map((app, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                     <div className="flex items-center gap-4">
                        {/* Company Logo (SVG Replacement) */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                          app.status === 'Uploaded' ? 'bg-green-500/20' :
                          app.status === 'Sent' ? 'bg-blue-500/20' :
                          app.status === 'Rejected' ? 'bg-red-500/20' :
                          'bg-white/10'
                        }`}>
                           <Icon 
                             icon={
                               app.status === 'Uploaded' ? 'solar:document-text-bold-duotone' :
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
                           <h4 className="font-bold text-white">{app.title || app.jobTitle || 'Activity'}</h4>
                           <p className="text-xs text-gray-500">{app.company || 'Unknown'}</p>
                        </div>
                     </div>
                     <div className={`px-3 py-1 rounded-full text-xs border ${
                        app.status === 'Sent' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 
                        app.status === 'Rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                        'bg-green-500/10 border-green-500/20 text-green-400'
                     }`}>
                        {app.status}
                     </div>
                  </div>
               ))}
            </div>
         </motion.div>

      </motion.div>
    </div>
  );
}
