/**
 * Theme Spacing
 * Consistent spacing system for the mood tracker app
 */

export const spacing = {
  // Micro spacing
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Component-specific spacing
  cardPadding: 16,
  cardMargin: 12,
  cardGap: 12,
  cardBorderRadius: 12,

  screenPadding: 16,
  screenMarginTop: 8,

  modalPadding: 20,
  modalBorderRadius: 16,

  inputPadding: 12,
  inputBorderRadius: 8,
  inputMarginBottom: 12,

  buttonPadding: 12,
  buttonBorderRadius: 8,
  buttonMarginBottom: 8,

  badgePaddingHorizontal: 8,
  badgePaddingVertical: 4,
  badgeBorderRadius: 12,

  chipPaddingHorizontal: 10,
  chipPaddingVertical: 6,
  chipBorderRadius: 16,
  chipGap: 8,

  tabBarHeight: 60,
  headerHeight: 56,
  statusBarHeight: 44,

  iconSizeSmall: 16,
  iconSizeMedium: 24,
  iconSizeLarge: 32,

  // Animation values
  cardScaleHover: 1.02,
  cardScalePress: 0.98,
  animationDuration: 200,

  // Elevation/shadow
  cardElevation: 2,
  cardElevationHover: 4,
  modalElevation: 8,

  // Layout breakpoints
  breakpointMobile: 480,
  breakpointTablet: 768,
  breakpointDesktop: 1024,

  // Grid columns
  gridColumnsMobile: 1,
  gridColumnsTablet: 2,
  gridColumnsDesktop: 3,
};

export type SpacingTheme = typeof spacing;