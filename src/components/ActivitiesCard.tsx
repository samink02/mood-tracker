/**
 * ActivitiesCard Component
 * Displays and manages activity entries with add/edit/delete functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Activity, DailyJournalEntry } from '@/models/Journal';
import { useJournalStore } from '@/state/journalStore';
import { validateActivity } from '@/utils/journalCalculations';

interface ActivitiesCardProps {
  entry: DailyJournalEntry;
}

const ActivitiesCard: React.FC<ActivitiesCardProps> = ({ entry }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [name, setName] = useState('');
  const [hoursOut, setHoursOut] = useState('');
  const [exhaustion, setExhaustion] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addActivity = useJournalStore((state) => state.addActivity);
  const updateActivity = useJournalStore((state) => state.updateActivity);
  const deleteActivity = useJournalStore((state) => state.deleteActivity);

  const openAddModal = () => {
    setEditingActivity(null);
    setName('');
    setHoursOut('');
    setExhaustion('5');
    setNote('');
    setError(null);
    setModalVisible(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setName(activity.name);
    setHoursOut(activity.hoursOut.toString());
    setExhaustion(activity.exhaustion.toString());
    setNote(activity.note || '');
    setError(null);
    setModalVisible(true);
  };

  const saveActivity = () => {
    const activityData: Activity = {
      id: editingActivity?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      hoursOut: parseFloat(hoursOut) || 0,
      exhaustion: parseInt(exhaustion, 10) || 5,
      note: note || undefined,
      date: entry.date,
    };

    const validation = validateActivity(activityData);
    if (!validation.valid) {
      setError(validation.error || 'Invalid activity');
      return;
    }

    if (editingActivity) {
      updateActivity(entry.date, editingActivity.id, activityData);
    } else {
      addActivity(entry.date, activityData);
    }

    setModalVisible(false);
  };

  const handleDelete = (activityId: string) => {
    deleteActivity(entry.date, activityId);
  };

  const getExhaustionColor = (level: number) => {
    if (level <= 3) return colors.success;
    if (level <= 6) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>🏃 Activities</Text>
        <Pressable style={styles.addButton} onPress={openAddModal} accessibilityRole="button" accessibilityLabel="Add activity">
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {entry.activities.length === 0 ? (
        <Text style={styles.emptyText}>No activities recorded</Text>
      ) : (
        <ScrollView style={styles.activityList} nestedScrollEnabled>
          {entry.activities.map((activity) => (
            <Pressable
              key={activity.id}
              style={styles.activityItem}
              onPress={() => openEditModal(activity)}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${activity.name}`}
            >
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityDetail}>{activity.hoursOut}h out</Text>
                  <View style={[styles.exhaustionBadge, { backgroundColor: getExhaustionColor(activity.exhaustion) + '20' }]}>
                    <Text style={[styles.exhaustionText, { color: getExhaustionColor(activity.exhaustion) }]}>
                      😓 {activity.exhaustion}/10
                    </Text>
                  </View>
                </View>
                {activity.note ? <Text style={styles.activityNote}>{activity.note}</Text> : null}
              </View>
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDelete(activity.id)}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${activity.name}`}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </Pressable>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Activity Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingActivity ? 'Edit Activity' : 'Add Activity'}
            </Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Activity Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Walking, Meeting"
                placeholderTextColor={colors.textTertiary}
                accessibilityLabel="Activity name"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.inputLabel}>Hours Out</Text>
                <TextInput
                  style={styles.textInput}
                  value={hoursOut}
                  onChangeText={setHoursOut}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.textTertiary}
                  accessibilityLabel="Hours out"
                />
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.inputLabel}>Exhaustion (1-10)</Text>
                <TextInput
                  style={styles.textInput}
                  value={exhaustion}
                  onChangeText={setExhaustion}
                  placeholder="5"
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholderTextColor={colors.textTertiary}
                  accessibilityLabel="Exhaustion level"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Note (optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textInputMultiline]}
                value={note}
                onChangeText={setNote}
                placeholder="Any notes about this activity"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                accessibilityLabel="Activity note"
              />
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
                onPress={saveActivity}
              >
                <Text style={styles.saveButtonText}>
                  {editingActivity ? 'Update' : 'Add'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.cardPadding,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: spacing.cardElevation,
    marginVertical: spacing.cardMargin / 2,
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
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.buttonBorderRadius,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  addButtonText: {
    ...typography.body2,
    color: colors.buttonPrimaryText,
    fontWeight: typography.fontWeightSemibold,
  },
  emptyText: {
    ...typography.body2,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  activityList: {
    maxHeight: 200,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightMedium,
    marginBottom: spacing.xs / 2,
  },
  activityDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  activityDetail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  exhaustionBadge: {
    paddingHorizontal: spacing.badgePaddingHorizontal,
    paddingVertical: spacing.badgePaddingVertical / 2,
    borderRadius: spacing.badgeBorderRadius,
  },
  exhaustionText: {
    ...typography.caption,
    fontWeight: typography.fontWeightMedium,
  },
  activityNote: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs / 2,
  },
  deleteButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  deleteButtonText: {
    fontSize: 20,
    color: colors.error,
    fontWeight: typography.fontWeightBold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.backgroundModal,
    borderRadius: spacing.modalBorderRadius,
    padding: spacing.modalPadding,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
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
  formGroup: {
    marginBottom: spacing.inputMarginBottom,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formGroupHalf: {
    flex: 1,
    marginBottom: spacing.inputMarginBottom,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: spacing.inputBorderRadius,
    padding: spacing.inputPadding,
    backgroundColor: colors.inputBackground,
    ...typography.body2,
    color: colors.textPrimary,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
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

export default ActivitiesCard;