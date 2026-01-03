import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { minutesToMs, msToMinutes } from '../constants/durations';

// Storage keys
const STORAGE_KEY_QUOTA_STATE = '@weekly_quota_state';
const STORAGE_KEY_LOGBOOK = '@quota_logbook';

/**
 * Configuration constants for the Weekly Quota system
 */
const QUOTA_CONFIG = {
  /** Target weekly boring time in minutes (default: 7 hours = 420 minutes) */
  WEEKLY_QUOTA_MINUTES: 420,
  /** Check interval for Monday reset (in milliseconds) */
  RESET_CHECK_INTERVAL_MS: 60 * 1000, // 1 minute
  /** Grace period after Monday 00:00 before forcing reset (in milliseconds) */
  RESET_GRACE_PERIOD_MS: 5 * 60 * 1000, // 5 minutes
};

/**
 * Converts quota config to milliseconds
 */
const getWeeklyQuotaMs = (): number => 
  minutesToMs(QUOTA_CONFIG.WEEKLY_QUOTA_MINUTES);

/**
 * Interface for the weekly quota state persisted to storage
 */
interface QuotaState {
  /** ISO week string identifying the current week (e.g., "2026-W01") */
  weekIdentifier: string;
  /** Total boring time accumulated this week in milliseconds */
  accumulatedMs: number;
  /** Timestamp when the current week started */
  weekStartTimestamp: number;
  /** Timestamp of last update */
  lastUpdatedTimestamp: number;
}

/**
 * Interface for logbook entries (archived weekly data)
 */
interface LogbookEntry {
  /** ISO week string for the archived week */
  weekIdentifier: string;
  /** Week start timestamp */
  weekStartTimestamp: number;
  /** Total boring time accumulated that week in milliseconds */
  accumulatedMs: number;
  /** Timestamp when entry was archived */
  archivedTimestamp: number;
}

/**
 * Interface for the useWeeklyQuota return value
 */
interface UseWeeklyQuotaReturn {
  /** Total boring time accumulated this week in milliseconds */
  accumulatedMs: number;
  /** Remaining quota time in milliseconds (can be negative = debt) */
  remainingMs: number;
  /** Weekly debt in minutes (positive = debt, negative = surplus) */
  debtMinutes: number;
  /** Progress towards quota as a percentage (0-100, can exceed 100) */
  progressPercent: number;
  /** Whether a Monday reset just occurred */
  justReset: boolean;
  /** Clear the reset flag after showing UI feedback */
  clearResetFlag: () => void;
  /** Record completed boring time (called when timer finishes) */
  recordTime: (elapsedMs: number) => Promise<void>;
  /** Force refresh from storage */
  refresh: () => Promise<void>;
  /** Get all logbook entries */
  getLogbook: () => Promise<LogbookEntry[]>;
  /** Clear all data (for testing/reset) */
  clearAll: () => Promise<void>;
}

/**
 * Generate ISO week identifier for a given date
 * Format: "YYYY-Www" (e.g., "2026-W01")
 */
const getWeekIdentifier = (date: Date): string => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

/**
 * Get the Monday 00:00:00 timestamp for the current week
 */
const getCurrentWeekStartTimestamp = (): number => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
};

/**
 * Check if we're in a new week compared to the stored state
 */
const isNewWeek = (storedState: QuotaState): boolean => {
  const currentWeekIdentifier = getWeekIdentifier(new Date());
  return storedState.weekIdentifier !== currentWeekIdentifier;
};

/**
 * Create initial quota state for current week
 */
const createInitialState = (): QuotaState => ({
  weekIdentifier: getWeekIdentifier(new Date()),
  accumulatedMs: 0,
  weekStartTimestamp: getCurrentWeekStartTimestamp(),
  lastUpdatedTimestamp: Date.now(),
});

/**
 * Create a logbook entry from current state
 */
const createLogbookEntry = (state: QuotaState): LogbookEntry => ({
  weekIdentifier: state.weekIdentifier,
  weekStartTimestamp: state.weekStartTimestamp,
  accumulatedMs: state.accumulatedMs,
  archivedTimestamp: Date.now(),
});

/**
 * Hook for managing weekly boring time quota
 * Handles Monday reset logic and persistent storage
 */
