export const DURATIONS = [5, 15, 30] as const;

export type Duration = (typeof DURATIONS)[number];

export const minutesToMs = (minutes: number): number => minutes * 60 * 1000;

export const formatMsToTime = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
