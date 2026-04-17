"use client";

import React, { useRef, useMemo } from 'react';

export interface Option {
  id: string;
  label: string;
}

export interface MultipleAnswerQuestionProps {
  question: string;
  options: Option[];
  values?: string[];
  onChange?: (ids: string[]) => void;
  hint?: string;
}

export const MultipleAnswerQuestion: React.FC<MultipleAnswerQuestionProps> = ({
  question,
  options,
  values = [],
  onChange,
  hint = 'Select all that apply',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => new Set(values), [values]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onChange?.(Array.from(next));
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
      toggle(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface leading-snug">
          {question}
        </h2>
        <span className="text-sm font-medium text-on-surface-variant/60 font-body">{hint}</span>
      </div>

      <div
        ref={containerRef}
        role="group"
        aria-label="Multiple answer options"
        className="flex flex-col gap-3"
      >
        {options.map((option, index) => {
          const isChecked = selected.has(option.id);

          return (
            <button
              key={option.id}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={0}
              onClick={() => toggle(option.id)}
              onKeyDown={(e) => handleKeyDown(e, index, option.id)}
              className={`
                group flex items-center gap-4 px-5 py-4 rounded-xl text-left border outline-none
                transition-all duration-200
                focus-visible:ring-4 focus-visible:ring-secondary/30
                ${isChecked
                  ? 'bg-secondary-container/40 border-secondary/30'
                  : 'bg-surface-container-low hover:bg-surface-container border-transparent hover:border-outline-variant/20'
                }
              `}
            >
              {/* Checkbox square */}
              <span className={`
                flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center
                transition-all duration-200
                ${isChecked
                  ? 'border-secondary bg-secondary'
                  : 'border-outline-variant bg-transparent group-hover:border-secondary/50'
                }
              `}>
                {isChecked && (
                  <svg className="w-3 h-3 text-on-secondary" viewBox="0 0 12 12" fill="none" strokeWidth={2.5} stroke="currentColor">
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                )}
              </span>

              <span className={`
                text-base font-medium transition-colors duration-200
                ${isChecked ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}
              `}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {selected.size > 0 && (
        <p className="text-xs text-on-surface-variant/50 font-body">
          {selected.size} of {options.length} selected
        </p>
      )}
    </div>
  );
};
