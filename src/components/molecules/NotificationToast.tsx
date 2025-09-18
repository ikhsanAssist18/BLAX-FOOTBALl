"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X, Info, AlertTriangle } from "lucide-react";

export interface ToastNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

interface NotificationToastProps {
  notification: ToastNotification;
  onClose: (id: string) => void;
}

export default function NotificationToast({
  notification,
  onClose,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notification.persistent && notification.duration !== 0) {
      const duration = notification.duration || 5000;
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration, notification.persistent]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border-l-4 shadow-lg";
    switch (notification.type) {
      case "success":
        return `${baseStyles} bg-green-50 border-green-400`;
      case "error":
        return `${baseStyles} bg-red-50 border-red-400`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-400`;
      case "info":
        return `${baseStyles} bg-blue-50 border-blue-400`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-400`;
    }
  };

  return (
    <div
      className={`
        max-w-sm w-full rounded-lg p-4 transition-all duration-300 ease-in-out transform
        ${getStyles()}
        ${
          isVisible && !isLeaving
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }
        ${isLeaving ? "translate-x-full opacity-0" : ""}
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            {notification.title}
          </h3>
          {notification.message && (
            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleClose}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
