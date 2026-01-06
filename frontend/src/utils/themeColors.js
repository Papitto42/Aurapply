/**
 * Theme Color Utilities
 * Use these functions to get theme-aware colors
 */

export const getThemeColors = (isDark) => {
  if (isDark) {
    return {
      // Backgrounds
      bgPrimary: 'bg-[#0F0F0F]',
      bgSecondary: 'bg-[#050505]',
      bgSurface: 'bg-[#151515]',
      bgCard: 'bg-[#151515]/80',
      bgGlass: 'bg-white/5',
      bgGlassHover: 'bg-white/8',
      bgNavbar: 'bg-[#151515]/80',
      
      // Text
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textTertiary: 'text-gray-400',
      textMuted: 'text-gray-500',
      
      // Borders
      borderPrimary: 'border-white/20',
      borderSecondary: 'border-white/10',
      borderTertiary: 'border-white/5',
      
      // Hover states
      hoverBg: 'hover:bg-white/8',
      hoverText: 'hover:text-white',
      hoverBorder: 'hover:border-white/30',
      
      // Active states
      activeBg: 'bg-white',
      activeText: 'text-black',
    };
  } else {
    return {
      // Backgrounds
      bgPrimary: 'bg-[#FAFAFA]',
      bgSecondary: 'bg-[#FAFAFA]',
      bgSurface: 'bg-white',
      bgCard: 'bg-white/80',
      bgGlass: 'bg-gray-50/50',
      bgGlassHover: 'bg-gray-50/50',
      bgNavbar: 'bg-white/80',
      
      // Text
      textPrimary: 'text-[#1F2937]',
      textSecondary: 'text-gray-700',
      textTertiary: 'text-gray-600',
      textMuted: 'text-gray-600',
      
      // Borders
      borderPrimary: 'border-gray-200/50',
      borderSecondary: 'border-gray-200/50',
      borderTertiary: 'border-gray-200/30',
      
      // Hover states
      hoverBg: 'hover:bg-gray-100/50',
      hoverText: 'hover:text-[#1F2937]',
      hoverBorder: 'hover:border-gray-300/50',
      
      // Active states
      activeBg: 'bg-[#1F2937]',
      activeText: 'text-white',
    };
  }
};

/**
 * Get theme-aware className string
 * @param {boolean} isDark - Whether dark mode is active
 * @param {string} darkClasses - Classes for dark mode
 * @param {string} lightClasses - Classes for light mode
 * @returns {string} - Combined className string
 */
export const themeClass = (isDark, darkClasses, lightClasses) => {
  return isDark ? darkClasses : lightClasses;
};

/**
 * Common theme-aware class combinations
 */
export const themeCombos = {
  // Background + Text
  card: (isDark) => themeClass(
    isDark,
    'bg-[#151515]/80 border border-white/20',
    'bg-white/80 border border-gray-200/50'
  ),
  
  cardHover: (isDark) => themeClass(
    isDark,
    'bg-white/8 hover:bg-white/15',
    'bg-gray-50/50 hover:bg-gray-100/50'
  ),
  
  navbar: (isDark) => themeClass(
    isDark,
    'bg-[#151515]/80 border-b border-white/20',
    'bg-white/80 border-b border-gray-200/50'
  ),
  
  // Text combinations
  heading: (isDark) => themeClass(
    isDark,
    'text-white',
    'text-[#1F2937]'
  ),
  
  body: (isDark) => themeClass(
    isDark,
    'text-gray-300',
    'text-gray-700'
  ),
  
  muted: (isDark) => themeClass(
    isDark,
    'text-gray-400',
    'text-gray-600'
  ),
  
  // Button states
  buttonInactive: (isDark) => themeClass(
    isDark,
    'text-gray-500 hover:text-white hover:bg-white/5',
    'text-gray-500 hover:text-[#1F2937] hover:bg-gray-100/50'
  ),
  
  buttonActive: (isDark) => themeClass(
    isDark,
    'bg-white text-black',
    'bg-[#1F2937] text-white'
  ),
  
  // Terminal
  terminalHeader: (isDark) => themeClass(
    isDark,
    'border-b border-white/20 bg-[#0F0F0F]/80',
    'border-b border-gray-200/50 bg-gray-50/80'
  ),
  
  terminalBody: (isDark) => themeClass(
    isDark,
    'bg-[#0F0F0F]/60 text-gray-200',
    'bg-gray-50/60 text-gray-800'
  ),
};

/**
 * Usage Examples:
 * 
 * // In a component:
 * const { isDark } = useTheme();
 * const colors = getThemeColors(isDark);
 * 
 * // Then use:
 * <div className={`${colors.bgCard} ${colors.textPrimary}`}>
 * 
 * // Or use themeClass:
 * <div className={themeClass(isDark, 'bg-[#151515] text-white', 'bg-white text-[#1F2937]')}>
 * 
 * // Or use themeCombos:
 * <div className={themeCombos.card(isDark)}>
 * <h1 className={themeCombos.heading(isDark)}>
 */






