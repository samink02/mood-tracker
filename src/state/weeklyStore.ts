/**
 * Weekly Store
 * Zustand store for managing weekly check-in data (GAD-7 and PHQ-9 scores)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  calculateGad7Score,
  calculatePhq9Score,
  getGad7Severity,
  getPhq9Severity,
} from '@/utils/questionnaireScoring';

export interface WeeklyCheckin {
  id: string;
  weekStartDate: string; // ISO date of the Sunday (start of week)
  gad7Responses: number[]; // 7 responses (0-3 each)
  gad7Score: number;
  gad7Severity: ReturnType<typeof getGad7Severity>;
  phq9Responses: number[]; // 9 responses (0-3 each)
  phq9Score: number;
  phq9Severity: ReturnType<typeof getPhq9Severity>;
  completedAt: string; // ISO timestamp
  notes?: string;
}

interface WeeklyState {
  checkins: WeeklyCheckin[];
  currentGad7Responses: number[];
  currentPhq9Responses: number[];
  isCheckinInProgress: boolean;
  isLoading: boolean;
  error: string | null;
}

interface WeeklyActions {
  // Check-in operations
  startCheckin: () => void;
  setGad7Response: (questionIndex: number, value: number) => void;
  setPhq9Response: (questionIndex: number, value: number) => void;
  completeCheckin: (notes?: string) => void;
  cancelCheckin: () => void;

  // Query operations
  getCheckinByWeekStart: (weekStart: string) => WeeklyCheckin | undefined;
  getCheckinsInRange: (startDate: string, endDate: string) => WeeklyCheckin[];
  getLatestCheckin: () => WeeklyCheckin | undefined;
  getGad7Trend: () => Array<{ date: string; score: number }>;
  getPhq9Trend: () => Array<{ date: string; score: number }>;
  hasCheckinThisWeek: () => boolean;

  // Delete operations
  deleteCheckin: (id: string) => void;

  // State management
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type WeeklyStore = WeeklyState & WeeklyActions;

const getWeekStartDate = (date: Date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day); // Go back to Sunday
  return d.toISOString().split('T')[0];
};

export const useWeeklyStore = create<WeeklyStore>()(
  persist(
    (set, get) => ({
      checkins: [],
      currentGad7Responses: new Array(7).fill(-1), // -1 = not answered
      currentPhq9Responses: new Array(9).fill(-1),
      isCheckinInProgress: false,
      isLoading: false,
      error: null,

      // Start a new check-in
      startCheckin: () => {
        set({
          currentGad7Responses: new Array(7).fill(-1),
          currentPhq9Responses: new Array(9).fill(-1),
          isCheckinInProgress: true,
          error: null,
        });
      },

      // Set GAD-7 response for a specific question
      setGad7Response: (questionIndex: number, value: number) => {
        set((state) => {
          const newResponses = [...state.currentGad7Responses];
          newResponses[questionIndex] = value;
          return { currentGad7Responses: newResponses };
        });
      },

      // Set PHQ-9 response for a specific question
      setPhq9Response: (questionIndex: number, value: number) => {
        set((state) => {
          const newResponses = [...state.currentPhq9Responses];
          newResponses[questionIndex] = value;
          return { currentPhq9Responses: newResponses };
        });
      },

      // Complete the check-in and save scores
      completeCheckin: (notes?: string) => {
        const state = get();

        // Validate all responses are filled
        const gad7Filled = state.currentGad7Responses.every((r) => r >= 0 && r <= 3);
        const phq9Filled = state.currentPhq9Responses.every((r) => r >= 0 && r <= 3);

        if (!gad7Filled || !phq9Filled) {
          set({ error: 'Please answer all questions before submitting.' });
          return;
        }

        try {
          const gad7Score = calculateGad7Score(state.currentGad7Responses);
          const gad7Severity = getGad7Severity(gad7Score);

          const phq9Score = calculatePhq9Score(state.currentPhq9Responses);
          const phq9Severity = getPhq9Severity(phq9Score);

          const weekStartDate = getWeekStartDate();

          const checkin: WeeklyCheckin = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            weekStartDate,
            gad7Responses: [...state.currentGad7Responses],
            gad7Score,
            gad7Severity,
            phq9Responses: [...state.currentPhq9Responses],
            phq9Score,
            phq9Severity,
            completedAt: new Date().toISOString(),
            notes,
          };

          set((state) => ({
            checkins: [...state.checkins, checkin],
            isCheckinInProgress: false,
            currentGad7Responses: new Array(7).fill(-1),
            currentPhq9Responses: new Array(9).fill(-1),
            error: null,
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      // Cancel the current check-in
      cancelCheckin: () => {
        set({
          isCheckinInProgress: false,
          currentGad7Responses: new Array(7).fill(-1),
          currentPhq9Responses: new Array(9).fill(-1),
          error: null,
        });
      },

      // Get check-in by week start date
      getCheckinByWeekStart: (weekStart: string) => {
        return get().checkins.find((c) => c.weekStartDate === weekStart);
      },

      // Get check-ins in a date range
      getCheckinsInRange: (startDate: string, endDate: string) => {
        return get()
          .checkins.filter((c) => c.weekStartDate >= startDate && c.weekStartDate <= endDate)
          .sort((a, b) => new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime());
      },

      // Get the latest check-in
      getLatestCheckin: () => {
        const checkins = get().checkins;
        if (checkins.length === 0) return undefined;
        return checkins.sort(
          (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        )[0];
      },

      // Get GAD-7 score trend over time
      getGad7Trend: () => {
        return get()
          .checkins.sort(
            (a, b) => new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime()
          )
          .map((c) => ({ date: c.weekStartDate, score: c.gad7Score }));
      },

      // Get PHQ-9 score trend over time
      getPhq9Trend: () => {
        return get()
          .checkins.sort(
            (a, b) => new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime()
          )
          .map((c) => ({ date: c.weekStartDate, score: c.phq9Score }));
      },

      // Check if a check-in already exists for this week
      hasCheckinThisWeek: () => {
        const weekStart = getWeekStartDate();
        return get().checkins.some((c) => c.weekStartDate === weekStart);
      },

      // Delete a check-in
      deleteCheckin: (id: string) => {
        set((state) => ({
          checkins: state.checkins.filter((c) => c.id !== id),
        }));
      },

      // Set loading state
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // Set error state
      setError: (error: string | null) => {
        set({ error });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'weekly-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);