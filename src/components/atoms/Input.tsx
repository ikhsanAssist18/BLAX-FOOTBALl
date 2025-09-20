import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  min?: string;
  max?: string;
}

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  icon,
  min,
  max,
}: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className={`w-full ${
          icon ? "pl-10" : "pl-4"
        } pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      />
    </div>
  );
}
