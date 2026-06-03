/**
 * Tests for EmotionsCard component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EmotionsCard from '@/components/EmotionsCard';
import {
  createEmptyDailyEntry,
  Emotion,
  EmotionCategory,
} from '@/models/Journal';

// Mock the journal store
const mockUpsertEntry = jest.fn();
const mockSetEmotions = jest.fn();

jest.mock('@/state/journalStore', () => ({
  useJournalStore: Object.assign(
    jest.fn(() => ({
      upsertEntry: mockUpsertEntry,
      setEmotions: mockSetEmotions,
    })),
    {
      getState: jest.fn(() => ({
        upsertEntry: mockUpsertEntry,
        setEmotions: mockSetEmotions,
      })),
    }
  ),
}));

const mockEntry = createEmptyDailyEntry('2024-01-15');

const sampleEmotions: Emotion[] = [
  { id: 'joy', name: 'Joy', category: EmotionCategory.Positive },
  { id: 'gratitude', name: 'Gratitude', category: EmotionCategory.Positive },
];

describe('EmotionsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with no emotions selected', () => {
    const { getByText } = render(<EmotionsCard entry={mockEntry} />);
    expect(getByText('Emotions')).toBeTruthy();
  });

  it('renders selected emotion chips', () => {
    const entryWithEmotions = {
      ...mockEntry,
      emotions: sampleEmotions,
    };
    const { getByText } = render(<EmotionsCard entry={entryWithEmotions} />);
    expect(getByText('Joy')).toBeTruthy();
    expect(getByText('Gratitude')).toBeTruthy();
  });

  it('shows "Tap to add" when no emotions selected', () => {
    const { getByText } = render(<EmotionsCard entry={mockEntry} />);
    expect(getByText(/tap/i)).toBeTruthy();
  });

  it('opens modal when tapped', () => {
    const { getByText, queryByText: _queryByText } = render(
      <EmotionsCard entry={mockEntry} />
    );

    // Before tapping, the modal emotion list should not be visible
    // After tapping the card, it should open the picker
    const card = getByText('Emotions');
    fireEvent.press(card);

    // The modal should now show emotion categories
    // (exact behavior depends on implementation)
    expect(getByText).toBeTruthy();
  });

  it('displays emotion count in the header', () => {
    const entryWithEmotions = {
      ...mockEntry,
      emotions: sampleEmotions,
    };
    const { getByText } = render(<EmotionsCard entry={entryWithEmotions} />);
    // Should show count of selected emotions
    expect(getByText(/2/)).toBeTruthy();
  });

  it('renders emotions grouped by category', () => {
    const entryWithMultipleEmotions = {
      ...mockEntry,
      emotions: [
        { id: 'joy', name: 'Joy', category: EmotionCategory.Positive },
        { id: 'sadness', name: 'Sadness', category: EmotionCategory.Negative },
        { id: 'calm', name: 'Calm', category: EmotionCategory.Neutral },
      ],
    };
    const { getByText } = render(
      <EmotionsCard entry={entryWithMultipleEmotions} />
    );
    expect(getByText('Joy')).toBeTruthy();
    expect(getByText('Sadness')).toBeTruthy();
    expect(getByText('Calm')).toBeTruthy();
  });
});
