/**
 * Tests for GAD-7 and PHQ-9 questionnaire scoring utilities
 */

import {
  calculateGad7Score,
  getGad7Severity,
  calculatePhq9Score,
  getPhq9Severity,
  assessSuicideRisk,
  validateQuestionnaireResponses,
  calculateScoreChange,
  calculateAverageScore,
  getScoreTrend,
  GAD7_QUESTIONS,
  PHQ9_QUESTIONS,
} from '@/utils/questionnaireScoring';

// ─── GAD-7 Tests ────────────────────────────────────────────────────────────

describe('GAD-7', () => {
  describe('calculateGad7Score', () => {
    it('returns 0 for all-zero responses', () => {
      expect(calculateGad7Score([0, 0, 0, 0, 0, 0, 0])).toBe(0);
    });

    it('returns 21 for all-three responses', () => {
      expect(calculateGad7Score([3, 3, 3, 3, 3, 3, 3])).toBe(21);
    });

    it('calculates mixed responses correctly', () => {
      // 0+1+2+3+0+1+2 = 9
      expect(calculateGad7Score([0, 1, 2, 3, 0, 1, 2])).toBe(9);
    });

    it('throws if not 7 responses', () => {
      expect(() => calculateGad7Score([0, 0, 0])).toThrow(
        'GAD-7 requires exactly 7 responses'
      );
    });

    it('throws if any response > 3', () => {
      expect(() => calculateGad7Score([0, 1, 2, 5, 0, 1, 2])).toThrow(
        'Each response must be between 0 and 3'
      );
    });
  });

  describe('getGad7Severity', () => {
    it('returns Minimal for score 0-4', () => {
      expect(getGad7Severity(0).level).toBe('Minimal');
      expect(getGad7Severity(4).level).toBe('Minimal');
    });

    it('returns Mild for score 5-9', () => {
      expect(getGad7Severity(5).level).toBe('Mild');
      expect(getGad7Severity(9).level).toBe('Mild');
    });

    it('returns Moderate for score 10-14', () => {
      expect(getGad7Severity(10).level).toBe('Moderate');
      expect(getGad7Severity(14).level).toBe('Moderate');
    });

    it('returns Severe for score 15-21', () => {
      expect(getGad7Severity(15).level).toBe('Severe');
      expect(getGad7Severity(21).level).toBe('Severe');
    });

    it('returns color and recommendation for each level', () => {
      const result = getGad7Severity(10);
      expect(result.color).toBeTruthy();
      expect(result.recommendation).toBeTruthy();
      expect(result.description).toBeTruthy();
    });
  });

  describe('GAD7_QUESTIONS', () => {
    it('has exactly 7 questions', () => {
      expect(GAD7_QUESTIONS).toHaveLength(7);
    });

    it('each question is a non-empty string', () => {
      GAD7_QUESTIONS.forEach((q) => {
        expect(typeof q).toBe('string');
        expect(q.length).toBeGreaterThan(0);
      });
    });
  });
});

// ─── PHQ-9 Tests ────────────────────────────────────────────────────────────

