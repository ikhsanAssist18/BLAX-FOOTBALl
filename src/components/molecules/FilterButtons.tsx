import React from 'react';
import Button from '../atoms/Button';

interface FilterButtonsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: { value: string; label: string }[];
  className?: string;
}

export default function FilterButtons({ activeFilter, onFilterChange, filters, className = '' }: FilterButtonsProps) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeFilter === filter.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}