import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative p-2 sm:p-3 rounded-2xl transition-all duration-300 group flex items-center justify-center"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{ minWidth: '40px', minHeight: '40px' }}
    >
      {/* Light mode background - warm glow */}
      {!isDark && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-orange-500/20 rounded-2xl border border-orange-200/30"
        />
      )}
      
      {/* Dark mode background - subtle glow */}
      {isDark && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-white/10 rounded-2xl border border-white/10"
        />
      )}

      {/* Icon container - Bulb icon */}
      <div className="relative z-10 flex items-center justify-center w-6 h-6">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="bulb-on"
              initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Icon 
                icon="solar:lightbulb-bolt-bold-duotone" 
                width="24" 
                height="24"
                className="text-yellow-400"
              />
            </motion.div>
          ) : (
            <motion.div
              key="bulb-off"
              initial={{ scale: 0.8, opacity: 0, rotate: 180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: -180 }}
              transition={{ duration: 0.3 }}
            >
              <Icon 
                icon="solar:lightbulb-minimalistic-bold-duotone" 
                width="24" 
                height="24"
                className="text-gray-700"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover effect - additional glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(255, 193, 7, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, transparent 70%)'
        }}
      />
    </motion.button>
  );
}
