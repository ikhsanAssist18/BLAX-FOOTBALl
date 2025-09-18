"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import NotificationToast, {
  ToastNotification,
} from "../molecules/NotificationToast";

interface NotificationContextType {
  showNotification: (notification: Omit<ToastNotification, "id">) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, persistent?: boolean) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const showNotification = (notification: Omit<ToastNotification, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: ToastNotification = {
      ...notification,
      id,
    };

    setNotifications((prev) => [...prev, newNotification]);
  };

  const showSuccess = (title: string, message?: string, duration = 4000) => {
    showNotification({ type: "success", title, message, duration });
  };

  const showError = (title: string, message?: string, persistent = false) => {
    showNotification({
      type: "error",
      title,
      message,
      duration: persistent ? 0 : 6000,
      persistent,
    });
  };

  const showWarning = (title: string, message?: string, duration = 5000) => {
    showNotification({ type: "warning", title, message, duration });
  };

  const showInfo = (title: string, message?: string, duration = 4000) => {
    showNotification({ type: "info", title, message, duration });
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
