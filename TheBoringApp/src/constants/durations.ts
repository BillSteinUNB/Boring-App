/**
 * durations.ts
 *
 * Timer duration options for The Boring App.
 *
 * Design Philosophy:
 * - Only three options to minimize decision fatigue
 * - No custom durations - constraints are the point
 * - Durations are meaningful increments for intentional boredom
 *
 * Why these specific durations:
 * - 5 minutes: A brief commitment, good for beginners
 * - 15 minutes: A moderate session, enough to feel the boredom
 * - 30 minutes: A substantial commitment to doing nothing
 *
 * No 1-minute option (too easy to dismiss)
 * No 60+ minute options (this isn't meditation, just boredom)
 */

/**
 * Available timer durations in minutes.
 * These are the only options - no customization allowed.
 */
export const TIMER_DURATIONS = [5, 15, 30] as const;

/**
 * Type for valid timer durations.
 */
export type TimerDuration = (typeof TIMER_DURATIONS)[number];

/**
 * Default duration when app first opens.
 */
export const DEFAULT_DURATION: TimerDuration = 5;

/**
 * Labels for display (kept minimal).
 */
export const DURATION_LABELS: Record<TimerDuration, string> = {
  5: '5 min',
  15: '15 min',
  30: '30 min',
};
