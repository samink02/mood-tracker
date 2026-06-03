import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/state/settingsStore';
import { useJournalStore } from '@/state/journalStore';
import { useTodoStore } from '@/state/todoStore';
import { useWeeklyStore } from '@/state/weeklyStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

/** Theme option keys */
type ThemeKey = 'light' | 'dark' | 'system';

/** Notification time picker mode */
type TimeField = 'morningReminderTime' | 'eveningReminderTime';

export default function SettingsScreen() {
  const settings = useSettingsStore((s) => s.settings);
  const updateNotificationSettings = useSettingsStore(
    (s) => s.updateNotificationSettings,
  );
  const setTheme = useSettingsStore((s) => s.setTheme);
  const resetSettings = useSettingsStore((s) => s.resetSettings);

  // Local state for time editing
  const [editingTime, setEditingTime] = useState<TimeField | null>(null);
  const [tempTime, setTempTime] = useState('');

  // Theme options
  const themeOptions: { key: ThemeKey; label: string; emoji: string }[] = [
    { key: 'light', label: 'Light', emoji: '☀️' },
    { key: 'dark', label: 'Dark', emoji: '🌙' },
    { key: 'system', label: 'System', emoji: '💻' },
  ];

  /** Handle notification toggle */
  const handleNotificationToggle = (value: boolean) => {
    updateNotificationSettings({ enabled: value });
  };

  /** Handle morning notification toggle */
  const handleMorningToggle = (value: boolean) => {
    updateNotificationSettings({ morningEnabled: value });
  };

  /** Handle evening notification toggle */
  const handleEveningToggle = (value: boolean) => {
    updateNotificationSettings({ eveningEnabled: value });
  };

  /** Start editing a time field */
  const startEditTime = (field: TimeField) => {
    const current =
      field === 'morningReminderTime'
        ? settings.notifications.morningReminderTime
        : settings.notifications.eveningReminderTime;
    setTempTime(current);
    setEditingTime(field);
  };

  /** Save edited time */
  const saveTime = () => {
    if (!editingTime) return;

    // Validate HH:MM format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(tempTime)) {
      Alert.alert(
        'Invalid Time',
        'Please enter a valid time in HH:MM format (e.g., 09:00).',
      );
      return;
    }

    updateNotificationSettings({ [editingTime]: tempTime });
    setEditingTime(null);
    setTempTime('');
  };

  /** Confirm data reset */
  const confirmResetAllData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your journal entries, to-do items, weekly check-ins, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            useJournalStore.persist.clearStorage();
            useTodoStore.persist.clearStorage();
            useWeeklyStore.persist.clearStorage();
            useSettingsStore.persist.clearStorage();
            Alert.alert(
              'Data Reset',
              'All data has been cleared. Please restart the app.',
            );
          },
        },
      ],
    );
  };

  /** Confirm settings reset */
  const confirmResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will restore all settings to their default values. Your journal data will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Settings',
          style: 'destructive',
          onPress: () => {
            resetSettings();
          },
        },
      ],
    );
  };

  /** Get data counts for display */
  const journalDates = useJournalStore((s) => s.getAllDates());
  const todoCount = useTodoStore((s) => s.items.length);
  const checkinCount = Object.keys(useWeeklyStore((s) => s.checkins)).length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⚙️ Settings</Text>
          <Text style={styles.headerSubtitle}>Configure your experience</Text>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Theme</Text>
          <View style={styles.themeRow}>
            {themeOptions.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.themeOption,
                  settings.theme === opt.key && styles.themeOptionSelected,
                ]}
                onPress={() => setTheme(opt.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.themeEmoji}>{opt.emoji}</Text>
                <Text
                  style={[
                    styles.themeLabel,
                    settings.theme === opt.key && styles.themeLabelSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notifications</Text>

          {/* Main toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={styles.settingLabel}>Enable Reminders</Text>
              <Text style={styles.settingDescription}>
                Receive daily journal reminders
              </Text>
            </View>
            <Switch
              value={settings.notifications.enabled}
              onValueChange={handleNotificationToggle}
              trackColor={{
                false: colors.text.tertiary,
                true: colors.primary[500],
              }}
              thumbColor={colors.background.light}
            />
          </View>

          {/* Morning notification */}
          {settings.notifications.enabled && (
            <View style={styles.subSetting}>
              <View style={styles.settingRow}>
                <View style={styles.settingLabelContainer}>
                  <Text style={styles.settingLabel}>🌅 Morning Reminder</Text>
                  <Text style={styles.settingDescription}>
                    Remind to log morning mood
                  </Text>
                </View>
                <Switch
                  value={settings.notifications.morningEnabled}
                  onValueChange={handleMorningToggle}
                  trackColor={{
                    false: colors.text.tertiary,
                    true: colors.primary[500],
                  }}
                  thumbColor={colors.background.light}
                />
              </View>

              {settings.notifications.morningEnabled && (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => startEditTime('morningReminderTime')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeLabel}>Morning Time</Text>
                  <Text style={styles.timeValue}>
                    {settings.notifications.morningReminderTime}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Evening notification */}
          {settings.notifications.enabled && (
            <View style={styles.subSetting}>
              <View style={styles.settingRow}>
                <View style={styles.settingLabelContainer}>
                  <Text style={styles.settingLabel}>🌙 Evening Reminder</Text>
                  <Text style={styles.settingDescription}>
                    Remind to reflect on the day
                  </Text>
                </View>
                <Switch
                  value={settings.notifications.eveningEnabled}
                  onValueChange={handleEveningToggle}
                  trackColor={{
                    false: colors.text.tertiary,
                    true: colors.primary[500],
                  }}
                  thumbColor={colors.background.light}
                />
              </View>

              {settings.notifications.eveningEnabled && (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => startEditTime('eveningReminderTime')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeLabel}>Evening Time</Text>
                  <Text style={styles.timeValue}>
                    {settings.notifications.eveningReminderTime}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Time edit modal */}
          {editingTime && (
            <View style={styles.timeEditContainer}>
              <Text style={styles.timeEditTitle}>
                Set{' '}
                {editingTime === 'morningReminderTime'
                  ? 'Morning'
                  : 'Evening'}{' '}
                Reminder Time
              </Text>
              <TextInput
                style={styles.timeInput}
                value={tempTime}
                onChangeText={setTempTime}
                placeholder="HH:MM"
                keyboardType={
                  Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'
                }
                maxLength={5}
                returnKeyType="done"
              />
              <View style={styles.timeEditActions}>
                <TouchableOpacity
                  style={styles.timeEditCancel}
                  onPress={() => setEditingTime(null)}
                >
                  <Text style={styles.timeEditCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeEditSave}
                  onPress={saveTime}
                >
                  <Text style={styles.timeEditSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Your Data</Text>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>📓 Journal Entries</Text>
            <Text style={styles.dataValue}>{journalDates.length} days</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>✅ To-Do Items</Text>
            <Text style={styles.dataValue}>{todoCount} items</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>📋 Weekly Check-ins</Text>
            <Text style={styles.dataValue}>{checkinCount} check-ins</Text>
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={confirmResetSettings}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>
              🔄 Reset Settings to Default
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resetButton, styles.dangerButton]}
            onPress={confirmResetAllData}
            activeOpacity={0.7}
          >
            <Text style={[styles.resetButtonText, styles.dangerButtonText]}>
              🗑️ Reset All Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About</Text>

          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>App Name</Text>
            <Text style={styles.aboutValue}>Mood Tracker</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Platform</Text>
            <Text style={styles.aboutValue}>
              {Platform.OS === 'ios'
                ? 'iOS'
                : Platform.OS === 'android'
                  ? 'Android'
                  : Platform.OS === 'web'
                    ? 'Web'
                    : 'Windows (Electron)'}
            </Text>
          </View>

          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>⚕️ Medical Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              This app is not a substitute for professional medical advice,
              diagnosis, or treatment. The GAD-7 and PHQ-9 questionnaires are
              screening tools only and do not constitute a clinical diagnosis.
              Always seek the advice of a qualified healthcare provider with any
              questions regarding a medical condition.
            </Text>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerTitle: {
    ...typography.heading1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
  },

  // Sections
  section: {
    backgroundColor: colors.card.background,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },

  // Theme
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.card.border,
    backgroundColor: colors.background.light,
  },
  themeOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  themeEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  themeLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  themeLabelSelected: {
    color: colors.primary[700],
    fontWeight: '600',
  },

  // Settings rows
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingLabelContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    ...typography.caption,
    color: colors.text.tertiary,
  },

  // Sub-settings
  subSetting: {
    marginLeft: spacing.md,
    marginTop: spacing.xs,
    paddingLeft: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary[200],
  },

  // Time buttons
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
    backgroundColor: colors.background.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  timeLabel: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  timeValue: {
    ...typography.body1,
    color: colors.primary[600],
    fontWeight: '600',
  },

  // Time editing
  timeEditContainer: {
    backgroundColor: colors.background.light,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  timeEditTitle: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 18,
    fontFamily: 'System',
    color: colors.text.primary,
    backgroundColor: colors.background.light,
    marginBottom: spacing.sm,
  },
  timeEditActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  timeEditCancel: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  timeEditCancelText: {
    ...typography.button,
    color: colors.text.secondary,
  },
  timeEditSave: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primary[500],
  },
  timeEditSaveText: {
    ...typography.button,
    color: colors.background.light,
  },

  // Data rows
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.card.border,
  },
  dataLabel: {
    ...typography.body1,
    color: colors.text.primary,
  },
  dataValue: {
    ...typography.body2,
    color: colors.text.secondary,
    fontWeight: '600',
  },

  // Reset buttons
  resetButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  resetButtonText: {
    ...typography.button,
    color: colors.text.secondary,
  },
  dangerButton: {
    borderColor: colors.status.error,
    backgroundColor: '#FFF5F5',
  },
  dangerButtonText: {
    color: colors.status.error,
  },

  // About
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.card.border,
  },
  aboutLabel: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  aboutValue: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '500',
  },
  disclaimerCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFD54F',
  },
  disclaimerTitle: {
    ...typography.body1,
    color: '#E65100',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  disclaimerText: {
    ...typography.caption,
    color: '#BF360C',
    lineHeight: 18,
  },
});
