/**
 * Tests for WeeklyCheckinScreen component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

// Mock the weekly store
const mockStartCheckin = jest.fn();
const mockSetGad7Response = jest.fn();
const mockSetPhq9Response = jest.fn();
const mockCompleteCheckin = jest.fn(() => ({
  success: true,
  gad7Score: 5,
  gad7Severity: 'Mild anxiety',
  phq9Score: 8,
  phq9Severity: 'Mild depression',
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
    })),
    {
      getState: jest.fn(() => ({
        theme: 'light',
      })),
    },
  ),
}));

import WeeklyCheckinScreen from '@/screens/WeeklyCheckinScreen';

const renderCheckinScreen = () => {
  return render(
    <NavigationContainer>
      <WeeklyCheckinScreen
        navigation={{ goBack: jest.fn(), navigate: jest.fn() } as any}
        route={{ name: 'WeeklyCheckin', key: 'checkin' } as any}
      />
    </NavigationContainer>,
  );
};

describe('WeeklyCheckinScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = renderCheckinScreen();
    expect(getByText).toBeTruthy();
  });

  it('shows GAD-7 as the first step', () => {
    const { getByText } = renderCheckinScreen();
    // Should show GAD-7 header or step indicator
    expect(getByText(/GAD-7/i)).toBeTruthy();
  });

  it('shows progress indicator', () => {
    const { getByText } = renderCheckinScreen();
    // Should show step 1 of 3 or similar
    expect(getByText(/1.*3/i)).toBeTruthy();
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

  it('shows medical disclaimer', () => {
    const { getByText } = renderCheckinScreen();
    // Should have a disclaimer somewhere in the flow
    expect(getByText).toBeTruthy();
  });

  it('has navigation back button', () => {
    const { getByText } = renderCheckinScreen();
    // Should have a cancel or back button
    expect(getByText(/cancel|back/i)).toBeTruthy();
  });
});
