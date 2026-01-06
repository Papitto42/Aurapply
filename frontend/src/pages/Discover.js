import React, { useState, useContext } from 'react';
import SwipeableCard from '../components/SwipeableCard';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { AuthContext } from '../App';
import DashboardLayout from '../layouts/DashboardLayout';
import { API_ENDPOINTS } from '../config/api';

export default function Discover() {
  const { setToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [lastDirection, setLastDirection] = useState();
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); // 'sending', 'success', 'error'
  const [applyingJob, setApplyingJob] = useState(null);
  const token = localStorage.getItem('token');

  const analyzeText = async () => {
    if (!pastedText.trim()) {
      alert('Please paste some text first');
      return;
    }

    if (!token) {
      alert('Please log in to analyze job postings');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await axios.post(
        API_ENDPOINTS.ANALYZE_JOBS,
        { text: pastedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data && Array.isArray(res.data)) {
        if (res.data.length > 0) {
          setJobs(res.data);
          setShowPasteModal(false);
          setPastedText('');
        } else {
          alert('No jobs found in the pasted text. Please try again with different text.');
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to analyze text. Please check your OpenAI API key in the backend .env file.';
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const swiped = async (direction, job) => {
    setLastDirection(direction);
    
    if (direction === 'right') {
      if (token) {
        setApplyingJob(job);
        setApplicationStatus('sending');
        try {
          await axios.post(API_ENDPOINTS.APPLY_JOB, 
            { 
              jobTitle: job.title, 
              company: job.company,
              jobDescription: job.description || ''
            }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setApplicationStatus('success');
          setTimeout(() => {
            setApplicationStatus(null);
            setApplyingJob(null);
          }, 3000);
        } catch (e) {
          console.error('Apply error:', e);
          setApplicationStatus('error');
          setTimeout(() => {
            setApplicationStatus(null);
            setApplyingJob(null);
          }, 3000);
        }
      } else {
        if (window.confirm('Please create an account to apply for jobs. Would you like to sign up now?')) {
          window.location.href = '/auth';
        }
      }
    }
    
    // Remove swiped job
    setJobs(prev => prev.filter(j => j.id !== job.id));
    setTimeout(() => setLastDirection(null), 1000);
  };

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  return (
    <DashboardLayout fullscreen={true}>
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
          onClick={() => setShowPasteModal(true)}
          className="p-2 rounded-xl text-gray-500 hover:text-orange-500 hover:bg-orange-500/10 transition-all"
          title="Paste job text"
        >
          <Icon icon="solar:document-add-bold-duotone" width="20" height="20" />
        </button>
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
      
      <div className="h-full w-full bg-[#050505] relative flex flex-col items-center overflow-y-auto overflow-x-hidden pt-20 pb-20">
         <div className="bg-noise"></div>
         
         {/* Enhanced Background Atmosphere */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-[#050505]"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-[#050505]"></div>
         
         {/* Animated Gradient Orbs */}
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             x: [0, 50, 0],
             y: [0, 30, 0]
           }}
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -z-10"
         />
         <motion.div 
           animate={{ 
             scale: [1, 1.3, 1],
             x: [0, -40, 0],
             y: [0, -20, 0]
           }}
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[90px] -z-10"
         />

         {/* Live Opportunities Badge */}
         <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative z-20 text-center mb-8"
         >
           <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent border border-orange-500/30 backdrop-blur-2xl shadow-[0_0_30px_rgba(255,77,0,0.3)]">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 bg-orange-500 rounded-full shadow-[0_0_12px_rgba(255,77,0,1)]"
              ></motion.div>
              <span className="text-sm font-bold uppercase tracking-widest text-orange-400">Live Opportunities</span>
           </div>
         </motion.div>

       <div className="relative w-full max-w-xl mx-auto z-10 mb-28 px-4">
         {jobs.length === 0 && !isAnalyzing && (
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="flex flex-col items-center justify-center h-full text-gray-500"
           >
             <Icon icon="solar:document-add-bold-duotone" className="text-6xl mb-4 opacity-50" />
             <p className="font-medium text-lg mb-2">No jobs to display</p>
             <p className="text-sm text-gray-600 mb-6">Paste job text to get started</p>
             <motion.button
               onClick={() => setShowPasteModal(true)}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="px-6 py-3 rounded-full bg-orange-500 text-white font-bold flex items-center gap-2"
             >
               <Icon icon="solar:document-add-bold-duotone" width="20" />
               Paste Job Text
             </motion.button>
           </motion.div>
         )}

         {isAnalyzing && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex flex-col items-center justify-center h-full text-gray-400"
           >
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             >
               <Icon icon="solar:loading-bold-duotone" className="text-6xl mb-4" />
             </motion.div>
             <p className="font-medium text-lg">Analyzing job postings...</p>
             <p className="text-sm text-gray-600 mt-2">This may take a few seconds</p>
           </motion.div>
         )}

         {jobs.map((job, index) => (
           <SwipeableCard
             key={job.id}
             index={index}
             onSwipe={(dir) => swiped(dir, job)}
             preventSwipe={['up', 'down']}
           >
             <motion.div 
               whileHover={{ scale: 1.01, y: -4 }}
               className="relative w-full rounded-[32px] overflow-hidden border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] bg-gradient-to-br from-[#1a1a1a] via-[#151515] to-[#0a0a0a] group"
             >
               {/* Animated Background Gradient */}
               <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-transparent to-blue-500/15"></div>
               <motion.div 
                 animate={{ 
                   backgroundPosition: ['0% 0%', '100% 100%'],
                 }}
                 transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                 className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-purple-500/5 to-blue-500/5 opacity-50"
                 style={{ backgroundSize: '200% 200%' }}
               ></motion.div>
               
               {/* Subtle Grid Pattern */}
               <div className="absolute inset-0 opacity-[0.03]" style={{
                 backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                 backgroundSize: '40px 40px'
               }}></div>
               
               {/* Card Content */}
               <div className="relative p-8 flex flex-col z-10">
                  {/* Top Row */}
                  <div className="flex justify-between items-start mb-6">
                     <motion.div 
                       whileHover={{ scale: 1.05 }}
                       className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-500/10 backdrop-blur-xl border border-orange-500/30 flex items-center gap-2 shadow-[0_0_20px_rgba(255,77,0,0.2)]">
                        <Icon icon="solar:map-point-bold-duotone" className="text-orange-400" width="16"/>
                        <span className="text-xs font-bold text-white">{job.location}</span>
                     </motion.div>
                  </div>

                  {/* Action Buttons - Top Right Corner */}
                  <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
                     <motion.div 
                       whileHover={{ scale: 1.1, rotate: -10 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={(e) => {
                          e.stopPropagation();
                          swiped('left', job);
                       }}
                       className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/40 flex items-center justify-center text-red-400 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:border-red-500/60 transition-all backdrop-blur-xl"
                     >
                        <Icon icon="solar:close-circle-bold-duotone" width="24" />
                     </motion.div>
                     <motion.div 
                       whileHover={{ scale: 1.1, rotate: 10 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={(e) => {
                          e.stopPropagation();
                          swiped('right', job);
                       }}
                       className="h-14 w-14 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center text-black cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] transition-all border-2 border-white/20"
                     >
                        <Icon icon="solar:heart-bold-duotone" width="28" />
                     </motion.div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col mb-6">
                     <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3 bg-gradient-to-r from-white via-white to-gray-200 bg-clip-text text-transparent break-words">
                        {job.title}
                     </h2>
                     <p className="text-xl md:text-2xl text-gray-200 font-semibold mb-4 break-words">{job.company}</p>
                     
                     {job.type && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 backdrop-blur-md border border-white/15 w-fit shadow-lg mb-4">
                           <Icon icon="solar:clock-circle-bold-duotone" className="text-orange-400" width="14"/>
                           <span className="text-xs text-gray-300 font-semibold">{job.type}</span>
                        </div>
                     )}

                     {/* Description Preview */}
                     {job.description && (
                        <div className="mb-4">
                           <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 break-words">
                              {job.description}
                           </p>
                        </div>
                     )}

                     {/* Salary */}
                     <div className="py-3 px-4 rounded-xl bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-xl border border-white/15 flex items-center justify-between shadow-[0_4px_16px_rgba(0,0,0,0.2)] mb-4">
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Salary</span>
                        <span className="text-white font-extrabold text-lg break-words">{job.salary}</span>
                     </div>
                  </div>

                  {/* See More Button */}
                  <motion.button
                     onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(job);
                     }}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold flex items-center justify-center gap-2 hover:from-orange-500/30 hover:to-orange-500/20 transition-all"
                  >
                     <span>See More Details</span>
                     <Icon icon="solar:arrow-right-bold-duotone" width="18" />
                  </motion.button>
               </div>
               
               {/* Enhanced Shine effect on hover */}
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                  <motion.div 
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"
                  ></motion.div>
               </div>
               
               {/* Glow effect */}
               <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-blue-500/20 to-purple-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
             </motion.div>
           </SwipeableCard>
         ))}
       </div>
       

       {lastDirection && (
         <motion.div
           initial={{ opacity: 0, scale: 0.8, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.8, y: 20 }}
           className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-xl font-bold z-30 flex items-center gap-2 px-6 py-3 rounded-full bg-black/50 backdrop-blur-xl border border-white/10"
         >
           {lastDirection === 'right' ? (
             <>
               <Icon icon="solar:check-circle-bold-duotone" className="text-orange-500 text-2xl" />
               <span className="text-orange-500">Applying...</span>
             </>
           ) : (
             <>
               <Icon icon="solar:close-circle-bold-duotone" className="text-gray-500 text-2xl" />
               <span className="text-gray-400">Skipped</span>
             </>
           )}
         </motion.div>
       )}

       {/* Application Status Toast */}
       <AnimatePresence>
         {applicationStatus && (
           <motion.div
             initial={{ opacity: 0, y: 50, scale: 0.9 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 50, scale: 0.9 }}
             className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[200]"
           >
             <div className={`px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 ${
               applicationStatus === 'success' 
                 ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                 : applicationStatus === 'error'
                 ? 'bg-red-500/20 border-red-500/30 text-red-400'
                 : 'bg-orange-500/20 border-orange-500/30 text-orange-400'
             }`}>
               {applicationStatus === 'sending' && (
                 <>
                   <motion.div
                     animate={{ rotate: 360 }}
                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                   >
                     <Icon icon="solar:loading-bold-duotone" className="text-2xl" />
                   </motion.div>
                   <div>
                     <p className="font-bold text-base">Sending application...</p>
                     <p className="text-sm opacity-80">{applyingJob?.title} at {applyingJob?.company}</p>
                   </div>
                 </>
               )}
               {applicationStatus === 'success' && (
                 <>
                   <Icon icon="solar:check-circle-bold-duotone" className="text-3xl" />
                   <div>
                     <p className="font-bold text-base">Application sent!</p>
                     <p className="text-sm opacity-80">Email sent to appiahelliot1@gmail.com</p>
                   </div>
                 </>
               )}
               {applicationStatus === 'error' && (
                 <>
                   <Icon icon="solar:close-circle-bold-duotone" className="text-3xl" />
                   <div>
                     <p className="font-bold text-base">Failed to send</p>
                     <p className="text-sm opacity-80">Please check your email configuration</p>
                   </div>
                 </>
               )}
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Paste Text Modal */}
       <AnimatePresence>
         {showPasteModal && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
             onClick={() => setShowPasteModal(false)}
           >
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               onClick={(e) => e.stopPropagation()}
               className="bg-[#111] border border-white/10 rounded-[32px] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
             >
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-white">Paste Job Text</h2>
                 <button
                   onClick={() => setShowPasteModal(false)}
                   className="text-gray-500 hover:text-white transition"
                 >
                   <Icon icon="solar:close-circle-bold-duotone" width="24" />
                 </button>
               </div>
               <p className="text-gray-400 text-sm mb-4">
                 Paste text from any job posting website. Our AI will analyze it and extract job opportunities.
               </p>
               <textarea
                 value={pastedText}
                 onChange={(e) => setPastedText(e.target.value)}
                 placeholder="Paste job posting text here..."
                 className="w-full h-64 bg-[#050505] border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition mb-6 resize-none"
               />
               <div className="flex gap-4">
                 <motion.button
                   onClick={analyzeText}
                   disabled={isAnalyzing || !pastedText.trim()}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="flex-1 py-4 rounded-2xl bg-orange-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isAnalyzing ? (
                     <>
                       <motion.div
                         animate={{ rotate: 360 }}
                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                       >
                         <Icon icon="solar:loading-bold-duotone" width="20" />
                       </motion.div>
                       Analyzing...
                     </>
                   ) : (
                     <>
                       <Icon icon="solar:magnifier-bold-duotone" width="20" />
                       Analyze Jobs
                     </>
                   )}
                 </motion.button>
                 <motion.button
                   onClick={() => setShowPasteModal(false)}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="px-6 py-4 rounded-2xl bg-white/10 text-white font-bold border border-white/10 hover:bg-white/20 transition"
                 >
                   Cancel
                 </motion.button>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Job Detail Modal */}
       <AnimatePresence>
         {showJobDetail && selectedJob && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
             onClick={() => setShowJobDetail(false)}
           >
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               onClick={(e) => e.stopPropagation()}
               className="bg-[#111] border border-white/10 rounded-[32px] p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
             >
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-3xl font-bold text-white mb-2">{selectedJob.title}</h2>
                   <p className="text-xl text-gray-300">{selectedJob.company}</p>
                 </div>
                 <button
                   onClick={() => setShowJobDetail(false)}
                   className="text-gray-500 hover:text-white transition"
                 >
                   <Icon icon="solar:close-circle-bold-duotone" width="24" />
                 </button>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Location</p>
                   <p className="text-white font-bold">{selectedJob.location}</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Salary</p>
                   <p className="text-white font-bold">{selectedJob.salary}</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Type</p>
                   <p className="text-white font-bold">{selectedJob.type}</p>
                 </div>
                 {selectedJob.email && (
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Contact</p>
                     <p className="text-white font-bold text-sm">{selectedJob.email}</p>
                   </div>
                 )}
               </div>

               {selectedJob.description && (
                 <div className="mb-6">
                   <h3 className="text-lg font-bold text-white mb-3">Description</h3>
                   <p className="text-gray-300 leading-relaxed">{selectedJob.description}</p>
                 </div>
               )}

               {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                 <div className="mb-6">
                   <h3 className="text-lg font-bold text-white mb-3">Requirements</h3>
                   <ul className="space-y-2">
                     {selectedJob.requirements.map((req, idx) => (
                       <li key={idx} className="text-gray-300 flex items-start gap-2">
                         <Icon icon="solar:check-circle-bold-duotone" className="text-orange-500 mt-1 flex-shrink-0" width="16" />
                         <span>{req}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}

               <div className="flex gap-4 pt-6 border-t border-white/10">
                 <motion.button
                   onClick={() => {
                     setShowJobDetail(false);
                     swiped('right', selectedJob);
                   }}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="flex-1 py-4 rounded-2xl bg-orange-500 text-white font-bold flex items-center justify-center gap-2"
                 >
                   <Icon icon="solar:arrow-right-up-linear" width="20" />
                   Apply Now
                 </motion.button>
                 <motion.button
                   onClick={() => {
                     setShowJobDetail(false);
                     swiped('left', selectedJob);
                   }}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="px-6 py-4 rounded-2xl bg-white/10 text-white font-bold border border-white/10 hover:bg-white/20 transition"
                 >
                   Skip
                 </motion.button>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
