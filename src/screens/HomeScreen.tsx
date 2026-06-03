/**
 * HomeScreen
 * Main screen showing today's journal entry with all cards
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useJournalStore } from '@/state/journalStore';
import { useWeeklyStore } from '@/state/weeklyStore';

import SummaryCard from '@/components/SummaryCard';
import MoodSelector from '@/components/MoodSelector';
import SleepCard from '@/components/SleepCard';
import EmotionsCard from '@/components/EmotionsCard';
import ActivitiesCard from '@/components/ActivitiesCard';
import MealsCard from '@/components/MealsCard';
import TodoListCard from '@/components/TodoListCard';
import DateSelector from '@/components/DateSelector';

const { width: screenWidth } = Dimensions.get('window');
const isWideScreen = screenWidth > spacing.breakpointTablet;

const HomeScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const ensureEntryExists = useJournalStore((state) => state.ensureEntryExists);
  const getEntry = useJournalStore((state) => state.getEntry);
  const hasCheckinThisWeek = useWeeklyStore((state) => state.hasCheckinThisWeek);

  // Ensure entry exists for selected date
  useEffect(() => {
    ensureEntryExists(selectedDate);
  }, [selectedDate, ensureEntryExists]);

  const entry = getEntry(selectedDate);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const isSunday = new Date(selectedDate).getDay() === 0;
  const showWeeklyButton = isSunday;

  if (!entry) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading journal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DateSelector selectedDate={selectedDate} onDateSelect={handleDateSelect} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <SummaryCard entry={entry} />

        {/* Mood Selector */}
        <MoodSelector selectedDate={selectedDate} currentMood={entry.overallMood} />

        {/* Responsive Grid Layout */}
        <View style={isWideScreen ? styles.gridContainer : styles.stackContainer}>
          <View style={isWideScreen ? styles.gridColumn : undefined}>
            {/* Sleep Card */}
            <SleepCard entry={entry} />

            {/* Emotions Card */}
            <EmotionsCard entry={entry} />
          </View>

          <View style={isWideScreen ? styles.gridColumn : undefined}>
            {/* Activities Card */}
            <ActivitiesCard entry={entry} />

            {/* Meals Card */}
            <MealsCard entry={entry} category="meals" />
          </View>

          <View style={isWideScreen ? styles.gridColumn : undefined}>
            {/* Drinks Card */}
            <MealsCard entry={entry} category="drinks" emoji="🥤" title="Drinks" />

            {/* Snacks Card */}
            <MealsCard
              entry={entry}
              category="snacksAndDesserts"
              emoji="🍰"
              title="Snacks & Desserts"
            />
          </View>
        </View>

        {/* To-Do List Card (full width) */}
        <TodoListCard />

        {/* Weekly Check-In Button (Sundays only) */}
        {showWeeklyButton && (
          <Pressable
            style={styles.weeklyButton}
            onPress={() => {
              // Navigate to weekly check-in screen
              // This will be connected to navigation in the full app
            }}
            accessibilityRole="button"
            accessibilityLabel="Weekly check-in"
          >
            <Text style={styles.weeklyButtonEmoji}>📋</Text>
            <Text style={styles.weeklyButtonText}>Weekly Check-In</Text>
            <Text style={styles.weeklyButtonSubtext}>
              {hasCheckinThisWeek() ? 'Already completed this week' : 'GAD-7 & PHQ-9 questionnaires'}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
  loadingText: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.screenMarginTop,
    paddingBottom: spacing.xxxl * 2,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: spacing.cardGap,
  },
  gridColumn: {
    flex: 1,
  },
  stackContainer: {
    // Default stack layout for mobile
  },
  weeklyButton: {
    backgroundColor: colors.primary[500],
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.xl,
    alignItems: 'center',
    marginVertical: spacing.cardMargin,
    shadowColor: colors.card.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  weeklyButtonEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  weeklyButtonText: {
    ...typography.heading3,
    color: colors.button.primaryText,
    marginBottom: spacing.xs,
  },
  weeklyButtonSubtext: {
    ...typography.body2,
    color: colors.button.primaryText + 'CC',
  },
});

export default HomeScreen;