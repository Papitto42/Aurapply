import React, { useState, useEffect } from 'react';

const InteractiveGridBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      
      {/* 1. The Base Grid Pattern 
          We use a repeating radial gradient to create the dots.
          Light mode: subtle gray dots, Dark mode: visible gray dots
      */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#CCCCCC 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px', // Adjust distance between dots
          opacity: 0.15
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none dark:block hidden"
        style={{
          backgroundImage: 'radial-gradient(#333333 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px',
          opacity: 0.3
        }}
      />

      {/* 2. The Mouse Spotlight Layer 
          This layer is brighter and follows the mouse. 
          We mask it so it only shows a circle around the cursor.
          Light mode: subtle dark spotlight, Dark mode: bright white spotlight
      */}
      <div 
        className="absolute inset-0 transition-opacity duration-300 hidden dark:block"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div 
        className="absolute inset-0 transition-opacity duration-300 block dark:hidden"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,0.03), transparent 40%)`,
        }}
      />

      {/* 3. The "Active" Grid Reveal 
          This duplicates the grid but makes it brighter (white) exactly where the mouse is,
          creating the effect that you are "lighting up" the dots.
          Light mode: darker dots, Dark mode: brighter white dots
      */}
      <div 
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px',
          opacity: isHovering ? 0.15 : 0,
          maskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none block dark:hidden"
        style={{
          backgroundImage: 'radial-gradient(#1F2937 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px',
          opacity: isHovering ? 0.2 : 0,
          maskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
        }}
      />

      {/* 4. Vignette Overlay 
          Darkens the corners of the screen to focus attention on the center 
          Light mode: subtle light vignette, Dark mode: dark vignette
      */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#FAFAFA] via-transparent to-[#FAFAFA]/80 dark:from-[#050505] dark:via-transparent dark:to-[#050505]/80" />
    </div>
  );
};

export default InteractiveGridBackground;

