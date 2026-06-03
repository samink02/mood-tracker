/**
 * Theme Colors
 * Soothing light theme color palette for the mood tracker app
 */

export const colors = {
  // Primary colors
  primary: '#5C6BC0', // Indigo
  primaryLight: '#7986CB',
  primaryDark: '#3949AB',
  accent: '#FF7043', // Deep orange accent

  // Background colors
  background: '#F5F7FA',
  backgroundCard: '#FFFFFF',
  backgroundModal: '#FFFFFF',
  backgroundInput: '#F0F2F5',
  backgroundDisabled: '#E0E0E0',

  // Text colors
  textPrimary: '#212121',
  textSecondary: '#616161',
  textTertiary: '#9E9E9E',
  textInverse: '#FFFFFF',
  textLink: '#5C6BC0',
  textDisabled: '#BDBDBD',

  // Mood colors
  moodHappy: '#4CAF50',
  moodSad: '#2196F3',
  moodAngry: '#F44336',
  moodNeutral: '#9E9E9E',

  // Status colors
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  errorLight: '#FFEBEE',
  info: '#2196F3',
  infoLight: '#E3F2FD',

  // Card colors
  cardShadow: 'rgba(0, 0, 0, 0.08)',
  cardBorder: '#E0E0E0',
  cardHoverBorder: '#5C6BC0',
  cardSelectedBorder: '#5C6BC0',

  // Emotion category colors
  emotionPositive: '#4CAF50',
  emotionNegative: '#F44336',
  emotionNeutral: '#9E9E9E',
  emotionComplex: '#FF9800',

  // Sleep quality colors
  sleepPoor: '#F44336',
  sleepBelowAverage: '#FF9800',
  sleepIdeal: '#4CAF50',
  sleepExcessive: '#FF9800',

  // Todo status colors
  todoNotStarted: '#9E9E9E',
  todoNotStartedBg: '#EEEEEE',
  todoInProgress: '#2196F3',
  todoInProgressBg: '#E3F2FD',
  todoOngoing: '#FF9800',
  todoOngoingBg: '#FFF3E0',
  todoOnHold: '#F44336',
  todoOnHoldBg: '#FFEBEE',
  todoDone: '#4CAF50',
  todoDoneBg: '#E8F5E9',

  // Chart colors
  chartLine1: '#5C6BC0',
  chartLine2: '#FF7043',
  chartLine3: '#4CAF50',
  chartGrid: '#E0E0E0',
  chartBackground: '#FAFAFA',

  // Divider and separator
  divider: '#E0E0E0',
  separator: '#F5F5F5',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Tab bar
  tabBarActive: '#5C6BC0',
  tabBarInactive: '#9E9E9E',
  tabBarBackground: '#FFFFFF',

  // Button colors
  buttonPrimary: '#5C6BC0',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#FFFFFF',
  buttonSecondaryText: '#5C6BC0',
  buttonSecondaryBorder: '#5C6BC0',
  buttonDanger: '#F44336',
  buttonDangerText: '#FFFFFF',
  buttonDisabled: '#E0E0E0',
  buttonDisabledText: '#9E9E9E',

  // Input colors
  inputBorder: '#E0E0E0',
  inputFocusBorder: '#5C6BC0',
  inputErrorBorder: '#F44336',
  inputBackground: '#FAFAFA',

  // Badge colors
  badgeInfo: '#2196F3',
  badgeSuccess: '#4CAF50',
  badgeWarning: '#FF9800',
  badgeError: '#F44336',
};

export type ColorTheme = typeof colors;