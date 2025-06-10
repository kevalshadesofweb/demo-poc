import { type JSX } from "react";

export interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showPercentage?: boolean;
  color?: "blue" | "green" | "red" | "purple";
}

export function ProgressBar({
  current,
  total,
  className = "",
  showPercentage = false,
  color = "blue",
}: ProgressBarProps): JSX.Element {
  const percentage = Math.min((current / total) * 100, 100);
  
  const getColorClasses = () => {
    switch (color) {
      case "green":
        return "bg-green-500";
      case "red":
        return "bg-red-500";
      case "purple":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`${getColorClasses()} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-gray-600 text-center">
          {Math.round(percentage)}% ({current}/{total})
        </div>
      )}
    </div>
  );
} 