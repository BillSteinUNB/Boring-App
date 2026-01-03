import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { minutesToMs } from '../constants/durations';
import { timerService } from '../services/timerService';
import { formatTimer } from '../utils/formatTime';
import { useWeeklyQuota } from './useWeeklyQuota';

type TimerStatus = 'idle' | 'running' | 'complete';
type TimerMode = 'countdown' | 'countup';

interface TimerState {
  status: TimerStatus;
  mode: TimerMode;
  selectedDuration: number | null;
  endTime: number | null;
  startTime: number | null;
}

interface UseBoringTimerReturn {
  status: TimerStatus;
  mode: TimerMode;
  selectedDuration: number | null;
  endTime: number | null;
  startTime: number | null;
  timeRemaining: number | null;
  displayTime: string;
  start: (durationMinutes?: number) => void;
  stop: () => void;
  reset: () => void;
  handleComplete: () => void;
  startCountUp: () => void;
  stopCountUp: () => void;
}

const initialState: TimerState = {
  status: 'idle',
  mode: 'countdown',
  selectedDuration: null,
  endTime: null,
  startTime: null,
};

/** Tick interval in milliseconds */
const TICK_INTERVAL_MS = 1000;

export function useBoringTimer(): UseBoringTimerReturn {
  const [state, setState] = useState<TimerState>(initialState);
  const [displayTime, setDisplayTime] = useState<string>('00:00');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  
  // Integrate with Weekly Quota system
  const quota = useWeeklyQuota();

  /**
   * Compute and update the display time based on absolute timestamps.
   * This prevents drift by always calculating from the source of truth.
   */
  const updateDisplayTime = useCallback((currentState: TimerState): void => {
    const now = Date.now();
    
    if (currentState.endTime !== null) {
      // Countdown mode: calculate remaining time from absolute endTime
      const remaining = Math.max(0, currentState.endTime - now);
      setDisplayTime(formatTimer(remaining));
    } else if (currentState.startTime !== null) {
      // Count-up mode: calculate elapsed time from absolute startTime
      const elapsed = now - currentState.startTime;
      setDisplayTime(formatTimer(elapsed));
    }
  }, []);

  /**
   * Check if countdown timer has completed.
   * Returns true if timer reached zero and completion was triggered.
   */
  const checkCompletion = useCallback((currentState: TimerState, onComplete: () => void): boolean => {
    if (currentState.status !== 'running' || currentState.endTime === null) {
      return false;
    }
    
    if (Date.now() >= currentState.endTime) {
      onComplete();
      return true;
    }
    return false;
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (tickIntervalRef.current !== null) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    };
  }, []);

  const reset = useCallback((): void => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState(initialState);
  }, []);

  const stop = useCallback((): void => {
    timerService.stopTimer();
    reset();
  }, [reset]);

  const handleComplete = useCallback((): void => {
    // Calculate elapsed time for quota tracking
    let elapsedMs = 0;
    if (state.mode === 'countdown' && state.selectedDuration !== null) {
      // Countdown: elapsed time is the full selected duration
      elapsedMs = state.selectedDuration;
    } else if (state.mode === 'countup' && state.startTime !== null) {
      // Countup: elapsed time is actual time elapsed
      elapsedMs = Date.now() - state.startTime;
    }

    // Record to weekly quota (fire and forget - don't block completion UI)
    if (elapsedMs > 0) {
      quota.recordTime(elapsedMs).catch((error) => {
        console.error('Failed to record quota time:', error);
      });
    }

    // Set status to complete
    setState((prev) => ({
      ...prev,
      status: 'complete',
    }));

    // Trigger platform completion (shows "Done" message)
    timerService.completeTimer();

    // Auto-reset to idle after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setState(initialState);
    }, 5000);
  }, [state.mode, state.selectedDuration, state.startTime, quota]);

  const start = useCallback((durationMinutes?: number): void => {
    // Clear any pending timeout from previous completion
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Calculate weekly debt for Live Activity display
    const weeklyDebtMinutes = quota.debtMinutes > 0 ? quota.debtMinutes : undefined;

    if (durationMinutes !== undefined) {
      // Countdown mode
      const durationMs: number = minutesToMs(durationMinutes);
      const now: number = Date.now();
      const endTime: number = now + durationMs;

      setState({
        status: 'running',
        mode: 'countdown',
        selectedDuration: durationMs,
        endTime,
        startTime: now,
      });

      // Initialize displayTime based on countdown mode
      setDisplayTime(formatTimer(durationMs));

      timerService.startTimer(endTime, 'countdown', weeklyDebtMinutes);
    } else {
      // Count-up mode (no duration provided)
      const now: number = Date.now();

      setState({
        status: 'running',
        mode: 'countup',
        selectedDuration: null,
        endTime: null,
        startTime: now,
      });

      // Initialize displayTime to 00:00 for count-up
      setDisplayTime(formatTimer(0));

      timerService.startTimer(null, 'countup', weeklyDebtMinutes);
    }
  }, [quota.debtMinutes]);

  // Consolidated update and completion effect
  useEffect(() => {
    if (state.status !== 'running') {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      return;
    }

    const tick = () => {
      // 1. Check for completion (if in countdown mode)
      const isCompleted = checkCompletion(state, handleComplete);
      if (isCompleted) {
        if (tickIntervalRef.current) {
          clearInterval(tickIntervalRef.current);
          tickIntervalRef.current = null;
        }
        return;
      }

      // 2. Update the UI display based on current time
      updateDisplayTime(state);
      
      // 3. Update native platform services with weekly debt info
      if (state.endTime !== null) {
        const weeklyDebtMinutes = quota.debtMinutes > 0 ? quota.debtMinutes : undefined;
        timerService.updateTimer?.(state.endTime, state.mode, weeklyDebtMinutes);
      }
    };

    // Run immediate first tick
    tick();

    // Start 1s interval
    tickIntervalRef.current = setInterval(tick, TICK_INTERVAL_MS);

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    };
  }, [state.status, state.endTime, state.startTime, handleComplete, checkCompletion, updateDisplayTime, quota.debtMinutes]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // If returning to foreground, force an immediate refresh
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        state.status === 'running'
      ) {
        // Force sync update to prevent display freeze/jump
        updateDisplayTime(state);
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [state.status, state.endTime, state.startTime, updateDisplayTime]);

  const timeRemaining: number | null = useMemo(() => {
    if (state.endTime === null) {
      return null;
    }
    return state.endTime - Date.now();
  }, [state.endTime]);

  const startCountUp = useCallback((): void => {
    // Clear any pending timeout from previous completion
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const now: number = Date.now();

    setState({
      status: 'running',
      mode: 'countup',
      selectedDuration: null,
      endTime: null,
      startTime: now,
    });

    // Initialize displayTime to 00:00 for count-up
    setDisplayTime(formatTimer(0));

    timerService.startTimer(null, 'countup');
  }, []);

  const stopCountUp = useCallback((): void => {
    // Capture final elapsed time before changing state
    if (state.startTime !== null) {
      const elapsed = Date.now() - state.startTime;
      setDisplayTime(formatTimer(elapsed));
    }

    // Set status to complete
    setState((prev) => ({
      ...prev,
      status: 'complete',
    }));

    // Auto-reset to idle after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setState(initialState);
      setDisplayTime('00:00');
    }, 3000);
  }, [state.startTime]);

  return {
    status: state.status,
    mode: state.mode,
    selectedDuration: state.selectedDuration,
    endTime: state.endTime,
    startTime: state.startTime,
    timeRemaining,
    displayTime,
    start,
    stop,
    reset,
    handleComplete,
    startCountUp,
    stopCountUp,
  };
}
