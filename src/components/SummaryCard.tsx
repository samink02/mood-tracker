/**
 * SummaryCard Component
 * Displays a summary of today's journal entry including mood, sleep, activities, and calories
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { DailyJournalEntry, getMoodInfo, OverallMood } from '@/models/Journal';
import { calculateSleepHours } from '@/utils/journalCalculations';

interface SummaryCardProps {
  entry: DailyJournalEntry;
  onPress?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ entry, onPress }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const elevationValue = React.useRef(new Animated.Value(spacing.cardElevation)).current;

  const moodInfo = getMoodInfo(entry.overallMood);
  const sleepHours = calculateSleepHours(entry.sleep);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: spacing.cardScalePress,
        useNativeDriver: true,
      }),
      Animated.timing(elevationValue, {
        toValue: spacing.cardElevationHover,
        duration: spacing.animationDuration,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(elevationValue, {
        toValue: spacing.cardElevation,
        duration: spacing.animationDuration,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          transform: [{ scale: scaleValue }],
          elevation: elevationValue,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`Journal summary for ${entry.date}`}
      >
        {/* Date and Mood Header */}
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{entry.date}</Text>
          </View>
          <View style={[styles.moodBadge, { backgroundColor: moodInfo.color + '20' }]}>
            <Text style={styles.moodEmoji}>{moodInfo.emoji}</Text>
            <Text style={[styles.moodLabel, { color: moodInfo.color }]}>{moodInfo.label}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>😴</Text>
            <Text style={styles.statValue}>{sleepHours}h</Text>
            <Text style={styles.statLabel}>Sleep</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🏃</Text>
            <Text style={styles.statValue}>{entry.aggregates.totalActivities}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🍽️</Text>
            <Text style={styles.statValue}>{entry.aggregates.totalMeals}</Text>
            <Text style={styles.statLabel}>Meals</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{entry.aggregates.totalCalories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🥤</Text>
            <Text style={styles.statValue}>{entry.aggregates.totalDrinks}</Text>
            <Text style={styles.statLabel}>Drinks</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🍰</Text>
            <Text style={styles.statValue}>{entry.aggregates.totalSnacks}</Text>
            <Text style={styles.statLabel}>Snacks</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    marginVertical: spacing.cardMargin / 2,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.cardPadding,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    ...typography.heading4,
    color: colors.textPrimary,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.badgePaddingHorizontal,
    paddingVertical: spacing.badgePaddingVertical,
    borderRadius: spacing.badgeBorderRadius,
  },
  moodEmoji: {
    fontSize: spacing.iconSizeMedium,
    marginRight: spacing.xs,
  },
  moodLabel: {
    ...typography.body2,
    fontWeight: typography.fontWeightSemibold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  statEmoji: {
    fontSize: spacing.iconSizeMedium,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.heading4,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightBold,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
});

export default SummaryCard;