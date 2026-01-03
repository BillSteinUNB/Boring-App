import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { TimerService, TimerMode } from '../timerService.interface';
import { formatMsToTime } from '../../constants/durations';

const MIN_ANDROID_API = 26; // Android 8.0 - Notification channels required
const NOTIFICATION_CHANNEL_ID = 'boring-timer-channel';
const NOTIFICATION_ID = 1001;
const BACKGROUND_TASK_NAME = 'boring-timer-update';

interface TimerState {
  endTime: number | null;
  startTime: number | null;
  totalDuration: number;
  mode: TimerMode;
}

interface LogbookEntry {
  id: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  completed: boolean;
}

let timerState: TimerState | null = null;
let updateInterval: NodeJS.Timeout | null = null;
let currentNotificationId: string | null = null;

/**
 * Android Foreground Service & Notification Implementation
 * 
 * Implements PRD-03 requirements:
 * - Foreground notification for timer persistence
 * - Minute-by-minute updates to notification body
 * - Silent, non-interruptive notification style
 * - No sounds, vibrations, or progress bars
 */

// Background task for periodic notification updates
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    if (timerState?.endTime === null) {
      return TaskManager.BackgroundTaskResult.Success;
    }

    const now = Date.now();
    const remaining = timerState.endTime - now;

    if (remaining <= 0) {
      // Timer completed - let the main thread handle completion
      return TaskManager.BackgroundTaskResult.Success;
    }

    // Update notification with remaining time (MM:SS format per PRD-03)
    await updateNotification(remaining);

    return TaskManager.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('[AndroidTimerService] Background task error:', error);
    return TaskManager.BackgroundTaskResult.Failed;
  }
});

/**
 * Update the notification with current remaining time
 */
async function updateNotification(remainingMs: number): Promise<void> {
  if (Platform.OS !== 'android') return;

  try {
    const timeString = formatMsToTime(Math.max(0, remainingMs));
    
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID.toString(),
      content: {
        title: 'Boring Timer',
        body: timeString,
        priority: Notifications.AndroidPriority.MIN,
        sound: false,
        vibrate: false,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('[AndroidTimerService] Failed to update notification:', error);
  }
}

/**
 * Configure notification channel for Android API 26+
 */
async function configureNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  try {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'Boring Timer',
      description: 'Timer countdown notifications',
      importance: Notifications.AndroidImportance.MIN,
      vibrationPattern: [],
      showBadge: false,
    });
  } catch (error) {
    console.error('[AndroidTimerService] Failed to configure notification channel:', error);
  }
}

/**
 * Initialize notification handler for non-interruptive behavior
 */
function configureNotificationHandler(): void {
  if (Platform.OS !== 'android') return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false, // Non-interruptive per PRD-03
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export const androidTimerService: TimerService = {
  isSupported(): boolean {
    if (Platform.OS !== 'android') return false;
    const apiLevel = typeof Platform.Version === 'number' 
      ? Platform.Version 
      : parseInt(String(Platform.Version), 10);
    return apiLevel >= MIN_ANDROID_API;
  },

  async startTimer(endTime: number | null, mode: TimerMode): Promise<void> {
    if (!this.isSupported() || endTime === null) return;

    try {
      // Configure notification system
      await configureNotificationChannel();
      configureNotificationHandler();

      const now = Date.now();
      const totalDuration = endTime - now;

      timerState = {
        endTime,
        startTime: now,
        totalDuration,
        mode,
      };

      // Calculate initial remaining time
      const remaining = endTime - now;
      const timeString = formatMsToTime(Math.max(0, remaining));

      // Schedule initial notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID.toString(),
        content: {
          title: 'Boring Timer',
          body: timeString,
          priority: Notifications.AndroidPriority.MIN,
          sound: false,
          vibrate: false,
        },
        trigger: null,
      });
      currentNotificationId = notificationId;

      console.log('[AndroidTimerService] Timer started:', {
        endTime,
        mode,
        totalDuration,
        notificationId,
      });

      // Register and start background task for minute-by-minute updates
      try {
        await TaskManager.registerTaskAsync(BACKGROUND_TASK_NAME, {
          minimumInterval: 60, // Update every 60 seconds per PRD-03 FR-03
          allowsDeviceSleep: true,
        });

        // Start interval for notification updates
        updateInterval = setInterval(async () => {
          if (timerState?.endTime === null) return;

          const remainingMs = timerState.endTime - Date.now();
          if (remainingMs <= 0) {
            // Timer completed
            if (updateInterval) {
              clearInterval(updateInterval);
              updateInterval = null;
            }
            return;
          }

          // Update notification with remaining time
          await updateNotification(remainingMs);
        }, 60000); // 60 seconds per PRD-03 requirement
      } catch (taskError) {
        console.error('[AndroidTimerService] Failed to register background task:', taskError);
        // Fallback: use setInterval in main thread (less reliable but works)
        updateInterval = setInterval(async () => {
          if (timerState?.endTime === null) return;
          const remainingMs = timerState.endTime - Date.now();
          if (remainingMs <= 0) return;
          await updateNotification(remainingMs);
        }, 60000);
      }

    } catch (error) {
      console.error('[AndroidTimerService] Failed to start timer:', error);
      throw error;
    }
  },

  async stopTimer(): Promise<void> {
    if (!this.isSupported()) return;

    try {
      // Clear update interval
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }

      // Cancel notification
      if (currentNotificationId) {
        await Notifications.cancelScheduledNotificationAsync(currentNotificationId);
        currentNotificationId = null;
      }

      timerState = null;

      console.log('[AndroidTimerService] Timer stopped');

    } catch (error) {
      console.error('[AndroidTimerService] Failed to stop timer:', error);
      throw error;
    }
  },

  async completeTimer(): Promise<void> {
    if (!this.isSupported()) return;

    try {
      // Clear update interval
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }

      // Show completion notification
      const completionId = await Notifications.scheduleNotificationAsync({
        identifier: `${NOTIFICATION_ID}-complete`,
        content: {
          title: 'Boring Timer',
          body: 'Done',
          priority: Notifications.AndroidPriority.MIN,
          sound: false,
          vibrate: false,
        },
        trigger: null,
      });

      // Cancel the running timer notification
      if (currentNotificationId) {
        await Notifications.cancelScheduledNotificationAsync(currentNotificationId);
        currentNotificationId = null;
      }

      timerState = null;

      console.log('[AndroidTimerService] Timer completed, showing completion notification');

    } catch (error) {
      console.error('[AndroidTimerService] Failed to complete timer:', error);
      throw error;
    }
  },

  async updateTimer(endTime: number, mode: TimerMode): Promise<void> {
    if (!this.isSupported()) return;

    try {
      if (timerState === null) return;

      timerState.endTime = endTime;
      timerState.mode = mode;

      const remaining = endTime - Date.now();
      await updateNotification(remaining);

    } catch (error) {
      console.error('[AndroidTimerService] Failed to update timer:', error);
    }
  },
};

/**
 * Export timer state for external monitoring (e.g., UI updates)
 */
export function getTimerState(): TimerState | null {
  return timerState;
}

// Export constants for external use
export { NOTIFICATION_CHANNEL_ID, NOTIFICATION_ID, BACKGROUND_TASK_NAME };
