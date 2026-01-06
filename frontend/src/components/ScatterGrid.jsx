import React, { useEffect, useRef } from 'react';

const ScatterGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Configuration
    const GRID_SPACING = 25;     // Distance between dots (reduced for more dots)
    const DOT_RADIUS = 1.5;      // Size of dots
    const MOUSE_RADIUS = 150;    // Area of effect around mouse
    const STRENGTH = 1000;       // How hard the dots scatter
    const DAMPING = 0.9;         // Friction (lower = more slippery)
    const RETURN_SPEED = 0.05;   // How fast they snap back
    const LINE_DISTANCE = 50;    // Maximum distance to draw lines between dots (adjusted for tighter grid)
    const LINE_OPACITY = 0.2;    // Base opacity for lines
    
    // Theme-aware colors
    const getThemeColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        return {
          base: "255, 150, 50",      // Orange base (darker orange)
          accent: "255, 77, 0",      // Bright orange accent
          bg: "#050505"               // Dark background
        };
      } else {
        return {
          base: "255, 150, 50",      // Orange base
          accent: "255, 77, 0",      // Bright orange accent
          bg: "#FAFAFA"               // Light background
        };
      }
    };
    
    let dots = [];
    let mouse = { x: -1000, y: -1000 }; // Start off-screen
    let animationFrameId = null;

    class Dot {
      constructor(x, y) {
        this.originX = x;        // Where it wants to be
        this.originY = y;
        this.x = x;              // Where it actually is
        this.y = y;
        this.vx = 0;             // Velocity X
        this.vy = 0;             // Velocity Y
      }

      update() {
        // 1. Calculate distance from mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 2. Repulsion Logic (Scatter away from mouse)
        if (distance < MOUSE_RADIUS) {
          const angle = Math.atan2(dy, dx);
          const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
          const pushX = Math.cos(angle) * force * STRENGTH * -0.01;
          const pushY = Math.sin(angle) * force * STRENGTH * -0.01;
          
          this.vx += pushX;
          this.vy += pushY;
        }

        // 3. Spring Logic (Return to origin)
        const springX = (this.originX - this.x) * RETURN_SPEED;
        const springY = (this.originY - this.y) * RETURN_SPEED;
        
        this.vx += springX;
        this.vy += springY;

        // 4. Physics (Friction)
        this.vx *= DAMPING;
        this.vy *= DAMPING;
        
        // 5. Apply movement
        this.x += this.vx;
        this.y += this.vy;
      }

      getDisplacement() {
        const dx = this.x - this.originX;
        const dy = this.y - this.originY;
        return Math.sqrt(dx * dx + dy * dy);
      }

      getVelocity() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      }

      draw(colors) {
        // Calculate displacement for color intensity
        const displacement = this.getDisplacement();
        
        // Color blends from base to accent based on movement
        const alpha = 0.3 + Math.min(displacement / 20, 0.7); // Brightens when moving
        const accentMix = Math.min(displacement / 10, 1); // Turns accent color when moving
        
        // Parse base and accent colors
        const baseParts = colors.base.split(', ').map(Number);
        const accentParts = colors.accent.split(', ').map(Number);
        
        // Interpolate between base and accent colors
        const r = baseParts[0] + (accentParts[0] - baseParts[0]) * accentMix;
        const g = baseParts[1] + (accentParts[1] - baseParts[1]) * accentMix;
        const b = baseParts[2] + (accentParts[2] - baseParts[2]) * accentMix;

        ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      dots = [];
      for (let x = GRID_SPACING / 2; x < width; x += GRID_SPACING) {
        for (let y = GRID_SPACING / 2; y < height; y += GRID_SPACING) {
          dots.push(new Dot(x, y));
        }
      }
    };

    const drawLines = (colors) => {
      // Parse colors
      const baseParts = colors.base.split(', ').map(Number);
      const accentParts = colors.accent.split(', ').map(Number);
      
      // Draw lines between nearby dots
      // Optimize by only checking nearby neighbors (within 2 grid spaces)
      for (let i = 0; i < dots.length; i++) {
        const dot1 = dots[i];
        
        // Only check dots that are likely to be nearby (within 2 grid spaces)
        // This reduces the number of distance calculations
        for (let j = i + 1; j < dots.length; j++) {
          const dot2 = dots[j];
          
          // Quick distance check (squared distance to avoid sqrt)
          const dx = dot2.x - dot1.x;
          const dy = dot2.y - dot1.y;
          const distSq = dx * dx + dy * dy;
          const maxDistSq = LINE_DISTANCE * LINE_DISTANCE;
          
          // Only draw lines if dots are close enough
          if (distSq < maxDistSq) {
            const distance = Math.sqrt(distSq);
            
            // Calculate movement intensity for both dots
            const displacement1 = dot1.getDisplacement();
            const displacement2 = dot2.getDisplacement();
            const velocity1 = dot1.getVelocity();
            const velocity2 = dot2.getVelocity();
            
            // Average movement intensity
            const avgDisplacement = (displacement1 + displacement2) / 2;
            const avgVelocity = (velocity1 + velocity2) / 2;
            
            // Line opacity increases with movement
            const movementIntensity = Math.min((avgDisplacement / 20) + (avgVelocity / 5), 1);
            const lineAlpha = LINE_OPACITY + (movementIntensity * 0.3);
            
            // Line color blends from base to accent based on movement
            const accentMix = Math.min(avgDisplacement / 15, 1);
            const r = baseParts[0] + (accentParts[0] - baseParts[0]) * accentMix;
            const g = baseParts[1] + (accentParts[1] - baseParts[1]) * accentMix;
            const b = baseParts[2] + (accentParts[2] - baseParts[2]) * accentMix;
            
            // Line opacity also fades with distance
            const distanceFade = 1 - (distance / LINE_DISTANCE);
            const finalAlpha = lineAlpha * distanceFade;
            
            // Draw the line
            ctx.strokeStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${finalAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(dot1.x, dot1.y);
            ctx.lineTo(dot2.x, dot2.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      const colors = getThemeColors();
      // Clear canvas (transparent background - page handles the bg color)
      ctx.clearRect(0, 0, width, height);
      
      // Update all dots first
      dots.forEach(dot => {
        dot.update();
      });
      
      // Draw lines between nearby dots
      drawLines(colors);
      
      // Then draw the dots on top
      dots.forEach(dot => {
        dot.draw(colors);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Watch for theme changes
    const themeObserver = new MutationObserver(() => {
      // Theme changed, colors will update on next frame
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    init();
    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      themeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default ScatterGrid;

