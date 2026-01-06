# Frontend Style Guide - Complete Reference

This document provides a comprehensive breakdown of all styling patterns, colors, animations, and design system used in the AurApply frontend. Use this as a reference to recreate the design system.

---

## Table of Contents
1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Component Styles](#component-styles)
5. [Animations & Effects](#animations--effects)
6. [Theme System](#theme-system)
7. [Utility Classes](#utility-classes)
8. [Background Effects](#background-effects)
9. [Button Styles](#button-styles)
10. [Card Styles](#card-styles)
11. [Form Styles](#form-styles)

---

## Color System

### Primary Colors (Theme-Aware)

#### Light Mode
```css
--background: 250 250 250;        /* #FAFAFA - Main background */
--surface: 255 255 255;           /* #FFFFFF - Card/surface background */
--text-primary: 31 41 55;         /* #1F2937 - Main text */
--text-secondary: 75 85 99;       /* #4B5563 - Secondary text */
--text-tertiary: 107 114 128;     /* #6B7280 - Tertiary text */
--border: 229 231 235;            /* #E5E7EB - Borders (gray-200) */
```

#### Dark Mode
```css
--background: 15 15 15;          /* #0F0F0F - Main background */
--surface: 21 21 21;             /* #151515 - Card/surface background */
--text-primary: 255 255 255;      /* #FFFFFF - Main text */
--text-secondary: 209 213 219;    /* #D1D5DB - Secondary text (gray-300) */
--text-tertiary: 156 163 175;    /* #9CA3AF - Tertiary text (gray-400) */
--border: 255 255 255;            /* White borders with opacity */
```

### Accent Colors (Same for Both Themes)
```css
--primary-accent: #FF4D00;        /* Primary orange */
--primary-orange: #FF4D00;
--primary-orange-light: #FF6B35;
--trust-blue: #0066FF;
--trust-blue-dark: #0052CC;
--success-green: #10B981;
--success-green-dark: #059669;
```

### Usage in Tailwind
```javascript
// tailwind.config.js
colors: {
  background: 'rgb(var(--background) / <alpha-value>)',
  surface: 'rgb(var(--surface) / <alpha-value>)',
  primary: 'rgb(var(--text-primary) / <alpha-value>)',
  secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
  tertiary: 'rgb(var(--text-tertiary) / <alpha-value>)',
  border: 'rgb(var(--border) / <alpha-value>)',
  'trust-blue': '#0066FF',
  'trust-blue-dark': '#0052CC',
  'success-green': '#10B981',
  'primary-orange': '#FF4D00',
  'primary-orange-light': '#FF6B35',
}
```

---

## Typography

### Font Family
```css
font-family: 'Inter', sans-serif;
```

### Font Sizes & Weights

#### Headings
```css
/* Hero Headline */
text-5xl md:text-6xl lg:text-7xl
font-medium
tracking-tighter
leading-[1.05]

/* Section Headings */
text-5xl md:text-6xl
font-medium
tracking-tight

/* Subheadings */
text-2xl md:text-3xl
font-semibold

/* Card Titles */
text-xl
font-bold
```

#### Body Text
```css
/* Primary Body */
text-base
text-[#1F2937] dark:text-white

/* Secondary Body */
text-sm
text-gray-600 dark:text-gray-400

/* Tertiary/Muted */
text-xs
text-gray-500 dark:text-gray-600
uppercase tracking-widest
```

### Text Effects
```css
/* Glow Text */
.text-glow {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

/* Gradient Text */
bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent
```

---

## Spacing & Layout

### Container Widths
```css
max-w-7xl mx-auto        /* Main content containers */
max-w-5xl mx-auto        /* Narrower sections */
max-w-3xl mx-auto        /* Forms/modals */
max-w-[1400px] mx-auto   /* Dashboard content */
max-w-[1600px] mx-auto   /* Wide dashboard */
```

### Padding
```css
p-6                      /* Standard padding */
p-8                      /* Card padding */
p-10 p-12                /* Large sections */
px-6 lg:px-8             /* Horizontal padding */
py-16 py-32              /* Vertical spacing */
```

### Gaps
```css
gap-4                    /* Standard gap */
gap-6                    /* Card grid gaps */
gap-8                    /* Section spacing */
```

### Border Radius
```css
rounded-xl               /* 12px - Standard cards */
rounded-2xl               /* 16px - Larger cards */
rounded-3xl               /* 24px - Hero sections */
rounded-[32px]            /* 32px - Premium cards */
rounded-full              /* Pills, buttons, avatars */
```

---

## Component Styles

### Glass Morphism Cards
```css
.glass-card {
  @apply backdrop-blur-xl transition-all duration-300;
  background: linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.9) 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
}

.dark .glass-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}
```

### Glass Panel (Alternative)
```css
.glass-panel {
  @apply backdrop-blur-xl;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
}

.dark .glass-panel {
  background: rgba(10, 10, 10, 0.8);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}
```

### Navigation Items
```css
/* Active State */
.nav-item.active {
  @apply font-semibold bg-[#1F2937] text-white shadow-[0_0_15px_rgba(31,41,55,0.3)];
}

.dark .nav-item.active {
  @apply bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)];
}

/* Inactive State */
.nav-item.inactive {
  @apply transition-all duration-300 text-gray-500;
  @apply hover:text-[#1F2937] hover:bg-gray-100/50;
}

.dark .nav-item.inactive {
  @apply hover:text-white hover:bg-white/5;
}
```

---

## Animations & Effects

### Text Clip Animation (Letter by Letter)
```css
.text-clip-container {
  display: inline-block;
  overflow: hidden;
}

.text-clip-letter {
  display: inline-block;
  transform: translateY(100%);
  animation: textClipSlideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes textClipSlideDown {
  from {
    transform: translateY(100%);
    clip-path: inset(100% 0 0 0);
  }
  to {
    transform: translateY(0);
    clip-path: inset(0 0 0 0);
  }
}
```

### Typewriter Effect
```css
.typewriter-text {
  @apply inline-block relative z-10;
  opacity: 1 !important;
  visibility: visible !important;
  min-width: 0;
  white-space: pre-wrap;
  color: #1F2937 !important;
}

.dark .typewriter-text {
  color: white !important;
}

.typewriter-cursor {
  display: inline-block;
  color: #FF4D00 !important;
  font-weight: 300;
  margin-left: 2px;
  opacity: 1;
  animation: blinkCursor 1s step-end infinite;
}

@keyframes blinkCursor {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

### Border Beam Animation
```css
@keyframes border-beam {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.border-beam {
  position: relative;
  overflow: hidden;
}

.border-beam::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 77, 0, 0.8), transparent);
  background-size: 200% 100%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: border-beam 2s linear infinite;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.border-beam:hover::before {
  opacity: 1;
}
```

### Flashlight Effect (Mouse Follow)
```css
.flashlight-effect {
  position: relative;
  overflow: hidden;
}

.flashlight-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  background: radial-gradient(
    circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 77, 0, 0.4) 0%,
    rgba(255, 77, 0, 0.15) 30%,
    transparent 60%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.flashlight-border:hover::before {
  opacity: 1;
}
```

### Marquee Animation
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.marquee-container {
  position: relative;
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}

.marquee-content {
  display: flex;
  animation: marquee 30s linear infinite;
  will-change: transform;
}

.marquee-content:hover {
  animation-play-state: paused;
}
```

### Clip Column Animation
```css
@keyframes clipColumn {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}

.clip-column {
  animation: clipColumn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

---

## Theme System

### Theme Context Implementation
```javascript
// ThemeContext.js structure
const ThemeContext = createContext(null);

// Theme values
theme: 'dark' | 'light'
isDark: boolean
isLight: boolean
toggleTheme: () => void
```

### CSS Variables Setup
```css
:root {
  /* Light Mode (Default) */
  --background: 250 250 250;
  --surface: 255 255 255;
  --text-primary: 31 41 55;
  --text-secondary: 75 85 99;
  --text-tertiary: 107 114 128;
  --border: 229 231 235;
}

.dark {
  /* Dark Mode */
  --background: 15 15 15;
  --surface: 21 21 21;
  --text-primary: 255 255 255;
  --text-secondary: 209 213 219;
  --text-tertiary: 156 163 175;
  --border: 255 255 255;
}
```

### Body Styles
```css
body {
  @apply overflow-x-hidden antialiased bg-background text-primary;
  font-family: 'Inter', sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

---

## Utility Classes

### Noise Texture (Film Grain)
```css
.bg-noise {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 50;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
}

.dark .bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
}
```

### Monochrome Logo Effect
```css
.mono-logo {
  filter: grayscale(100%) brightness(200%);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.mono-logo:hover {
  filter: grayscale(0%) brightness(100%);
  opacity: 1;
}
```

### Custom Scrollbar
```css
::-webkit-scrollbar { 
  width: 6px; 
}

::-webkit-scrollbar-track {
  background: #FAFAFA;
}

.dark ::-webkit-scrollbar-track {
  background: #050505;
}

::-webkit-scrollbar-thumb {
  background: #D1D5DB;
}

.dark ::-webkit-scrollbar-thumb {
  background: #333;
}

::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

---

## Background Effects

### Scatter Grid (Physics-Based)
- **Grid Spacing**: 25px
- **Dot Radius**: 1.5px
- **Mouse Radius**: 150px
- **Strength**: 1000
- **Damping**: 0.9
- **Return Speed**: 0.05
- **Line Distance**: 50px
- **Colors**: Theme-aware orange gradient

### Interactive Grid Background
```css
/* Base Grid Pattern */
background-image: radial-gradient(#CCCCCC 1.5px, transparent 1.5px);
background-size: 30px 30px;
opacity: 0.15; /* Light mode */

/* Dark mode */
background-image: radial-gradient(#333333 1.5px, transparent 1.5px);
opacity: 0.3;

/* Mouse Spotlight */
background: radial-gradient(
  600px circle at ${mouseX}px ${mouseY}px,
  rgba(255,255,255,0.06),
  transparent 40%
);
```

### Gradient Orbs (Floating)
```css
/* Orange Orb */
w-[600px] h-[600px]
bg-orange-500/18
blur-[120px]
animate: scale [1, 1.2, 1], x [0, 50, 0], y [0, 30, 0]
duration: 8s

/* Blue Orb */
w-[500px] h-[500px]
bg-trust-blue/18
blur-[100px]
animate: scale [1, 1.3, 1], x [0, -40, 0], y [0, -20, 0]
duration: 10s
```

---

## Button Styles

### Parallelogram Button
```css
.parallelogram-button {
  position: relative;
  display: inline-block;
  transform: skewX(-12deg);
  transition: all 0.3s ease;
  overflow: hidden;
}

.parallelogram-button-content {
  transform: skewX(12deg);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.parallelogram-button-white {
  background: white;
  color: black;
}

.parallelogram-button-outlined {
  background: black;
  border: 2px solid;
  color: inherit;
}

.parallelogram-button:hover {
  transform: skewX(-12deg) scale(1.05);
}
```

### Standard Buttons
```css
/* Primary Button */
px-5 py-2.5
bg-gradient-to-r from-orange-500 to-orange-600
text-white (or text-black)
rounded-full
font-bold
hover:from-orange-400 hover:to-orange-500
shadow-lg shadow-orange-500/20

/* Secondary Button */
px-5 py-2.5
bg-white/8
border border-white/20
rounded-full
text-white
hover:bg-white/15

/* Icon Button */
p-2 rounded-xl
transition-all duration-300
hover:bg-white/5
```

### Control Bar Buttons (Fixed Top Right)
```css
fixed top-4 right-6 z-[100]
flex items-center gap-4
backdrop-blur-2xl
px-4 py-2
rounded-full
bg-white/80 border border-gray-200/50
dark:bg-[#111]/80 dark:border-white/10
shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]
dark:shadow-[0_0_40px_-10px_rgba(0,0,0,0.8)]
```

---

## Card Styles

### Standard Card
```css
glass-card
rounded-[32px]
p-8
border border-gray-200/50 dark:border-white/20
bg-white/80 dark:bg-[#151515]/80
backdrop-blur-xl
```

### Bento Grid Card
```css
glass-card
rounded-[32px]
p-6 or p-8
hover:bg-white/[0.02]
transition-colors
relative overflow-hidden
```

### Feature Card (Glow Effect)
```css
relative p-8 rounded-2xl
border backdrop-blur-xl
hover:border-orange-500/40
transition-all overflow-hidden
flashlight-effect flashlight-border
bg-gradient-to-br from-orange-500/20 via-white to-blue-500/20
dark:from-orange-500/8 dark:via-[#151515] dark:to-trust-blue/8
border-gray-200/50 dark:border-white/20
```

### Status Badge
```css
px-3 py-1 rounded-full text-xs border

/* Sent */
bg-blue-500/10 border-blue-500/20 text-blue-400

/* Rejected */
bg-red-500/10 border-red-500/20 text-red-400

/* Uploaded */
bg-green-500/10 border-green-500/20 text-green-400
```

---

## Form Styles

### Input Fields
```css
w-full
bg-white/5
border border-white/10
rounded-2xl
py-4 pl-12 pr-4
text-white
outline-none
focus:border-orange-500/50
transition-all
placeholder-gray-500
```

### Textarea
```css
w-full
h-64
bg-[#050505]
border border-white/10
rounded-2xl
p-4
text-white
placeholder-gray-500
focus:outline-none
focus:border-orange-500/50
transition
resize-none
```

### Form Container
```css
glass-card
p-10
rounded-[32px]
```

---

## Special Effects

### Glow Card (Icon Follow Cursor)
- Uses SVG filters with `feGaussianBlur`
- Duplicates icon and scales based on mouse position
- Applies radial gradient glow effect
- Opacity changes on hover

### Swipeable Cards
- Uses Framer Motion drag constraints
- Rotates based on drag distance
- Opacity fades at edges
- Spring animation on release

### Loading States
```css
/* Spinner */
animate-spin
duration: 1s
repeat: infinite
ease: linear

/* Pulse */
animate-pulse

/* Scale Animation */
animate: scale [0, 1.2, 1]
duration: 0.5s
```

---

## Shadows

### Card Shadows
```css
/* Light Mode */
shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]

/* Dark Mode */
shadow-[0_0_40px_-10px_rgba(0,0,0,0.8)]

/* Glow Shadow */
shadow-[0_0_20px_rgba(255,77,0,0.3)]
```

### Text Shadows
```css
text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
```

---

## Z-Index Scale
```css
z-0          /* Background layers */
z-10         /* Content */
z-20         /* Overlays */
z-30         /* Modals */
z-40         /* Mobile header */
z-50         /* Sidebar, noise texture */
z-[60]       /* Bottom navbar */
z-[100]      /* Fixed control bars */
z-[200]      /* Modals, dropdowns */
```

---

## Responsive Breakpoints
```css
sm: 640px    /* Small devices */
md: 768px    /* Tablets */
lg: 1024px   /* Desktops */
xl: 1280px   /* Large desktops */
```

---

## Framer Motion Patterns

### Page Transitions
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}
```

### Stagger Children
```javascript
const container = { 
  hidden: { opacity: 0 }, 
  show: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  } 
};

const item = { 
  hidden: { y: 20, opacity: 0 }, 
  show: { y: 0, opacity: 1 } 
};
```

### Hover Effects
```javascript
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### Layout Animations
```javascript
layoutId="dot"  // For shared element transitions
```

---

## Icon System

### Icon Library
- **Library**: Iconify (Solar Icons)
- **Size**: Typically 20-24px for UI, 28px for buttons
- **Color**: Inherits text color, or specific theme colors

### Common Icons
```javascript
solar:widget-bold-duotone        // Dashboard
solar:radar-bold-duotone        // Discover
solar:chart-square-bold-duotone  // Analytics
solar:settings-bold-duotone      // Settings
solar:upload-square-bold-duotone // Upload
solar:mailbox-bold-duotone       // Email
solar:logout-3-bold-duotone      // Logout
solar:palette-bold-duotone       // Theme
```

---

## Selection Styles
```css
selection:bg-orange-500/30
selection:text-white
```

---

## Key Design Principles

1. **Glassmorphism**: Heavy use of backdrop-blur with semi-transparent backgrounds
2. **Minimal Borders**: Subtle borders with low opacity (5-20%)
3. **Smooth Transitions**: All interactive elements use 300ms transitions
4. **Theme Consistency**: All colors adapt to light/dark mode
5. **Physics-Based**: Scatter grid uses real physics calculations
6. **Context-Aware**: Effects respond to mouse position and hover states
7. **Layered Depth**: Multiple z-index layers create depth
8. **Gradient Accents**: Orange and blue gradients for visual interest

---

## Implementation Notes

- All colors use CSS variables for theme switching
- Dark mode is class-based (`dark` class on `html` element)
- Animations use Framer Motion for complex interactions
- Canvas-based effects (ScatterGrid) for performance
- SVG filters for glow effects
- CSS masks for advanced clipping effects

---

This style guide should provide everything needed to recreate the AurApply frontend design system. All values are exact and can be directly implemented.

