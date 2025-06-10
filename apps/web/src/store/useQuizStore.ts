import { create } from "zustand";
import type { QuizState, QuizSettings, QuizQuestion } from "@/types/quiz";

const DEFAULT_TIME_PER_QUESTION = 30; // seconds

export const useQuizStore = create<QuizState>((set, get) => ({
  settings: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  isComplete: false,
  timeRemaining: DEFAULT_TIME_PER_QUESTION,
  isTimeUp: false,

  setSettings: (settings: QuizSettings) => {
    set({
      settings,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      isComplete: false,
      timeRemaining: settings.timePerQuestion || DEFAULT_TIME_PER_QUESTION,
      isTimeUp: false,
    });
  },

  setQuestions: (questions: QuizQuestion[]) => {
    set({ questions, answers: new Array(questions.length).fill(undefined) });
  },

  setAnswer: (questionIndex: number, answer: string) => {
    const { questions, answers } = get();
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;

    // Calculate score only for answered questions (not skipped)
    const newScore = newAnswers.reduce((score, answer, index) => {
      if (answer === "SKIPPED") return score;
      const question = questions[index];
      return question && answer === question.correct_answer ? score + 1 : score;
    }, 0);

    set({ answers: newAnswers, score: newScore });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    const nextIndex = currentQuestionIndex + 1;
    const isComplete = nextIndex >= questions.length;

    set({
      currentQuestionIndex: nextIndex,
      isComplete,
      timeRemaining:
        get().settings?.timePerQuestion || DEFAULT_TIME_PER_QUESTION,
      isTimeUp: false,
    });
  },

  resetQuiz: () => {
    set({
      settings: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      isComplete: false,
      timeRemaining: DEFAULT_TIME_PER_QUESTION,
      isTimeUp: false,
    });
  },

  updateTimer: (time: number) => {
    set({ timeRemaining: time });
    if (time <= 0) {
      set({ isTimeUp: true });
    }
  },

  // New function to handle early quiz exit
  exitQuiz: () => {
    // Calculate final score before exiting
    const { questions, answers } = get();
    const score = answers.reduce((total, answer, index) => {
      if (answer === "SKIPPED") return total;
      const question = questions[index];
      return question && answer === question.correct_answer ? total + 1 : total;
    }, 0);

    return set({
      score,
      isComplete: true,
      timeRemaining: 0,
      isTimeUp: true,
    });
  },
}));
