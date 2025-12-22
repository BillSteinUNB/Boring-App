import { TimerService } from '../timerService.interface';

export const iosTimerService: TimerService = {
  async startTimer(endTime: number): Promise<void> {
    console.log('iOS: startTimer not yet implemented');
  },

  async stopTimer(): Promise<void> {
    console.log('iOS: stopTimer not yet implemented');
  },

  isSupported(): boolean {
    return false;
  },
};
