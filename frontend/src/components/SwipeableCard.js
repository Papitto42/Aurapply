import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function SwipeableCard({ 
  children, 
  onSwipe, 
  preventSwipe = [],
  index = 0 
}) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    if (preventSwipe.includes('left') && info.offset.x < 0) {
      x.set(0);
      return;
    }
    if (preventSwipe.includes('right') && info.offset.x > 0) {
      x.set(0);
      return;
    }

    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      setExitX(direction === 'right' ? 500 : -500);
      
      setTimeout(() => {
        if (onSwipe) onSwipe(direction);
      }, 200);
    } else {
      x.set(0);
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        zIndex: 1000 - index,
      }}
      drag={preventSwipe.includes('left') && preventSwipe.includes('right') ? false : 'x'}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 20 }}
      animate={{ 
        scale: exitX !== 0 ? 0.8 : 1, 
        y: exitX !== 0 ? -50 : 0,
        x: exitX,
        opacity: exitX !== 0 ? 0 : 1,
      }}
      exit={{ x: exitX, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  );
}

