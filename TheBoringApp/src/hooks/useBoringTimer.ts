/**
 * useBoringTimer.ts
 *
 * Shared hook for timer logic in The Boring App.
 *
 * This hook will provide:
 * - Timer state management (idle, running, completed)
 * - Countdown logic with remaining time
 * - Platform-agnostic interface for starting/stopping timer
 * - Integration point for platform-specific services
 *
 * Hook Interface (planned):
 * - timerState: 'idle' | 'running' | 'completed'
 * - remainingSeconds: number
 * - selectedDuration: number (in minutes)
 * - startTimer: () => void
 * - stopTimer: () => void
 * - selectDuration: (minutes: number) => void
 *
 * Design Notes:
 * - No pause functionality - commitment is the point
 * - No sound or haptic feedback
 * - Timer continues even if app is backgrounded (via native services)
 */

import { useState } from 'react';
import { TIMER_DURATIONS } from '../constants/durations';

type TimerState = 'idle' | 'running' | 'completed';

export function useBoringTimer() {
  // TODO: Implement timer state
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [selectedDuration, setSelectedDuration] = useState<number>(TIMER_DURATIONS[0]);

  // TODO: Implement timer start logic
  const startTimer = () => {
    // Will start the timer and trigger platform-specific services
    throw new Error('Not implemented');
  };

  // TODO: Implement timer stop logic
  const stopTimer = () => {
    // Will stop the timer and clean up platform-specific services
    throw new Error('Not implemented');
  };

  // TODO: Implement duration selection
  const selectDuration = (minutes: number) => {
    setSelectedDuration(minutes);
  };

  return {
    timerState,
    remainingSeconds,
    selectedDuration,
    startTimer,
    stopTimer,
    selectDuration,
  };
}
