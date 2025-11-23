import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

/**
 * Context-aware glow/shine effect card component
 * Features:
 * - Duplicates and scales the icon
 * - Translates it on pointermove
 * - Applies feGaussianBlur for glow effect
 */
export default function GlowCard({ 
  children, 
  icon, 
  iconSize = 24,
  glowColor = 'rgba(255, 77, 0, 0.6)',
  className = '',
  onClick,
  as: Component = motion.div,
  ...props 
}) {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [cardCenter, setCardCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardCenter({
        x: rect.width / 2,
        y: rect.height / 2
      });
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset glow to center
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: rect.width / 2,
        y: rect.height / 2
      });
    }
  };

  // Calculate offset from center for smooth glow movement
  const offsetX = mousePosition.x - cardCenter.x;
  const offsetY = mousePosition.y - cardCenter.y;
  
  // Scale based on distance from center (more dramatic effect)
  const distanceFromCenter = Math.sqrt(offsetX ** 2 + offsetY ** 2);
  const maxDistance = Math.sqrt(cardCenter.x ** 2 + cardCenter.y ** 2);
  const intensity = Math.min(distanceFromCenter / maxDistance, 1);

  return (
    <>
      {/* SVG Filter Definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={`glow-filter-${icon || 'default'}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      <Component
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={`relative overflow-hidden ${className}`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {/* Glow Effect Layer - Duplicated Icon that follows cursor */}
        {icon && (
          <div
            className="absolute pointer-events-none transition-all duration-300 ease-out"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              transform: `translate(-50%, -50%) scale(${2.5 + intensity * 2})`,
              opacity: isHovered ? 0.4 : 0,
              filter: `url(#glow-filter-${icon || 'default'})`,
              color: glowColor,
              willChange: 'transform, opacity',
            }}
          >
            <Icon 
              icon={icon} 
              width={iconSize * 2} 
              style={{ 
                filter: `drop-shadow(0 0 20px ${glowColor})`,
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Additional shine overlay for extra effect */}
        {isHovered && (
          <motion.div
            className="absolute pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              width: '200px',
              height: '200px',
              background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(20px)',
            }}
          />
        )}
      </Component>
    </>
  );
}