export function useWeeklyQuota(): UseWeeklyQuotaReturn {
  const [quotaState, setQuotaState] = useState<QuotaState | null>(null);
  const [justReset, setJustReset] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const resetCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initializationPromiseRef = useRef<Promise<void> | null>(null);

  /**
   * Load quota state from AsyncStorage
   */
  const loadState = useCallback(async (): Promise<QuotaState> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_QUOTA_STATE);
      if (stored) {
        const parsed: QuotaState = JSON.parse(stored);
        
        // Check if we're in a new week
        if (isNewWeek(parsed)) {
          // Archive current week to logbook
          const logbookEntry = createLogbookEntry(parsed);
          const existingLogbookRaw = await AsyncStorage.getItem(STORAGE_KEY_LOGBOOK);
          const existingLogbook: LogbookEntry[] = existingLogbookRaw 
            ? JSON.parse(existingLogbookRaw) 
            : [];
          await AsyncStorage.setItem(
            STORAGE_KEY_LOGBOOK, 
            JSON.stringify([...existingLogbook, logbookEntry])
          );

          // Create new state for current week
          const newState = createInitialState();
          await AsyncStorage.setItem(STORAGE_KEY_QUOTA_STATE, JSON.stringify(newState));
          
          // Set reset flag for UI feedback
          setJustReset(true);
          
          return newState;
        }
        
        return parsed;
      }
      
      // No stored state, create initial state
      const initialState = createInitialState();
      await AsyncStorage.setItem(STORAGE_KEY_QUOTA_STATE, JSON.stringify(initialState));
      return initialState;
    } catch (error) {
      console.error('Failed to load quota state:', error);
      return createInitialState();
    }
  }, []);

  /**
   * Save quota state to AsyncStorage
   */
  const saveState = useCallback(async (state: QuotaState): Promise<void> => {
    try {
      const updatedState = { ...state, lastUpdatedTimestamp: Date.now() };
      await AsyncStorage.setItem(STORAGE_KEY_QUOTA_STATE, JSON.stringify(updatedState));
      setQuotaState(updatedState);
    } catch (error) {
      console.error('Failed to save quota state:', error);
    }
  }, []);

  /**
   * Initialize the hook
   */
  useEffect(() => {
    const initialize = async () => {
      if (!initializationPromiseRef.current) {
        initializationPromiseRef.current = loadState();
      }
      
      try {
        const state = await initializationPromiseRef.current;
        setQuotaState(state);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize weekly quota:', error);
      }
    };

    initialize();
  }, [loadState]);

  /**
   * Periodic Monday reset check (runs every minute when app is active)
   */
  useEffect(() => {
    if (!isInitialized) return;

    const checkForNewWeek = async () => {
      if (quotaState && isNewWeek(quotaState)) {
        try {
          // Archive current week
          const logbookEntry = createLogbookEntry(quotaState);
          const existingLogbookRaw = await AsyncStorage.getItem(STORAGE_KEY_LOGBOOK);
          const existingLogbook: LogbookEntry[] = existingLogbookRaw 
            ? JSON.parse(existingLogbookRaw) 
            : [];
          await AsyncStorage.setItem(
            STORAGE_KEY_LOGBOOK,
            JSON.stringify([...existingLogbook, logbookEntry])
          );

          // Create new state
          const newState = createInitialState();
          await AsyncStorage.setItem(STORAGE_KEY_QUOTA_STATE, JSON.stringify(newState));
          setQuotaState(newState);
          setJustReset(true);
        } catch (error) {
          console.error('Failed to handle week reset:', error);
        }
      }
    };

    // Run initial check
    checkForNewWeek();

    // Set up interval for ongoing checks
    resetCheckIntervalRef.current = setInterval(
      checkForNewWeek, 
      QUOTA_CONFIG.RESET_CHECK_INTERVAL_MS
    );

    return () => {
      if (resetCheckIntervalRef.current) {
        clearInterval(resetCheckIntervalRef.current);
        resetCheckIntervalRef.current = null;
      }
    };
  }, [isInitialized, quotaState]);

  /**
   * Calculate derived values
   */
  const accumulatedMs = quotaState?.accumulatedMs ?? 0;
  const weeklyQuotaMs = getWeeklyQuotaMs();
  const remainingMs = weeklyQuotaMs - accumulatedMs;
  const debtMinutes = -Math.floor(msToMinutes(remainingMs)); // Negative = surplus, positive = debt
  const progressPercent = (accumulatedMs / weeklyQuotaMs) * 100;

  /**
   * Record completed boring time (called when timer finishes)
   */
  const recordTime = useCallback(async (elapsedMs: number): Promise<void> => {
    if (!quotaState || elapsedMs <= 0) return;

    const updatedState = {
      ...quotaState,
      accumulatedMs: quotaState.accumulatedMs + elapsedMs,
    };
    
    await saveState(updatedState);
  }, [quotaState, saveState]);

  /**
   * Clear the reset flag after showing UI feedback
   */
  const clearResetFlag = useCallback(() => {
    setJustReset(false);
  }, []);

  /**
   * Force refresh from storage
   */
  const refresh = useCallback(async (): Promise<void> => {
    const state = await loadState();
    setQuotaState(state);
  }, [loadState]);

  /**
   * Get all logbook entries
   */
  const getLogbook = useCallback(async (): Promise<LogbookEntry[]> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_LOGBOOK);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load logbook:', error);
      return [];
    }
  }, []);

  /**
   * Clear all data (for testing/reset)
   */
  const clearAll = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEY_QUOTA_STATE,
        STORAGE_KEY_LOGBOOK,
      ]);
      const initialState = createInitialState();
      setQuotaState(initialState);
      setJustReset(false);
    } catch (error) {
      console.error('Failed to clear quota data:', error);
    }
  }, []);

  return {
    accumulatedMs,
    remainingMs,
    debtMinutes,
    progressPercent,
    justReset,
    clearResetFlag,
    recordTime,
    refresh,
    getLogbook,
    clearAll,
  };
}