describe('PHQ-9', () => {
  describe('calculatePhq9Score', () => {
    it('returns 0 for all-zero responses', () => {
      expect(calculatePhq9Score([0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(0);
    });

    it('returns 27 for all-three responses', () => {
      expect(calculatePhq9Score([3, 3, 3, 3, 3, 3, 3, 3, 3])).toBe(27);
    });

    it('calculates mixed responses correctly', () => {
      // 0+1+2+3+0+1+2+3+0 = 12
      expect(calculatePhq9Score([0, 1, 2, 3, 0, 1, 2, 3, 0])).toBe(12);
    });

    it('throws if not 9 responses', () => {
      expect(() => calculatePhq9Score([0, 0, 0])).toThrow(
        'PHQ-9 requires exactly 9 responses'
      );
    });
  });

  describe('getPhq9Severity', () => {
    it('returns None for score 0-4', () => {
      expect(getPhq9Severity(0).level).toBe('None');
      expect(getPhq9Severity(4).level).toBe('None');
    });

    it('returns Mild for score 5-9', () => {
      expect(getPhq9Severity(5).level).toBe('Mild');
      expect(getPhq9Severity(9).level).toBe('Mild');
    });

    it('returns Moderate for score 10-14', () => {
      expect(getPhq9Severity(10).level).toBe('Moderate');
      expect(getPhq9Severity(14).level).toBe('Moderate');
    });

    it('returns Moderately Severe for score 15-19', () => {
      expect(getPhq9Severity(15).level).toBe('Moderately Severe');
      expect(getPhq9Severity(19).level).toBe('Moderately Severe');
    });

    it('returns Severe for score 20-27', () => {
      expect(getPhq9Severity(20).level).toBe('Severe');
      expect(getPhq9Severity(27).level).toBe('Severe');
    });
  });

  describe('PHQ9_QUESTIONS', () => {
    it('has exactly 9 questions', () => {
      expect(PHQ9_QUESTIONS).toHaveLength(9);
    });

    it('each question is a non-empty string', () => {
      PHQ9_QUESTIONS.forEach((q) => {
        expect(typeof q).toBe('string');
        expect(q.length).toBeGreaterThan(0);
      });
    });
  });

  describe('assessSuicideRisk', () => {
    it('returns none when PHQ-9 Q9 response is 0', () => {
      const result = assessSuicideRisk([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(result.risk).toBe('none');
    });

    it('returns low when PHQ-9 Q9 response is 1', () => {
      const result = assessSuicideRisk([0, 0, 0, 0, 0, 0, 0, 0, 1]);
      expect(result.risk).toBe('low');
      expect(result.message).toBeTruthy();
    });

    it('returns high when PHQ-9 Q9 response is 3', () => {
      const result = assessSuicideRisk([0, 0, 0, 0, 0, 0, 0, 0, 3]);
      expect(result.risk).toBe('high');
      expect(result.message).toBeTruthy();
    });

    it('throws if not 9 responses', () => {
      expect(() => assessSuicideRisk([0, 0, 0])).toThrow(
        'PHQ-9 requires exactly 9 responses'
      );
    });
  });
});

// ─── Validation Tests ───────────────────────────────────────────────────────

describe('validateQuestionnaireResponses', () => {
  it('returns valid for correct GAD-7 responses (7 items)', () => {
    const result = validateQuestionnaireResponses([0, 1, 2, 3, 0, 1, 2], 7);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns valid for correct PHQ-9 responses (9 items)', () => {
    const result = validateQuestionnaireResponses(
      [0, 1, 2, 3, 0, 1, 2, 3, 0],
      9
    );
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns invalid for wrong number of responses', () => {
    const result = validateQuestionnaireResponses([0, 1, 2], 7);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns invalid for out-of-range values', () => {
    const result = validateQuestionnaireResponses([0, 1, 5, 3, 0, 1, 2], 7);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns invalid for non-integer values', () => {
    const result = validateQuestionnaireResponses([0, 1.5, 2, 3, 0, 1, 2], 7);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

// ─── Score Change & Average Tests ───────────────────────────────────────────

describe('calculateScoreChange', () => {
  it('shows improvement when score decreases', () => {
    const change = calculateScoreChange(15, 5);
    expect(change.improved).toBe(true);
    expect(change.worsened).toBe(false);
    expect(change.change).toBe(-10);
  });

  it('shows worsening when score increases', () => {
    const change = calculateScoreChange(5, 15);
    expect(change.improved).toBe(false);
    expect(change.worsened).toBe(true);
    expect(change.change).toBe(10);
  });

  it('shows no change for same scores', () => {
    const change = calculateScoreChange(10, 10);
    expect(change.same).toBe(true);
    expect(change.change).toBe(0);
  });
});

describe('calculateAverageScore', () => {
  it('calculates average of scores', () => {
    expect(calculateAverageScore([5, 10, 15, 20])).toBe(12.5);
  });

  it('returns 0 for empty array', () => {
    expect(calculateAverageScore([])).toBe(0);
  });
});

describe('getScoreTrend', () => {
  it('returns improving for decreasing scores over time', () => {
    const scores = [
      { date: '2024-01-01', score: 20 },
      { date: '2024-01-08', score: 15 },
      { date: '2024-01-15', score: 10 },
      { date: '2024-01-22', score: 5 },
    ];
    expect(getScoreTrend(scores).trend).toBe('improving');
  });

  it('returns worsening for increasing scores over time', () => {
    const scores = [
      { date: '2024-01-01', score: 5 },
      { date: '2024-01-08', score: 10 },
      { date: '2024-01-15', score: 15 },
      { date: '2024-01-22', score: 20 },
    ];
    expect(getScoreTrend(scores).trend).toBe('worsening');
  });

  it('returns stable for flat scores', () => {
    const scores = [
      { date: '2024-01-01', score: 10 },
      { date: '2024-01-08', score: 10 },
      { date: '2024-01-15', score: 10 },
      { date: '2024-01-22', score: 10 },
    ];
    expect(getScoreTrend(scores).trend).toBe('stable');
  });

  it('returns stable for insufficient data', () => {
    expect(getScoreTrend([]).trend).toBe('stable');
    expect(getScoreTrend([{ date: '2024-01-01', score: 10 }]).trend).toBe(
      'stable'
    );
  });
});
