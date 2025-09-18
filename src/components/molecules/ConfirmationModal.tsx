import React from "react";
import { AlertTriangle, CheckCircle, X, Loader2 } from "lucide-react";
import Button from "../atoms/Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "danger" | "warning" | "info";
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="h-12 w-12 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
      case "info":
        return <CheckCircle className="h-12 w-12 text-blue-500" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "info":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      default:
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">{getIcon()}</div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>

          {/* Message */}
          <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
              className="text-black border-gray-300 hover:bg-gray-50"
              intent="cancel"
            >
              {cancelText}
            </Button>

            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={getConfirmButtonStyle()}
              intent={type === "danger" ? "delete" : "default"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
