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

// ─── GAD-7 Tests ────────────────────────────────────────────────────

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

    it('handles partial responses (undefined values)', () => {
      // 0+1+0+3+0+0+0 = 4
      expect(calculateGad7Score([0, 1, undefined as any, 3, 0, 0, 0])).toBe(4);
    });
  });

  describe('getGad7Severity', () => {
    it('returns "Minimal anxiety" for score 0-4', () => {
      expect(getGad7Severity(0)).toBe('Minimal anxiety');
      expect(getGad7Severity(4)).toBe('Minimal anxiety');
    });

    it('returns "Mild anxiety" for score 5-9', () => {
      expect(getGad7Severity(5)).toBe('Mild anxiety');
      expect(getGad7Severity(9)).toBe('Mild anxiety');
    });

    it('returns "Moderate anxiety" for score 10-14', () => {
      expect(getGad7Severity(10)).toBe('Moderate anxiety');
      expect(getGad7Severity(14)).toBe('Moderate anxiety');
    });

    it('returns "Severe anxiety" for score 15-21', () => {
      expect(getGad7Severity(15)).toBe('Severe anxiety');
      expect(getGad7Severity(21)).toBe('Severe anxiety');
    });
  });

  describe('GAD7_QUESTIONS', () => {
    it('has exactly 7 questions', () => {
      expect(GAD7_QUESTIONS).toHaveLength(7);
    });

    it('each question has id, text, and shortForm', () => {
      GAD7_QUESTIONS.forEach((q, i) => {
        expect(q.id).toBe(i + 1);
        expect(q.text).toBeTruthy();
        expect(q.shortForm).toBeTruthy();
      });
    });
  });
});

// ─── PHQ-9 Tests ────────────────────────────────────────────────────

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
  });

  describe('getPhq9Severity', () => {
    it('returns "No depression" for score 0-4', () => {
      expect(getPhq9Severity(0)).toBe('No depression');
      expect(getPhq9Severity(4)).toBe('No depression');
    });

    it('returns "Mild depression" for score 5-9', () => {
      expect(getPhq9Severity(5)).toBe('Mild depression');
      expect(getPhq9Severity(9)).toBe('Mild depression');
    });

    it('returns "Moderate depression" for score 10-14', () => {
      expect(getPhq9Severity(10)).toBe('Moderate depression');
      expect(getPhq9Severity(14)).toBe('Moderate depression');
    });

    it('returns "Moderately severe depression" for score 15-19', () => {
      expect(getPhq9Severity(15)).toBe('Moderately severe depression');
      expect(getPhq9Severity(19)).toBe('Moderately severe depression');
    });

    it('returns "Severe depression" for score 20-27', () => {
      expect(getPhq9Severity(20)).toBe('Severe depression');
      expect(getPhq9Severity(27)).toBe('Severe depression');
    });
  });

  describe('PHQ9_QUESTIONS', () => {
    it('has exactly 9 questions', () => {
      expect(PHQ9_QUESTIONS).toHaveLength(9);
    });

    it('each question has id, text, and shortForm', () => {
      PHQ9_QUESTIONS.forEach((q, i) => {
        expect(q.id).toBe(i + 1);
        expect(q.text).toBeTruthy();
        expect(q.shortForm).toBeTruthy();
      });
    });
  });

  describe('assessSuicideRisk', () => {
    it('returns true when PHQ-9 Q9 response > 0', () => {
      // Q9 is the 9th item (index 8)
      const responses = [0, 0, 0, 0, 0, 0, 0, 0, 1];
      expect(assessSuicideRisk(responses)).toBe(true);
    });

    it('returns false when PHQ-9 Q9 response is 0', () => {
      const responses = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      expect(assessSuicideRisk(responses)).toBe(false);
    });

    it('returns false when PHQ-9 Q9 response is undefined', () => {
      const responses = [0, 0, 0, 0, 0, 0, 0, 0];
      expect(assessSuicideRisk(responses)).toBe(false);
    });
  });
});

// ─── Cross-Checkin Tests ─────────────────────────────────────────────

describe('validateQuestionnaireResponses', () => {
  it('returns valid for correct GAD-7 responses', () => {
    const result = validateQuestionnaireResponses([0, 1, 2, 3, 0, 1, 2], 'gad7');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns valid for correct PHQ-9 responses', () => {
    const result = validateQuestionnaireResponses(
      [0, 1, 2, 3, 0, 1, 2, 3, 0],
      'phq9',
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns invalid for wrong number of GAD-7 responses', () => {
    const result = validateQuestionnaireResponses([0, 1, 2], 'gad7');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('returns invalid for wrong number of PHQ-9 responses', () => {
    const result = validateQuestionnaireResponses([0, 1, 2, 3, 0, 1, 2], 'phq9');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('returns invalid for out-of-range values', () => {
    const result = validateQuestionnaireResponses([0, 1, 5, 3, 0, 1, 2], 'gad7');
    expect(result.valid).toBe(false);
  });
});

describe('calculateScoreChange', () => {
  it('returns positive change for improving scores', () => {
    // Lower GAD-7 score is better, so going from 15 to 5 is +10 improvement
    const change = calculateScoreChange(15, 5);
    expect(change).toBe(10); // Score decreased = improvement
  });

  it('returns negative change for worsening scores', () => {
    const change = calculateScoreChange(5, 15);
    expect(change).toBe(-10); // Score increased = worsening
  });

  it('returns 0 for unchanged scores', () => {
    const change = calculateScoreChange(10, 10);
    expect(change).toBe(0);
  });
});

describe('calculateAverageScore', () => {
  it('calculates average of scores', () => {
    const scores = [5, 10, 15, 20];
    expect(calculateAverageScore(scores)).toBe(12.5);
  });

  it('returns 0 for empty array', () => {
    expect(calculateAverageScore([])).toBe(0);
  });
});

describe('getScoreTrend', () => {
  it('returns "improving" for decreasing scores over time', () => {
    const scores = [20, 15, 10, 5];
    expect(getScoreTrend(scores)).toBe('improving');
  });

  it('returns "worsening" for increasing scores over time', () => {
    const scores = [5, 10, 15, 20];
    expect(getScoreTrend(scores)).toBe('worsening');
  });

  it('returns "stable" for flat scores', () => {
    const scores = [10, 10, 10, 10];
    expect(getScoreTrend(scores)).toBe('stable');
  });

  it('returns "unknown" for insufficient data', () => {
    expect(getScoreTrend([])).toBe('unknown');
    expect(getScoreTrend([10])).toBe('unknown');
  });
});
