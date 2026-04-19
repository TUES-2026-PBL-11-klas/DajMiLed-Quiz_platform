"use client";

import React, { useRef } from 'react';

export interface Option {
  id: string;
  label: string;
}

export interface MultipleChoiceQuestionProps {
  question: string;
  options: Option[];
  value?: string;
  onChange?: (id: string) => void;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  options,
  value,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedValue = value;

  const handleSelect = (id: string) => {
    onChange?.(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number, id: string) => {
    const buttons = containerRef.current?.querySelectorAll('button');
    if (!buttons) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      buttons[(index + 1) % buttons.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      buttons[(index - 1 + buttons.length) % buttons.length].focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface leading-snug">
        {question}
      </h2>

      <div
        ref={containerRef}
        role="radiogroup"
        aria-label="Multiple choice options"
        className="flex flex-col gap-3"
      >
        {options.map((option, index) => {
          const isSelected = selectedValue === option.id;

          return (
            <button
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleSelect(option.id)}
              onKeyDown={(e) => handleKeyDown(e, index, option.id)}
              className={`
                group flex items-center gap-4 px-5 py-4 rounded-xl text-left border outline-none
                transition-all duration-200
                focus-visible:ring-4 focus-visible:ring-primary/30
                ${isSelected
                  ? 'bg-primary-fixed/30 border-primary/30'
                  : 'bg-surface-container-low hover:bg-surface-container border-transparent hover:border-outline-variant/20'
                }
              `}
            >
              {/* Radio circle */}
              <span className={`
                flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200
                ${isSelected
                  ? 'border-primary bg-primary'
                  : 'border-outline-variant bg-transparent group-hover:border-primary/50'
                }
              `} />

              <span className={`
                text-base font-medium transition-colors duration-200
                ${isSelected ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}
              `}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
