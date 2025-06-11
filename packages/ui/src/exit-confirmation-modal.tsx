import { JSX } from "react";

export interface ExitConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  className?: string;
}

export function ExitConfirmationModal({
  isOpen,
  onCancel,
  onConfirm,
  title = "Exit Quiz?",
  message = "Are you sure you want to exit? Your current progress will be saved and you'll see your results.",
  cancelText = "Cancel",
  confirmText = "Exit Quiz",
  className = "",
}: ExitConfirmationModalProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${className}`}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
