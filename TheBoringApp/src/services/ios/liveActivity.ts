import { Platform } from 'react-native';
import * as LiveActivity from 'expo-live-activity';
import { TimerService } from '../timerService.interface';

// Requires app.json config:
// "ios": { "supportsLiveActivities": true }
// Also requires Widget Extension target in Xcode project

const MIN_IOS_VERSION = 16.2;

export const iosTimerService: TimerService = {
  isSupported(): boolean {
    // Live Activities require iOS 16.2+ for push updates
    const version = parseFloat(String(Platform.Version));
    return Platform.OS === 'ios' && version >= MIN_IOS_VERSION;
  },

  async startTimer(endTime: number): Promise<void> {
    if (!this.isSupported()) return;

    try {
      // startActivity creates a new Live Activity on lock screen and Dynamic Island
      // The widget extension renders the UI using the provided data
      await LiveActivity.startActivity({
        data: {
          endTime, // Timestamp when timer ends (used by widget for countdown)
        },
      });
    } catch (error) {
      console.warn('iOS Live Activity: Failed to start', error);
    }
  },

  async stopTimer(): Promise<void> {
    if (!this.isSupported()) return;

    try {
      // endAllActivities dismisses all Live Activities for this app
      await LiveActivity.endAllActivities();
    } catch (error) {
      console.warn('iOS Live Activity: Failed to stop', error);
    }
  },

  async completeTimer(): Promise<void> {
    if (!this.isSupported()) return;

    try {
      // Update Live Activity to show "Done" state
      // The widget extension should render "Done" when endTime is 0 or in the past
      await LiveActivity.updateActivity({
        data: {
          endTime: 0, // Signal completion - widget shows "Done"
        },
      });

      // After 5 seconds, dismiss the activity
      setTimeout(async () => {
        try {
          await LiveActivity.endAllActivities();
        } catch (error) {
          console.warn('iOS Live Activity: Failed to dismiss after completion', error);
        }
      }, 5000);
    } catch (error) {
      console.warn('iOS Live Activity: Failed to complete', error);
    }
  },
};
