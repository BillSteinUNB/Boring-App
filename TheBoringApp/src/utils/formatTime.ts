/**
 * Formats milliseconds into a display string for the timer.
 * Under 1 hour: "MM:SS" (e.g., "05:23")
 * 1 hour or over: "H:MM:SS" (e.g., "1:23:45")
 */
export function formatTimer(ms: number): string {
  if (ms <= 0) return "00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number): string => n.toString().padStart(2, "0");

  if (hours >= 1) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Formats milliseconds into a screen reader friendly string.
 * Example: "5 minutes 23 seconds"
 */
export function formatTimerAccessible(ms: number): string {
  if (ms <= 0) return "0 seconds";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);

  return parts.join(" ");
}
