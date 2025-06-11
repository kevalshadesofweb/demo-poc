import { JSX } from "react";

export interface QuestionCardProps {
  question: string;
  answers: string[];
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  isTimeUp?: boolean;
  isTransitioning?: boolean;
  className?: string;
}

export function QuestionCard({
  question,
  answers,
  selectedAnswer,
  onAnswerSelect,
  isTimeUp = false,
  isTransitioning = false,
  className = "",
}: QuestionCardProps): JSX.Element {
  const handleAnswerClick = (answer: string) => {
    if (isTimeUp || isTransitioning) return;
    onAnswerSelect(answer);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Question Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{question}</h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {answers.map((answer, index) => {
          return (
            <button
              key={index}
              onClick={() => handleAnswerClick(answer)}
              disabled={isTimeUp || isTransitioning}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer == answer
                  ? "border-blue-500 bg-blue-500 text-blue-900 shadow-lg"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              } ${
                isTimeUp || isTransitioning
                  ? "cursor-not-allowed opacity-75"
                  : "cursor-pointer hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{answer}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
