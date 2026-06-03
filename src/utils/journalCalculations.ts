/**
 * Journal Calculation Utilities
 * Helper functions for calculating journal entry statistics
 */

import { SleepEntry, Activity, MealEntry, JournalAggregates } from '@/models/Journal';

/**
 * Calculate total sleep hours from sleep entry
 * @param sleepEntry Sleep entry with fellAsleepAt and wokeUpAt timestamps
 * @returns Total hours of sleep (handles overnight sleep)
 */
export const calculateSleepHours = (sleepEntry: SleepEntry): number => {
  const { fellAsleepAt, wokeUpAt } = sleepEntry;

  let fellAsleep = new Date(fellAsleepAt);
  let wokeUp = new Date(wokeUpAt);

  // If woke up time is before fell asleep time, assume it's the next day
  if (wokeUp <= fellAsleep) {
    wokeUp = new Date(wokeUp.getTime() + 24 * 60 * 60 * 1000);
  }

  const timeDifference = wokeUp.getTime() - fellAsleep.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  // Round to 2 decimal places
  return Math.round(hoursDifference * 100) / 100;
};

/**
 * Calculate aggregates from journal entry data
 * @param activities Array of activities
 * @param meals Array of meals
 * @param drinks Array of drinks
 * @param snacks Array of snacks
 * @param sleep Sleep entry
 * @returns Aggregated statistics
 */
export const calculateAggregates = (
  activities: Activity[],
  meals: MealEntry[],
  drinks: MealEntry[],
  snacks: MealEntry[],
  sleep: SleepEntry
): JournalAggregates => {
  const totalSleepHours = calculateSleepHours(sleep);

  const totalActivities = activities.length;
  const totalExhaustion = activities.reduce((sum, activity) => sum + activity.exhaustion, 0);

  const totalMeals = meals.length;
  const totalDrinks = drinks.length;
  const totalSnacks = snacks.length;

  const totalCalories =
    sumCalories(meals) + sumCalories(drinks) + sumCalories(snacks);

  return {
    totalSleepHours,
    totalActivities,
    totalExhaustion,
    totalMeals,
    totalDrinks,
    totalSnacks,
    totalCalories,
  };
};

/**
 * Helper function to sum calories from meal entries
 * @param meals Array of meal entries
 * @returns Total calories
 */
export const sumCalories = (meals: MealEntry[]): number => {
  return meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
};

/**
 * Calculate average exhaustion from activities
 * @param activities Array of activities
 * @returns Average exhaustion (0 if no activities)
 */
export const calculateAverageExhaustion = (activities: Activity[]): number => {
  if (activities.length === 0) return 0;
  const totalExhaustion = activities.reduce((sum, activity) => sum + activity.exhaustion, 0);
  return Math.round((totalExhaustion / activities.length) * 100) / 100;
};

/**
 * Filter activities by specific date
 * @param activities Array of activities
 * @param date Filter date string (ISO format)
 * @returns Filtered activities
 */
export const filterActivitiesByDate = (activities: Activity[], date: string): Activity[] => {
  return activities.filter((activity) => activity.date === date);
};

/**
 * Filter meals by time of day
 * @param meals Array of meal entries
 * @param timeOfDay Time of day filter
 * @returns Filtered meals
 */
export const filterMealsByTimeOfDay = (
  meals: MealEntry[],
  timeOfDay: 'morning' | 'lunch' | 'dinner' | 'snack'
): MealEntry[] => {
  return meals.filter((meal) => meal.timeOfDay === timeOfDay);
};

/**
 * Calculate total hours spent on activities
 * @param activities Array of activities
 * @returns Total hours
 */
export const calculateTotalActivityHours = (activities: Activity[]): number => {
  const totalHours = activities.reduce((sum, activity) => sum + activity.hoursOut, 0);
  return Math.round(totalHours * 100) / 100;
};

/**
 * Get activities sorted by exhaustion level (highest first)
 * @param activities Array of activities
 * @returns Sorted activities
 */
export const getActivitiesByExhaustion = (activities: Activity[]): Activity[] => {
  return [...activities].sort((a, b) => b.exhaustion - a.exhaustion);
};

/**
 * Get calorie distribution by meal category
 * @param meals Array of meals
 * @param drinks Array of drinks
 * @param snacks Array of snacks
 * @returns Object with calories by category
 */
export const getCalorieDistribution = (
  meals: MealEntry[],
  drinks: MealEntry[],
  snacks: MealEntry[]
) => {
  return {
    meals: sumCalories(meals),
    drinks: sumCalories(drinks),
    snacks: sumCalories(snacks),
    total: sumCalories(meals) + sumCalories(drinks) + sumCalories(snacks),
  };
};

