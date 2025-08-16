export interface Question {
  YearAsked?: string;
  Subtopic?: string;
  QuestionText?: string;
  Choice_A_Text?: string;
  Choice_A_isCorrect?: boolean | null;
  Choice_A_Explanation?: string;
  Choice_B_Text?: string;
  Choice_B_isCorrect?: boolean | null;
  Choice_B_Explanation?: string;
  Choice_C_Text?: string;
  Choice_C_isCorrect?: boolean | null;
  Choice_C_Explanation?: string;
  Choice_D_Text?: string;
  Choice_D_isCorrect?: boolean | null;
  Choice_D_Explanation?: string;
  Choice_E_Text?: string;
  Choice_E_isCorrect?: boolean | null;
  Choice_E_Explanation?: string;
  OverallExplanation?: string;
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean | null;
  explanation: string;
}

export interface UserAnswer {
  questionId: number;
  selectedChoices: string[]; // Changed from single choice to array of choices
  isCorrect: boolean | null;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: UserAnswer[];
}