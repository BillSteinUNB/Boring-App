import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
// @ts-ignore - Assuming expo-live-updates will be installed separately
import * as LiveUpdates from 'expo-live-updates';
import { TimerService } from '../timerService.interface';

/**
 * Android Implementation of TimerService
 * 
 * API VERSION SPLIT:
 * - Android 16+ (API 36.1+): Uses the modern Live Updates API via 'expo-live-updates'.
 *   This provides a dedicated, high-priority lock screen widget experience similar to iOS.
 * - Android < 16: Falls back to standard ongoing notifications via 'expo-notifications'.
 * 
 * BATTERY OPTIMIZATION:
 * For older Android versions, we update the notification every 60 seconds instead of every second.
 * This significantly reduces wake-locks and battery drain while still providing a "boring"
 * but functional glanceable timer.
 * 
 * PERMISSIONS REQUIRED:
 * - POST_NOTIFICATIONS (Android 13+)
 * - FOREGROUND_SERVICE (To ensure the timer continues when the app is backgrounded)
 */

let notificationInterval: NodeJS.Timeout | null = null;
let currentNotificationId: string | null = null;
const CHANNEL_ID = 'boring-timer';

export const androidTimerService: TimerService = {
  isSupported(): boolean {
    if (Platform.OS !== 'android') return false;
    
    // Check for API 36.1+ (Android 16+)
    // Platform.Version is a number on Android
    const apiLevel = typeof Platform.Version === 'number' ? Platform.Version : parseInt(Platform.Version as string, 10);
    return apiLevel >= 36;
  },

  async startTimer(endTime: number): Promise<void> {
    try {
      const isModernAndroid = this.isSupported();

      if (isModernAndroid) {
        // API 36.1+ Live Updates Implementation
        await LiveUpdates.startUpdate({
          title: "Being Boring",
          endTime: endTime,
          style: 'minimal', // Adhere to boring aesthetic
        });
      } else {
        // Fallback for older Android versions
        await setupNotificationChannel();
        await updateStandardNotification(endTime);

        // Update every 60 seconds for battery efficiency
        notificationInterval = setInterval(() => {
          updateStandardNotification(endTime);
        }, 60000);
      }
    } catch (error) {
      // Fail silently as per requirement to maintain a non-disruptive experience
      console.error('Failed to start Android timer display:', error);
    }
  },

  async stopTimer(): Promise<void> {
    try {
      if (notificationInterval) {
        clearInterval(notificationInterval);
        notificationInterval = null;
      }

      if (this.isSupported()) {
        await LiveUpdates.stopUpdate();
      } else if (currentNotificationId) {
        await Notifications.dismissNotificationAsync(currentNotificationId);
        currentNotificationId = null;
      }
    } catch (error) {
      console.error('Failed to stop Android timer display:', error);
    }
  },

  async completeTimer(): Promise<void> {
    try {
      // Clear any update interval
      if (notificationInterval) {
        clearInterval(notificationInterval);
        notificationInterval = null;
      }

      if (this.isSupported()) {
        // Modern Android: Update Live Update to show completion
        await LiveUpdates.updateUpdate({
          title: "Done. You did nothing.",
          style: 'minimal',
        });

        // Dismiss after 5 seconds
        setTimeout(async () => {
          try {
            await LiveUpdates.stopUpdate();
          } catch (error) {
            console.error('Failed to dismiss Android Live Update after completion:', error);
          }
        }, 5000);
      } else if (currentNotificationId) {
        // Fallback: Update notification to show completion message
        await Notifications.presentNotificationAsync({
          title: "Done. You did nothing.",
          body: "",
          android: {
            channelId: CHANNEL_ID,
            sticky: false,
            ongoing: false,
            showTimestamp: false,
            priority: 'max',
          },
        });

        // Dismiss after 5 seconds
        setTimeout(async () => {
          try {
            if (currentNotificationId) {
              await Notifications.dismissNotificationAsync(currentNotificationId);
              currentNotificationId = null;
            }
          } catch (error) {
            console.error('Failed to dismiss Android notification after completion:', error);
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Failed to complete Android timer display:', error);
    }
  },
};

// Internal helper for standard notifications
async function updateStandardNotification(endTime: number): Promise<void> {
  const remainingMs = endTime - Date.now();
  if (remainingMs <= 0) {
    if (notificationInterval) {
      clearInterval(notificationInterval);
      notificationInterval = null;
    }
    return;
  }

  const remainingSeconds = Math.floor(remainingMs / 1000);
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Ensure notification handler is set
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const id = await Notifications.presentNotificationAsync({
    title: "Being Boring",
    body: timeStr,
    android: {
      channelId: CHANNEL_ID,
      sticky: true, // Prevent dismissal by user
      ongoing: true,
      showTimestamp: false,
      priority: 'max', // Ensure it appears on lock screen
    },
  });
  
  currentNotificationId = id;
}

async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Boring Timer',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0], // No vibration
      enableVibrate: false,
      showBadge: false,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}
