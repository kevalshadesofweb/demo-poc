"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useQuizStore } from "@/store/useQuizStore";
import type { QuizSettings } from "@/types/quiz";
import { DIFFICULTIES, QUESTION_COUNTS, TIME_OPTIONS } from "@/constants/quiz";

export function TopicSelection() {
  const { data: categories, isLoading, error } = useCategories();
  const setSettings = useQuizStore((state) => state.setSettings);
  const [selectedCategory, setSelectedCategory] = useState<number>(9); // Default to General Knowledge
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<QuizSettings["difficulty"]>("easy");
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [selectedTime, setSelectedTime] = useState(30);

  const handleStartQuiz = () => {
    setSettings({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      amount: selectedAmount,
      timePerQuestion: selectedTime,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error:{" "}
        {error instanceof Error ? error.message : "Failed to fetch categories"}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Select Quiz Settings</h2>

      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`flex-1 py-2 px-4 rounded-md capitalize ${
                  selectedDifficulty === difficulty
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <div className="flex gap-2">
            {QUESTION_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => setSelectedAmount(count)}
                className={`flex-1 py-2 px-4 rounded-md ${
                  selectedAmount === count
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Time Per Question Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Per Question (seconds)
          </label>
          <div className="flex gap-2">
            {TIME_OPTIONS.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`flex-1 py-2 px-4 rounded-md ${
                  selectedTime === time
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {time}s
              </button>
            ))}
          </div>
        </div>

        {/* Start Quiz Button */}
        <button
          onClick={handleStartQuiz}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
