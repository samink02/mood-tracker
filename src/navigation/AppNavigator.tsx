/**
 * Navigation Configuration
 * React Navigation setup with tabs and stack navigators
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '@/screens/HomeScreen';
import TrendsScreen from '@/screens/TrendsScreen';
import WeeklyCheckinScreen from '@/screens/WeeklyCheckinScreen';
import SettingsScreen from '@/screens/SettingsScreen';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type RootStackParamList = {
  MainTabs: undefined;
  WeeklyCheckin: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Trends: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Tab navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.tabBar.active,
        tabBarInactiveTintColor: colors.tabBar.inactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar.background,
          height: spacing.tabBarHeight,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
          borderTopColor: colors.divider,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          ...typography.caption,
          marginTop: spacing.xs,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.card.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          ...typography.heading4,
          color: colors.text.primary,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="book" color={color} size={size} />
          ),
          headerTitle: 'Daily Journal',
        }}
      />
      <Tab.Screen
        name="Trends"
        component={TrendsScreen}
        options={{
          tabBarLabel: 'Trends',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="chart" color={color} size={size} />
          ),
          headerTitle: 'Trends & Analytics',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="settings" color={color} size={size} />
          ),
          headerTitle: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

// Simple tab icon component using text emojis for cross-platform compatibility
const TabIcon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  const emojiMap: Record<string, string> = {
    book: '📖',
    chart: '📊',
    settings: '⚙️',
  };

  return (
    <span style={{ fontSize: size - 4, color }}>
      {emojiMap[name] || '📋'}
    </span>
  );
};

// Root stack navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background.light },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="WeeklyCheckin"
          component={WeeklyCheckinScreen}
          options={{
            headerShown: true,
            headerTitle: 'Weekly Check-In',
            headerStyle: {
              backgroundColor: colors.card.background,
            },
            headerTintColor: colors.text.primary,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;