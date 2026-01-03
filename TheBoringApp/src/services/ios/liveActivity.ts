import { Platform } from 'react-native';
import * as LiveActivity from 'expo-live-activity';
import { TimerService, TimerMode, LiveActivityState } from '../timerService.interface';
import { formatTimer } from '../../utils/formatTime';

const MIN_IOS_VERSION = 16.2;

// Monochrome color palette for Live Activity
const MONOCHROME_COLORS = {
  background: '#0a0a0a',
  primary: '#888888',
  secondary: '#444444',
} as const;

let currentActivityId: string | null = null;

const buildLiveActivityState = (
  endTime: number,
  mode: TimerMode,
  weeklyDebtMinutes?: number
): LiveActivity.LiveActivityState => {
  const remainingMs = Math.max(0, endTime - Date.now());
  const displayTime = formatTimer(remainingMs);

  // Build subtitle with optional weekly debt indicator
  let subtitle: string | undefined;
  if (weeklyDebtMinutes !== undefined && weeklyDebtMinutes > 0) {
    // Show debt indicator when user has weekly debt
    subtitle = `${mode === 'countdown' ? 'Remaining' : 'Elapsed'} • -${weeklyDebtMinutes}m`;
  } else {
    subtitle = mode === 'countdown' ? undefined : 'Elapsed';
  }

  return {
    title: displayTime,
    subtitle,
    progressBar: {
      date: endTime,
    },
  };
};

const buildActivityConfig = (): LiveActivity.LiveActivityConfig => ({
  backgroundColor: MONOCHROME_COLORS.background,
  titleColor: MONOCHROME_COLORS.primary,
  subtitleColor: MONOCHROME_COLORS.secondary,
  progressViewTint: MONOCHROME_COLORS.primary,
  progressViewLabelColor: MONOCHROME_COLORS.secondary,
  timerType: 'linear',
  padding: 16,
});

const buildCompletionState = (mode: TimerMode): LiveActivity.LiveActivityState => ({
  title: '00:00',
  subtitle: mode === 'countdown' ? 'Complete' : 'Done',
  progressBar: {
    progress: 1,
  },
});

export const iosTimerService: TimerService = {
  isSupported(): boolean {
    if (Platform.OS !== 'ios') return false;
    const version = parseFloat(String(Platform.Version));
    return version >= MIN_IOS_VERSION;
  },

  async startTimer(endTime: number | null, mode: TimerMode, weeklyDebtMinutes?: number): Promise<void> {
    if (!this.isSupported() || endTime === null) return;

    // End any existing activity before starting a new one
    if (currentActivityId !== null) {
      await this.stopTimer();
    }

    const state = buildLiveActivityState(endTime, mode, weeklyDebtMinutes);
    const config = buildActivityConfig();

    try {
      const activityId = await LiveActivity.startActivity(state, config);
      if (activityId) {
        currentActivityId = activityId;
      }
    } catch (error) {
      console.warn('[LiveActivity] Failed to start:', error);
      // Silent failure - Live Activity is optional, timer continues in app
    }
  },

  async stopTimer(): Promise<void> {
    if (!this.isSupported() || currentActivityId === null) return;

    try {
      await LiveActivity.stopActivity(currentActivityId, {
        title: 'Cancelled',
        progressBar: { progress: 0 },
      });
    } catch (error) {
      console.warn('[LiveActivity] Failed to stop:', error);
    } finally {
      currentActivityId = null;
    }
  },

  async completeTimer(mode: TimerMode = 'countdown'): Promise<void> {
    if (!this.isSupported() || currentActivityId === null) return;

    try {
      const finalState = buildCompletionState(mode);
      await LiveActivity.stopActivity(currentActivityId, finalState);
    } catch (error) {
      console.warn('[LiveActivity] Failed to complete:', error);
    } finally {
      currentActivityId = null;
    }
  },

  /**
   * Update the Live Activity with new timer state.
   * Called by useBoringTimer on each tick.
   * Optionally includes weekly debt information for Dynamic Island display.
   */
  async updateTimer(endTime: number, mode: TimerMode, weeklyDebtMinutes?: number): Promise<void> {
    if (!this.isSupported() || currentActivityId === null) return;

    try {
      const state = buildLiveActivityState(endTime, mode, weeklyDebtMinutes);
      await LiveActivity.updateActivity(currentActivityId, state);
    } catch (error) {
      // Silently fail - update failures are non-critical
      console.warn('[LiveActivity] Failed to update:', error);
    }
  },
};
