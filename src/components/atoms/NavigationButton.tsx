import React from "react";
import type { LucideIcon } from "lucide-react";
import Button from "./Button";

interface NavigationButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
  size = "md",
  className,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={className}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </Button>
  );
};
