export type TimerMode = 'countdown' | 'countup';

export interface LiveActivityState {
  endTime: number;
  mode: TimerMode;
  weeklyDebtMinutes?: number;
}

export interface TimerService {
  startTimer(endTime: number | null, mode: TimerMode, weeklyDebtMinutes?: number): Promise<void>;
  stopTimer(): Promise<void>;
  completeTimer(mode?: TimerMode): Promise<void>;
  isSupported(): boolean;
  updateTimer?(endTime: number, mode: TimerMode, weeklyDebtMinutes?: number): Promise<void>;
}
