"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuestions } from "@/hooks/useQuestions";
import { useQuizStore } from "@/store/useQuizStore";
import { shuffleArray, decodeHtml } from "@/utils/quiz";
import {
  ProgressBar,
  QuestionCard,
  Timer,
  ExitConfirmationModal,
} from "@repo/ui";

export function Quiz() {
  const {
    settings,
    currentQuestionIndex,
    setAnswer,
    nextQuestion,
    resetQuiz,
    setQuestions,
    setExitQuiz,
  } = useQuizStore();
  const { data: questions, isLoading, error } = useQuestions(settings);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isTimeUp, setIsTimeUp] = useState(false);

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

  // Reset transition state when question changes
  useEffect(() => {
    setIsTransitioning(false);
    setIsTimeUp(false);
  }, [currentQuestionIndex]);

  const handleExit = useCallback(() => {
    setShowExitConfirm(true);
  }, []);

  const confirmExit = useCallback(() => {
    setExitQuiz();
    setShowExitConfirm(false);
  }, [setExitQuiz]);

  const cancelExit = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      if (selectedAnswer != "") {
        setAnswer(selectedAnswer);
      }
      nextQuestion();
      setSelectedAnswer("");
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, selectedAnswer, setAnswer, nextQuestion]);

  const handleTimeUp = useCallback(() => {
    setIsTimeUp(true);
    // Auto-submit current answer if selected, otherwise skip
    if (selectedAnswer) {
      setAnswer(selectedAnswer);
    }
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      handleNext();
    }, 1000);
  }, [selectedAnswer, setAnswer, handleNext]);

  const handleAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);
  }, []);

  if (!settings) {
    // Reset states and it will automatically show options modal
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

  return (
    <div
      className={`max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md transition-all duration-500 ${
        isTransitioning
          ? "opacity-0 -translate-x-full"
          : "opacity-100 translate-x-0"
      }`}
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
            <Timer
              key={currentQuestionIndex}
              initialTime={settings.timePerQuestion}
              onTimeUp={handleTimeUp}
              isRunning={!isTransitioning && !isTimeUp}
              showProgress={true}
            />
          </div>

          {/* Right side - Action buttons */}
          <div className="flex gap-3">
            {/* Exit Quiz */}
            <button
              onClick={handleExit}
              className="px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
            >
              Exit Quiz
            </button>
            {/* Reset Quiz */}
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
        selectedAnswer={selectedAnswer}
        onAnswerSelect={handleAnswer}
        isTimeUp={isTimeUp}
        isTransitioning={isTransitioning}
        className="mb-8"
      />

      {/* Navigation */}

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {currentQuestionIndex + 1 == questions.length
            ? "See Results"
            : selectedAnswer === ""
              ? "Skip Question"
              : "Next Question"}
        </button>
      </div>

      {/* Exit Confirmation Modal */}
      <ExitConfirmationModal
        isOpen={showExitConfirm}
        onCancel={cancelExit}
        onConfirm={confirmExit}
      />
    </div>
  );
}
