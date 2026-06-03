/**
 * Questionnaire Scoring Utilities
 * Helper functions for GAD-7 and PHQ-9 score calculations
 */

/**
 * GAD-7 Questionnaire Helper
 * Generalized Anxiety Disorder 7-item scale
 */
export const GAD7_QUESTIONS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it\'s hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
];

export const GAD7_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

/**
 * Calculate GAD-7 total score
 * @param responses Array of 7 responses (0-3 each)
 * @returns Total score (0-21)
 * @throws Error if invalid responses
 */
export const calculateGad7Score = (responses: number[]): number => {
  if (responses.length !== 7) {
    throw new Error('GAD-7 requires exactly 7 responses');
  }

  if (!responses.every((response) => response >= 0 && response <= 3)) {
    throw new Error('Each response must be between 0 and 3');
  }

  return responses.reduce((sum, response) => sum + response, 0);
};

/**
 * Get GAD-7 severity level based on score
 * @param score GAD-7 score (0-21)
 * @returns Severity level and description
 */
export const getGad7Severity = (score: number) => {
  if (score < 5) {
    return {
      level: 'Minimal',
      description: 'Minimal anxiety symptoms',
      color: '#4CAF50',
      recommendation: 'No intervention needed.',
    };
  } else if (score < 10) {
    return {
      level: 'Mild',
      description: 'Mild anxiety symptoms',
      color: '#8BC34A',
      recommendation: 'Consider monitoring symptoms.',
    };
  } else if (score < 15) {
    return {
      level: 'Moderate',
      description: 'Moderate anxiety symptoms',
      color: '#FF9800',
      recommendation: 'Consider professional consultation.',
    };
  } else {
    return {
      level: 'Severe',
      description: 'Severe anxiety symptoms',
      color: '#F44336',
      recommendation: 'Seek professional help immediately.',
    };
  }
};

/**
 * PHQ-9 Questionnaire Helper
 * Patient Health Questionnaire 9-item scale
 */
export const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling/staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself - or that you\'re a failure',
  'Trouble concentrating on things',
  'Moving or speaking slowly, or being fidgety/restless',
  'Thoughts that you would be better off dead or of hurting yourself',
];

export const PHQ9_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

/**
 * Calculate PHQ-9 total score
 * @param responses Array of 9 responses (0-3 each)
 * @returns Total score (0-27)
 * @throws Error if invalid responses
 */
export const calculatePhq9Score = (responses: number[]): number => {
  if (responses.length !== 9) {
    throw new Error('PHQ-9 requires exactly 9 responses');
  }

  if (!responses.every((response) => response >= 0 && response <= 3)) {
    throw new Error('Each response must be between 0 and 3');
  }

  return responses.reduce((sum, response) => sum + response, 0);
};

/**
 * Get PHQ-9 severity level based on score
 * @param score PHQ-9 score (0-27)
 * @returns Severity level and description
 */
export const getPhq9Severity = (score: number) => {
  if (score < 5) {
    return {
      level: 'None',
      description: 'No depression symptoms',
      color: '#4CAF50',
      recommendation: 'No intervention needed.',
    };
  } else if (score < 10) {
    return {
      level: 'Mild',
      description: 'Mild depression symptoms',
      color: '#8BC34A',
      recommendation: 'Consider monitoring symptoms.',
    };
  } else if (score < 15) {
    return {
      level: 'Moderate',
      description: 'Moderate depression symptoms',
      color: '#FF9800',
      recommendation: 'Consider professional consultation.',
    };
  } else if (score < 20) {
    return {
      level: 'Moderately Severe',
      description: 'Moderately severe depression symptoms',
      color: '#FF5722',
      recommendation: 'Seek professional help.',
    };
  } else {
    return {
      level: 'Severe',
      description: 'Severe depression symptoms',
      color: '#F44336',
      recommendation: 'Seek professional help immediately.',
    };
  }
};

/**
 * Check for suicide risk in PHQ-9 responses
 * @param responses PHQ-9 responses array
 * @returns Suicide risk assessment
 */
