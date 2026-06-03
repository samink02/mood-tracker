/**
 * Tests for journal calculation utilities
 */

import {
  calculateSleepHours,
  calculateAggregates,
  sumCalories,
  calculateAverageExhaustion,
  calculateSleepQuality,
  getMoodTrend,
  getSleepTrend,
  validateSleepEntry,
  validateActivity,
  validateMealEntry,
} from '@/utils/journalCalculations';
import { SleepEntry, Activity, MealEntry, OverallMood } from '@/models/Journal';

// ─── Helper factories ──────────────────────────────────────────────────────

const makeSleepEntry = (fellAsleepAt: Date, wokeUpAt: Date): SleepEntry => ({
  fellAsleepAt,
  wokeUpAt,
});

const makeActivity = (overrides: Partial<Activity> = {}): Activity => ({
  id: '1',
  name: 'Running',
  hoursOut: 1,
  exhaustion: 7,
  note: '',
  date: '2024-01-15',
  ...overrides,
});

const makeMeal = (overrides: Partial<MealEntry> = {}): MealEntry => ({
  id: '1',
  name: 'Oatmeal',
  quantity: 1,
  calories: 300,
  timeOfDay: 'morning',
  ...overrides,
});

// ─── calculateSleepHours ───────────────────────────────────────────────────

describe('calculateSleepHours', () => {
  it('calculates overnight sleep (23:00 – 07:00 = 8 hours)', () => {
    const sleep = makeSleepEntry(
      new Date('2024-01-15T23:00:00'),
      new Date('2024-01-16T07:00:00')
    );
    expect(calculateSleepHours(sleep)).toBe(8);
  });

  it('calculates daytime nap (13:00 – 14:30 = 1.5 hours)', () => {
    const sleep = makeSleepEntry(
      new Date('2024-01-15T13:00:00'),
      new Date('2024-01-15T14:30:00')
    );
    expect(calculateSleepHours(sleep)).toBe(1.5);
  });

  it('calculates short sleep (00:30 – 06:30 = 6 hours)', () => {
    const sleep = makeSleepEntry(
      new Date('2024-01-15T00:30:00'),
      new Date('2024-01-15T06:30:00')
    );
    expect(calculateSleepHours(sleep)).toBe(6);
  });

  it('handles midnight exactly (00:00 – 08:00 = 8 hours)', () => {
    const sleep = makeSleepEntry(
      new Date('2024-01-15T00:00:00'),
      new Date('2024-01-15T08:00:00')
    );
    expect(calculateSleepHours(sleep)).toBe(8);
  });

  it('handles late bed / early wake (02:00 – 06:00 = 4 hours)', () => {
    const sleep = makeSleepEntry(
      new Date('2024-01-15T02:00:00'),
      new Date('2024-01-15T06:00:00')
    );
    expect(calculateSleepHours(sleep)).toBe(4);
  });

  it('returns 24 for same time (overnight wrap-around)', () => {
    const sleep = makeSleepEntry(
      new Date('2024-01-15T22:00:00'),
      new Date('2024-01-15T22:00:00')
    );
    // Same time means the algorithm adds 24h for the next day
    const hours = calculateSleepHours(sleep);
    expect(hours).toBe(24);
  });
});

// ─── sumCalories ────────────────────────────────────────────────────────────

describe('sumCalories', () => {
  it('sums calories from meal entries', () => {
    const meals: MealEntry[] = [
      makeMeal({
        id: '1',
        name: 'Oatmeal',
        calories: 300,
        timeOfDay: 'morning',
      }),
      makeMeal({ id: '2', name: 'Salad', calories: 450, timeOfDay: 'lunch' }),
      makeMeal({ id: '3', name: 'Pasta', calories: 600, timeOfDay: 'dinner' }),
    ];
    expect(sumCalories(meals)).toBe(1350);
  });

  it('returns 0 for empty array', () => {
    expect(sumCalories([])).toBe(0);
  });

  it('handles entries with zero calories', () => {
    const meals: MealEntry[] = [
      makeMeal({ id: '1', name: 'Water', calories: 0, timeOfDay: 'morning' }),
      makeMeal({ id: '2', name: 'Toast', calories: 200, timeOfDay: 'morning' }),
    ];
    expect(sumCalories(meals)).toBe(200);
  });
});

