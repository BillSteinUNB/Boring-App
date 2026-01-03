import { Platform } from 'react-native';
import { TimerService, TimerMode } from './timerService.interface';
import { iosTimerService } from './ios/liveActivity';
import { androidTimerService } from './android/liveUpdate';

const mockTimerService: TimerService = {
  async startTimer(_endTime: number | null, _mode: TimerMode): Promise<void> {},

  async stopTimer(): Promise<void> {},

  async completeTimer(): Promise<void> {},

  isSupported(): boolean {
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
