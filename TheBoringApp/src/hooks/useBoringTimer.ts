import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { minutesToMs } from '../constants/durations';
import { timerService } from '../services/timerService';

type TimerStatus = 'idle' | 'running' | 'complete';

interface TimerState {
  status: TimerStatus;
  selectedDuration: number | null;
  endTime: number | null;
}

interface UseBoringTimerReturn {
  status: TimerStatus;
  selectedDuration: number | null;
  endTime: number | null;
  timeRemaining: number | null;
  start: (durationMinutes: number) => void;
  stop: () => void;
  reset: () => void;
  handleComplete: () => void;
}

const initialState: TimerState = {
  status: 'idle',
  selectedDuration: null,
  endTime: null,
};

export function useBoringTimer(): UseBoringTimerReturn {
  const [state, setState] = useState<TimerState>(initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
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
    console.log('Timer reset');
  }, []);

  const stop = useCallback((): void => {
    timerService.stopTimer();
    reset();
    console.log('Timer stopped');
  }, [reset]);

  const handleComplete = useCallback((): void => {
    // Set status to complete
    setState((prev) => ({
      ...prev,
      status: 'complete',
    }));

    // Trigger platform completion (shows "Done" message)
    timerService.completeTimer();

    console.log('Timer completed');

    // Auto-reset to idle after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setState(initialState);
      console.log('Timer auto-reset to idle');
    }, 5000);
  }, []);

  const start = useCallback((durationMinutes: number): void => {
    // Clear any pending timeout from previous completion
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const durationMs: number = minutesToMs(durationMinutes);
    const endTime: number = Date.now() + durationMs;

    setState({
      status: 'running',
      selectedDuration: durationMs,
      endTime,
    });

    timerService.startTimer(endTime);
    console.log(`Timer started: ${durationMinutes} minutes`);
  }, []);

  // Auto-complete when timer reaches zero
  useEffect(() => {
    if (state.status !== 'running' || state.endTime === null) {
      return;
    }

    const interval = setInterval(() => {
      if (Date.now() >= state.endTime!) {
        handleComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status, state.endTime, handleComplete]);

  const timeRemaining: number | null = useMemo(() => {
    if (state.endTime === null) {
      return null;
    }
    return state.endTime - Date.now();
  }, [state.endTime]);

  return {
    status: state.status,
    selectedDuration: state.selectedDuration,
    endTime: state.endTime,
    timeRemaining,
    start,
    stop,
    reset,
    handleComplete,
  };
}
