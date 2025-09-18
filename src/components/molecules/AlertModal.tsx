"use client";
import React from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import Button from "../atoms/Button";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

// Warning Modal Component
export function WarningModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = true,
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          {showCancel && (
            <Button onClick={onClose} variant="outline">
              {cancelText}
            </Button>
          )}
          <Button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            variant="primary"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Success Modal Component
export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = "OK",
  showCancel = false,
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            variant="primary"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

// General Alert Modal Component
export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = true,
  variant = "info",
}: BaseModalProps & { variant?: "info" | "error" | "warning" }) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "error":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />,
          buttonClass: "bg-red-500 hover:bg-red-600 text-white",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />,
          buttonClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
        };
      default:
        return {
          icon: <Info className="h-6 w-6 text-blue-500 mr-2" />,
          buttonClass: "bg-blue-500 hover:bg-blue-600 text-white",
        };
    }
  };

  const { icon, buttonClass } = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {icon}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          {showCancel && (
            <Button onClick={onClose} variant="outline">
              {cancelText}
            </Button>
          )}
          <Button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            variant="primary"
            className={buttonClass}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