// ─── calculateAverageExhaustion ─────────────────────────────────────────────

describe('calculateAverageExhaustion', () => {
  it('calculates average exhaustion from activities', () => {
    const activities: Activity[] = [
      makeActivity({ id: '1', name: 'Running', exhaustion: 8 }),
      makeActivity({ id: '2', name: 'Walking', exhaustion: 3 }),
      makeActivity({ id: '3', name: 'Yoga', exhaustion: 5 }),
    ];
    expect(calculateAverageExhaustion(activities)).toBeCloseTo(5.33, 1);
  });

  it('returns 0 for empty array', () => {
    expect(calculateAverageExhaustion([])).toBe(0);
  });
});

// ─── calculateAggregates ────────────────────────────────────────────────────

describe('calculateAggregates', () => {
  it('calculates all aggregates from components', () => {
    const activities: Activity[] = [
      makeActivity({ id: '1', name: 'Running', hoursOut: 1, exhaustion: 8 }),
      makeActivity({ id: '2', name: 'Walking', hoursOut: 0.5, exhaustion: 3 }),
    ];
    const meals: MealEntry[] = [
      makeMeal({
        id: '1',
        name: 'Breakfast',
        calories: 400,
        timeOfDay: 'morning',
      }),
      makeMeal({ id: '2', name: 'Lunch', calories: 600, timeOfDay: 'lunch' }),
    ];
    const drinks: MealEntry[] = [
      makeMeal({ id: '3', name: 'Coffee', calories: 50, timeOfDay: 'morning' }),
    ];
    const snacks: MealEntry[] = [
      makeMeal({ id: '4', name: 'Cookie', calories: 150, timeOfDay: 'snack' }),
    ];
    const sleep = makeSleepEntry(
      new Date('2024-01-15T22:00:00'),
      new Date('2024-01-16T06:30:00')
    );

    const aggregates = calculateAggregates(
      activities,
      meals,
      drinks,
      snacks,
      sleep
    );

    expect(aggregates.totalSleepHours).toBe(8.5);
    expect(aggregates.totalActivities).toBe(2);
    expect(aggregates.totalMeals).toBe(2);
    expect(aggregates.totalDrinks).toBe(1);
    expect(aggregates.totalSnacks).toBe(1);
    expect(aggregates.totalCalories).toBe(1200);
    expect(aggregates.totalExhaustion).toBe(11);
  });

  it('handles empty data', () => {
    const sleep = makeSleepEntry(
      new Date('2024-01-15T23:00:00'),
      new Date('2024-01-16T07:00:00')
    );
    const aggregates = calculateAggregates([], [], [], [], sleep);

    expect(aggregates.totalSleepHours).toBe(8);
    expect(aggregates.totalActivities).toBe(0);
    expect(aggregates.totalExhaustion).toBe(0);
    expect(aggregates.totalMeals).toBe(0);
    expect(aggregates.totalDrinks).toBe(0);
    expect(aggregates.totalSnacks).toBe(0);
    expect(aggregates.totalCalories).toBe(0);
  });
});

// ─── calculateSleepQuality ──────────────────────────────────────────────────

describe('calculateSleepQuality', () => {
  it('returns 100 for 7-9 hours (ideal)', () => {
    expect(calculateSleepQuality(8)).toBe(100);
  });

  it('returns 40 for 5-6 hours (below average)', () => {
    expect(calculateSleepQuality(5.5)).toBe(40);
  });

  it('returns 20 for less than 4 hours (poor)', () => {
    expect(calculateSleepQuality(3)).toBe(20);
  });

  it('returns 80 for 8-10 hours (good but excessive)', () => {
    expect(calculateSleepQuality(9)).toBe(80);
  });

  it('returns 60 for more than 10 hours (excessive)', () => {
    expect(calculateSleepQuality(11)).toBe(60);
  });
});

