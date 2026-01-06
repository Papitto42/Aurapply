import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AuthContext } from '../App';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/discover', icon: 'solar:radar-bold-duotone' },
    { path: '/dashboard', icon: 'solar:widget-bold-duotone' },
  ];

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-[60] pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto flex items-center gap-6 backdrop-blur-2xl px-8 py-4 rounded-full transition-all duration-300 bg-white/80 border border-gray-200/50 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] dark:bg-[#111]/80 dark:border-white/10 dark:shadow-[0_0_40px_-10px_rgba(0,0,0,0.8)]"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="relative group">
              <div className={`p-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-[#1F2937] text-white dark:bg-white dark:text-black'
                  : 'text-gray-500 hover:text-[#1F2937] hover:bg-gray-100/50 dark:hover:text-white dark:hover:bg-white/5'
              }`}>
                <Icon icon={item.icon} width="28" height="28" />
              </div>
              {isActive && (
                <motion.div 
                  layoutId="dot" 
                  className="absolute -bottom-2 left-0 right-0 mx-auto w-1 h-1 rounded-full bg-[#1F2937] dark:bg-white"
                />
              )}
            </Link>
          );
        })}

        <div className="w-px h-8 mx-2 bg-gray-300/50 dark:bg-white/10"></div>

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="w-px h-8 mx-2 bg-gray-300/50 dark:bg-white/10"></div>

        <button 
          onClick={() => { 
            localStorage.removeItem('token'); 
            setToken(null);
            navigate('/auth');
          }} 
          className="p-3 rounded-2xl transition-all text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <Icon icon="solar:logout-3-bold-duotone" width="28" height="28" />
        </button>
      </motion.div>
    </div>
  );
}
