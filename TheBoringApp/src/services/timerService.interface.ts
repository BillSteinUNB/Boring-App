export interface TimerService {
  startTimer(endTime: number): Promise<void>;
  stopTimer(): Promise<void>;
  completeTimer(): Promise<void>;
  isSupported(): boolean;
}
