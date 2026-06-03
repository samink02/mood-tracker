/**
 * EmotionsCard Component
 * Multi-select emotions from comprehensive list, grouped by category
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
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Emotion, EmotionCategory, EMOTION_LIST, DailyJournalEntry } from '@/models/Journal';
import { useJournalStore } from '@/state/journalStore';

interface EmotionsCardProps {
  entry: DailyJournalEntry;
}

const EmotionsCard: React.FC<EmotionsCardProps> = ({ entry }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const setEmotions = useJournalStore((state) => state.setEmotions);
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>(entry.emotions);

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

  const toggleEmotion = (emotion: Emotion) => {
    const isSelected = selectedEmotions.some((e) => e.id === emotion.id);
    if (isSelected) {
      setSelectedEmotions(selectedEmotions.filter((e) => e.id !== emotion.id));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const saveEmotions = () => {
    setEmotions(entry.date, selectedEmotions);
    setModalVisible(false);
  };

  const getCategoryColor = (category: EmotionCategory) => {
    switch (category) {
      case EmotionCategory.Positive:
        return colors.emotion.positive;
      case EmotionCategory.Negative:
        return colors.emotion.negative;
      case EmotionCategory.Neutral:
        return colors.emotion.neutral;
      case EmotionCategory.Complex:
        return colors.emotion.complex;
      default:
        return colors.text.tertiary;
    }
  };

  const getCategoryLabel = (category: EmotionCategory) => {
    switch (category) {
      case EmotionCategory.Positive:
        return 'Positive';
      case EmotionCategory.Negative:
        return 'Negative';
      case EmotionCategory.Neutral:
        return 'Neutral';
      case EmotionCategory.Complex:
        return 'Complex';
      default:
        return category;
    }
  };

  const emotionsByCategory = Object.values(EmotionCategory).map((category) => ({
    category,
    label: getCategoryLabel(category),
    emotions: EMOTION_LIST.filter((e) => e.category === category),
  }));

  return (
    <Animated.View style={[styles.animatedContainer, { transform: [{ scale: scaleValue }] }]}>
      <Pressable
        onPress={() => {
          setSelectedEmotions(entry.emotions);
          setModalVisible(true);
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel="Edit emotions"
      >
        <View style={styles.header}>
          <Text style={styles.cardTitle}>🎭 Emotions</Text>
          <Text style={styles.editHint}>Tap to edit</Text>
        </View>

        {entry.emotions.length === 0 ? (
          <Text style={styles.emptyText}>No emotions selected</Text>
        ) : (
          <View style={styles.emotionChips}>
            {entry.emotions.map((emotion) => (
              <View
                key={emotion.id}
                style={[
                  styles.emotionChip,
                  { backgroundColor: getCategoryColor(emotion.category) + '20' },
                ]}
              >
                <Text style={styles.emotionChipEmoji}>{emotion.emoji}</Text>
                <Text style={[styles.emotionChipText, { color: getCategoryColor(emotion.category) }]}>
                  {emotion.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Pressable>

      {/* Emotions Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Emotions</Text>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {emotionsByCategory.map(({ category, label, emotions }) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={[styles.categoryLabel, { color: getCategoryColor(category) }]}>
                    {label}
                  </Text>
                  <View style={styles.emotionOptions}>
                    {emotions.map((emotion) => {
                      const isSelected = selectedEmotions.some((e) => e.id === emotion.id);
                      return (
                        <Pressable
                          key={emotion.id}
                          style={[
                            styles.emotionOption,
                            isSelected && {
                              backgroundColor: getCategoryColor(emotion.category) + '20',
                              borderColor: getCategoryColor(emotion.category),
                            },
                          ]}
                          onPress={() => toggleEmotion(emotion)}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: isSelected }}
                          accessibilityLabel={emotion.name}
                        >
                          <Text style={styles.emotionOptionEmoji}>{emotion.emoji}</Text>
                          <Text
                            style={[
                              styles.emotionOptionText,
                              isSelected && { color: getCategoryColor(emotion.category) },
                            ]}
                          >
                            {emotion.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveEmotions}
              >
                <Text style={styles.saveButtonText}>Save ({selectedEmotions.length})</Text>
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
    backgroundColor: colors.card.background,
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.cardPadding,
    shadowColor: colors.card.shadow,
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
    color: colors.text.primary,
  },
  editHint: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  emptyText: {
    ...typography.body2,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  emotionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.chipGap,
  },
  emotionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.chipPaddingHorizontal,
    paddingVertical: spacing.chipPaddingVertical,
    borderRadius: spacing.chipBorderRadius,
  },
  emotionChipEmoji: {
    fontSize: spacing.iconSizeSmall,
    marginRight: spacing.xs,
  },
  emotionChipText: {
    ...typography.caption,
    fontWeight: typography.fontWeightMedium,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.background.modal,
    borderTopLeftRadius: spacing.modalBorderRadius,
    borderTopRightRadius: spacing.modalBorderRadius,
    padding: spacing.modalPadding,
    maxHeight: '80%',
  },
  modalTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  scrollView: {
    marginBottom: spacing.lg,
  },
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryLabel: {
    ...typography.heading4,
    fontWeight: typography.fontWeightSemibold,
    marginBottom: spacing.sm,
  },
  emotionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.chipGap,
  },
  emotionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.chipPaddingHorizontal,
    paddingVertical: spacing.chipPaddingVertical,
    borderRadius: spacing.chipBorderRadius,
    borderWidth: 1,
    borderColor: colors.card.border,
    backgroundColor: colors.background.input,
  },
  emotionOptionEmoji: {
    fontSize: spacing.iconSizeSmall,
    marginRight: spacing.xs,
  },
  emotionOptionText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  modalButton: {
    borderRadius: spacing.buttonBorderRadius,
    paddingVertical: spacing.buttonPadding,
    paddingHorizontal: spacing.xl,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.button.secondary,
    borderWidth: 1,
    borderColor: colors.button.secondaryBorder,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.button.secondaryText,
  },
  saveButton: {
    backgroundColor: colors.button.primary,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.button.primaryText,
  },
});

export default EmotionsCard;