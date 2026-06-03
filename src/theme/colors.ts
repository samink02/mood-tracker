/**
 * Theme Colors
 * Soothing light theme color palette for the mood tracker app.
 * Organized with nested namespaces for semantic usage.
 */

export const colors = {
  // Primary palette (indigo scale)
  primary: {
    50: '#E8EAF6',
    100: '#C5CAE9',
    200: '#9FA8DA',
    300: '#7986CB',
    400: '#5C6BC0',
    500: '#3F51B5',
    600: '#3949AB',
    700: '#303F9F',
    800: '#283593',
    900: '#1A237E',
  },

  // Accent (deep orange)
  accent: '#FF7043',

  // Background colors
  background: {
    light: '#F5F7FA',
    card: '#FFFFFF',
    modal: '#FFFFFF',
    input: '#F0F2F5',
    disabled: '#E0E0E0',
  },

  // Text colors
  text: {
    primary: '#212121',
    secondary: '#616161',
    tertiary: '#9E9E9E',
    inverse: '#FFFFFF',
    link: '#5C6BC0',
    disabled: '#BDBDBD',
  },

  // Mood colors
  mood: {
    happy: '#4CAF50',
    sad: '#2196F3',
    angry: '#F44336',
    neutral: '#9E9E9E',
    happyBg: '#E8F5E9',
    sadBg: '#E3F2FD',
    angryBg: '#FFEBEE',
    neutralBg: '#F5F5F5',
  },

  // Status colors
  status: {
    success: '#4CAF50',
    successLight: '#E8F5E9',
    warning: '#FF9800',
    warningLight: '#FFF3E0',
    error: '#F44336',
    errorLight: '#FFEBEE',
    info: '#2196F3',
    infoLight: '#E3F2FD',
  },

  // Card colors
  card: {
    background: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.08)',
    border: '#E0E0E0',
    hoverBorder: '#5C6BC0',
    selectedBorder: '#5C6BC0',
    transparent: 'transparent',
  },

  // Emotion category colors
  emotion: {
    positive: '#4CAF50',
    positiveBg: '#E8F5E9',
    negative: '#F44336',
    negativeBg: '#FFEBEE',
    neutral: '#9E9E9E',
    neutralBg: '#F5F5F5',
    complex: '#FF9800',
    complexBg: '#FFF3E0',
  },

  // Sleep quality colors
  sleep: {
    poor: '#F44336',
    belowAverage: '#FF9800',
    ideal: '#4CAF50',
    excessive: '#FF9800',
  },

  // Todo status colors
  todo: {
    notStarted: '#9E9E9E',
    notStartedBg: '#EEEEEE',
    inProgress: '#2196F3',
    inProgressBg: '#E3F2FD',
    ongoing: '#FF9800',
    ongoingBg: '#FFF3E0',
    onHold: '#F44336',
    onHoldBg: '#FFEBEE',
    done: '#4CAF50',
    doneBg: '#E8F5E9',
  },

  // Chart colors
  chart: {
    line1: '#5C6BC0',
    line2: '#FF7043',
    line3: '#4CAF50',
    grid: '#E0E0E0',
    background: '#FAFAFA',
    bar: '#5C6BC0',
    barLight: '#9FA8DA',
  },

  // Divider and separator
  divider: '#E0E0E0',
  separator: '#F5F5F5',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Tab bar
  tabBar: {
    active: '#5C6BC0',
    inactive: '#9E9E9E',
    background: '#FFFFFF',
  },

  // Button colors
  button: {
    primary: '#5C6BC0',
    primaryText: '#FFFFFF',
    secondary: '#FFFFFF',
    secondaryText: '#5C6BC0',
    secondaryBorder: '#5C6BC0',
    danger: '#F44336',
    dangerText: '#FFFFFF',
    disabled: '#E0E0E0',
    disabledText: '#9E9E9E',
  },

  // Input colors
  input: {
    border: '#E0E0E0',
    focusBorder: '#5C6BC0',
    errorBorder: '#F44336',
    background: '#FAFAFA',
  },

  // Badge colors
  badge: {
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  },
};

export type ColorTheme = typeof colors;
