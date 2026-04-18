'use client';

import React from 'react';
import { DraftQuestion, QuestionType, TYPE_LABELS } from '@/types/form';
import { Trash2, GripVertical, ChevronDown, PlusCircle } from 'lucide-react';

interface Props {
  question: DraftQuestion;
  index: number;
  totalCount: number;
  onUpdate: (qId: string, patch: Partial<DraftQuestion>) => void;
  onRemove: (qId: string) => void;
  onChangeType: (qId: string, type: QuestionType) => void;
  onAddChoice: (qId: string) => void;
  onRemoveChoice: (qId: string, cId: string) => void;
  onUpdateChoice: (qId: string, cId: string, text: string) => void;
}

export function QuestionCard({ question: q, index, totalCount, onUpdate, onRemove, onChangeType, onAddChoice, onRemoveChoice, onUpdateChoice }: Props) {
  return (
    <div className="rounded-2xl bg-surface-container p-6 border border-outline-variant/20 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <GripVertical className="w-4 h-4 opacity-40" />
          <span className="text-xs font-bold uppercase tracking-wider">Question {index + 1}</span>
        </div>
        <button type="button" onClick={() => onRemove(q.id)} disabled={totalCount === 1} className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-30" title="Remove question">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <textarea
        value={q.text}
        onChange={(e) => onUpdate(q.id, { text: e.target.value })}
        placeholder="Enter your question here..."
        rows={2}
        className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/40 outline-none resize-none mb-4"
      />

      <div className="relative mb-5">
        <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Question Type</label>
        <div className="relative">
          <select value={q.type} onChange={(e) => onChangeType(q.id, e.target.value as QuestionType)} className="w-full appearance-none px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary pr-10">
            {Object.entries(TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
        </div>
      </div>

      {q.type !== 'open_ended' && (
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-2">Answer Options</label>
          <div className="flex flex-col gap-2 mb-3">
            {q.choices.map((c, cIdx) => (
              <div key={c.id} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-xs font-bold text-on-surface-variant flex-shrink-0">
                  {String.fromCharCode(65 + cIdx)}
                </span>
                <input type="text" value={c.text} onChange={(e) => onUpdateChoice(q.id, c.id, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + cIdx)}`} className="flex-1 px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" onClick={() => onRemoveChoice(q.id, c.id)} disabled={q.choices.length <= 1} className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-30">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onAddChoice(q.id)} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80 transition-opacity">
            <PlusCircle className="w-3.5 h-3.5" />
            Add Option
          </button>
        </div>
      )}

      {q.type === 'open_ended' && (
        <div className="px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-sm text-on-surface-variant italic">
          Students will type a free-text answer. The evaluation service will score it.
        </div>
      )}
    </div>
  );
}
