/**
 * Journal Data Models
 * TypeScript interfaces and types for journal entries
 */

// Overall mood enum with numeric values for scoring
export enum OverallMood {
  Sad = 1,
  Angry = 2,
  Happy = 3,
  Neutral = 4,
}

// Emotion category classification
export enum EmotionCategory {
  Positive = 'positive',
  Negative = 'negative',
  Neutral = 'neutral',
  Complex = 'complex',
}

// Individual emotion with category
export interface Emotion {
  id: string;
  name: string;
  category: EmotionCategory;
  emoji?: string;
}

// Sleep entry with duration calculation
export interface SleepEntry {
  fellAsleepAt: Date;
  wokeUpAt: Date;
}

// Activity with exhaustion tracking
export interface Activity {
  id: string;
  name: string;
  hoursOut: number;
  exhaustion: number; // 1-10 scale
  note?: string;
  address?: string;
  todoItemCompleted?: boolean;
  date: string; // ISO date string
}

// Meal entry for tracking food intake
export interface MealEntry {
  id: string;
  name: string;
  quantity: string | number;
  calories?: number;
  timeOfDay?: 'morning' | 'lunch' | 'dinner' | 'snack';
}

// Aggregated statistics for performance
export interface JournalAggregates {
  totalSleepHours: number;
  totalActivities: number;
  totalExhaustion: number;
  totalMeals: number;
  totalDrinks: number;
  totalSnacks: number;
  totalCalories: number;
}

// Main daily journal entry
export interface DailyJournalEntry {
  date: string; // ISO date string (YYYY-MM-DD) as primary key
  emotions: Emotion[];
  overallMood: OverallMood;
  sleep: SleepEntry;
  activities: Activity[];
  meals: MealEntry[];
  drinks: MealEntry[];
  snacksAndDesserts: MealEntry[];
  aggregates: JournalAggregates;
}

// Helper function to create a new daily entry
export const createEmptyDailyEntry = (date: string): DailyJournalEntry => {
  const today = new Date();
  const fellAsleepTime = new Date(today.setHours(23, 0, 0, 0));
  const wokeUpTime = new Date(today.setHours(7, 0, 0, 0));

  return {
    date,
    emotions: [],
    overallMood: OverallMood.Neutral,
    sleep: {
      fellAsleepAt: fellAsleepTime,
      wokeUpAt: wokeUpTime,
    },
    activities: [],
    meals: [],
    drinks: [],
    snacksAndDesserts: [],
    aggregates: {
      totalSleepHours: 8,
      totalActivities: 0,
      totalExhaustion: 0,
      totalMeals: 0,
      totalDrinks: 0,
      totalSnacks: 0,
      totalCalories: 0,
    },
  };
};

// Comprehensive list of emotions organized by category
export const EMOTION_LIST: Emotion[] = [
  // Positive emotions
  { id: 'happy', name: 'Happy', category: EmotionCategory.Positive, emoji: '😊' },
  { id: 'excited', name: 'Excited', category: EmotionCategory.Positive, emoji: '🤩' },
  { id: 'grateful', name: 'Grateful', category: EmotionCategory.Positive, emoji: '🙏' },
  { id: 'calm', name: 'Calm', category: EmotionCategory.Positive, emoji: '😌' },
  { id: 'confident', name: 'Confident', category: EmotionCategory.Positive, emoji: '💪' },
  { id: 'optimistic', name: 'Optimistic', category: EmotionCategory.Positive, emoji: '🌟' },
  { id: 'satisfied', name: 'Satisfied', category: EmotionCategory.Positive, emoji: '😌' },
  { id: 'inspired', name: 'Inspired', category: EmotionCategory.Positive, emoji: '✨' },

  // Negative emotions
  { id: 'sad', name: 'Sad', category: EmotionCategory.Negative, emoji: '😢' },
  { id: 'anxious', name: 'Anxious', category: EmotionCategory.Negative, emoji: '😰' },
  { id: 'angry', name: 'Angry', category: EmotionCategory.Negative, emoji: '😠' },
  { id: 'frustrated', name: 'Frustrated', category: EmotionCategory.Negative, emoji: '😤' },
  { id: 'tired', name: 'Tired', category: EmotionCategory.Negative, emoji: '😩' },
  { id: 'lonely', name: 'Lonely', category: EmotionCategory.Negative, emoji: '😔' },
  { id: 'overwhelmed', name: 'Overwhelmed', category: EmotionCategory.Negative, emoji: '😵' },
  { id: 'disappointed', name: 'Disappointed', category: EmotionCategory.Negative, emoji: '😞' },

  // Neutral emotions
  { id: 'neutral', name: 'Neutral', category: EmotionCategory.Neutral, emoji: '😐' },
  { id: 'bored', name: 'Bored', category: EmotionCategory.Neutral, emoji: '😑' },
  { id: 'curious', name: 'Curious', category: EmotionCategory.Neutral, emoji: '🤔' },
  { id: 'focused', name: 'Focused', category: EmotionCategory.Neutral, emoji: '🎯' },
  { id: 'thoughtful', name: 'Thoughtful', category: EmotionCategory.Neutral, emoji: '🤔' },

  // Complex emotions
  { id: 'conflicted', name: 'Conflicted', category: EmotionCategory.Complex, emoji: '😕' },
  { id: 'nostalgic', name: 'Nostalgic', category: EmotionCategory.Complex, emoji: '😌' },
  { id: 'hopeful', name: 'Hopeful', category: EmotionCategory.Complex, emoji: '🌈' },
  { id: 'appreciative', name: 'Appreciative', category: EmotionCategory.Complex, emoji: '🤗' },
];

// Helper to get mood display information
export const getMoodInfo = (mood: OverallMood) => {
  switch (mood) {
    case OverallMood.Happy:
      return { emoji: '😊', label: 'Happy', color: '#4CAF50' };
    case OverallMood.Sad:
      return { emoji: '😢', label: 'Sad', color: '#2196F3' };
    case OverallMood.Angry:
      return { emoji: '😠', label: 'Angry', color: '#F44336' };
    case OverallMood.Neutral:
      return { emoji: '😐', label: 'Neutral', color: '#9E9E9E' };
    default:
      return { emoji: '😐', label: 'Neutral', color: '#9E9E9E' };
  }
};

// Helper to format date for display
export const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper to format time for display
export const formatTimeDisplay = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};