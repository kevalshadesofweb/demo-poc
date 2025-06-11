"use client";

import { motion } from "framer-motion";
import { useQuizStore } from "@/store/useQuizStore";
import { decodeHtml } from "@/utils/quiz";
import { ResultCard } from "@repo/ui";

export function Results() {
  const { settings, questions, resetQuiz } = useQuizStore();

  if (!settings || !questions) {
    return null;
  }
  if (!questions.length) return null;

  // Calculate score based on questions with 'selected' field that match correct_answer
  const score = questions.filter(
    (question) =>
      question.selected && question.selected === question.correct_answer
  ).length;

  const percentage = Math.round((score / questions.length) * 100);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getSkippedCount = () => {
    return questions.filter((question) => !question.selected).length;
  };

  const getAnsweredCount = () => {
    return questions.filter((question) => question.selected).length;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="bg-white rounded-xl shadow-lg overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center border-b">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Quiz Results
          </motion.h1>
        </div>

        {/* Score Summary */}
        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6"
          >
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${getScoreColor(percentage)}`}
              >
                {percentage}%
              </div>
              <div className="text-sm opacity-90">
                {score} / {questions.length}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <p className="text-lg text-gray-700">
              You got{" "}
              <span className="font-semibold text-blue-600">{score}</span> out
              of <span className="font-semibold">{questions.length}</span>{" "}
              questions correct!
            </p>
            {getSkippedCount() > 0 && (
              <p className="text-sm text-gray-500">
                <span className="font-medium text-orange-600">
                  {getSkippedCount()}
                </span>{" "}
                questions were skipped due to time constraints.
              </p>
            )}
            <p className="text-sm text-gray-500">
              <span className="font-medium text-green-600">
                {getAnsweredCount()}
              </span>{" "}
              questions were answered.
            </p>
          </motion.div>
        </div>

        {/* Question Review */}
        <div className="p-6 border-t">
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl font-semibold text-gray-800 mb-4"
          >
            Question Review
          </motion.h2>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = question.selected;
              const isCorrect =
                userAnswer === decodeHtml(question.correct_answer);
              const isSkipped = !userAnswer;
              const allAnswers = [
                ...question.incorrect_answers,
                question.correct_answer,
              ];
              const shuffledAnswers = allAnswers.sort(
                () => Math.random() - 0.5
              );

              return (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <ResultCard
                    questionNumber={index + 1}
                    question={decodeHtml(question.question)}
                    userAnswer={userAnswer}
                    correctAnswer={question.correct_answer}
                    allAnswers={shuffledAnswers.map((answer) =>
                      decodeHtml(answer)
                    )}
                    isCorrect={isCorrect}
                    isSkipped={isSkipped}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t bg-gray-50">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center gap-4"
          >
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Take Another Quiz
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
