/**
 * Settings Store
 * Zustand store for managing app settings with AsyncStorage persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSettings {
  enabled: boolean;
  morningReminderTime: string; // Format: "HH:mm"
  eveningReminderTime: string; // Format: "HH:mm"
  morningEnabled: boolean;
  eveningEnabled: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  firstLaunch: boolean;
  hasRequestedNotificationPermission: boolean;
  version: string;
}

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;
}

interface SettingsActions {
  // Settings management
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => void;
  resetSettings: () => void;

  // Notification settings convenience methods
  setNotificationsEnabled: (enabled: boolean) => void;
  setMorningReminderTime: (time: string) => void;
  setEveningReminderTime: (time: string) => void;
  setMorningEnabled: (enabled: boolean) => void;
  setEveningEnabled: (enabled: boolean) => void;
  markNotificationPermissionRequested: () => void;
  markFirstLaunchComplete: () => void;

  // Theme settings
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // State management
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  notifications: {
    enabled: true,
    morningReminderTime: '08:00',
    eveningReminderTime: '20:00',
    morningEnabled: true,
    eveningEnabled: true,
  },
  firstLaunch: true,
  hasRequestedNotificationPermission: false,
  version: '1.0.0',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      error: null,

      // Update settings
      updateSettings: (updates: Partial<AppSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      // Update notification settings
      updateNotificationSettings: (updates: Partial<NotificationSettings>) => {
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, ...updates },
          },
        }));
      },

      // Reset settings to defaults
      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
      },

      // Enable/disable notifications
      setNotificationsEnabled: (enabled: boolean) => {
        get().updateNotificationSettings({ enabled });
      },

      // Set morning reminder time
      setMorningReminderTime: (time: string) => {
        get().updateNotificationSettings({ morningReminderTime: time });
      },

      // Set evening reminder time
      setEveningReminderTime: (time: string) => {
        get().updateNotificationSettings({ eveningReminderTime: time });
      },

      // Enable/disable morning reminders
      setMorningEnabled: (enabled: boolean) => {
        get().updateNotificationSettings({ morningEnabled: enabled });
      },

      // Enable/disable evening reminders
      setEveningEnabled: (enabled: boolean) => {
        get().updateNotificationSettings({ eveningEnabled: enabled });
      },

      // Mark that notification permission has been requested
      markNotificationPermissionRequested: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            hasRequestedNotificationPermission: true,
          },
        }));
      },

      // Mark first launch as complete
      markFirstLaunchComplete: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            firstLaunch: false,
          },
        }));
      },

      // Set theme
      setTheme: (theme: 'light' | 'dark' | 'system') => {
        get().updateSettings({ theme });
      },

      // Set loading state
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // Set error state
      setError: (error: string | null) => {
        set({ error });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);