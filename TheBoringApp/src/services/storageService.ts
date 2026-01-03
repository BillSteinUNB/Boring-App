import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  WEEKLY_QUOTA: 'boring-app-weekly-quota',
  LOGBOOK: 'boring-app-logbook',
  SETTINGS: 'boring-app-settings',
} as const;

// Types
export interface LogbookEntry {
  id: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  completed: boolean;
  createdAt: string;
}

export interface WeeklyQuota {
  currentWeekStart: string; // ISO date string for Monday 00:00:00
  totalMinutes: number;
  sessionsCompleted: number;
  sessionsAttempted: number;
}

export interface StorageSettings {
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  defaultDuration: number;
}

// Default values
const DEFAULT_WEEKLY_QUOTA: WeeklyQuota = {
  currentWeekStart: getWeekStart(new Date().toISOString()),
  totalMinutes: 0,
  sessionsCompleted: 0,
  sessionsAttempted: 0,
};

/**
 * Get the start of the week (Monday 00:00:00) for a given date
 */
function getWeekStart(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday
  const weekStart = new Date(date.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString();
}

/**
 * Check if we're in a new week and reset quota if needed
 */
async function checkAndResetWeeklyQuota(quota: WeeklyQuota): Promise<WeeklyQuota> {
  const currentWeekStart = getWeekStart(new Date().toISOString());
  
  if (quota.currentWeekStart !== currentWeekStart) {
    // New week - reset quota
    return {
      ...DEFAULT_WEEKLY_QUOTA,
      currentWeekStart,
    };
  }
  
  return quota;
}

/**
 * Storage Service
 * 
 * Handles persistence of:
 * - Weekly Quota: Tracks weekly timer usage statistics
 * - Logbook: Stores completed timer sessions
 * - Settings: App preferences
 * 
 * All data is stored locally using AsyncStorage
 */
export const storageService = {
  /**
   * Initialize storage - check and reset weekly quota if needed
   */
  async initialize(): Promise<void> {
    try {
      const quotaJson = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_QUOTA);
      if (quotaJson) {
        const quota = JSON.parse(quotaJson);
        const updatedQuota = await checkAndResetWeeklyQuota(quota);
        if (updatedQuota.currentWeekStart !== quota.currentWeekStart) {
          await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_QUOTA, JSON.stringify(updatedQuota));
        }
      }
    } catch (error) {
      console.error('[StorageService] Initialize error:', error);
    }
  },

  // ============ Weekly Quota Operations ============

  /**
   * Get current weekly quota
   */
  async getWeeklyQuota(): Promise<WeeklyQuota> {
    try {
      const quotaJson = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_QUOTA);
      if (quotaJson) {
        const quota = JSON.parse(quotaJson);
        return await checkAndResetWeeklyQuota(quota);
      }
      return { ...DEFAULT_WEEKLY_QUOTA };
    } catch (error) {
      console.error('[StorageService] Failed to get weekly quota:', error);
      return { ...DEFAULT_WEEKLY_QUOTA };
    }
  },

  /**
   * Add a completed session to the weekly quota
   */
  async addCompletedSession(durationMs: number): Promise<WeeklyQuota> {
    try {
      const quota = await this.getWeeklyQuota();
      const updatedQuota: WeeklyQuota = {
        ...quota,
        totalMinutes: quota.totalMinutes + Math.round(durationMs / 60000),
        sessionsCompleted: quota.sessionsCompleted + 1,
        sessionsAttempted: quota.sessionsAttempted + 1,
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_QUOTA, JSON.stringify(updatedQuota));
      return updatedQuota;
    } catch (error) {
      console.error('[StorageService] Failed to add completed session:', error);
      throw error;
    }
  },

  /**
   * Add a failed/attempted session to the weekly quota (not completed)
   */
  async addAttemptedSession(): Promise<WeeklyQuota> {
    try {
      const quota = await this.getWeeklyQuota();
      const updatedQuota: WeeklyQuota = {
        ...quota,
        sessionsAttempted: quota.sessionsAttempted + 1,
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_QUOTA, JSON.stringify(updatedQuota));
      return updatedQuota;
    } catch (error) {
      console.error('[StorageService] Failed to add attempted session:', error);
      throw error;
    }
  },

  /**
   * Reset weekly quota (for testing or manual reset)
   */
  async resetWeeklyQuota(): Promise<WeeklyQuota> {
    try {
      const newQuota: WeeklyQuota = {
        ...DEFAULT_WEEKLY_QUOTA,
        currentWeekStart: getWeekStart(new Date().toISOString()),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_QUOTA, JSON.stringify(newQuota));
      return newQuota;
    } catch (error) {
      console.error('[StorageService] Failed to reset weekly quota:', error);
      throw error;
    }
  },

  // ============ Logbook Operations ============

  /**
   * Get all logbook entries
   */
  async getLogbook(): Promise<LogbookEntry[]> {
    try {
      const logbookJson = await AsyncStorage.getItem(STORAGE_KEYS.LOGBOOK);
      if (logbookJson) {
        return JSON.parse(logbookJson);
      }
      return [];
    } catch (error) {
      console.error('[StorageService] Failed to get logbook:', error);
      return [];
    }
  },

  /**
   * Add a new entry to the logbook
   */
  async addLogbookEntry(entry: Omit<LogbookEntry, 'id' | 'createdAt'>): Promise<LogbookEntry> {
    try {
      const newEntry: LogbookEntry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      const currentLogbook = await this.getLogbook();
      const updatedLogbook = [newEntry, ...currentLogbook];

      await AsyncStorage.setItem(STORAGE_KEYS.LOGBOOK, JSON.stringify(updatedLogbook));
      return newEntry;
    } catch (error) {
      console.error('[StorageService] Failed to add logbook entry:', error);
      throw error;
    }
  },

  /**
   * Get logbook entries for a specific date range
   */
  async getLogbookByDateRange(startDate: string, endDate: string): Promise<LogbookEntry[]> {
    try {
      const logbook = await this.getLogbook();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      return logbook.filter((entry) => {
        const entryTime = new Date(entry.createdAt).getTime();
        return entryTime >= start && entryTime <= end;
      });
    } catch (error) {
      console.error('[StorageService] Failed to get logbook by date range:', error);
      return [];
    }
  },

  /**
   * Clear all logbook entries
   */
  async clearLogbook(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LOGBOOK);
    } catch (error) {
      console.error('[StorageService] Failed to clear logbook:', error);
      throw error;
    }
  },

  /**
   * Delete a specific logbook entry
   */
  async deleteLogbookEntry(id: string): Promise<void> {
    try {
      const logbook = await this.getLogbook();
      const updatedLogbook = logbook.filter((entry) => entry.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.LOGBOOK, JSON.stringify(updatedLogbook));
    } catch (error) {
      console.error('[StorageService] Failed to delete logbook entry:', error);
      throw error;
    }
  },

  // ============ Settings Operations ============

  /**
   * Get app settings
   */
  async getSettings(): Promise<StorageSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }
      return {
        notificationsEnabled: true,
        darkModeEnabled: true,
        defaultDuration: 15,
      };
    } catch (error) {
      console.error('[StorageService] Failed to get settings:', error);
      return {
        notificationsEnabled: true,
        darkModeEnabled: true,
        defaultDuration: 15,
      };
    }
  },

  /**
   * Update app settings
   */
  async updateSettings(settings: Partial<StorageSettings>): Promise<StorageSettings> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('[StorageService] Failed to update settings:', error);
      throw error;
    }
  },

  // ============ Utility Operations ============

  /**
   * Clear all storage data (for testing or account reset)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.WEEKLY_QUOTA,
        STORAGE_KEYS.LOGBOOK,
        STORAGE_KEYS.SETTINGS,
      ]);
    } catch (error) {
      console.error('[StorageService] Failed to clear all storage:', error);
      throw error;
    }
  },

  /**
   * Export all data as JSON string (for backup)
   */
  async exportData(): Promise<string> {
    try {
      const [quota, logbook, settings] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_QUOTA),
        AsyncStorage.getItem(STORAGE_KEYS.LOGBOOK),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
      ]);

      return JSON.stringify({
        weeklyQuota: quota ? JSON.parse(quota) : null,
        logbook: logbook ? JSON.parse(logbook) : [],
        settings: settings ? JSON.parse(settings) : null,
        exportedAt: new Date().toISOString(),
      }, null, 2);
    } catch (error) {
      console.error('[StorageService] Failed to export data:', error);
      throw error;
    }
  },
};

// Export storage keys for external use
export { STORAGE_KEYS };
