/**
 * SleepCard Component
 * Displays and allows editing of sleep entry data
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Modal,
  Platform,
  TextInput,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { SleepEntry, DailyJournalEntry } from '@/models/Journal';
import { calculateSleepHours, validateSleepEntry } from '@/utils/journalCalculations';
import { useJournalStore } from '@/state/journalStore';

interface SleepCardProps {
  entry: DailyJournalEntry;
}

const SleepCard: React.FC<SleepCardProps> = ({ entry }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fellAsleepHour, setFellAsleepHour] = useState('');
  const [fellAsleepMinute, setFellAsleepMinute] = useState('');
  const [wokeUpHour, setWokeUpHour] = useState('');
  const [wokeUpMinute, setWokeUpMinute] = useState('');
  const [error, setError] = useState<string | null>(null);

  const updateSleep = useJournalStore((state) => state.updateSleep);
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const sleepHours = calculateSleepHours(entry.sleep);

  const openModal = () => {
    const fellAsleep = new Date(entry.sleep.fellAsleepAt);
    const wokeUp = new Date(entry.sleep.wokeUpAt);

    setFellAsleepHour(fellAsleep.getHours().toString().padStart(2, '0'));
    setFellAsleepMinute(fellAsleep.getMinutes().toString().padStart(2, '0'));
    setWokeUpHour(wokeUp.getHours().toString().padStart(2, '0'));
    setWokeUpMinute(wokeUp.getMinutes().toString().padStart(2, '0'));
    setError(null);
    setModalVisible(true);
  };

  const saveSleep = () => {
    const today = new Date();
    const fellAsleepDate = new Date(today);
    fellAsleepDate.setHours(parseInt(fellAsleepHour, 10), parseInt(fellAsleepMinute, 10), 0);

    const wokeUpDate = new Date(today);
    wokeUpDate.setHours(parseInt(wokeUpHour, 10), parseInt(wokeUpMinute, 10), 0);

    const newSleep: SleepEntry = {
      fellAsleepAt: fellAsleepDate,
      wokeUpAt: wokeUpDate,
    };

    const validation = validateSleepEntry(newSleep);
    if (!validation.valid) {
      setError(validation.error || 'Invalid sleep entry');
      return;
    }

    updateSleep(entry.date, newSleep);
    setModalVisible(false);
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: spacing.cardScalePress,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getSleepQualityEmoji = (hours: number) => {
    if (hours >= 7 && hours <= 9) return '😴'; // Great
    if (hours >= 6 && hours < 7) return '😐'; // OK
    if (hours < 6) return '😫'; // Poor
    return '🤤'; // Excessive
  };

  return (
    <Animated.View style={[styles.animatedContainer, { transform: [{ scale: scaleValue }] }]}>
      <Pressable
        onPress={openModal}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel="Edit sleep entry"
      >
        <View style={styles.header}>
          <Text style={styles.cardTitle}>{getSleepQualityEmoji(sleepHours)} Sleep</Text>
          <Text style={styles.editHint}>Tap to edit</Text>
        </View>

        <View style={styles.sleepContent}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Fell Asleep</Text>
            <Text style={styles.timeValue}>
              {new Date(entry.sleep.fellAsleepAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          <Text style={styles.arrow}>→</Text>

          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Woke Up</Text>
            <Text style={styles.timeValue}>
              {new Date(entry.sleep.wokeUpAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Sleep</Text>
          <Text style={styles.totalValue}>{sleepHours} hours</Text>
        </View>
      </Pressable>

      {/* Sleep Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Sleep Times</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.timeInputRow}>
              <View style={styles.timeInputGroup}>
                <Text style={styles.inputLabel}>Fell Asleep</Text>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={fellAsleepHour}
                    onChangeText={setFellAsleepHour}
                    placeholder="HH"
                    keyboardType="number-pad"
                    maxLength={2}
                    accessibilityLabel="Fell asleep hour"
                  />
                  <Text style={styles.timeSeparator}>:</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={fellAsleepMinute}
                    onChangeText={setFellAsleepMinute}
                    placeholder="MM"
                    keyboardType="number-pad"
                    maxLength={2}
                    accessibilityLabel="Fell asleep minute"
                  />
                </View>
              </View>

              <View style={styles.timeInputGroup}>
                <Text style={styles.inputLabel}>Woke Up</Text>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={wokeUpHour}
                    onChangeText={setWokeUpHour}
                    placeholder="HH"
                    keyboardType="number-pad"
                    maxLength={2}
                    accessibilityLabel="Woke up hour"
                  />
                  <Text style={styles.timeSeparator}>:</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={wokeUpMinute}
                    onChangeText={setWokeUpMinute}
                    placeholder="MM"
                    keyboardType="number-pad"
                    maxLength={2}
                    accessibilityLabel="Woke up minute"
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveSleep}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    elevation: spacing.cardElevation,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.heading4,
    color: colors.textPrimary,
  },
  editHint: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  sleepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  timeValue: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  arrow: {
    ...typography.heading3,
    color: colors.textTertiary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  totalLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  totalValue: {
    ...typography.heading4,
    color: colors.primary,
    fontWeight: typography.fontWeightBold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.backgroundModal,
    borderRadius: spacing.modalBorderRadius,
    padding: spacing.modalPadding,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  errorText: {
    ...typography.body2,
    color: colors.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
  },
  timeInputGroup: {
    alignItems: 'center',
  },
  inputLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    ...typography.heading3,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: spacing.inputBorderRadius,
    padding: spacing.sm,
    width: 60,
    textAlign: 'center',
  },
  timeSeparator: {
    ...typography.heading3,
    color: colors.textTertiary,
    marginHorizontal: spacing.xs,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    borderRadius: spacing.buttonBorderRadius,
    paddingVertical: spacing.buttonPadding,
    paddingHorizontal: spacing.xl,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.buttonSecondary,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.buttonSecondaryText,
  },
  saveButton: {
    backgroundColor: colors.buttonPrimary,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.buttonPrimaryText,
  },
});

export default SleepCard;