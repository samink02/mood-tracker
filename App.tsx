/**
 * App.tsx - Root component for Mood Tracker
 *
 * Wires up React Navigation, Zustand stores, and notification system.
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import AppNavigator from '@/navigation/AppNavigator';
import { useSettingsStore } from '@/state/settingsStore';
import { initializeNotifications } from '@/services/notificationService';
import { colors } from '@/theme/colors';

export default function App() {
  const theme = useSettingsStore((s) => s.theme);
  const isFirstLaunch = useSettingsStore((s) => s.firstLaunch);

  // Initialize notifications on mount
  useEffect(() => {
    const setup = async () => {
      try {
        await initializeNotifications();
      } catch (error) {
        // Notifications may fail on web or in development
        console.warn('Notification initialization skipped:', error);
      }
    };
    setup();
  }, []);

  // Mark first launch as complete after mount
  useEffect(() => {
    if (isFirstLaunch) {
      useSettingsStore.getState().markFirstLaunchComplete();
    }
  }, [isFirstLaunch]);

  // Determine status bar style based on theme
  const statusBarStyle =
    theme === 'dark' ? 'light' : theme === 'light' ? 'dark' : 'auto';

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer
          theme={{
            dark: theme === 'dark',
            colors: {
              primary: colors.primary[500],
              background: colors.background.light,
              card: colors.card.background,
              text: colors.text.primary,
              border: colors.card.border,
              notification: colors.status.error,
            },
            fonts: {
              regular: {
                fontFamily: 'System',
                fontWeight: '400',
              },
              medium: {
                fontFamily: 'System',
                fontWeight: '500',
              },
              bold: {
                fontFamily: 'System',
                fontWeight: '700',
              },
              heavy: {
                fontFamily: 'System',
                fontWeight: '900',
              },
            },
          }}
        >
          <AppNavigator />
          <StatusBar style={statusBarStyle} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
