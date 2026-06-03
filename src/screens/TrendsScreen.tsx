/**
 * TrendsScreen
 * Charts showing trends over time for mood, sleep, calories, and activities
 */

import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useJournalStore } from '@/state/journalStore';
import { useWeeklyStore } from '@/state/weeklyStore';
import { OverallMood, getMoodInfo } from '@/models/Journal';
import { calculateSleepHours } from '@/utils/journalCalculations';

const { width: screenWidth } = Dimensions.get('window');
const CHART_WIDTH = screenWidth - spacing.screenPadding * 2;

const TrendsScreen: React.FC = () => {
  const getAllEntries = useJournalStore((state) => state.getAllEntries);
  const entries = getAllEntries();
  const gad7Trend = useWeeklyStore((state) => state.getGad7Trend)();
  const phq9Trend = useWeeklyStore((state) => state.getPhq9Trend)();

  // Process data for charts
  const chartData = useMemo(() => {
    if (entries.length === 0) return null;

    const sorted = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const sleepData = sorted.map((entry) => ({
      date: entry.date,
      value: calculateSleepHours(entry.sleep),
    }));

    const moodData = sorted.map((entry) => ({
      date: entry.date,
      value: entry.overallMood,
      label: getMoodInfo(entry.overallMood).label,
    }));

    const calorieData = sorted.map((entry) => ({
      date: entry.date,
      value: entry.aggregates.totalCalories,
    }));

    const activityData = sorted.map((entry) => ({
      date: entry.date,
      value: entry.aggregates.totalActivities,
    }));

    const exhaustionData = sorted.map((entry) => ({
      date: entry.date,
      value: entry.aggregates.totalExhaustion,
    }));

    return {
      sleepData,
      moodData,
      calorieData,
      activityData,
      exhaustionData,
      gad7Trend,
      phq9Trend,
    };
  }, [entries, gad7Trend, phq9Trend]);

  // Simple chart rendering using text-based visualization
  // (Victory Native charts would be used in production)
  const renderSimpleChart = (
    title: string,
    emoji: string,
    data: Array<{ date: string; value: number; label?: string }>,
    unit: string,
    color: string
  ) => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>
          {emoji} {title}
        </Text>

        <View style={styles.chartArea}>
          {data.slice(-14).map((point, index) => (
            <View key={point.date} style={styles.chartBarContainer}>
              <View style={styles.chartBarWrapper}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: `${((point.value - minValue) / range) * 80 + 20}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.chartDateLabel}>
                {new Date(point.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.chartValueLabel}>
                {Math.round(point.value * 10) / 10}
                {unit}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.chartSummary}>
          <Text style={styles.summaryText}>
            Latest: {Math.round(data[data.length - 1].value * 10) / 10}
            {unit}
          </Text>
          <Text style={styles.summaryText}>
            Avg: {Math.round((data.reduce((s, d) => s + d.value, 0) / data.length) * 10) / 10}
            {unit}
          </Text>
        </View>
      </View>
    );
  };

  if (!chartData || entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📊</Text>
        <Text style={styles.emptyTitle}>No Data Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start journaling to see your trends over time
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Sleep Chart */}
      {renderSimpleChart(
        'Sleep Hours',
        '😴',
        chartData.sleepData,
        'h',
        colors.chart.line1
      )}

      {/* Mood Chart */}
      {renderSimpleChart(
        'Overall Mood',
        '🎭',
        chartData.moodData,
        '',
        colors.chart.line2
      )}

      {/* Calories Chart */}
      {renderSimpleChart(
        'Daily Calories',
        '🔥',
        chartData.calorieData,
        ' cal',
        colors.chart.line3
      )}

      {/* Activities Chart */}
      {renderSimpleChart(
        'Activities Per Day',
        '🏃',
        chartData.activityData,
        '',
        colors.primary[500]
      )}

      {/* GAD-7 Weekly Chart */}
      {chartData.gad7Trend.length > 0 &&
        renderSimpleChart(
          'GAD-7 Anxiety Score',
          '😰',
          chartData.gad7Trend.map((t) => ({ date: t.date, value: t.score })),
          '/21',
          colors.status.warning
        )}

      {/* PHQ-9 Weekly Chart */}
      {chartData.phq9Trend.length > 0 &&
        renderSimpleChart(
          'PHQ-9 Depression Score',
          '😔',
          chartData.phq9Trend.map((t) => ({ date: t.date, value: t.score })),
          '/27',
          colors.status.error
        )}

      {/* Data Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>📈 Summary</Text>
        <Text style={styles.summaryCardText}>
          Based on {entries.length} journal {entries.length === 1 ? 'entry' : 'entries'}
        </Text>
        <Text style={styles.summaryCardText}>
          From {entries[entries.length - 1]?.date} to {entries[0]?.date}
        </Text>
        {gad7Trend.length > 0 && (
          <Text style={styles.summaryCardText}>
            {gad7Trend.length} weekly check-in{gad7Trend.length === 1 ? '' : 's'} completed
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.screenMarginTop,
    paddingBottom: spacing.xxxl * 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    padding: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: colors.card.background,
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.cardPadding,
    marginVertical: spacing.cardMargin / 2,
    shadowColor: colors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: spacing.cardElevation,
  },
  chartTitle: {
    ...typography.heading4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    gap: 4,
    overflow: 'hidden',
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  chartBarWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
  },
  chartBar: {
    width: '70%',
    borderRadius: 4,
    minHeight: 4,
  },
  chartDateLabel: {
    ...typography.caption,
    fontSize: 8,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  chartValueLabel: {
    fontSize: 8,
    color: colors.text.secondary,
  },
  chartSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  summaryText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: typography.fontWeightMedium,
  },
  summaryCard: {
    backgroundColor: colors.card.background,
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.cardPadding,
    marginVertical: spacing.cardMargin / 2,
    alignItems: 'center',
  },
  summaryCardTitle: {
    ...typography.heading4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  summaryCardText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
});

export default TrendsScreen;