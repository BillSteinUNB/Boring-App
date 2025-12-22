export interface TimerService {
  startTimer(endTime: number): Promise<void>;
  stopTimer(): Promise<void>;
  isSupported(): boolean;
}
