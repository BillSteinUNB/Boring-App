import { Platform } from 'react-native';

export const colors = {
  background: '#0a0a0a',
  primaryText: '#888888',
  secondaryText: '#444444',
  accent: '#666666',
} as const;

export const typography = {
  fontFamily: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
