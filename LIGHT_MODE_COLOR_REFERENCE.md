# Light Mode Color Reference Guide

This document provides all the color mappings for converting the dark theme to light theme.

## Base Colors

### Backgrounds
- Dark: `bg-[#0F0F0F]` → Light: `bg-[#FAFAFA]`
- Dark: `bg-[#050505]` → Light: `bg-[#FAFAFA]`
- Dark: `bg-[#151515]` → Light: `bg-white`
- Dark: `bg-[#1A1A1A]` → Light: `bg-white`
- Dark: `bg-[#0A0A0A]` → Light: `bg-white`

### Text Colors
- Dark: `text-white` → Light: `text-[#1F2937]`
- Dark: `text-gray-300` → Light: `text-gray-700`
- Dark: `text-gray-400` → Light: `text-gray-600`
- Dark: `text-gray-500` → Light: `text-gray-600`
- Dark: `text-gray-600` → Light: `text-gray-500`

### Borders
- Dark: `border-white/20` → Light: `border-gray-200/50`
- Dark: `border-white/10` → Light: `border-gray-200/50`
- Dark: `border-white/5` → Light: `border-gray-200/30`
- Dark: `border-white/30` → Light: `border-gray-300/50`

### Glass/Card Backgrounds
- Dark: `bg-white/5` → Light: `bg-gray-50/50`
- Dark: `bg-white/8` → Light: `bg-gray-50/50`
- Dark: `bg-white/10` → Light: `bg-gray-100/50`
- Dark: `bg-white/15` → Light: `bg-gray-100/50`
- Dark: `bg-[#151515]/80` → Light: `bg-white/80`
- Dark: `bg-[#151515]/90` → Light: `bg-white/90`
- Dark: `bg-[#0F0F0F]/60` → Light: `bg-gray-50/60`
- Dark: `bg-[#0F0F0F]/80` → Light: `bg-gray-50/80`

## Component-Specific Mappings

### Navbar
```jsx
// Dark
className="bg-[#151515]/80 border-b border-white/20"
// Light
className="bg-white/80 border-b border-gray-200/50"

// Dark
className="bg-[#151515]/95"
// Light
className="bg-white/95"

// Dark
className="bg-[#151515]/90"
// Light
className="bg-white/90"
```

### Navigation Buttons
```jsx
// Dark
className="text-gray-300 hover:text-white hover:bg-white/8"
// Light
className="text-gray-600 hover:text-[#1F2937] hover:bg-gray-100/50"

// Active state
// Dark
className="bg-white text-black"
// Light
className="bg-[#1F2937] text-white"
```

### Cards
```jsx
// Dark
className="border border-white/20 bg-[#151515]/80"
// Light
className="border border-gray-200/50 bg-white/80"

// Dark
className="bg-white/5 border border-white/10"
// Light
className="bg-gray-50/50 border border-gray-200/50"

// Dark
className="bg-white/8 hover:bg-white/15"
// Light
className="bg-gray-50/50 hover:bg-gray-100/50"
```

### Terminal Component
```jsx
// Header
// Dark
className="border-b border-white/20 bg-[#0F0F0F]/80"
// Light
className="border-b border-gray-200/50 bg-gray-50/80"

// Body
// Dark
className="bg-[#0F0F0F]/60"
// Light
className="bg-gray-50/60"

// Text
// Dark
className="text-gray-200"
// Light
className="text-gray-800"

// Dark
className="text-gray-300"
// Light
className="text-gray-700"

// Dark
className="text-gray-500"
// Light
className="text-gray-600"
```

### Hero Section
```jsx
// Badge
// Dark
className="bg-gradient-to-r from-white/15 to-white/8 border border-white/30"
// Light
className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200/50"

// Headline
// Dark
style={{ color: 'white' }}
// Light
className="text-[#1F2937]"
```

### Dashboard Preview Cards
```jsx
// Card container
// Dark
className="border border-white/20 bg-white/8"
// Light
className="border border-gray-200/50 bg-gray-50/50"

// Text
// Dark
className="text-white"
// Light
className="text-[#1F2937]"

// Dark
className="text-gray-400"
// Light
className="text-gray-600"

// Dark
className="text-gray-300"
// Light
className="text-gray-600"
```

### Stats Section
```jsx
// Container
// Dark
className="border border-white/20 bg-[#151515]/80"
// Light
className="border border-gray-200/50 bg-white/80"

// Text
// Dark
className="text-gray-300"
// Light
className="text-gray-700"

// Dark
className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
// Light (keep same or use darker)
className="bg-gradient-to-r from-[#1F2937] to-gray-600 bg-clip-text text-transparent"
```

### Features Section
```jsx
// Heading
// Dark
className="text-white"
// Light
className="text-[#1F2937]"

// Description
// Dark
className="text-gray-300"
// Light
className="text-gray-700"

// GlowCard
// Dark
className="border border-white/20 bg-[#151515]/60"
// Light
className="border border-gray-200/50 bg-white/60"
```

