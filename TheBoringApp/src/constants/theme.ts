/**
 * theme.ts
 *
 * Visual theme constants for The Boring App.
 *
 * Design Philosophy:
 * - Monochrome only - no colors to stimulate
 * - Dark theme only - no light mode toggle
 * - System monospace typography
 * - No decorative elements
 *
 * The visual design should be intentionally plain,
 * reinforcing that this app offers nothing to engage with
 * except the passage of time.
 *
 * Color Palette (STRICT - no other colors permitted):
 * - Background: #0a0a0a (near black)
 * - Primary text: #888888 (gray)
 * - Secondary text: #444444 (dark gray)
 * - Accent/Buttons: #666666 (medium gray)
 */

export const COLORS = {
  // Primary palette - monochrome only, dark theme
  background: '#0a0a0a',
  text: '#888888',
  textSecondary: '#444444',
  accent: '#666666',

  // Semantic aliases (all map to the four permitted colors)
  surface: '#0a0a0a',
  border: '#444444',
  buttonBackground: '#666666',
  buttonText: '#0a0a0a',
  buttonBorder: '#666666',

  // Timer states (use permitted colors only)
  timerActive: '#888888',
  timerComplete: '#888888',
} as const;

export const FONTS = {
  // System monospace only - no custom fonts
  family: 'monospace',

  // Font sizes - minimal hierarchy
  sizes: {
    body: 16,
    timer: 16, // Same as body - no emphasis
  },

  // No bold, no italic - regular weight only
  weights: {
    regular: '400' as const,
  },

  // Line heights
  lineHeights: {
    normal: 1.5,
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
