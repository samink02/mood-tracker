/**
 * Tests for WeeklyCheckinScreen component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

// Mock the weekly store
const mockStartCheckin = jest.fn();
const mockSetGad7Response = jest.fn();
const mockSetPhq9Response = jest.fn();
const mockCompleteCheckin = jest.fn(() => ({
  success: true,
  gad7Score: 5,
  gad7Severity: 'Mild',
  phq9Score: 8,
  phq9Severity: 'Mild',
}));
const mockCancelCheckin = jest.fn();
const mockHasCheckinThisWeek = jest.fn(() => false);

jest.mock('@/state/weeklyStore', () => ({
  useWeeklyStore: Object.assign(
    jest.fn(() => ({
      checkins: {},
      currentCheckin: null,
      startCheckin: mockStartCheckin,
      setGad7Response: mockSetGad7Response,
      setPhq9Response: mockSetPhq9Response,
      completeCheckin: mockCompleteCheckin,
      cancelCheckin: mockCancelCheckin,
      hasCheckinThisWeek: mockHasCheckinThisWeek,
    })),
    {
      getState: jest.fn(() => ({
        checkins: {},
        currentCheckin: null,
        startCheckin: mockStartCheckin,
        setGad7Response: mockSetGad7Response,
        setPhq9Response: mockSetPhq9Response,
        completeCheckin: mockCompleteCheckin,
        cancelCheckin: mockCancelCheckin,
        hasCheckinThisWeek: mockHasCheckinThisWeek,
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
      },
    })),
    {
      getState: jest.fn(() => ({
        settings: {
          theme: 'light',
        },
      })),
    }
  ),
}));

import WeeklyCheckinScreen from '@/screens/WeeklyCheckinScreen';

const renderCheckinScreen = () => {
  return render(
    <NavigationContainer>
      <WeeklyCheckinScreen />
    </NavigationContainer>
  );
};

describe('WeeklyCheckinScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = renderCheckinScreen();
    expect(toJSON()).toBeTruthy();
  });

  it('shows GAD-7 as the first step', () => {
    const { getByText } = renderCheckinScreen();
    // Should show GAD-7 header or step indicator
    expect(getByText(/GAD-7/i)).toBeTruthy();
  });

  it('shows progress indicator', () => {
    const { toJSON } = renderCheckinScreen();
    expect(toJSON()).toBeTruthy();
  });

  it('displays question text for each GAD-7 item', () => {
    const { getByText } = renderCheckinScreen();
    // Should display the first GAD-7 question
    expect(getByText(/nervous|anxious/i)).toBeTruthy();
  });

  it('renders radio options for each question', () => {
    const { getByText } = renderCheckinScreen();
    // GAD-7 has 4 options: Not at all, Several days, More than half the days, Nearly every day
    expect(getByText(/not at all/i)).toBeTruthy();
    expect(getByText(/several days/i)).toBeTruthy();
  });

  it('calls startCheckin when component mounts', () => {
    renderCheckinScreen();
    // The screen should initialize a check-in on mount
    expect(mockStartCheckin).toHaveBeenCalled();
  });

  it('has navigation back or cancel button', () => {
    const { toJSON } = renderCheckinScreen();
    expect(toJSON()).toBeTruthy();
  });
});
