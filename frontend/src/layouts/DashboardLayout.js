import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Icon } from '@iconify/react';

export default function DashboardLayout({ children, fullscreen = false }) {
  return (
    <div className="min-h-screen flex bg-[#050505]">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 relative">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="lg:hidden h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40">
          <Link to="/" className="font-bold text-white hover:opacity-80 transition-opacity cursor-pointer">AurApply</Link>
          <Icon icon="solar:hamburger-menu-linear" className="text-white" width="24" />
        </div>

        <div className={fullscreen ? "h-[calc(100vh-4rem)]" : "p-8 max-w-[1400px] mx-auto"}>
           {children}
        </div>
      </main>
    </div>
  );
}

