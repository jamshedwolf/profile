import { useState, useEffect } from 'react';

export interface ThemeColor {
  name: string;
  light: {
    primary: string;
    ring: string;
  };
  dark: {
    primary: string;
    ring: string;
  };
  gradient: {
    light: string;
    dark: string;
  };
  hex: string; // For display in the picker
}

export const themeColors: ThemeColor[] = [
  {
    name: 'Purple',
    light: { primary: '270 70% 55%', ring: '270 70% 55%' },
    dark: { primary: '270 65% 60%', ring: '270 65% 60%' },
    gradient: {
      light: 'linear-gradient(135deg, hsl(270, 70%, 55%) 0%, hsl(290, 75%, 60%) 50%, hsl(320, 80%, 65%) 100%)',
      dark: 'linear-gradient(135deg, hsl(270, 65%, 60%) 0%, hsl(290, 70%, 65%) 50%, hsl(320, 75%, 70%) 100%)',
    },
    hex: '#8B5CF6',
  },
  {
    name: 'Blue',
    light: { primary: '210 90% 50%', ring: '210 90% 50%' },
    dark: { primary: '210 85% 60%', ring: '210 85% 60%' },
    gradient: {
      light: 'linear-gradient(135deg, hsl(210, 90%, 50%) 0%, hsl(230, 85%, 55%) 50%, hsl(250, 80%, 60%) 100%)',
      dark: 'linear-gradient(135deg, hsl(210, 85%, 60%) 0%, hsl(230, 80%, 65%) 50%, hsl(250, 75%, 70%) 100%)',
    },
    hex: '#3B82F6',
  },
  {
    name: 'Green',
    light: { primary: '142 76% 36%', ring: '142 76% 36%' },
    dark: { primary: '142 70% 50%', ring: '142 70% 50%' },
    gradient: {
      light: 'linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(165, 80%, 45%) 50%, hsl(200, 90%, 50%) 100%)',
      dark: 'linear-gradient(135deg, hsl(142, 70%, 50%) 0%, hsl(165, 75%, 55%) 50%, hsl(200, 85%, 60%) 100%)',
    },
    hex: '#22C55E',
  },
  {
    name: 'Orange',
    light: { primary: '25 95% 55%', ring: '25 95% 55%' },
    dark: { primary: '25 90% 60%', ring: '25 90% 60%' },
    gradient: {
      light: 'linear-gradient(135deg, hsl(25, 95%, 55%) 0%, hsl(35, 90%, 50%) 50%, hsl(45, 85%, 55%) 100%)',
      dark: 'linear-gradient(135deg, hsl(25, 90%, 60%) 0%, hsl(35, 85%, 55%) 50%, hsl(45, 80%, 60%) 100%)',
    },
    hex: '#F97316',
  },
  {
    name: 'Rose',
    light: { primary: '350 80% 55%', ring: '350 80% 55%' },
    dark: { primary: '350 75% 60%', ring: '350 75% 60%' },
    gradient: {
      light: 'linear-gradient(135deg, hsl(350, 80%, 55%) 0%, hsl(330, 75%, 50%) 50%, hsl(310, 70%, 55%) 100%)',
      dark: 'linear-gradient(135deg, hsl(350, 75%, 60%) 0%, hsl(330, 70%, 55%) 50%, hsl(310, 65%, 60%) 100%)',
    },
    hex: '#F43F5E',
  },
  {
    name: 'Teal',
    light: { primary: '175 85% 40%', ring: '175 85% 40%' },
    dark: { primary: '175 80% 50%', ring: '175 80% 50%' },
    gradient: {
      light: 'linear-gradient(135deg, hsl(175, 85%, 40%) 0%, hsl(190, 80%, 45%) 50%, hsl(200, 75%, 50%) 100%)',
      dark: 'linear-gradient(135deg, hsl(175, 80%, 50%) 0%, hsl(190, 75%, 55%) 50%, hsl(200, 70%, 60%) 100%)',
    },
    hex: '#14B8A6',
  },
];

const STORAGE_KEY = 'portfolio-theme-color';

export function useThemeColor() {
  const [currentColor, setCurrentColor] = useState<ThemeColor>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const found = themeColors.find(c => c.name === stored);
        if (found) return found;
      }
    }
    return themeColors[2]; // Default to Green
  });

  const applyThemeColor = (color: ThemeColor) => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    
    const colors = isDark ? color.dark : color.light;
    const gradient = isDark ? color.gradient.dark : color.gradient.light;
    
    // Primary colors
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--ring', colors.ring);
    root.style.setProperty('--sidebar-primary', colors.primary);
    root.style.setProperty('--sidebar-ring', colors.ring);
    root.style.setProperty('--gradient-primary', gradient);
    
    // Accent color (same as primary for consistency)
    root.style.setProperty('--accent', colors.primary);
    
    // Chart colors
    root.style.setProperty('--chart-1', colors.primary);
    
    // Shadow and glow effects
    root.style.setProperty('--shadow-glow', `0 0 50px hsl(${colors.primary} / 0.25)`);
    root.style.setProperty('--shadow-primary', `0 10px 40px -10px hsl(${colors.primary} / 0.4)`);
    root.style.setProperty('--shadow-hover', `0 20px 50px -15px hsl(${colors.primary} / 0.5)`);
    root.style.setProperty('--theme-color-hex', color.hex);
  };

  const setThemeColor = (color: ThemeColor) => {
    setCurrentColor(color);
    localStorage.setItem(STORAGE_KEY, color.name);
    applyThemeColor(color);
  };

  // Apply theme color on mount and when dark mode changes
  useEffect(() => {
    applyThemeColor(currentColor);
    
    // Watch for dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          applyThemeColor(currentColor);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, [currentColor]);

  return { currentColor, setThemeColor, themeColors };
}