// ─── getMoodTrend ───────────────────────────────────────────────────────────

describe('getMoodTrend', () => {
  it('returns sorted date-mood pairs', () => {
    const entries = [
      { date: '2024-01-13', overallMood: OverallMood.Sad },
      { date: '2024-01-14', overallMood: OverallMood.Neutral },
      { date: '2024-01-15', overallMood: OverallMood.Happy },
    ];
    const trend = getMoodTrend(entries);
    expect(trend).toHaveLength(3);
    expect(trend[0].date).toBe('2024-01-13');
    expect(trend[0].mood).toBe(OverallMood.Sad);
    expect(trend[2].mood).toBe(OverallMood.Happy);
  });

  it('returns empty array for empty input', () => {
    expect(getMoodTrend([])).toEqual([]);
  });
});

// ─── getSleepTrend ──────────────────────────────────────────────────────────

describe('getSleepTrend', () => {
  it('returns sorted date-hours pairs', () => {
    const entries = [
      { date: '2024-01-13', totalSleepHours: 5 },
      { date: '2024-01-14', totalSleepHours: 7 },
      { date: '2024-01-15', totalSleepHours: 8 },
    ];
    const trend = getSleepTrend(entries);
    expect(trend).toHaveLength(3);
    expect(trend[0].hours).toBe(5);
    expect(trend[2].hours).toBe(8);
  });

  it('returns empty array for empty input', () => {
    expect(getSleepTrend([])).toEqual([]);
  });
});

// ─── validateSleepEntry ─────────────────────────────────────────────────────

describe('validateSleepEntry', () => {
  it('returns valid for correct sleep entry', () => {
    const sleep = makeSleepEntry(
      new Date('2024-01-15T22:00:00'),
      new Date('2024-01-16T06:30:00')
    );
    const result = validateSleepEntry(sleep);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns invalid for null fellAsleepAt', () => {
    const sleep = {
      fellAsleepAt: null as any,
      wokeUpAt: new Date('2024-01-16T06:30:00'),
    };
    const result = validateSleepEntry(sleep);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns invalid for null wokeUpAt', () => {
    const sleep = {
      fellAsleepAt: new Date('2024-01-15T22:00:00'),
      wokeUpAt: null as any,
    };
    const result = validateSleepEntry(sleep);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns invalid for invalid dates', () => {
    const sleep = {
      fellAsleepAt: new Date('invalid'),
      wokeUpAt: new Date('invalid'),
    };
    const result = validateSleepEntry(sleep);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

// ─── validateActivity ───────────────────────────────────────────────────────

describe('validateActivity', () => {
  it('returns valid for correct activity', () => {
    const result = validateActivity(makeActivity());
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns invalid for empty name', () => {
    const result = validateActivity(makeActivity({ name: '' }));
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns invalid for exhaustion out of range (0)', () => {
    const result = validateActivity(makeActivity({ exhaustion: 0 }));
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns invalid for exhaustion out of range (15)', () => {
    const result = validateActivity(makeActivity({ exhaustion: 15 }));
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns invalid for negative hours', () => {
    const result = validateActivity(makeActivity({ hoursOut: -1 }));
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns invalid for missing date', () => {
    const result = validateActivity(makeActivity({ date: '' }));
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

// ─── validateMealEntry ──────────────────────────────────────────────────────

describe('validateMealEntry', () => {
  it('returns valid for correct meal', () => {
    const result = validateMealEntry(makeMeal());
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns invalid for empty name', () => {
    const result = validateMealEntry(makeMeal({ name: '' }));
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns invalid for empty quantity', () => {
    const result = validateMealEntry(makeMeal({ quantity: '' }));
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns invalid for negative calories', () => {
    const result = validateMealEntry(makeMeal({ calories: -100 }));
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns invalid for excessive calories (>10000)', () => {
    const result = validateMealEntry(makeMeal({ calories: 15000 }));
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
