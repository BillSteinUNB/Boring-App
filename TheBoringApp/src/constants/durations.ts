export const DURATIONS = [15, 60] as const;
export type Duration = (typeof DURATIONS)[number];

export const DEFAULT_CUSTOM_DURATION = 30;
export const MIN_DURATION = 1;
export const MAX_DURATION = 180;

export const minutesToMs = (minutes: number): number => minutes * 60 * 1000;
export const msToMinutes = (ms: number): number => Math.floor(ms / 60 / 1000);
export const isValidDuration = (minutes: number): boolean =>
  minutes >= MIN_DURATION && minutes <= MAX_DURATION;

export const formatMsToTime = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
