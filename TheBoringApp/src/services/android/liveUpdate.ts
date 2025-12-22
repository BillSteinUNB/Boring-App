import { TimerService } from '../timerService.interface';

export const androidTimerService: TimerService = {
  async startTimer(endTime: number): Promise<void> {
    console.log('Android: startTimer not yet implemented');
  },

  async stopTimer(): Promise<void> {
    console.log('Android: stopTimer not yet implemented');
  },

  isSupported(): boolean {
    console.log('Android: isSupported not yet implemented');
    return false;
  },
};
