export const lightPalette = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#EDF2F7',
  
  // Brand / IMD Primary
  primary: '#0284C7',        // IMD Sky Blue
  primaryDark: '#0369A1',
  primaryLight: '#E0F2FE',
  secondary: '#0F766E',      // Oceanic Teal
  accent: '#F59E0B',         // Solar Amber
  
  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  
  // Status & Alerts
  alertRed: '#DC2626',
  alertRedBg: '#FEE2E2',
  alertOrange: '#EA580C',
  alertOrangeBg: '#FFEDD5',
  alertYellow: '#CA8A04',
  alertYellowBg: '#FEF9C3',
  alertGreen: '#16A34A',
  alertGreenBg: '#DCFCE7',
  
  // Impact levels
  impactLow: '#16A34A',
  impactModerate: '#EAB308',
  impactHigh: '#F97316',
  impactSevere: '#EF4444',

  // Weather Condition Gradients
  heroGradient: ['#0284C7', '#0369A1'],
  cardGradient: ['#FFFFFF', '#F8FAFC'],
  glassBg: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(226, 232, 240, 0.8)',
};

export const darkPalette = {
  background: '#0B1120',      // Deep Space Midnight
  surface: '#1E293B',        // Slate Slate
  surfaceElevated: '#334155',
  surfaceSubtle: '#152033',
  border: '#334155',
  borderLight: '#1E293B',
  
  // Brand / IMD Primary
  primary: '#38BDF8',        // Vivid Electric Sky
  primaryDark: '#0284C7',
  primaryLight: 'rgba(56, 189, 248, 0.15)',
  secondary: '#2DD4BF',      // Cyan Teal
  accent: '#FBBF24',         // Golden Amber
  
  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',
  
  // Status & Alerts
  alertRed: '#EF4444',
  alertRedBg: 'rgba(239, 68, 68, 0.18)',
  alertOrange: '#F97316',
  alertOrangeBg: 'rgba(249, 115, 22, 0.18)',
  alertYellow: '#FACC15',
  alertYellowBg: 'rgba(250, 204, 21, 0.18)',
  alertGreen: '#22C55E',
  alertGreenBg: 'rgba(34, 197, 94, 0.18)',
  
  // Impact levels
  impactLow: '#22C55E',
  impactModerate: '#FACC15',
  impactHigh: '#FB923C',
  impactSevere: '#F87171',

  // Weather Condition Gradients
  heroGradient: ['#0C4A6E', '#082F49'],
  cardGradient: ['#1E293B', '#111827'],
  glassBg: 'rgba(30, 41, 59, 0.85)',
  glassBorder: 'rgba(51, 65, 85, 0.7)',
};

export type ThemePalette = typeof lightPalette;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 16, fontWeight: '600' as const },
  bodyLarge: { fontSize: 15, fontWeight: '400' as const },
  bodyMedium: { fontSize: 13, fontWeight: '400' as const },
  bodySmall: { fontSize: 11, fontWeight: '400' as const },
  caption: { fontSize: 10, fontWeight: '500' as const, letterSpacing: 0.5 },
};
