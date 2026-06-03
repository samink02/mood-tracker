/**
 * Theme Index
 * Central export point for the theme system
 */

export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';

import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  typography,
};

export type Theme = typeof theme;

// Common style presets using the nested color structure
export const commonStyles = {
  card: {
    backgroundColor: colors.card.background,
    borderRadius: spacing.cardBorderRadius,
    padding: spacing.cardPadding,
    elevation: spacing.cardElevation,
    shadowColor: colors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  button: {
    primary: {
      backgroundColor: colors.button.primary,
      borderRadius: spacing.buttonBorderRadius,
      paddingVertical: spacing.buttonPadding,
      paddingHorizontal: spacing.lg,
    },
    secondary: {
      backgroundColor: colors.button.secondary,
      borderRadius: spacing.buttonBorderRadius,
      paddingVertical: spacing.buttonPadding,
      paddingHorizontal: spacing.lg,
      borderWidth: 1,
      borderColor: colors.button.secondaryBorder,
    },
  },
  input: {
    borderWidth: 1,
    borderColor: colors.input.border,
    borderRadius: spacing.inputBorderRadius,
    padding: spacing.inputPadding,
    backgroundColor: colors.input.background,
  },
  badge: {
    paddingHorizontal: spacing.badgePaddingHorizontal,
    paddingVertical: spacing.badgePaddingVertical,
    borderRadius: spacing.badgeBorderRadius,
  },
};
