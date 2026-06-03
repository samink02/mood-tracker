/**
 * MealsCard Component
 * Displays and manages meal entries (meals, drinks, snacks)
 * Reusable for all three categories
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { MealEntry, DailyJournalEntry } from '@/models/Journal';
import { useJournalStore } from '@/state/journalStore';
import { validateMealEntry } from '@/utils/journalCalculations';

type MealCategory = 'meals' | 'drinks' | 'snacksAndDesserts';

interface MealsCardProps {
  entry: DailyJournalEntry;
  category: MealCategory;
  emoji?: string;
  title?: string;
}

const CATEGORY_CONFIG: Record<MealCategory, { emoji: string; title: string }> = {
  meals: { emoji: '🍽️', title: 'Meals' },
  drinks: { emoji: '🥤', title: 'Drinks' },
  snacksAndDesserts: { emoji: '🍰', title: 'Snacks & Desserts' },
};

const TIME_OF_DAY_OPTIONS: Array<{ value: MealEntry['timeOfDay']; label: string; emoji: string }> = [
  { value: 'morning', label: 'Morning', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍪' },
];

const MealsCard: React.FC<MealsCardProps> = ({ entry, category, emoji, title }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<MealEntry['timeOfDay']>(undefined);
  const [error, setError] = useState<string | null>(null);

  const addMeal = useJournalStore((state) => state.addMeal);
  const updateMeal = useJournalStore((state) => state.updateMeal);
  const deleteMeal = useJournalStore((state) => state.deleteMeal);

  const config = CATEGORY_CONFIG[category];
  const displayEmoji = emoji || config.emoji;
  const displayTitle = title || config.title;
  const items = entry[category];

  const openAddModal = () => {
    setEditingMeal(null);
    setName('');
    setQuantity('');
    setCalories('');
    setTimeOfDay(undefined);
    setError(null);
    setModalVisible(true);
  };

  const openEditModal = (meal: MealEntry) => {
    setEditingMeal(meal);
    setName(meal.name);
    setQuantity(meal.quantity.toString());
    setCalories(meal.calories?.toString() || '');
    setTimeOfDay(meal.timeOfDay);
    setError(null);
    setModalVisible(true);
  };

  const saveMeal = () => {
    const mealData: MealEntry = {
      id: editingMeal?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      quantity: quantity,
      calories: calories ? parseInt(calories, 10) : undefined,
      timeOfDay,
    };

    const validation = validateMealEntry(mealData);
    if (!validation.valid) {
      setError(validation.error || 'Invalid entry');
      return;
    }

    if (editingMeal) {
      updateMeal(entry.date, category, editingMeal.id, mealData);
    } else {
      addMeal(entry.date, mealData, category);
    }

    setModalVisible(false);
  };

  const handleDelete = (mealId: string) => {
    deleteMeal(entry.date, category, mealId);
  };

  const getTimeOfDayEmoji = (tod: MealEntry['timeOfDay']) => {
    const found = TIME_OF_DAY_OPTIONS.find((opt) => opt.value === tod);
    return found ? found.emoji : '';
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>
          {displayEmoji} {displayTitle}
        </Text>
        <Pressable style={styles.addButton} onPress={openAddModal} accessibilityRole="button" accessibilityLabel={`Add ${displayTitle.toLowerCase()}`}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>No {displayTitle.toLowerCase()} recorded</Text>
      ) : (
        <ScrollView style={styles.itemList} nestedScrollEnabled>
          {items.map((item) => (
            <Pressable
              key={item.id}
              style={styles.mealItem}
              onPress={() => openEditModal(item)}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${item.name}`}
            >
              <View style={styles.mealInfo}>
                <View style={styles.mealNameRow}>
                  {item.timeOfDay && (
                    <Text style={styles.timeEmoji}>{getTimeOfDayEmoji(item.timeOfDay)}</Text>
                  )}
                  <Text style={styles.mealName}>{item.name}</Text>
                </View>
                <View style={styles.mealDetails}>
                  <Text style={styles.mealDetail}>{item.quantity}</Text>
                  {item.calories && (
                    <Text style={styles.mealCalories}>{item.calories} cal</Text>
                  )}
                </View>
              </View>
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${item.name}`}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </Pressable>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Summary */}
      {items.length > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total: {items.length} items</Text>
          {items.some((i) => i.calories) && (
            <Text style={styles.summaryCalories}>
              {items.reduce((sum, i) => sum + (i.calories || 0), 0)} cal
            </Text>
          )}
        </View>
      )}

      {/* Meal Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingMeal ? `Edit ${displayTitle.slice(0, -1)}` : `Add ${displayTitle.slice(0, -1)}`}
            </Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Chicken Salad, Orange Juice"
                placeholderTextColor={colors.textTertiary}
                accessibilityLabel="Item name"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={styles.textInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="e.g., 1 plate, 250ml"
                  placeholderTextColor={colors.textTertiary}
                  accessibilityLabel="Quantity"
                />
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.inputLabel}>Calories</Text>
                <TextInput
                  style={styles.textInput}
                  value={calories}
                  onChangeText={setCalories}
                  placeholder="Optional"
                  keyboardType="number-pad"
                  placeholderTextColor={colors.textTertiary}
                  accessibilityLabel="Calories"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Time of Day</Text>
              <View style={styles.timeOfDayOptions}>
                {TIME_OF_DAY_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.timeOption,
                      timeOfDay === option.value && styles.timeOptionSelected,
                    ]}
                    onPress={() => setTimeOfDay(option.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: timeOfDay === option.value }}
                  >
                    <Text style={styles.timeOptionEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.timeOptionText,
                        timeOfDay === option.value && styles.timeOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
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
                onPress={saveMeal}
              >
                <Text style={styles.saveButtonText}>
                  {editingMeal ? 'Update' : 'Add'}
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
  itemList: {
    maxHeight: 150,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  mealInfo: {
    flex: 1,
  },
  mealNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs / 2,
  },
  timeEmoji: {
    fontSize: spacing.iconSizeSmall,
    marginRight: spacing.xs,
  },
  mealName: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightMedium,
  },
  mealDetails: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  mealDetail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  mealCalories: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: typography.fontWeightMedium,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  summaryCalories: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: typography.fontWeightSemibold,
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
  timeOfDayOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.buttonBorderRadius,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
  },
  timeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  timeOptionEmoji: {
    fontSize: spacing.iconSizeSmall,
    marginRight: spacing.xs,
  },
  timeOptionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  timeOptionTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeightSemibold,
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

export default MealsCard;