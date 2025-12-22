import { Platform } from 'react-native';
import { TimerService } from './timerService.interface';
import { iosTimerService } from './ios/liveActivity';
import { androidTimerService } from './android/liveUpdate';

const mockTimerService: TimerService = {
  async startTimer(endTime: number): Promise<void> {
    console.warn('TimerService: Platform not supported');
  },

  async stopTimer(): Promise<void> {
    console.warn('TimerService: Platform not supported');
  },

  isSupported(): boolean {
    console.warn('TimerService: Platform not supported');
    return false;
  },
};

function getTimerService(): TimerService {
  switch (Platform.OS) {
    case 'ios':
      return iosTimerService;
    case 'android':
      return androidTimerService;
    default:
      return mockTimerService;
  }
}

export const timerService: TimerService = getTimerService();
