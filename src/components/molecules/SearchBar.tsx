import React from 'react';
import { Search } from 'lucide-react';
import Input from '../atoms/Input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search...", className = '' }: SearchBarProps) {
  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      icon={<Search className="h-5 w-5 text-gray-400" />}
      className={className}
    />
  );
}