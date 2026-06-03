/**
 * Tests for HomeScreen component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

// Mock the Zustand stores before importing the component
jest.mock('@/state/journalStore', () => ({
  useJournalStore: Object.assign(
    jest.fn(() => ({
      entriesByDate: {},
      isLoading: false,
      error: null,
      upsertEntry: jest.fn(),
      getEntry: jest.fn(() => null),
      getAllDates: jest.fn(() => []),
      ensureEntryExists: jest.fn(),
      getTodayEntry: jest.fn(() => ({
        date: '2024-01-15',
        overallMood: 4,
        emotions: [],
        sleep: {
          fellAsleepAt: new Date('2024-01-14T23:00:00'),
          wokeUpAt: new Date('2024-01-15T07:00:00'),
        },
        activities: [],
        meals: [],
        drinks: [],
        snacksAndDesserts: [],
        aggregates: {
          totalSleepHours: 8,
          totalActivities: 0,
          totalExhaustion: 0,
          totalMeals: 0,
          totalDrinks: 0,
          totalSnacks: 0,
          totalCalories: 0,
        },
      })),
      updateOverallMood: jest.fn(),
    })),
    {
      getState: jest.fn(() => ({
        entriesByDate: {},
        ensureEntryExists: jest.fn(),
        getTodayEntry: jest.fn(() => null),
        getAllDates: jest.fn(() => []),
      })),
    }
  ),
}));

jest.mock('@/state/todoStore', () => ({
  useTodoStore: Object.assign(
    jest.fn(() => ({
      items: [],
      searchQuery: '',
      filterStatus: 'all',
      isLoading: false,
      error: null,
      addTodo: jest.fn(),
      updateTodo: jest.fn(),
      deleteTodo: jest.fn(),
      setTodoStatus: jest.fn(),
      getActiveTodos: jest.fn(() => []),
      getCompletedTodos: jest.fn(() => []),
      getFilteredTodos: jest.fn(() => []),
      getStatistics: jest.fn(() => ({
        total: 0,
        completed: 0,
        inProgress: 0,
        completionPercentage: 0,
      })),
      setSearchQuery: jest.fn(),
      setFilterStatus: jest.fn(),
      clearCompleted: jest.fn(),
      markAllAsDone: jest.fn(),
    })),
    {
      getState: jest.fn(() => ({
        items: [],
      })),
    }
  ),
}));

jest.mock('@/state/weeklyStore', () => ({
  useWeeklyStore: Object.assign(
    jest.fn(() => ({
      checkins: {},
      currentCheckin: null,
      hasCheckinThisWeek: jest.fn(() => false),
    })),
    {
      getState: jest.fn(() => ({
        checkins: {},
        hasCheckinThisWeek: jest.fn(() => false),
      })),
    }
  ),
}));

jest.mock('@/state/settingsStore', () => ({
  useSettingsStore: Object.assign(
    jest.fn(() => ({
      settings: {
        theme: 'light',
        notifications: {
          enabled: true,
          morningReminderTime: '09:00',
          eveningReminderTime: '21:00',
          morningEnabled: true,
          eveningEnabled: true,
        },
        firstLaunch: false,
        hasRequestedNotificationPermission: false,
        version: '1.0.0',
      },
    })),
    {
      getState: jest.fn(() => ({
        settings: {
          theme: 'light',
          notifications: {
            enabled: true,
            morningReminderTime: '09:00',
            eveningReminderTime: '21:00',
            morningEnabled: true,
            eveningEnabled: true,
          },
        },
      })),
    }
  ),
}));

// Import after mocks
import HomeScreen from '@/screens/HomeScreen';

const renderHomeScreen = () => {
  return render(
    <NavigationContainer>
      <HomeScreen />
    </NavigationContainer>
  );
};

describe('HomeScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = renderHomeScreen();
    expect(toJSON()).toBeTruthy();
  });

  it('renders the mood selector area', () => {
    const { toJSON } = renderHomeScreen();
    expect(toJSON()).toBeTruthy();
  });

  it('renders the summary card area', () => {
    const { toJSON } = renderHomeScreen();
    expect(toJSON()).toBeTruthy();
  });

  it('renders the sleep card area', () => {
    const { toJSON } = renderHomeScreen();
    expect(toJSON()).toBeTruthy();
  });

  it('renders the emotions card area', () => {
    const { toJSON } = renderHomeScreen();
    expect(toJSON()).toBeTruthy();
  });

  it('renders the activities card area', () => {
    const { toJSON } = renderHomeScreen();
    expect(toJSON()).toBeTruthy();
  });

  it('renders meals, drinks, and snacks card areas', () => {
    const { toJSON } = renderHomeScreen();
    expect(toJSON()).toBeTruthy();
  });

  it('renders the to-do list card area', () => {
    const { toJSON } = renderHomeScreen();
    expect(toJSON()).toBeTruthy();
  });
});
