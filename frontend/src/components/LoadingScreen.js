import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Glass Panel Container */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-[32px] p-16 relative overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, rgba(255,77,0,0.1) 0%, rgba(59,130,246,0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: '400px',
            minHeight: '400px'
          }}
        >
          {/* Loading Animation - 2x2 Grid of Teardrops */}
          <div className="grid grid-cols-2 gap-12 items-center justify-center py-8">
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.3, scale: 0.8 }}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 relative"
              >
                {/* Teardrop Shape */}
                <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0">
                  <defs>
                    <linearGradient id={`teardrop-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                      <stop offset="50%" stopColor="rgba(150,150,150,0.6)" />
                      <stop offset="100%" stopColor="rgba(80,80,80,0.3)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M40 10 Q40 20 45 30 Q50 40 50 50 Q50 60 45 65 Q40 70 35 65 Q30 60 30 50 Q30 40 35 30 Q40 20 40 10 Z"
                    fill={`url(#teardrop-${index})`}
                  />
                </svg>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Copyright Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 left-0 right-0 text-center text-gray-600 text-sm"
      >
        <p>© 2025 AurApply Inc. Crafted for the ambitious.</p>
      </motion.div>
    </div>
  );
}

