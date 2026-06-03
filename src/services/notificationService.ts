/**
 * Notification Service
 *
 * Schedules and manages daily journal reminders using expo-notifications.
 * Supports morning and evening notification times configured via SettingsStore.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useSettingsStore } from '@/state/settingsStore';

/** Notification channel identifier */
const CHANNEL_ID = 'journal-reminders';

/** Notification category for interactive actions */
const JOURNAL_CATEGORY = 'JOURNAL_REMINDER';

/** Morning reminder title and body */
const MORNING_NOTIFICATION = {
  title: '🌅 Good Morning!',
  body: 'Time to log your mood and start your day mindfully.',
};

/** Evening reminder title and body */
const EVENING_NOTIFICATION = {
  title: '🌙 Evening Reflection',
  body: "Take a moment to reflect on your day and log your journal entry.",
};

/** Configure notification handler to show alerts when app is foregrounded */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Request notification permissions from the OS */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      if (status !== 'granted') {
        console.warn('Notification permission not granted:', status);
        return false;
      }
    }

    // Mark that we've requested permission
    useSettingsStore.getState().markNotificationPermissionRequested();

    return true;
  } catch (error) {
    console.error('Failed to request notification permissions:', error);
    return false;
  }
}

/** Set up the notification channel for Android */
async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Journal Reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#6366F1',
    description: 'Daily reminders to log your journal entries',
    enableVibrate: true,
    showBadge: false,
  });
}

/** Set up notification categories (interactive actions) */
async function setupNotificationCategories(): Promise<void> {
  await Notifications.setNotificationCategoryAsync(JOURNAL_CATEGORY, [
    {
      identifier: 'OPEN_JOURNAL',
      buttonOptions: {
        isDestructive: false,
        isAuthenticationRequired: false,
      },
    },
  ]);
}

/**
 * Parse a time string "HH:MM" into hour and minute numbers.
 * Returns null if the format is invalid.
 */
function parseTimeString(
  timeStr: string,
): { hour: number; minute: number } | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return { hour, minute };
}

/**
 * Schedule a daily repeating notification at the given time.
 * Returns the notification identifier, or null on failure.
 */
async function scheduleDailyNotification(
  timeStr: string,
  content: { title: string; body: string },
  identifier: string,
): Promise<string | null> {
  try {
    const parsed = parseTimeString(timeStr);
    if (!parsed) {
      console.warn(`Invalid time format: ${timeStr}`);
      return null;
    }

    // Cancel any existing notification with this identifier first
    await Notifications.cancelScheduledNotificationAsync(identifier);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        sound: true,
        categoryIdentifier: JOURNAL_CATEGORY,
        data: { type: 'journal_reminder', identifier },
      },
      identifier,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: parsed.hour,
        minute: parsed.minute,
        repeats: true,
      },
    });

    return notificationId;
  } catch (error) {
    console.error(`Failed to schedule notification (${identifier}):`, error);
    return null;
  }
}

/** Cancel all scheduled journal reminder notifications */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync('morning-reminder');
    await Notifications.cancelScheduledNotificationAsync('evening-reminder');
  } catch (error) {
    console.error('Failed to cancel notifications:', error);
  }
}

/**
 * Schedule all notifications based on current settings.
 * This is the main entry point for setting up notifications.
 */
export async function scheduleAllNotifications(): Promise<{
  morning: string | null;
  evening: string | null;
}> {
  const settings = useSettingsStore.getState();
  const result = { morning: null as string | null, evening: null as string | null };

  // If notifications are disabled, cancel everything
  if (!settings.notifications.enabled) {
    await cancelAllNotifications();
    return result;
  }

  // Set up Android channel and categories
  await setupAndroidChannel();
  await setupNotificationCategories();

  // Schedule morning notification
  if (settings.notifications.morningEnabled) {
    result.morning = await scheduleDailyNotification(
      settings.notifications.morningTime,
      MORNING_NOTIFICATION,
      'morning-reminder',
    );
  } else {
    // Cancel morning if it was previously scheduled
    await Notifications.cancelScheduledNotificationAsync('morning-reminder');
  }

  // Schedule evening notification
  if (settings.notifications.eveningEnabled) {
    result.evening = await scheduleDailyNotification(
      settings.notifications.eveningTime,
      EVENING_NOTIFICATION,
      'evening-reminder',
    );
  } else {
    // Cancel evening if it was previously scheduled
    await Notifications.cancelScheduledNotificationAsync('evening-reminder');
  }

  return result;
}

/**
 * Initialize the notification system.
 * Call this once when the app starts.
 */
export async function initializeNotifications(): Promise<void> {
  try {
    // Set up Android channel
    await setupAndroidChannel();

    // Set up categories
    await setupNotificationCategories();

    // Check current settings and schedule if enabled
    const settings = useSettingsStore.getState();
    if (settings.notifications.enabled) {
      // Request permissions if we haven't already
      if (!settings.hasRequestedNotificationPermission) {
        const granted = await requestNotificationPermissions();
        if (!granted) {
          // Disable notifications if permission denied
          useSettingsStore.getState().updateNotificationSettings({
            enabled: false,
          });
          return;
        }
      }

      await scheduleAllNotifications();
    }

    // Listen for notification responses (when user taps notification)
    Notifications.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content;
      if (data?.type === 'journal_reminder') {
        // The app will navigate to the Home screen automatically
        // via the navigation container's linking configuration
        console.log('Journal reminder notification tapped:', data.identifier);
      }
    });
  } catch (error) {
    console.error('Failed to initialize notifications:', error);
  }
}

/**
 * Get all currently scheduled notifications (for debugging).
 */
export async function getScheduledNotifications(): Promise<
  Notifications.NotificationRequest[]
> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Reschedule all notifications. Call this when notification settings change.
 */
export async function rescheduleNotifications(): Promise<void> {
  await scheduleAllNotifications();
}
