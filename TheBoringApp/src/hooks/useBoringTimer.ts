import { useState, useMemo, useEffect, useCallback } from 'react';
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
}

const initialState: TimerState = {
  status: 'idle',
  selectedDuration: null,
  endTime: null,
};

export function useBoringTimer(): UseBoringTimerReturn {
  const [state, setState] = useState<TimerState>(initialState);

  const reset = useCallback((): void => {
    setState(initialState);
    console.log('Timer stopped');
  }, []);

  const stop = useCallback((): void => {
    timerService.stopTimer();
    reset();
  }, [reset]);

  const handleComplete = useCallback((): void => {
    timerService.stopTimer();
    setState((prev) => ({ ...prev, status: 'complete' }));

    setTimeout(() => {
      reset();
    }, 2000);
  }, [reset]);

  const start = useCallback((durationMinutes: number): void => {
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
  };
}
