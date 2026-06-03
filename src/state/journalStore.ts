/**
 * Journal Store
 * Zustand store for managing journal entries with AsyncStorage persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DailyJournalEntry,
  createEmptyDailyEntry,
  SleepEntry,
  Activity,
  MealEntry,
  Emotion,
  OverallMood,
} from '@/models/Journal';
import { calculateAggregates } from '@/utils/journalCalculations';

interface JournalState {
  entriesByDate: Record<string, DailyJournalEntry>;
  isLoading: boolean;
  error: string | null;
}

interface JournalActions {
  // Core CRUD operations
  upsertEntry: (entry: DailyJournalEntry) => void;
  getEntry: (date: string) => DailyJournalEntry | undefined;
  deleteEntry: (date: string) => void;
  getEntriesInRange: (startDate: string, endDate: string) => DailyJournalEntry[];
  getAllEntries: () => DailyJournalEntry[];
  getAllDates: () => string[];

  // Partial updates
  updateOverallMood: (date: string, mood: OverallMood) => void;
  updateSleep: (date: string, sleep: SleepEntry) => void;
  setEmotions: (date: string, emotions: Emotion[]) => void;
  addEmotion: (date: string, emotion: Emotion) => void;
  removeEmotion: (date: string, emotionId: string) => void;

  // Activity management
  addActivity: (date: string, activity: Activity) => void;
  updateActivity: (date: string, activityId: string, updates: Partial<Activity>) => void;
  deleteActivity: (date: string, activityId: string) => void;

  // Meal management
  addMeal: (date: string, meal: MealEntry, category: 'meals' | 'drinks' | 'snacksAndDesserts') => void;
  updateMeal: (
    date: string,
    category: 'meals' | 'drinks' | 'snacksAndDesserts',
    mealId: string,
    updates: Partial<MealEntry>
  ) => void;
  deleteMeal: (
    date: string,
    category: 'meals' | 'drinks' | 'snacksAndDesserts',
    mealId: string
  ) => void;

  // Utility functions
  ensureEntryExists: (date: string) => DailyJournalEntry;
  getTodayEntry: () => DailyJournalEntry;
  getLast7DaysEntries: () => DailyJournalEntry[];
  getThisWeekEntries: () => DailyJournalEntry[];
  getThisMonthEntries: () => DailyJournalEntry[];

  // State management
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type JournalStore = JournalState & JournalActions;

export const useJournalStore = create<JournalStore>()(
  persist(
    (set, get) => ({
      entriesByDate: {},
      isLoading: false,
      error: null,

      // Ensure an entry exists for a given date
      ensureEntryExists: (date: string) => {
        const state = get();
        if (!state.entriesByDate[date]) {
          const newEntry = createEmptyDailyEntry(date);
          set((state) => ({
            entriesByDate: { ...state.entriesByDate, [date]: newEntry },
          }));
          return newEntry;
        }
        return state.entriesByDate[date];
      },

      // Get today's entry, creating it if needed
      getTodayEntry: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().ensureEntryExists(today);
      },

      // Core CRUD operations
      upsertEntry: (entry: DailyJournalEntry) => {
        set((state) => ({
          entriesByDate: {
            ...state.entriesByDate,
            [entry.date]: entry,
          },
        }));
      },

      getEntry: (date: string) => {
        return get().entriesByDate[date];
      },

      deleteEntry: (date: string) => {
        set((state) => {
          const newEntries = { ...state.entriesByDate };
          delete newEntries[date];
          return { entriesByDate: newEntries };
        });
      },

      getEntriesInRange: (startDate: string, endDate: string) => {
        const state = get();
        const entries: DailyJournalEntry[] = [];

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Iterate through all dates in range
        const currentDate = new Date(start);
        while (currentDate <= end) {
          const dateStr = currentDate.toISOString().split('T')[0];
          if (state.entriesByDate[dateStr]) {
            entries.push(state.entriesByDate[dateStr]);
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return entries;
      },

      getAllEntries: () => {
        return Object.values(get().entriesByDate).sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      },

      getAllDates: () => {
        return Object.keys(get().entriesByDate).sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );
      },

      // Overall mood updates
      updateOverallMood: (date: string, mood: OverallMood) => {
        set((state) => {
          const entry = state.entriesByDate[date];
          if (!entry) return state;

          const updatedEntry = {
            ...entry,
            overallMood: mood,
          };

          return {
            entriesByDate: {
              ...state.entriesByDate,
              [date]: updatedEntry,
            },
          };
        });
      },

      // Sleep updates
      updateSleep: (date: string, sleep: SleepEntry) => {
        set((state) => {
          const entry = state.entriesByDate[date];
          if (!entry) return state;

          const updatedEntry = {
            ...entry,
            sleep,
            aggregates: calculateAggregates(
              entry.activities,
              entry.meals,
              entry.drinks,
              entry.snacksAndDesserts,
              sleep
            ),
          };

          return {
            entriesByDate: {
              ...state.entriesByDate,
              [date]: updatedEntry,
            },
          };
        });
      },

      // Emotion management
      setEmotions: (date: string, emotions: Emotion[]) => {
        set((state) => {
          const entry = state.entriesByDate[date];
          if (!entry) return state;

          const updatedEntry = {
            ...entry,
            emotions,
          };

          return {
            entriesByDate: {
              ...state.entriesByDate,
              [date]: updatedEntry,
            },
          };
        });
      },

      addEmotion: (date: string, emotion: Emotion) => {
        set((state) => {
          const entry = state.entriesByDate[date];
          if (!entry) return state;

          const updatedEntry = {
            ...entry,
            emotions: [...entry.emotions, emotion],
          };

          return {
            entriesByDate: {
              ...state.entriesByDate,
              [date]: updatedEntry,
            },
          };
        });
      },

      removeEmotion: (date: string, emotionId: string) => {
        set((state) => {
          const entry = state.entriesByDate[date];
          if (!entry) return state;

          const updatedEntry = {
            ...entry,
            emotions: entry.emotions.filter((e) => e.id !== emotionId),
          };

          return {
            entriesByDate: {
              ...state.entriesByDate,
              [date]: updatedEntry,
            },
          };
        });
      },

      // Activity management
      addActivity: (date: string, activity: Activity) => {
        set((state) => {
          const entry = state.entriesByDate[date];
          if (!entry) return state;

          const updatedActivity = { ...activity, date };
          const updatedActivities = [...entry.activities, updatedActivity];

          const updatedEntry = {
            ...entry,
            activities: updatedActivities,
            aggregates: calculateAggregates(
              updatedActivities,
              entry.meals,
              entry.drinks,
              entry.snacksAndDesserts,
              entry.sleep
            ),
          };

          return {
            entriesByDate: {
              ...state.entriesByDate,
              [date]: updatedEntry,
            },
          };
        });
      },

      updateActivity: (date: string, activityId: string, updates: Partial<Activity>) => {
        set((state) => {
          const entry = state.entriesByDate[date];
          if (!entry) return state;

          const updatedActivities = entry.activities.map((activity) =>
            activity.id === activityId ? { ...activity, ...updates } : activity
          );

          const updatedEntry = {
            ...entry,
            activities: updatedActivities,
            aggregates: calculateAggregates(
              updatedActivities,
              entry.meals,
              entry.drinks,
              entry.snacksAndDesserts,
              entry.sleep
            ),
          };

          return {
            entriesByDate: {
              ...state.entriesByDate,
              [date]: updatedEntry,
            },
          };
        });
      },

      deleteActivity: (date: string, activityId: string) => {
        set((state) => {
          const entry = state.entriesByDate[date];
          if (!entry) return state;

          const updatedActivities = entry.activities.filter((activity) => activity.id !== activityId);

          const updatedEntry = {
            ...entry,
            activities: updatedActivities,
            aggregates: calculateAggregates(
              updatedActivities,
              entry.meals,
              entry.drinks,
              entry.snacksAndDesserts,
              entry.sleep
            ),
          };

          return {
            entriesByDate: {
              ...state.entriesByDate,
              [date]: updatedEntry,
            },
          };
        });
      },

      // Meal management
      addMeal: (date: string, meal: MealEntry, category: 'meals' | 'drinks' | 'snacksAndDesserts') => {
        set((state) => {
          const entry = state.entriesByDate[date];
          if (!entry) return state;

          const updatedMeal = { ...meal, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) };
          const updatedCategory = [...entry[category], updatedMeal];

          const updatedEntry = {
            ...entry,
            [category]: updatedCategory,
            aggregates: calculateAggregates(
              entry.activities,
              category === 'meals' ? updatedCategory : entry.meals,
              category === 'drinks' ? updatedCategory : entry.drinks,
              category === 'snacksAndDesserts' ? updatedCategory : entry.snacksAndDesserts,
              entry.sleep
            ),
          };

          return {
            entriesByDate: {
              ...state.entriesByDate,
              [date]: updatedEntry,
            },
          };
        });
      },

      updateMeal: (
        date: string,
        category: 'meals' | 'drinks' | 'snacksAndDesserts',
        mealId: string,
        updates: Partial<MealEntry>
      ) => {
        set((state) => {
          const entry = state.entriesByDate[date];
          if (!entry) return state;

          const updatedCategory = entry[category].map((meal) =>
            meal.id === mealId ? { ...meal, ...updates } : meal
          );

          const updatedEntry = {
            ...entry,
            [category]: updatedCategory,
            aggregates: calculateAggregates(
              entry.activities,
              category === 'meals' ? updatedCategory : entry.meals,
              category === 'drinks' ? updatedCategory : entry.drinks,
              category === 'snacksAndDesserts' ? updatedCategory : entry.snacksAndDesserts,
              entry.sleep
            ),
          };

          return {
            entriesByDate: {
              ...state.entriesByDate,
              [date]: updatedEntry,
            },
          };
        });
      },

      deleteMeal: (
        date: string,
        category: 'meals' | 'drinks' | 'snacksAndDesserts',
        mealId: string
      ) => {
        set((state) => {
          const entry = state.entriesByDate[date];
          if (!entry) return state;

          const updatedCategory = entry[category].filter((meal) => meal.id !== mealId);

          const updatedEntry = {
            ...entry,
            [category]: updatedCategory,
            aggregates: calculateAggregates(
              entry.activities,
              category === 'meals' ? updatedCategory : entry.meals,
              category === 'drinks' ? updatedCategory : entry.drinks,
              category === 'snacksAndDesserts' ? updatedCategory : entry.snacksAndDesserts,
              entry.sleep
            ),
          };

          return {
            entriesByDate: {
              ...state.entriesByDate,
              [date]: updatedEntry,
            },
          };
        });
      },

      // Utility functions
      getLast7DaysEntries: () => {
        const today = new Date();
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 6);

        return get().getEntriesInRange(
          last7Days.toISOString().split('T')[0],
          today.toISOString().split('T')[0]
        );
      },

      getThisWeekEntries: () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

        return get().getEntriesInRange(
          startOfWeek.toISOString().split('T')[0],
          today.toISOString().split('T')[0]
        );
      },

      getThisMonthEntries: () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        return get().getEntriesInRange(
          startOfMonth.toISOString().split('T')[0],
          today.toISOString().split('T')[0]
        );
      },

      // State management
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);