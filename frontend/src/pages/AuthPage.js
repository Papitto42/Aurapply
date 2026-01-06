import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { AuthContext } from '../App';
import { API_ENDPOINTS } from '../config/api';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const { setToken } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!form.email || !form.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    if (!isLogin && !form.name) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }
    
    const endpoint = isLogin ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.REGISTER;
    try {
      const res = await axios.post(endpoint, form, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        // Redirect to dashboard after successful login
        navigate('/dashboard');
      } else {
        setIsLogin(true);
        setError('');
        // Show success message and redirect to login
        setTimeout(() => {
          alert("Account created successfully! Please login.");
          setForm({ email: form.email, password: '', name: '' });
        }, 100);
      }
    } catch (err) {
      console.error('Login/Register Error:', err);
      let errorMessage = "An error occurred. Please try again.";
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error') || err.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to server. Make sure the backend is running on port 5001.";
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = "Request timed out. Please check your connection and try again.";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid credentials. Please check your email and password.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative flex overflow-hidden">
      <div className="bg-noise"></div>

      {/* Background Gradients - Like the Lumina image */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-trust-blue/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Left: Typography */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center p-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Link to="/" className="flex items-center gap-2 mb-6 opacity-50 hover:opacity-70 transition-opacity cursor-pointer">
            <Icon icon="solar:atom-bold-duotone" className="text-orange-500" width="24" />
            <span className="text-sm font-mono tracking-[0.3em] uppercase">AurApply v2.0</span>
          </Link>
          
          <h1 className="text-7xl font-medium leading-[0.95] tracking-tighter mb-8 text-glow">
            Automate <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">
              The Future.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-md font-light">
            The creative intelligence engine dedicated to transforming how you land your next role.
          </p>

          {/* Social Proof / Stats */}
          <div className="flex gap-12 mt-16 border-t border-white/10 pt-8">
             <div>
                <h3 className="text-3xl font-bold text-white">99%</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Efficiency</p>
             </div>
             <div>
                <h3 className="text-3xl font-bold text-white">3</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Active Users</p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Right: The Glass Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md px-6"
        >
          <div className="glass-card p-10 rounded-[32px]">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2"
              >
                <Icon icon="solar:danger-triangle-bold-duotone" className="text-lg" />
                {error}
              </motion.div>
            )}

            <div className="flex justify-between items-center mb-10">
               <h2 className="text-2xl font-light text-white">{isLogin ? 'Welcome back' : 'Get Access'}</h2>
               <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center">
                  <Icon icon="solar:arrow-right-up-linear" width="20" />
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
              {!isLogin && (
                <div className="group">
                  <div className="relative flex items-center">
                    <Icon icon="solar:user-circle-bold-duotone" className="absolute left-4 text-gray-500" width="20"/>
                    <input 
                       type="text"
                       name="name"
                       id="name"
                       autoComplete="name"
                       placeholder="Full Name" 
                       value={form.name}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-orange-500/50 transition-all placeholder-gray-500"
                       onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                </div>
              )}
              
              <div className="relative flex items-center">
                <Icon icon="solar:letter-bold-duotone" className="absolute left-4 text-gray-500" width="20"/>
                <input 
                  type="email"
                  name="email"
                  id="email"
                  autoComplete={isLogin ? "email" : "username"}
                  placeholder="Email Address" 
                  value={form.email}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-orange-500/50 transition-all placeholder-gray-500"
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>

              <div className="relative flex items-center">
                <Icon icon="solar:lock-keyhole-bold-duotone" className="absolute left-4 text-gray-500" width="20"/>
                <input 
                  type="password"
                  name="password"
                  id="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder="Password" 
                  value={form.password}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-orange-500/50 transition-all placeholder-gray-500"
                  onChange={e => setForm({...form, password: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-bold py-4 rounded-2xl mt-4 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Icon icon="solar:loading-circle-bold-duotone" className="animate-spin" width="20" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Enter System' : 'Initialize'} 
                    <Icon icon="solar:arrow-right-linear" width="20" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
               <button 
                 onClick={() => {
                   setIsLogin(!isLogin);
                   setError('');
                   setForm({ email: '', password: '', name: '' });
                 }} 
                 className="text-sm text-gray-500 hover:text-white transition-colors"
               >
                 {isLogin ? "No account? Create one." : "Already have access? Login."}
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
