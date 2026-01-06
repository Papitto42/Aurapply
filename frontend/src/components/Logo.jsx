import React from 'react';

// Option 1: Aurora Atom (Recommended)
export const AuroraAtomLogo = ({ width = 300, height = 80, showText = true, className = "" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 300 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="auroraGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF4D00" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
      </defs>

      {/* ICON SECTION */}
      <g transform="translate(10, 10)">
        {/* Central Nucleus */}
        <circle cx="30" cy="30" r="6" fill="#FF4D00" />
        
        {/* Inner Orbit/Wave */}
        <path 
          d="M15 45C15 45 20 50 30 50C40 50 50 40 50 30" 
          stroke="url(#auroraGradient)" 
          strokeWidth="5" 
          strokeLinecap="round" 
        />
        
        {/* Outer Orbit/Wave */}
        <path 
          d="M10 25C10 15 20 5 35 5C50 5 60 15 60 30C60 45 50 55 35 55" 
          stroke="url(#auroraGradient)" 
          strokeWidth="5" 
          strokeLinecap="round" 
          opacity="0.8" 
        />
      </g>

      {/* TEXT SECTION */}
      {showText && (
        <g transform="translate(85, 52)">
          <text 
            fontFamily="'Inter', 'Roboto', sans-serif" 
            fontSize="38" 
            fontWeight="700" 
            letterSpacing="-1" 
            fill="currentColor"
            className="text-[#1F2937] dark:text-white"
          >
            Aur<tspan fill="#FF4D00">Apply</tspan>
          </text>
        </g>
      )}
    </svg>
  );
};

// Option 2: Network Grid A
export const NetworkGridLogo = ({ width = 300, height = 80, showText = true, className = "" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 300 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ICON SECTION */}
      <g transform="translate(10, 10)">
        {/* Grid Lines */}
        <path 
          d="M30 5 L10 55 L50 55 Z" 
          stroke="#FF4D00" 
          strokeWidth="2" 
          strokeLinejoin="round" 
          opacity="0.3"
        />
        <line x1="18" y1="35" x2="42" y2="35" stroke="#FF4D00" strokeWidth="3" />
        
        {/* Nodes */}
        <circle cx="30" cy="5" r="5" fill="#FF4D00" />
        <circle cx="20" cy="30" r="4" fill="#FF4D00" />
        <circle cx="40" cy="30" r="4" fill="#FF4D00" />
        <circle cx="10" cy="55" r="5" fill="#FF4D00" />
        <circle cx="50" cy="55" r="5" fill="#FF4D00" />
      </g>

      {/* TEXT SECTION */}
      {showText && (
        <g transform="translate(80, 52)">
          <text 
            fontFamily="'Inter', 'Roboto', sans-serif" 
            fontSize="38" 
            fontWeight="400" 
            letterSpacing="-0.5" 
            fill="currentColor"
            className="text-[#1F2937] dark:text-white"
          >
            Aur<tspan fontWeight="800" fill="#FF4D00">Apply</tspan>
          </text>
        </g>
      )}
    </svg>
  );
};

// Option 3: Bolt Arrow
export const BoltArrowLogo = ({ width = 300, height = 80, showText = true, className = "" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 300 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="boltGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF4D00" />
          <stop offset="100%" stopColor="#FF7F50" />
        </linearGradient>
      </defs>

      {/* ICON SECTION */}
      <g transform="translate(15, 8)">
        {/* Bolt Arrow Shape */}
        <path 
          d="M25 60 L15 35 L30 35 L20 0 L50 25 L35 25 L45 60 Z" 
          fill="url(#boltGradient)" 
          stroke="white" 
          strokeWidth="2"
        />
        {/* Motion lines */}
        <path d="M55 10 L65 5" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round" />
        <path d="M55 20 L70 15" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* TEXT SECTION */}
      {showText && (
        <g transform="translate(90, 52)">
          <text 
            fontFamily="'Inter', 'Roboto', sans-serif" 
            fontSize="38" 
            fontWeight="800" 
            letterSpacing="0" 
            fill="currentColor"
            className="text-[#1F2937] dark:text-white"
          >
            AUR<tspan fill="#FF4D00" fontWeight="400">APPLY</tspan>
          </text>
        </g>
      )}
    </svg>
  );
};

// Icon-only versions (for favicon, app icons, etc.)
export const AuroraAtomIcon = ({ size = 60, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 60 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF4D00" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
      </defs>

      <g>
        {/* Central Nucleus */}
        <circle cx="30" cy="30" r="6" fill="#FF4D00" />
        
        {/* Inner Orbit */}
        <path 
          d="M15 45C15 45 20 50 30 50C40 50 50 40 50 30" 
          stroke="url(#iconGradient)" 
          strokeWidth="5" 
          strokeLinecap="round" 
        />
        
        {/* Outer Orbit */}
        <path 
          d="M10 25C10 15 20 5 35 5C50 5 60 15 60 30C60 45 50 55 35 55" 
          stroke="url(#iconGradient)" 
          strokeWidth="5" 
          strokeLinecap="round" 
          opacity="1" 
        />
      </g>
    </svg>
  );
};

// Default export (using Aurora Atom as recommended)
const Logo = ({ variant = "aurora", width, height, showText = true, iconOnly = false, size, className = "" }) => {
  if (iconOnly) {
    return <AuroraAtomIcon size={size || 60} className={className} />;
  }

  switch (variant) {
    case "network":
      return <NetworkGridLogo width={width} height={height} showText={showText} className={className} />;
    case "bolt":
      return <BoltArrowLogo width={width} height={height} showText={showText} className={className} />;
    case "aurora":
    default:
      return <AuroraAtomLogo width={width} height={height} showText={showText} className={className} />;
  }
};

export default Logo;






