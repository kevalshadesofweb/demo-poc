export interface Category {
  id: number;
  name: string;
}

export interface QuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizSettings {
  category: number;
  difficulty: "easy" | "medium" | "hard";
  amount: number;
  timePerQuestion: number;
}

export interface QuizState {
  settings: QuizSettings | null;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: string[];
  score: number;
  isComplete: boolean;
  timeRemaining: number;
  isTimeUp: boolean;
  setSettings: (settings: QuizSettings) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  setAnswer: (questionIndex: number, answer: string) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  updateTimer: (time: number) => void;
  exitQuiz: () => void;
}
