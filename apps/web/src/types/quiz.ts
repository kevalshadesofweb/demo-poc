export interface Category {
  id: number;
  name: string;
}

export interface QuizSettings {
  category: number;
  difficulty: "easy" | "medium" | "hard";
  amount: number;
  timePerQuestion: number;
}

export interface QuizQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  selected?: string;
}

export interface QuizState {
  settings: QuizSettings | null;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  isQuizRunning: boolean;
  setSettings: (settings: QuizSettings) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  setAnswer: (answer: string) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  setExitQuiz: () => void;
}
