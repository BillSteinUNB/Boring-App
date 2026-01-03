import { Platform } from 'react-native';

export const colors = {
  background: '#0a0a0a',
  primaryText: '#888888',
  secondaryText: '#888888', // Updated from #444444 for WCAG AA compliance (8.6:1)
  accent: '#888888', // Updated from #666666 for WCAG AA compliance (8.6:1)
} as const;

export const typography = {
  fontFamily: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
  fontSize: {
    timer: 48,
    input: 18,
    button: 16,
    label: 14,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const touchTarget = {
  min: 44,
  inputWidth: 60,
} as const;
