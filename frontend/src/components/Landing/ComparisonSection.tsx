import React from 'react';
import Link from 'next/link';

export function ComparisonSection() {
  return (
    <section className="mt-32 mb-16 w-full max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6 text-on-surface">The Scholarly Upgrade.</h2>
        <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">We bridged the gap between intuitive design and advanced artificial intelligence.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        <div className="p-10 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/60 flex flex-col justify-between group hover:bg-surface-container transition-colors duration-500">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8 text-center w-full">The Static Past</h3>
            <h4 className="font-display text-3xl font-bold text-on-surface mb-8 text-center">Legacy Platforms</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-error mt-2.5 shrink-0 opacity-40" />
                <p className="text-on-surface font-medium leading-relaxed">Manual grading of open-ended questions takes hours of teacher time.</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-error mt-2.5 shrink-0 opacity-40" />
                <p className="text-on-surface font-medium leading-relaxed">Rigid formats often penalize students for minor typos or capitalization.</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-error mt-2.5 shrink-0 opacity-40" />
                <p className="text-on-surface font-medium leading-relaxed">Students wait days for feedback, losing the &quot;teachable moment&quot; entirely.</p>
              </li>
            </ul>
          </div>
          <div className="mt-12 pt-8 border-t border-outline-variant/10 italic text-primary font-bold text-sm">
            &quot;As slow as it is outdated.&quot;
          </div>
        </div>

        <div className="p-10 rounded-[2.5rem] primary-gradient-soft border border-primary/20 flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-primary/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 w-full">
            <div className="mb-8 w-full text-center">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">The Intelligent Future</h3>
            </div>
            <h4 className="font-display text-3xl font-bold text-on-surface mb-8 text-center">Modern Scholar</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <p className="text-on-surface font-medium leading-relaxed">Semantic AI grades complex free-text answers with 94%+ accuracy.</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <p className="text-on-surface font-medium leading-relaxed">AI-generated test variations from your own text in a single click.</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <p className="text-on-surface font-medium leading-relaxed">Real-time explanations for mistakes ensure immediate learning.</p>
              </li>
            </ul>
          </div>
          <div className="mt-12 relative z-10">
            <Link href="/register" className="inline-flex items-center text-primary font-bold hover:opacity-80 transition-opacity duration-300">
              Join the Evolution
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
