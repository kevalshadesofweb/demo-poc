import { type JSX } from "react";

export interface ResultCardProps {
  questionNumber: number;
  question: string;
  userAnswer?: string;
  correctAnswer: string;
  allAnswers: string[];
  isCorrect: boolean;
  isSkipped: boolean;
  className?: string;
}

export function ResultCard({
  questionNumber,
  question,
  userAnswer,
  correctAnswer,
  allAnswers,
  isCorrect,
  isSkipped,
  className = "",
}: ResultCardProps): JSX.Element {
  const getStatusIcon = () => {
    if (isSkipped) {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    if (isCorrect) {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    );
  };

  const getStatusText = () => {
    if (isSkipped) return "Skipped";
    if (isCorrect) return "Correct";
    return "Incorrect";
  };

  const getStatusColor = () => {
    if (isSkipped) return "text-orange-600";
    if (isCorrect) return "text-green-600";
    return "text-red-600";
  };

  const getBorderColor = () => {
    if (isSkipped) return "border-orange-200 bg-orange-50";
    if (isCorrect) return "border-green-200 bg-green-50";
    return "border-red-200 bg-red-50";
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getBorderColor()} ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-800">Question {questionNumber}</h3>
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 ${getStatusColor()} text-sm`}
          >
            {getStatusIcon()}
            {getStatusText()}
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-3">{question}</p>

      <div className="space-y-2">
        {allAnswers.map((answer, index) => {
          const isUserAnswer = userAnswer === answer;
          const isCorrectAnswer = correctAnswer === answer;

          let answerClass = "p-2 rounded text-sm";
          if (isCorrectAnswer) {
            answerClass +=
              " bg-green-100 text-green-800 border border-green-200";
          } else if (isUserAnswer && !isCorrect) {
            answerClass += " bg-red-100 text-red-800 border border-red-200";
          } else {
            answerClass += " bg-gray-100 text-gray-700";
          }

          return (
            <div key={index} className={answerClass}>
              <span className="font-medium">
                {isCorrectAnswer && "✓ "}
                {isUserAnswer && !isCorrect && "✗ "}
                {answer}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
