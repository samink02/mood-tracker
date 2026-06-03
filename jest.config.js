const { getDefaultConfig } = require('expo/metro-config');
const { withJest } = require('expo/build/jest/withJest');

const config = withJest(getDefaultConfig(__dirname), {
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|victory-native|react-native-svg|react-native-reanimated|react-native-modal|expo-.*|@expo-.*)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/types.ts',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
    }],
  },
});

module.exports = config;