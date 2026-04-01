import React from 'react';
import Link from 'next/link';

export interface QuizCardProps {
  id: number | string;
  title: string;
  category: string;
  questionCount: number;
  className?: string; 
}

export function QuizCard({ 
  id,
  title, 
  category, 
  questionCount, 
  className = '', 
}: QuizCardProps) {
  const variants: ('primary' | 'secondary' | 'tertiary')[] = ['primary', 'secondary', 'tertiary'];
  const numericId = typeof id === 'number' ? id : (id.length || 0);
  const colorVariant = variants[numericId % variants.length];

  const colorStyles = {
    primary: {
      bg: 'bg-primary-container/80',
      text: 'text-on-primary-container',
      textMuted: 'text-on-primary-container/70',
      badgeBg: 'bg-primary/10 text-on-primary-container',
      button: 'bg-primary text-white shadow-primary/20',
      shadow: 'shadow-primary/5'
    },
    secondary: {
      bg: 'bg-secondary-container/80',
      text: 'text-on-secondary-container',
      textMuted: 'text-on-secondary-container/70',
      badgeBg: 'bg-secondary/10 text-on-secondary-container',
      button: 'bg-secondary text-white shadow-secondary/20',
      shadow: 'shadow-secondary/5'
    },
    tertiary: {
      bg: 'bg-tertiary-container/80',
      text: 'text-on-tertiary-container',
      textMuted: 'text-on-tertiary-container/70',
      badgeBg: 'bg-tertiary/10 text-on-tertiary-container',
      button: 'bg-tertiary text-white shadow-tertiary/20',
      shadow: 'shadow-tertiary/5'
    }
  };

  const style = colorStyles[colorVariant] || colorStyles.primary;

  return (
    <div className={`group relative overflow-hidden rounded-2xl ${style.bg} border border-outline-variant/10 transition-transform duration-700 hover:scale-[1.02] cursor-pointer shadow-lg ${style.shadow} flex flex-col justify-end p-8 ${className}`}>
      <div className="absolute inset-0 bg-scholarly-texture opacity-10 mix-blend-multiply pointer-events-none" />
      
      <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full ${style.badgeBg} opacity-40 blur-2xl group-hover:scale-110 transition-transform duration-700`} />
      <div className={`absolute top-1/2 left-0 w-32 h-32 rounded-full ${style.badgeBg} opacity-20 blur-xl group-hover:translate-x-4 transition-transform duration-1000`} />
      
      <div className={`relative z-10 ${style.text} w-full`}>
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full bg-white/40 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest ${style.text}`}>
            {category}
          </span>
        </div>
        
        <h2 className="font-display text-2xl lg:text-3xl font-extrabold mb-4 leading-tight">{title}</h2>
        
        <div className="flex items-end justify-between gap-4 mt-auto">
          <div className="space-y-1">
            <p className={`${style.textMuted} text-xs font-bold uppercase tracking-wider`}>
              {questionCount} Questions
            </p>
          </div>
          <Link href="/quiz/view" className={`px-6 py-2.5 rounded-full font-bold shadow-md active:scale-95 transition-all text-sm ${style.button}`}>
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
}
