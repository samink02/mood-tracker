# Validation Checklist

Use this checklist to verify the Mood Tracker application is complete, functional, and ready for deployment.

## 1. Project Setup & Configuration

- [ ] `package.json` has all required dependencies with correct versions
- [ ] `tsconfig.json` has strict mode enabled and `@/` path aliases configured
- [ ] `.eslintrc.js` extends expo + TypeScript + Prettier configs
- [ ] `.prettierrc` matches team formatting preferences
- [ ] `jest.config.js` resolves `@/` aliases and transforms TS files
- [ ] `jest.setup.js` mocks AsyncStorage, notifications, and native modules
- [ ] `.env.example` lists all required environment variables
- [ ] `app.config.ts` has correct bundle identifiers and permissions
- [ ] `npm install` completes without errors
- [ ] `npm run typecheck` passes with zero errors

## 2. Data Models

- [ ] `Journal.ts` exports `DailyJournalEntry`, `OverallMood`, `Emotion`, `SleepEntry`, `Activity`, `MealEntry`
- [ ] `EMOTION_LIST` covers all 26 emotions across 4 categories
- [ ] `Todo.ts` exports `TodoItem`, `TodoStatus`, and helper functions
- [ ] `createEmptyDailyEntry()` returns a valid empty journal entry
- [ ] All model fields have TypeScript types (no `any`)

## 3. State Management

- [ ] `journalStore` persists to AsyncStorage with key `journal-store`
- [ ] All CRUD actions work: upsert, get, delete, update sub-fields
- [ ] `ensureEntryExists` creates today's entry if missing
- [ ] Aggregates auto-recalculate on every mutation
- [ ] `todoStore` supports add, update, delete, status change, search, filter
- [ ] `weeklyStore` validates GAD-7/PHQ-9 responses before completion
- [ ] `settingsStore` persists theme and notification preferences
- [ ] All stores use `persist` middleware with AsyncStorage

## 4. Utility Functions

- [ ] `calculateSleepHours` handles overnight sleep (wake < sleep time)
- [ ] `calculateAggregates` sums calories, counts activities, averages exhaustion
- [ ] GAD-7 scoring: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-21 Severe
- [ ] PHQ-9 scoring: 0-4 None, 5-9 Mild, 10-14 Moderate, 15-19 Mod. Severe, 20-27 Severe
- [ ] `assessSuicideRisk` flags PHQ-9 Q9 > 0
- [ ] All validation functions return clear error messages

## 5. UI Components

- [ ] `SummaryCard` displays date, mood, and stats with animated press
- [ ] `SleepCard` shows/edits fell-asleep and woke-up times
- [ ] `EmotionsCard` shows emotion chips grouped by category with modal picker
- [ ] `ActivitiesCard` lists activities with add/edit/delete modal
- [ ] `MealsCard` handles meals, drinks, and snacks via `category` prop
- [ ] `MoodSelector` shows 4 mood options with selection state
- [ ] `DateSelector` navigates days with ◀/▶ and date picker modal
- [ ] `TodoListCard` shows progress bar, active/completed sections

## 6. Screens

- [ ] `HomeScreen` composes all cards in responsive layout (grid on wide, stack on mobile)
- [ ] `TrendsScreen` shows bar charts for sleep, mood, calories, GAD-7, PHQ-9
- [ ] `WeeklyCheckinScreen` has 3-step flow (GAD-7 → PHQ-9 → Results)
- [ ] `SettingsScreen` has theme toggle, notification config, data management
- [ ] Sunday-only weekly check-in button on HomeScreen

## 7. Navigation

- [ ] Bottom tabs: Home (📓), Trends (📊), Settings (⚙️)
- [ ] Stack navigator wraps tabs + WeeklyCheckin screen
- [ ] Tab icons render correctly on iOS and web
- [ ] Navigation types defined in `RootStackParamList` and `MainTabParamList`

## 8. Notifications

- [ ] `notificationService.ts` requests permissions on first launch
- [ ] Morning reminder scheduled at configured time (default 09:00)
- [ ] Evening reminder scheduled at configured time (default 21:00)
- [ ] Notifications cancelled when setting is toggled off
- [ ] Android notification channel created with correct importance
- [ ] Settings screen toggles reflect current notification state

## 9. Theme System

- [ ] Light/dark/system theme options work in settings
- [ ] Colors, spacing, typography exported from `theme/index.ts`
- [ ] `commonStyles` presets used across card and button components
- [ ] No hardcoded colors in component files (all from theme)

## 10. Electron (Windows Desktop)

- [ ] `electron/main.js` creates BrowserWindow with correct dimensions
- [ ] `electron/preload.js` exposes `electronAPI` via contextBridge
- [ ] `electron/package.json` has electron-builder configuration
- [ ] NSIS installer config: desktop shortcut, start menu, install directory
- [ ] `npm run electron:dev` launches app in development mode
- [ ] `npm run electron:build` produces Windows installer

## 11. Tests

- [ ] `journalCalculations.test.ts` covers sleep, calorie, trend calculations
- [ ] `questionnaireScoring.test.ts` covers GAD-7 and PHQ-9 scoring
- [ ] `HomeScreen.test.tsx` verifies card rendering and mood selector
- [ ] `EmotionsCard.test.tsx` verifies modal open/close and selection
- [ ] `TodoListCard.test.tsx` verifies add, complete, delete operations
- [ ] `WeeklyCheckinScreen.test.tsx` verifies questionnaire flow
- [ ] `npm test` passes with all tests green
- [ ] Test coverage > 60% for utility functions

## 12. Code Quality

- [ ] `npm run lint` passes with no errors
- [ ] `npm run typecheck` passes with no errors
- [ ] No `any` types in production code
- [ ] No `console.log` in production code (warnings acceptable)
- [ ] All functions and complex types have JSDoc comments
- [ ] Consistent code formatting (Prettier validated)

## 13. Documentation

- [ ] `README.md` covers setup, scripts, structure, and features
- [ ] `ENV_SETUP.md` documents all environment variables
- [ ] `docs/ARCHITECTURE.md` describes project structure and data model
- [ ] `docs/DEPLOYMENT_IOS.md` has step-by-step EAS build instructions
- [ ] `docs/DEPLOYMENT_WINDOWS.md` has Electron build and signing instructions
- [ ] `docs/GIT_WORKFLOW.md` documents branching and commit conventions
- [ ] `docs/VALIDATION_CHECKLIST.md` is this file

## 14. Git & Repository

- [ ] `.gitignore` excludes node_modules, .expo, dist, .env, build artifacts
- [ ] No API keys, tokens, or secrets committed to the repository
- [ ] All files committed in logical units with conventional commit messages
- [ ] Code pushed to remote repository: `https://github.com/samink02/mood-tracker.git`
- [ ] Remote is set as `origin`

## 15. Medical & Privacy

- [ ] Medical disclaimer displayed in Settings and Weekly Check-in Results
- [ ] App Store description mentions screening tools are not diagnostic
- [ ] No user data is transmitted over the network (all local)
- [ ] AsyncStorage used for persistence (Keychain-backed on iOS)
- [ ] Privacy policy URL provided for App Store submission

## Pre-Release Final Checks

- [ ] Full `npm install` clean install on a fresh clone
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] App builds for web: `npx expo export --platform web`
- [ ] Electron wrapper loads the web build
- [ ] iOS build succeeds via EAS: `eas build --platform ios`
