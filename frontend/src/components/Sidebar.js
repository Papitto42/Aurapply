import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import ThemeToggle from './ThemeToggle';
import { AuroraAtomIcon } from './Logo';

export default function Sidebar() {
  const location = useLocation();
  const [userProfile, setUserProfile] = useState({ name: 'Elliot Appiah', jobTitle: 'Full stack dev' });
  const profileRef = useRef(userProfile);
  
  useEffect(() => {
    profileRef.current = userProfile;
  }, [userProfile]);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user profile
      axios.get(API_ENDPOINTS.USER_PROFILE, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data && res.data.name) {
          const updatedProfile = { 
            name: res.data.name || 'Elliot Appiah',
            jobTitle: res.data.jobTitle || 'Full stack dev',
            avatar: res.data.avatar || null
          };
          setUserProfile(updatedProfile);
          profileRef.current = updatedProfile;
        }
      })
      .catch(() => {
        // Fallback to localStorage if available
        try {
          const savedProfiles = JSON.parse(localStorage.getItem('savedProfiles') || '{}');
          if (savedProfiles[token]) {
            setUserProfile(savedProfiles[token]);
            profileRef.current = savedProfiles[token];
          }
        } catch (e) {}
      });
    }
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const savedProfiles = JSON.parse(localStorage.getItem('savedProfiles') || '{}');
          if (savedProfiles[token]) {
            setUserProfile(savedProfiles[token]);
            profileRef.current = savedProfiles[token];
          }
        } catch (e) {}
      }
    };
    
    const handleStorageChange = () => {
      handleProfileUpdate();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    // Also check on interval for same-tab updates
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const savedProfiles = JSON.parse(localStorage.getItem('savedProfiles') || '{}');
          if (savedProfiles[token] && savedProfiles[token].name !== profileRef.current.name) {
            setUserProfile(savedProfiles[token]);
            profileRef.current = savedProfiles[token];
          }
        } catch (e) {}
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      clearInterval(interval);
    };
  }, []);
  
  const getInitials = (name) => {
    if (!name) return 'EA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const links = [
    { name: 'Overview', path: '/dashboard', icon: 'solar:widget-bold-duotone' },
    { name: 'Discover', path: '/discover', icon: 'solar:radar-bold-duotone' },
    { name: 'Analytics', path: '/analytics', icon: 'solar:chart-square-bold-duotone' },
    { name: 'Settings', path: '/settings', icon: 'solar:settings-bold-duotone' },
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-gray-200/50 bg-white dark:border-white/5 dark:bg-[#050505] z-50 transition-colors duration-300">
      {/* Logo Area */}
      <Link to="/" className="p-8 flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
        <div className="w-8 h-8 flex items-center justify-center">
          <AuroraAtomIcon size={32} />
        </div>
        <span className="font-bold text-xl tracking-tight text-[#1F2937] dark:text-white">
          AurApply
        </span>
      </Link>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-2">
        <p className="px-4 text-xs font-mono mb-4 uppercase tracking-widest text-gray-500 dark:text-gray-600">
          Main Menu
        </p>
        {links.map((link) => (
          <Link key={link.path} to={link.path}>
            <div className={`nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === link.path ? 'active' : 'inactive'}`}>
              <Icon icon={link.icon} width="20" />
              <span className="text-sm">{link.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 bg-gray-50 border border-gray-200/50 dark:bg-white/5 dark:border-white/5">
          <Icon icon="solar:palette-bold-duotone" width="20" className="text-gray-600 dark:text-gray-400" />
          <span className="text-sm flex-1 text-gray-600 dark:text-gray-400">Theme</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Bottom User Profile */}
      <div className="p-4 border-t border-gray-200/50 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200/50 bg-gray-50 dark:bg-white/5 dark:border-white/5 transition-colors duration-300">
          {userProfile.avatar ? (
            <img 
              src={userProfile.avatar.startsWith('http') ? userProfile.avatar : API_ENDPOINTS.getFileUrl(userProfile.avatar)} 
              alt={userProfile.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-300/50 dark:border-white/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold text-white">
              {getInitials(userProfile.name)}
            </div>
          )}
          <div className="overflow-hidden flex-1 min-w-0">
            <h4 className="text-sm font-bold truncate text-[#1F2937] dark:text-white">
              {userProfile.name}
            </h4>
            <p className="text-xs truncate text-gray-600 dark:text-gray-500">
              {userProfile.jobTitle || 'Pro Plan Active'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

