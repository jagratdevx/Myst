export const THEME_COLORS = {
  dark: {
    background: '#081120',
    secondary: '#101A2E',
    card: '#162033',
    accent: '#5EEBFF',
    accentSecondary: '#9B87F5',
    textPrimary: '#F5F7FA',
    textSecondary: '#AAB4C3',
    border: 'rgba(255,255,255,0.06)',
    glass: 'rgba(255, 255, 255, 0.05)',
    shadow: 'rgba(0, 0, 0, 0.4)',
    success: '#4ADE80',
    error: '#F87171',
    warning: '#FBBF24',
  },
  light: {
    background: '#F4F7FB',
    secondary: '#FFFFFF',
    card: '#FFFFFF',
    accent: '#4BA3FF',
    accentSecondary: '#8A6DFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    border: 'rgba(15,23,42,0.08)',
    glass: 'rgba(15, 23, 42, 0.03)',
    shadow: 'rgba(15, 23, 42, 0.1)',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
  }
};

export type ThemeType = 'dark' | 'light';

export const COLORS = THEME_COLORS.dark; // Legacy support, will be replaced by dynamic colors