/**
 * Calculate sleep quality score based on duration
 * @param hours Sleep hours
 * @returns Quality score (0-100)
 */
export const calculateSleepQuality = (hours: number): number => {
  if (hours < 4) return 20; // Poor
  if (hours < 6) return 40; // Below average
  if (hours >= 6 && hours <= 8) return 100; // Ideal
  if (hours > 8 && hours <= 10) return 80; // Good but excessive
  return 60; // Excessive
};

/**
 * Get mood trend over time
 * @param entries Array of journal entries with dates and moods
 * @returns Array of date and mood pairs
 */
export const getMoodTrend = (
  entries: Array<{ date: string; overallMood: number }>
): Array<{ date: string; mood: number }> => {
  return entries
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: entry.date,
      mood: entry.overallMood,
    }));
};

/**
 * Get sleep trend over time
 * @param entries Array of journal entries with dates and sleep hours
 * @returns Array of date and sleep hours pairs
 */
export const getSleepTrend = (
  entries: Array<{ date: string; totalSleepHours: number }>
): Array<{ date: string; hours: number }> => {
  return entries
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: entry.date,
      hours: entry.totalSleepHours,
    }));
};

/**
 * Calculate calorie trend over time
 * @param entries Array of journal entries with dates and total calories
 * @returns Array of date and calorie pairs
 */
export const getCalorieTrend = (
  entries: Array<{ date: string; totalCalories: number }>
): Array<{ date: string; calories: number }> => {
  return entries
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: entry.date,
      calories: entry.totalCalories,
    }));
};

/**
 * Calculate activity trends over time
 * @param entries Array of journal entries with dates and activity data
 * @returns Object with different activity trends
 */
export const getActivityTrends = (
  entries: Array<{
    date: string;
    totalActivities: number;
    totalExhaustion: number;
  }>
) => {
  const sortedEntries = entries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return {
    activityCount: sortedEntries.map((entry) => ({
      date: entry.date,
      count: entry.totalActivities,
    })),
    exhaustion: sortedEntries.map((entry) => ({
      date: entry.date,
      exhaustion: entry.totalExhaustion,
    })),
  };
};

/**
 * Validate sleep entry data
 * @param sleepEntry Sleep entry to validate
 * @returns True if valid, error message if invalid
 */
export const validateSleepEntry = (
  sleepEntry: SleepEntry
): { valid: boolean; error?: string } => {
  const { fellAsleepAt, wokeUpAt } = sleepEntry;

  if (!fellAsleepAt || !wokeUpAt) {
    return { valid: false, error: 'Both fall asleep and wake up times are required' };
  }

  const fellAsleep = new Date(fellAsleepAt);
  const wokeUp = new Date(wokeUpAt);

  if (isNaN(fellAsleep.getTime()) || isNaN(wokeUp.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }

  // Check for reasonable sleep duration (0-24 hours)
  let sleepHours = calculateSleepHours(sleepEntry);
  if (sleepHours < 0 || sleepHours > 24) {
    return { valid: false, error: 'Sleep duration must be between 0 and 24 hours' };
  }

  return { valid: true };
};

/**
 * Validate activity data
 * @param activity Activity to validate
 * @returns True if valid, error message if invalid
 */
export const validateActivity = (
  activity: Activity
): { valid: boolean; error?: string } => {
  if (!activity.name || activity.name.trim() === '') {
    return { valid: false, error: 'Activity name is required' };
  }

  if (activity.hoursOut < 0 || activity.hoursOut > 24) {
    return { valid: false, error: 'Hours out must be between 0 and 24' };
  }

  if (activity.exhaustion < 1 || activity.exhaustion > 10) {
    return { valid: false, error: 'Exhaustion must be between 1 and 10' };
  }

  if (!activity.date) {
    return { valid: false, error: 'Activity date is required' };
  }

  return { valid: true };
};

/**
 * Validate meal entry data
 * @param meal Meal entry to validate
 * @returns True if valid, error message if invalid
 */
export const validateMealEntry = (
  meal: MealEntry
): { valid: boolean; error?: string } => {
  if (!meal.name || meal.name.trim() === '') {
    return { valid: false, error: 'Meal name is required' };
  }

  if (!meal.quantity) {
    return { valid: false, error: 'Quantity is required' };
  }

  if (meal.calories !== undefined && (meal.calories < 0 || meal.calories > 10000)) {
    return { valid: false, error: 'Calories must be between 0 and 10000' };
  }

  return { valid: true };
};