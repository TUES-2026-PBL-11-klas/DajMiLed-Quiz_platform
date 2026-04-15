"use client";

import React, { useState, useEffect, useRef } from 'react';

export interface OpenEndedQuestionProps {
  question: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const OpenEndedQuestion: React.FC<OpenEndedQuestionProps> = ({
  question,
  value = "",
  placeholder = "Type your thoughtful response here...",
  onChange,
}) => {
  const [text, setText] = useState<string>(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    onChange?.(val);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <h2 className="text-xl md:text-2xl font-display font-bold text-on-surface">
        {question}
      </h2>
      
      <div className="relative group w-full">
        <textarea 
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          className="w-full p-6 bg-surface-container-low border-none rounded-xl 
                     focus:ring-2 focus:ring-primary/40 focus:outline-none 
                     placeholder:text-on-surface-variant/50 font-body 
                     resize-y min-h-[160px] text-lg text-on-surface
                     transition-shadow duration-300 group-hover:shadow-sm"
          placeholder={placeholder}
          aria-label="Your answer"
          rows={4}
        />
      </div>
    </div>
  );
};