### Technology Section
```jsx
// Card
// Dark
className="border border-white/20 bg-[#151515]/80"
// Light
className="border border-gray-200/50 bg-white/80"

// Text
// Dark
className="text-gray-300"
// Light
className="text-gray-700"

// Tags
// Dark
className="bg-white/8 border border-white/20 text-gray-300"
// Light
className="bg-gray-100/50 border border-gray-200/50 text-gray-700"
```

### Testimonials
```jsx
// Card
// Dark
className="border border-white/20 bg-[#151515]/80"
// Light
className="border border-gray-200/50 bg-white/80"

// Text
// Dark
className="text-gray-300"
// Light
className="text-gray-700"

// Dark
className="text-white"
// Light
className="text-[#1F2937]"
```

### Footer
```jsx
// Border
// Dark
className="border-t border-white/20"
// Light
className="border-t border-gray-200/50"

// Text
// Dark
className="text-gray-300"
// Light
className="text-gray-700"

// Dark
className="text-gray-500"
// Light
className="text-gray-600"

// Links
// Dark
className="hover:text-white"
// Light
className="hover:text-[#1F2937]"
```

### CTA Section
```jsx
// Container
// Dark
className="border border-white/20 bg-gradient-to-br from-orange-500/15 via-[#151515] to-trust-blue/15"
// Light
className="border border-gray-200/50 bg-gradient-to-br from-orange-500/10 via-white to-trust-blue/10"

// Text
// Dark
className="text-gray-300"
// Light
className="text-gray-700"
```

### Buttons
```jsx
// Sign In button
// Dark
className="bg-white/8 border border-white/20 text-white hover:bg-white/15"
// Light
className="bg-gray-100/50 border border-gray-200/50 text-[#1F2937] hover:bg-gray-200/50"

// Navigation arrows
// Dark
className="bg-white/15 border border-white/30 hover:bg-white/25"
// Light
className="bg-gray-100/50 border border-gray-300/50 hover:bg-gray-200/50"
```

## Gradient Overlays

### Dashboard View
```jsx
// Dark
className="bg-gradient-to-t from-[#0F0F0F]/50 via-transparent to-transparent"
// Light
className="bg-gradient-to-t from-white/50 via-transparent to-transparent"

// Dark
className="bg-gradient-to-br from-orange-500/15 via-[#151515] to-blue-500/15"
// Light
className="bg-gradient-to-br from-orange-500/10 via-white to-blue-500/10"
```

### Rotating Card
```jsx
// Dark
className="bg-gradient-to-t from-[#0F0F0F]/70 via-transparent to-transparent"
// Light
className="bg-gradient-to-t from-white/70 via-transparent to-transparent"

// Dark
className="bg-gradient-to-br from-orange-500/8 via-[#151515] to-trust-blue/8"
// Light
className="bg-gradient-to-br from-orange-500/5 via-white to-trust-blue/5"
```

## Flashlight Effects

### Background Glow
```jsx
// Dark
background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)'
// Light
background: 'radial-gradient(circle, rgba(0, 0, 0, 0.08) 0%, transparent 70%)'

// Dark
background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)'
// Light
background: 'radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, transparent 70%)'
```

## Pattern to Follow

For any color reference, use this pattern:

```jsx
className={`${isDark ? 'dark-color-classes' : 'light-color-classes'}`}
```

Or inline styles:
```jsx
style={{
  backgroundColor: isDark ? '#151515' : '#FFFFFF',
  color: isDark ? '#E0E0E0' : '#1F2937'
}}
```

## Complete Color Palette

### Light Mode Palette
- **Background Primary**: `#FAFAFA`
- **Background Secondary**: `#FFFFFF`
- **Text Primary**: `#1F2937`
- **Text Secondary**: `#4B5563`
- **Text Tertiary**: `#6B7280`
- **Border**: `rgba(0, 0, 0, 0.05)` to `rgba(0, 0, 0, 0.1)`
- **Glass Background**: `rgba(255, 255, 255, 0.8)` to `rgba(255, 255, 255, 0.9)`
- **Card Background**: `rgba(249, 250, 251, 0.5)` (gray-50/50)
- **Hover Background**: `rgba(243, 244, 246, 0.5)` (gray-100/50)

### Accent Colors (Same for both themes)
- **Primary Orange**: `#FF4D00`
- **Trust Blue**: `#0066FF`
- **Success Green**: `#10B981`

## Quick Reference Table

| Dark Mode | Light Mode |
|-----------|------------|
| `bg-[#0F0F0F]` | `bg-[#FAFAFA]` |
| `bg-[#151515]` | `bg-white` |
| `text-white` | `text-[#1F2937]` |
| `text-gray-300` | `text-gray-700` |
| `text-gray-400` | `text-gray-600` |
| `text-gray-500` | `text-gray-600` |
| `border-white/20` | `border-gray-200/50` |
| `bg-white/5` | `bg-gray-50/50` |
| `bg-white/8` | `bg-gray-50/50` |
| `bg-white/10` | `bg-gray-100/50` |
| `bg-white/15` | `bg-gray-100/50` |
| `bg-[#151515]/80` | `bg-white/80` |
| `bg-[#0F0F0F]/60` | `bg-gray-50/60` |
| `hover:bg-white/8` | `hover:bg-gray-100/50` |
| `hover:text-white` | `hover:text-[#1F2937]` |






