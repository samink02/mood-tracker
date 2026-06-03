/**
 * DateSelector Component
 * Navigation component for selecting dates to view past journal entries
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useJournalStore } from '@/state/journalStore';

interface DateSelectorProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const getAllDates = useJournalStore((state) => state.getAllDates);
  const dates = getAllDates();

  const today = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === today;

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const todayDate = new Date();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);

    if (dateStr === today) return 'Today';
    if (dateStr === yesterdayDate.toISOString().split('T')[0]) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const navigateDay = (direction: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + direction);
    const newDate = currentDate.toISOString().split('T')[0];
    onDateSelect(newDate);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.navButton}
        onPress={() => navigateDay(-1)}
        accessibilityRole="button"
        accessibilityLabel="Previous day"
      >
        <Text style={styles.navButtonText}>◀</Text>
      </Pressable>

      <Pressable
        style={styles.dateButton}
        onPress={() => setModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Select date"
      >
        <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>
        {!isToday && (
          <Pressable
            style={styles.todayButton}
            onPress={() => onDateSelect(today)}
            accessibilityRole="button"
            accessibilityLabel="Go to today"
          >
            <Text style={styles.todayButtonText}>Today</Text>
          </Pressable>
        )}
      </Pressable>

      <Pressable
        style={styles.navButton}
        onPress={() => navigateDay(1)}
        accessibilityRole="button"
        accessibilityLabel="Next day"
      >
        <Text style={styles.navButtonText}>▶</Text>
      </Pressable>

      {/* Date Picker Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date</Text>

            <Pressable
              style={styles.todayOption}
              onPress={() => {
                onDateSelect(today);
                setModalVisible(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Go to today"
            >
              <Text style={styles.todayOptionText}>📌 Today</Text>
            </Pressable>

            <ScrollView style={styles.dateList} showsVerticalScrollIndicator={false}>
              {dates.length === 0 ? (
                <Text style={styles.emptyText}>No journal entries yet</Text>
              ) : (
                dates.map((date) => (
                  <Pressable
                    key={date}
                    style={[
                      styles.dateOption,
                      date === selectedDate && styles.dateOptionSelected,
                    ]}
                    onPress={() => {
                      onDateSelect(date);
                      setModalVisible(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={formatDisplayDate(date)}
                  >
                    <Text
                      style={[
                        styles.dateOptionText,
                        date === selectedDate && styles.dateOptionTextSelected,
                      ]}
                    >
                      {formatDisplayDate(date)}
                    </Text>
                    <Text style={styles.dateOptionSubtext}>
                      {new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Close date selector"
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  navButton: {
    padding: spacing.sm,
    minWidth: 40,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    color: colors.primary,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateText: {
    ...typography.heading4,
    color: colors.textPrimary,
  },
  todayButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.buttonBorderRadius,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  todayButtonText: {
    ...typography.caption,
    color: colors.buttonPrimaryText,
    fontWeight: typography.fontWeightSemibold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.backgroundModal,
    borderTopLeftRadius: spacing.modalBorderRadius,
    borderTopRightRadius: spacing.modalBorderRadius,
    padding: spacing.modalPadding,
    maxHeight: '70%',
  },
  modalTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  todayOption: {
    backgroundColor: colors.primary + '10',
    borderRadius: spacing.buttonBorderRadius,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  todayOptionText: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: typography.fontWeightSemibold,
  },
  dateList: {
    maxHeight: 300,
  },
  emptyText: {
    ...typography.body2,
    color: colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  dateOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  dateOptionSelected: {
    backgroundColor: colors.primary + '10',
  },
  dateOptionText: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightMedium,
  },
  dateOptionTextSelected: {
    color: colors.primary,
  },
  dateOptionSubtext: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs / 2,
  },
  closeButton: {
    backgroundColor: colors.buttonSecondary,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    borderRadius: spacing.buttonBorderRadius,
    paddingVertical: spacing.buttonPadding,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    ...typography.button,
    color: colors.buttonSecondaryText,
  },
});

export default DateSelector;