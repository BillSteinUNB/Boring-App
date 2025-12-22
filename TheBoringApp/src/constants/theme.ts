/**
 * theme.ts
 *
 * Visual theme constants for The Boring App.
 *
 * Design Philosophy:
 * - Monochrome only - no colors to stimulate
 * - High contrast for accessibility
 * - Simple, readable typography
 * - No decorative elements
 *
 * The visual design should be intentionally plain,
 * reinforcing that this app offers nothing to engage with
 * except the passage of time.
 */

export const COLORS = {
  // Primary palette - monochrome only
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E0E0E0',

  // Interactive states
  buttonBackground: '#1A1A1A',
  buttonText: '#FFFFFF',
  buttonDisabled: '#CCCCCC',

  // Timer states
  timerActive: '#1A1A1A',
  timerComplete: '#333333',
} as const;

export const FONTS = {
  // System fonts only - no custom fonts needed for boring
  regular: 'System',
  medium: 'System',
  bold: 'System',

  // Font sizes
  sizes: {
    small: 14,
    body: 16,
    large: 20,
    timer: 48,
    title: 24,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
