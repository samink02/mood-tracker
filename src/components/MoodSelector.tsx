/**
 * MoodSelector Component
 * Allows users to select their overall mood for the day
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { OverallMood, getMoodInfo } from '@/models/Journal';
import { useJournalStore } from '@/state/journalStore';

interface MoodSelectorProps {
  selectedDate: string;
  currentMood: OverallMood;
}

const MOOD_OPTIONS = [
  OverallMood.Happy,
  OverallMood.Neutral,
  OverallMood.Sad,
  OverallMood.Angry,
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedDate, currentMood }) => {
  const updateOverallMood = useJournalStore((state) => state.updateOverallMood);

  const handleMoodSelect = (mood: OverallMood) => {
    updateOverallMood(selectedDate, mood);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>How are you feeling?</Text>
      <View style={styles.moodOptions}>
        {MOOD_OPTIONS.map((mood) => {
          const moodInfo = getMoodInfo(mood);
          const isSelected = currentMood === mood;

          return (
            <Pressable
              key={mood}
              style={[
                styles.moodButton,
                isSelected && {
                  backgroundColor: moodInfo.color + '20',
                  borderColor: moodInfo.color,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleMoodSelect(mood)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={moodInfo.label}
            >
              <Text style={styles.moodEmoji}>{moodInfo.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  isSelected && { color: moodInfo.color, fontWeight: typography.fontWeightBold },
                ]}
              >
                {moodInfo.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundCard,
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.cardPadding,
    marginVertical: spacing.cardMargin / 2,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: spacing.cardElevation,
  },
  label: {
    ...typography.heading4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.buttonBorderRadius,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.backgroundInput,
    minWidth: 70,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
});

export default MoodSelector;