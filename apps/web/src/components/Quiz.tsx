"use client";

import { useEffect, useState } from "react";
import { useQuestions } from "@/hooks/useQuestions";
import { useQuizStore } from "@/store/useQuizStore";
import { shuffleArray, decodeHtml } from "@/utils/quiz";
import { ProgressBar, QuestionCard } from "@repo/ui";
import { Timer } from "./Timer";

export function Quiz() {
  const {
    settings,
    currentQuestionIndex,
    answers,
    setAnswer,
    nextQuestion,
    resetQuiz,
    setQuestions,
    isComplete,
    isTimeUp,
    exitQuiz,
  } = useQuizStore();
  const { data: questions, isLoading, error } = useQuestions(settings);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Store questions in state when they're fetched
  useEffect(() => {
    if (questions) {
      setQuestions(questions);
    }
  }, [questions, setQuestions]);

  // Shuffle answers when question changes
  useEffect(() => {
    if (questions && questions[currentQuestionIndex]) {
      const currentQuestion = questions[currentQuestionIndex];
      const allAnswers = [
        currentQuestion.correct_answer,
        ...currentQuestion.incorrect_answers,
      ];
      setShuffledAnswers(shuffleArray(allAnswers));
    }
  }, [questions, currentQuestionIndex]);

  // Handle time up
  useEffect(() => {
    if (isTimeUp && !answers[currentQuestionIndex]) {
      // Mark question as skipped and move to next question
      setAnswer(currentQuestionIndex, "SKIPPED");
      nextQuestion();
    }
  }, [isTimeUp, currentQuestionIndex, answers, setAnswer, nextQuestion]);

  // Reset transition state when question changes
  useEffect(() => {
    setIsTransitioning(false);
  }, [currentQuestionIndex]);

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    exitQuiz();
    setShowExitConfirm(false);
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  if (!settings) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !questions) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error:{" "}
        {error instanceof Error ? error.message : "Failed to fetch questions"}
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error: Question not found
      </div>
    );
  }

  const hasAnswered =
    answers[currentQuestionIndex] !== undefined &&
    answers[currentQuestionIndex] !== "SKIPPED";
  const isSkipped = answers[currentQuestionIndex] === "SKIPPED";

  const handleAnswer = (answer: string) => {
    if (hasAnswered || isTimeUp || isTransitioning) return;
    setAnswer(currentQuestionIndex, answer);
  };

  const handleNext = () => {
    if (!hasAnswered || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      nextQuestion();
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div
      className={`max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md transition-all duration-500 ${
        isTransitioning
          ? "opacity-0 -translate-x-full"
          : "opacity-100 translate-x-0"
      } ${isSkipped ? "opacity-75" : ""}`}
    >
      {/* Progress and Timer */}
      <div className="mb-6">
        {/* Progress Bar */}
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={questions.length}
          className="mb-4"
        />

        {/* Header with Timer in Center */}
        <div className="flex justify-between items-center">
          {/* Left side - Question counter */}
          <div className="text-gray-600 font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          {/* Center - Timer */}
          <div className="flex-1 flex justify-center">
            <Timer />
          </div>

          {/* Right side - Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleExit}
              className="px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
            >
              Exit Quiz
            </button>
            <button
              onClick={resetQuiz}
              className="px-4 py-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <QuestionCard
        question={decodeHtml(currentQuestion.question)}
        answers={shuffledAnswers.map((answer) => decodeHtml(answer))}
        selectedAnswer={answers[currentQuestionIndex]}
        onAnswerSelect={handleAnswer}
        isAnswered={hasAnswered}
        isTimeUp={isTimeUp}
        isTransitioning={isTransitioning}
        className="mb-8"
      />

      {/* Navigation */}
      {hasAnswered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {isComplete ? "See Results" : "Next Question"}
          </button>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Exit Quiz?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to exit? Your current progress will be saved
              and you&apos;ll see your results.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelExit}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmExit}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
