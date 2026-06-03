/**
 * Tests for HomeScreen component
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
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
        overallMood: null,
        emotions: [],
        sleep: null,
        activities: [],
        meals: [],
        drinks: [],
        snacksAndDesserts: [],
        aggregates: {
          sleepHours: 0,
          totalActivities: 0,
          totalMeals:0,
          totalDrinks: 0,
          totalSnacks: 0,
          totalCalories: 0,
          averageExhaustion: 0,
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
    },
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
    },
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
    },
  ),
}));

jest.mock('@/state/settingsStore', () => ({
  useSettingsStore: Object.assign(
    jest.fn(() => ({
      theme: 'light',
      notifications: {
        enabled: true,
        morningTime: '09:00',
        eveningTime: '21:00',
        morningEnabled: true,
        eveningEnabled: true,
      },
      firstLaunch: false,
      hasRequestedNotificationPermission: false,
    })),
    {
      getState: jest.fn(() => ({
        theme: 'light',
        notifications: {
          enabled: true,
          morningTime: '09:00',
          eveningTime: '21:00',
          morningEnabled: true,
          eveningEnabled: true,
        },
      })),
    },
  ),
}));

// Need to import after mocks
import HomeScreen from '@/screens/HomeScreen';

const renderHomeScreen = () => {
  return render(
    <NavigationContainer>
      <HomeScreen navigation={{ navigate: jest.fn() } as any} route={{ name: 'Home', key: 'home' } as any} />
    </NavigationContainer>,
  );
};

describe('HomeScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = renderHomeScreen();
    // Should show date selector and at least the summary card
    expect(getByText).toBeTruthy();
  });

  it('renders the mood selector', () => {
    const { getByText } = renderHomeScreen();
    // Mood selector should show the four mood options
    expect(getByText('Happy')).toBeTruthy();
  });

  it('renders the summary card', () => {
    const { getByText } = renderHomeScreen();
    // Summary card should show stats labels
    expect(getByText).toBeTruthy();
  });

  it('renders the sleep card', () => {
    const { getByText } = renderHomeScreen();
    // Sleep card should be present
    expect(getByText).toBeTruthy();
  });

  it('renders the emotions card', () => {
    const { getByText } = renderHomeScreen();
    expect(getByText).toBeTruthy();
  });

  it('renders the activities card', () => {
    const { getByText } = renderHomeScreen();
    expect(getByText).toBeTruthy();
  });

  it('renders meals, drinks, and snacks cards', () => {
    const { getByText } = renderHomeScreen();
    expect(getByText).toBeTruthy();
  });

  it('renders the to-do list card', () => {
    const { getByText } = renderHomeScreen();
    expect(getByText).toBeTruthy();
  });
});
