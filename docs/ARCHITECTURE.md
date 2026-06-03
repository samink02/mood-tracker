# Architecture

## Overview

Mood Tracker is a cross-platform journaling and mood-tracking application built with **React Native + Expo (managed workflow)** and **TypeScript**. It targets iOS via EAS Build and Windows desktop via an Electron wrapper around the Expo web build.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React Native + Expo | Cross-platform UI |
| Language | TypeScript (strict) | Type safety |
| Navigation | React Navigation 7 | Stack + Tab navigation |
| State | Zustand 5 | Lightweight state management |
| Persistence | AsyncStorage | Local data storage |
| Charts | Victory Native | Trend visualization |
| Animations | react-native-reanimated | Smooth card animations |
| Notifications | expo-notifications | Daily reminders |
| Desktop | Electron 33 | Windows/macOS/Linux wrapper |
| Testing | Jest + RNTL | Unit & component tests |
| Linting | ESLint + Prettier | Code quality |

## Project Structure

```
mood-tracker/
├── App.tsx                    # Root component, wires navigation + notifications
├── app.config.ts              # Expo configuration (typed)
├── index.ts                   # Expo entry point
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript config with @/ path aliases
├── jest.config.js             # Jest configuration
├── jest.setup.js              # Jest mocks
├── .eslintrc.js               # ESLint rules
├── .prettierrc                # Prettier formatting
├── .env.example               # Environment variable template
├── assets/                    # Static assets (icons, splash)
├── docs/                      # Documentation
├── electron/                  # Electron desktop wrapper
│   ├── main.js                # Electron main process
│   ├── preload.js             # Context bridge
│   └── package.json           # Electron dependencies
└── src/
    ├── models/                # Data models & types
    │   ├── Journal.ts         # DailyJournalEntry, Emotion, Sleep, etc.
    │   └── Todo.ts            # TodoItem, status helpers, validation
    ├── state/                 # Zustand stores
    │   ├── journalStore.ts    # Journal entries CRUD + aggregates
    │   ├── todoStore.ts       # To-do list with rollover
    │   ├── weeklyStore.ts     # GAD-7 / PHQ-9 check-ins
    │   └── settingsStore.ts   # Theme, notification preferences
    ├── utils/                 # Pure functions
    │   ├── journalCalculations.ts  # Sleep, calorie, trend calculations
    │   └── questionnaireScoring.ts # GAD-7 / PHQ-9 scoring logic
    ├── services/
    │   └── notificationService.ts  # expo-notifications scheduling
    ├── navigation/
    │   └── AppNavigator.tsx   # Tab + Stack navigation
    ├── screens/
    │   ├── HomeScreen.tsx     # Main journal screen
    │   ├── TrendsScreen.tsx   # Charts & trends
    │   ├── WeeklyCheckinScreen.tsx  # GAD-7 / PHQ-9
    │   └── SettingsScreen.tsx # Settings & notification config
    ├── components/
    │   ├── SummaryCard.tsx    # Daily overview card
    │   ├── SleepCard.tsx      # Sleep entry card
    │   ├── EmotionsCard.tsx   # Emotion picker card
    │   ├── ActivitiesCard.tsx # Activity list card
    │   ├── MealsCard.tsx      # Meals/drinks/snacks card
    │   ├── MoodSelector.tsx   # Overall mood picker
    │   ├── DateSelector.tsx   # Date navigation bar
    │   └── TodoListCard.tsx   # To-do list with rollover
    ├── theme/
    │   ├── colors.ts          # Color palette & semantic tokens
    │   ├── spacing.ts         # Spacing scale & breakpoints
    │   ├── typography.ts      # Font sizes, weights, styles
    │   └── index.ts           # Central export + commonStyles
    └── tests/                 # Test files
        ├── journalCalculations.test.ts
        ├── questionnaireScoring.test.ts
        ├── HomeScreen.test.tsx
        ├── EmotionsCard.test.tsx
        ├── TodoListCard.test.tsx
        └── WeeklyCheckinScreen.test.tsx
```

## Data Model

### DailyJournalEntry

The core entity. Each entry is keyed by date string (YYYY-MM-DD).

