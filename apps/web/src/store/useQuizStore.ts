import { create } from "zustand";
import type { QuizState, QuizSettings, QuizQuestion } from "@/types/quiz";

export const useQuizStore = create<QuizState>((set, get) => ({
  settings: null,
  questions: [],
  currentQuestionIndex: -1,
  isQuizRunning: false,
  setSettings: (settings: QuizSettings) => {
    set({
      settings,
      isQuizRunning: true,
    });
  },

  setQuestions: (questions: QuizQuestion[]) => {
    set({ questions, currentQuestionIndex: 0 });
  },

  setAnswer: (answer: string) => {
    const { questions, currentQuestionIndex } = get();
    if (questions[currentQuestionIndex]) {
      questions[currentQuestionIndex].selected = answer;
      set({ questions });
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    const nextIndex = currentQuestionIndex + 1;
    if (currentQuestionIndex + 1 >= questions.length) {
      set({ isQuizRunning: false });
    } else {
      set({
        currentQuestionIndex: nextIndex,
      });
    }
  },

  resetQuiz: () => {
    set({
      settings: null,
      questions: [],
      currentQuestionIndex: -1,
    });
  },

  setExitQuiz: () => {
    set({ isQuizRunning: false });
  },
}));
