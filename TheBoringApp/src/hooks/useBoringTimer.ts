import { useState, useMemo } from 'react';
import { minutesToMs } from '../constants/durations';

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

  const start = (durationMinutes: number): void => {
    const durationMs: number = minutesToMs(durationMinutes);
    const endTime: number = Date.now() + durationMs;

    setState({
      status: 'running',
      selectedDuration: durationMs,
      endTime,
    });

    console.log(`Timer started: ${durationMinutes} minutes`);
  };

  const stop = (): void => {
    setState(initialState);
    console.log('Timer stopped');
  };

  const reset = (): void => {
    stop();
  };

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