```typescript
interface DailyJournalEntry {
  date: string;                    // Primary key, YYYY-MM-DD
  overallMood: OverallMood | null; // Happy/Neutral/Sad/Angry
  emotions: Emotion[];             // Selected emotions with categories
  sleep: SleepEntry | null;        // Fell-asleep / woke-up times
  activities: Activity[];          // Name, hours, exhaustion, note
  meals: MealEntry[];              // Breakfast/lunch/dinner entries
  drinks: MealEntry[];             // Beverage entries
  snacksAndDesserts: MealEntry[];  // Snack entries
  aggregates: JournalAggregates;   // Auto-calculated totals
}
```

### WeeklyCheckin

Stores GAD-7 and PHQ-9 questionnaire results per week.

```typescript
interface WeeklyCheckin {
  weekStartDate: string;    // ISO date of the week's Sunday
  gad7Responses: number[];  // 7 items, 0-3 each
  gad7Score: number;        // 0-21
  gad7Severity: string;     // Minimal/Mild/Moderate/Severe
  phq9Responses: number[];  // 9 items, 0-3 each
  phq9Score: number;        // 0-27
  phq9Severity: string;     // None/Mild/Moderate/Moderately Severe/Severe
  completedAt: string;      // ISO timestamp
}
```

### TodoItem

Task with status tracking and rollover behavior.

```typescript
interface TodoItem {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;     // 'not started' | 'in progress' | 'ongoing' | 'on hold' | 'done'
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  dueDate: string | null;
}
```

## State Management

All state is managed via Zustand stores with `persist` middleware backed by AsyncStorage:

| Store | Key | Purpose |
|-------|-----|---------|
| `journalStore` | `journal-store` | CRUD for daily entries, aggregate recalculation |
| `todoStore` | `todo-store` | To-do items with filtering & search |
| `weeklyStore` | `weekly-checkin-store` | GAD-7/PHQ-9 check-in workflow |
| `settingsStore` | `settings-store` | Theme, notification preferences, first-launch flag |

Each store follows the same pattern:
1. Define an interface for the state shape
2. Create the store with `create` + `persist`
3. Actions mutate state; Zustand auto-triggers re-renders
4. Aggregates are recalculated on every mutation (journal store)

## Navigation Flow

```
RootStack
├── MainTabs (Bottom Tab Navigator)
│   ├── HomeTab → HomeScreen
│   │   └── DateSelector, SummaryCard, MoodSelector,
│   │       SleepCard, EmotionsCard, ActivitiesCard,
│   │       MealsCard ×3, TodoListCard
│   ├── TrendsTab → TrendsScreen
│   │   └── Bar charts for sleep, mood, calories, GAD-7, PHQ-9
│   └── SettingsTab → SettingsScreen
│       └── Theme, notifications, data management, about
└── WeeklyCheckin → WeeklyCheckinScreen
    └── GAD-7 step → PHQ-9 step → Results step
```

## Notification System

Uses `expo-notifications` for local scheduled notifications:

1. **Initialization**: `initializeNotifications()` called in App.tsx on mount
2. **Permissions**: Requested on first launch via `requestNotificationPermissions()`
3. **Scheduling**: `scheduleAllNotifications()` creates daily repeating triggers
4. **Morning reminder**: Default 09:00, configurable in Settings
5. **Evening reminder**: Default 21:00, configurable in Settings
6. **Android channel**: `journal-reminders` channel with default importance

## Electron Desktop Wrapper

The Electron wrapper loads the Expo web build:

1. Build the web bundle: `npx expo export --platform web`
2. Electron's `main.js` loads `dist/index.html`
3. Preload script exposes `window.electronAPI` for platform detection
4. Window size: 1200×900, min 800×600
5. Full application menu with File/Edit/View/Help

## Testing Strategy

| Type | Tool | Scope |
|------|------|-------|
| Unit tests | Jest | Pure functions (calculations, scoring) |
| Component tests | RNTL | Screen components, user interactions |
| Integration | Jest | Store actions + state updates |
| Type checking | tsc | Compile-time correctness |

Tests live in `src/tests/` and use `@/` path aliases resolved by Jest config.

## Security Considerations

- No network requests by default (all data is local)
- AsyncStorage encrypts on iOS (Keychain), plaintext on Android
- Environment variables via `.env` (not committed to git)
- Electron sandbox mode with context isolation
- No analytics or tracking by default
