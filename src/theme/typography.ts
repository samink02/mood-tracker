/**
 * Theme Typography
 * Font styles and sizes for the mood tracker app
 */

export const typography = {
  // Font families
  fontRegular: 'System',
  fontMedium: 'System',
  fontBold: 'System',

  // Font sizes
  fontSizeXs: 10,
  fontSizeSm: 12,
  fontSizeMd: 14,
  fontSizeLg: 16,
  fontSizeXl: 18,
  fontSizeXxl: 22,
  fontSizeXxxl: 28,
  fontSizeHero: 36,

  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,

  // Font weights
  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemibold: '600' as const,
  fontWeightBold: '700' as const,

  // Letter spacing
  letterSpacingTight: -0.5,
  letterSpacingNormal: 0,
  letterSpacingWide: 0.5,

  // Text styles (pre-composed)
  heading1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 33.6,
  },
  heading2: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28.6,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 23.4,
  },
  heading4: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20.8,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20.8,
  },
  overline: {
    fontSize: 10,
    fontWeight: '600' as const,
    lineHeight: 15,
    letterSpacing: 1.5,
  },
};

export type TypographyTheme = typeof typography;