export const assessSuicideRisk = (responses: number[]): { risk: 'none' | 'low' | 'high'; message?: string } => {
  if (responses.length !== 9) {
    throw new Error('PHQ-9 requires exactly 9 responses');
  }

  // Question 9 asks about suicide thoughts
  const q9Response = responses[8];

  if (q9Response === 0) {
    return { risk: 'none' };
  } else if (q9Response === 1 || q9Response === 2) {
    return {
      risk: 'low',
      message: 'You reported having thoughts that you would be better off dead. Please consider speaking with a healthcare provider.',
    };
  } else {
    return {
      risk: 'high',
      message: 'You reported thoughts of hurting yourself. Please seek help immediately. Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741.',
    };
  }
};

/**
 * Validate questionnaire responses
 * @param responses Array of numeric responses
 * @param expectedLength Expected number of responses
 * @returns Validation result
 */
export const validateQuestionnaireResponses = (
  responses: number[],
  expectedLength: number
): { valid: boolean; error?: string } => {
  if (!Array.isArray(responses)) {
    return { valid: false, error: 'Responses must be an array' };
  }

  if (responses.length !== expectedLength) {
    return { valid: false, error: `Expected ${expectedLength} responses, got ${responses.length}` };
  }

  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];
    if (typeof response !== 'number') {
      return { valid: false, error: `Response at index ${i} must be a number` };
    }
    if (!Number.isInteger(response)) {
      return { valid: false, error: `Response at index ${i} must be an integer` };
    }
    if (response < 0 || response > 3) {
      return { valid: false, error: `Response at index ${i} must be between 0 and 3` };
    }
  }

  return { valid: true };
};

/**
 * Calculate score change between two assessments
 * @param previousScore Previous score
 * @param currentScore Current score
 * @returns Score change and improvement status
 */
export const calculateScoreChange = (previousScore: number, currentScore: number) => {
  const change = currentScore - previousScore;
  const changePercentage = previousScore === 0 ? 0 : Math.round((change / previousScore) * 100);

  return {
    change,
    changePercentage,
    improved: change < 0,
    worsened: change > 0,
    same: change === 0,
  };
};

/**
 * Get questionnaire completion status
 * @param responses Array of responses
 * @param expectedLength Expected number of questions
 * @returns Completion status and count
 */
export const getCompletionStatus = (responses: number[], expectedLength: number) => {
  const answeredCount = responses.filter((response) => response !== undefined && response !== null).length;
  const isComplete = answeredCount === expectedLength;
  const percentageComplete = Math.round((answeredCount / expectedLength) * 100);

  return {
    answeredCount,
    expectedLength,
    isComplete,
    percentageComplete,
  };
};

/**
 * Calculate average score over multiple assessments
 * @param scores Array of scores
 * @returns Average score
 */
export const calculateAverageScore = (scores: number[]): number => {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((total, score) => total + score, 0);
  return Math.round((sum / scores.length) * 100) / 100;
};

/**
 * Get score trend over time
 * @param scores Array of score objects with dates
 * @returns Trend information
 */
export const getScoreTrend = (
  scores: Array<{ date: string; score: number }>
): { trend: 'improving' | 'worsening' | 'stable'; averageChange: number } => {
  if (scores.length < 2) {
    return { trend: 'stable', averageChange: 0 };
  }

  // Sort by date
  const sortedScores = scores.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate average change between consecutive scores
  let totalChange = 0;
  for (let i = 1; i < sortedScores.length; i++) {
    totalChange += sortedScores[i].score - sortedScores[i - 1].score;
  }

  const averageChange = totalChange / (sortedScores.length - 1);

  let trend: 'improving' | 'worsening' | 'stable';
  if (averageChange < -0.5) {
    trend = 'improving';
  } else if (averageChange > 0.5) {
    trend = 'worsening';
  } else {
    trend = 'stable';
  }

  return { trend, averageChange: Math.round(averageChange * 100) / 100 };
};