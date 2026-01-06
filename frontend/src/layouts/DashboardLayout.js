import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Icon } from '@iconify/react';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

export default function DashboardLayout({ children, fullscreen = false }) {
  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-[#FAFAFA] dark:bg-[#050505]">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 relative">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="lg:hidden h-16 border-b border-gray-200/50 bg-white/80 dark:border-white/5 dark:bg-[#050505]/80 flex items-center justify-between px-6 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
          <Link to="/" className="hover:opacity-80 transition-opacity cursor-pointer">
            <Logo iconOnly size={32} />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Icon 
              icon="solar:hamburger-menu-linear" 
              className="text-[#1F2937] dark:text-white" 
              width="24" 
            />
          </div>
        </div>

        <div className={fullscreen ? "h-[calc(100vh-4rem)]" : "p-8 max-w-[1400px] mx-auto"}>
           {children}
        </div>
      </main>
    </div>
  );
}

