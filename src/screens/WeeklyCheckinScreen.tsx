/**
 * WeeklyCheckinScreen
 * GAD-7 and PHQ-9 questionnaires with scoring and charts
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useWeeklyStore } from '@/state/weeklyStore';
import {
  GAD7_QUESTIONS,
  GAD7_OPTIONS,
  PHQ9_QUESTIONS,
  PHQ9_OPTIONS,
  calculateGad7Score,
  calculatePhq9Score,
  getGad7Severity,
  getPhq9Severity,
  assessSuicideRisk,
} from '@/utils/questionnaireScoring';

type QuestionnaireStep = 'gad7' | 'phq9' | 'results';

const WeeklyCheckinScreen: React.FC = () => {
  const [step, setStep] = useState<QuestionnaireStep>('gad7');
  const [gad7Responses, setGad7Responses] = useState<number[]>(new Array(7).fill(-1));
  const [phq9Responses, setPhq9Responses] = useState<number[]>(new Array(9).fill(-1));
  const [gad7Score, setGad7Score] = useState<number | null>(null);
  const [phq9Score, setPhq9Score] = useState<number | null>(null);

  const startCheckin = useWeeklyStore((state) => state.startCheckin);
  const setGad7Response = useWeeklyStore((state) => state.setGad7Response);
  const setPhq9Response = useWeeklyStore((state) => state.setPhq9Response);
  const completeCheckin = useWeeklyStore((state) => state.completeCheckin);
  const cancelCheckin = useWeeklyStore((state) => state.cancelCheckin);
  const error = useWeeklyStore((state) => state.error);

  const handleGad7Response = (questionIndex: number, value: number) => {
    const newResponses = [...gad7Responses];
    newResponses[questionIndex] = value;
    setGad7Responses(newResponses);
    setGad7Response(questionIndex, value);
  };

  const handlePhq9Response = (questionIndex: number, value: number) => {
    const newResponses = [...phq9Responses];
    newResponses[questionIndex] = value;
    setPhq9Responses(newResponses);
    setPhq9Response(questionIndex, value);
  };

  const isGad7Complete = gad7Responses.every((r) => r >= 0);
  const isPhq9Complete = phq9Responses.every((r) => r >= 0);

  const handleGad7Next = () => {
    if (!isGad7Complete) {
      return;
    }
    const score = calculateGad7Score(gad7Responses);
    setGad7Score(score);
    setStep('phq9');
  };

  const handlePhq9Complete = () => {
    if (!isPhq9Complete) {
      return;
    }
    const score = calculatePhq9Score(phq9Responses);
    setPhq9Score(score);

    // Check for suicide risk
    const risk = assessSuicideRisk(phq9Responses);
    if (risk.risk === 'high') {
      Alert.alert(
        'Important Message',
        risk.message || 'Please seek help immediately. Call 988 (Suicide & Crisis Lifeline).',
        [{ text: 'I understand', style: 'default' }]
      );
    } else if (risk.risk === 'low') {
      Alert.alert(
        'Note',
        risk.message || 'Please consider speaking with a healthcare provider.',
        [{ text: 'OK', style: 'default' }]
      );
    }

    setStep('results');
  };

  const handleSave = () => {
    completeCheckin();
  };

  const handleCancel = () => {
    cancelCheckin();
    // Navigate back handled by navigation
  };

  const gad7Severity = gad7Score !== null ? getGad7Severity(gad7Score) : null;
  const phq9Severity = phq9Score !== null ? getPhq9Severity(phq9Score) : null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, step === 'gad7' && styles.progressStepActive]}>
            <Text style={styles.progressStepText}>1</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.progressStep, step === 'phq9' && styles.progressStepActive]}>
            <Text style={styles.progressStepText}>2</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.progressStep, step === 'results' && styles.progressStepActive]}>
            <Text style={styles.progressStepText}>3</Text>
          </View>
        </View>

        {step === 'gad7' && (
          <>
            <Text style={styles.questionnaireTitle}>GAD-7 Anxiety Assessment</Text>
            <Text style={styles.questionnaireSubtitle}>
              Over the last 2 weeks, how often have you been bothered by:
            </Text>

            {GAD7_QUESTIONS.map((question, qIndex) => (
              <View key={qIndex} style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  {qIndex + 1}. {question}
                </Text>
                <View style={styles.optionsRow}>
                  {GAD7_OPTIONS.map((option) => (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.optionButton,
                        gad7Responses[qIndex] === option.value && styles.optionButtonSelected,
                      ]}
                      onPress={() => handleGad7Response(qIndex, option.value)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: gad7Responses[qIndex] === option.value }}
                      accessibilityLabel={option.label}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          gad7Responses[qIndex] === option.value && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}

            <Pressable
              style={[styles.nextButton, !isGad7Complete && styles.nextButtonDisabled]}
              onPress={handleGad7Next}
              disabled={!isGad7Complete}
              accessibilityRole="button"
              accessibilityLabel="Continue to PHQ-9"
            >
              <Text style={styles.nextButtonText}>
                Continue to PHQ-9 →
              </Text>
            </Pressable>
          </>
        )}

        {step === 'phq9' && (
          <>
            <Pressable style={styles.backButton} onPress={() => setStep('gad7')}>
              <Text style={styles.backButtonText}>← Back to GAD-7</Text>
            </Pressable>

            <Text style={styles.questionnaireTitle}>PHQ-9 Depression Assessment</Text>
            <Text style={styles.questionnaireSubtitle}>
              Over the last 2 weeks, how often have you been bothered by:
            </Text>

            {PHQ9_QUESTIONS.map((question, qIndex) => (
              <View key={qIndex} style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  {qIndex + 1}. {question}
                </Text>
                <View style={styles.optionsRow}>
                  {PHQ9_OPTIONS.map((option) => (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.optionButton,
                        phq9Responses[qIndex] === option.value && styles.optionButtonSelected,
                      ]}
                      onPress={() => handlePhq9Response(qIndex, option.value)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: phq9Responses[qIndex] === option.value }}
                      accessibilityLabel={option.label}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          phq9Responses[qIndex] === option.value && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}

            <Pressable
              style={[styles.nextButton, !isPhq9Complete && styles.nextButtonDisabled]}
              onPress={handlePhq9Complete}
              disabled={!isPhq9Complete}
              accessibilityRole="button"
              accessibilityLabel="View results"
            >
              <Text style={styles.nextButtonText}>View Results →</Text>
            </Pressable>
          </>
        )}

        {step === 'results' && gad7Severity && phq9Severity && (
          <>
            <Text style={styles.resultsTitle}>Your Results</Text>

            {/* GAD-7 Results */}
            <View style={[styles.resultCard, { borderLeftColor: gad7Severity.color }]}>
              <Text style={styles.resultLabel}>GAD-7 Anxiety Score</Text>
              <Text style={[styles.resultScore, { color: gad7Severity.color }]}>
                {gad7Score} / 21
              </Text>
              <Text style={[styles.resultLevel, { color: gad7Severity.color }]}>
                {gad7Severity.level}
              </Text>
              <Text style={styles.resultDescription}>{gad7Severity.description}</Text>
              <Text style={styles.resultRecommendation}>{gad7Severity.recommendation}</Text>
            </View>

            {/* PHQ-9 Results */}
            <View style={[styles.resultCard, { borderLeftColor: phq9Severity.color }]}>
              <Text style={styles.resultLabel}>PHQ-9 Depression Score</Text>
              <Text style={[styles.resultScore, { color: phq9Severity.color }]}>
                {phq9Score} / 27
              </Text>
              <Text style={[styles.resultLevel, { color: phq9Severity.color }]}>
                {phq9Severity.level}
              </Text>
              <Text style={styles.resultDescription}>{phq9Severity.description}</Text>
              <Text style={styles.resultRecommendation}>{phq9Severity.recommendation}</Text>
            </View>

            {/* Save Button */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Check-In</Text>
            </Pressable>

            {/* Disclaimer */}
            <View style={styles.disclaimerCard}>
              <Text style={styles.disclaimerTitle}>⚠️ Medical Disclaimer</Text>
              <Text style={styles.disclaimerText}>
                These questionnaires are screening tools only and are not a substitute for
                professional diagnosis or treatment. Always consult with a qualified
                healthcare provider for mental health concerns. If you are experiencing a
                mental health crisis, please call 988 (Suicide & Crisis Lifeline) or text
                HOME to 741741.
              </Text>
            </View>
          </>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.screenMarginTop,
    paddingBottom: spacing.xxxl * 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepActive: {
    backgroundColor: colors.primary[500],
  },
  progressStepText: {
    ...typography.body2,
    color: colors.text.secondary,
    fontWeight: typography.fontWeightBold,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.sm,
  },
  questionnaireTitle: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  questionnaireSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  questionContainer: {
    marginBottom: spacing.lg,
    backgroundColor: colors.card.background,
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.cardPadding,
  },
  questionText: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: spacing.md,
    fontWeight: typography.fontWeightMedium,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.buttonBorderRadius,
    borderWidth: 1,
    borderColor: colors.input.border,
    backgroundColor: colors.input.background,
  },
  optionButtonSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500] + '10',
  },
  optionText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  optionTextSelected: {
    color: colors.primary[500],
    fontWeight: typography.fontWeightSemibold,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backButtonText: {
    ...typography.body2,
    color: colors.primary[500],
  },
  nextButton: {
    backgroundColor: colors.primary[500],
    borderRadius: spacing.buttonBorderRadius,
    paddingVertical: spacing.buttonPadding,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  nextButtonDisabled: {
    backgroundColor: colors.button.disabled,
  },
  nextButtonText: {
    ...typography.button,
    color: colors.button.primaryText,
  },
  resultsTitle: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: colors.card.background,
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.cardPadding,
    borderLeftWidth: 4,
    marginBottom: spacing.lg,
  },
  resultLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  resultScore: {
    ...typography.heading1,
    fontWeight: typography.fontWeightBold,
    marginBottom: spacing.xs,
  },
  resultLevel: {
    ...typography.heading4,
    fontWeight: typography.fontWeightSemibold,
    marginBottom: spacing.xs,
  },
  resultDescription: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  resultRecommendation: {
    ...typography.body2,
    color: colors.text.primary,
    fontStyle: 'italic',
  },
  errorText: {
    ...typography.body2,
    color: colors.status.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.status.success,
    borderRadius: spacing.buttonBorderRadius,
    paddingVertical: spacing.buttonPadding,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.button.primaryText,
  },
  disclaimerCard: {
    backgroundColor: colors.status.warningLight,
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.cardPadding,
    marginTop: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.warning,
  },
  disclaimerTitle: {
    ...typography.heading4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  disclaimerText: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: typography.body2.lineHeight * typography.lineHeightRelaxed,
  },
});

export default WeeklyCheckinScreen;