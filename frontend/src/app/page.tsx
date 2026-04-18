import React from 'react';
import Link from 'next/link';
import { ComparisonSection } from '@/components/Landing/ComparisonSection';

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0 bg-scholarly-texture opacity-10" aria-label="subtle library texture" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-fixed-dim opacity-20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary-fixed opacity-20 rounded-full blur-[120px]" />

      <nav className="relative z-10 flex justify-between items-center h-24 px-8 md:px-16 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-black text-primary font-display tracking-tight">The Modern Scholar</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2.5 rounded-full font-bold text-primary hover:bg-surface-container-low transition-colors">Sign In</Link>
          <Link href="/register" className="px-6 py-2.5 rounded-full font-bold primary-gradient text-on-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Get Started</Link>
        </div>
      </nav>

      <main className="relative z-10 flex-grow flex flex-col items-center flex-start pt-24 px-6 max-w-5xl mx-auto w-full text-center">
        <h1 className="font-display font-bold text-6xl md:text-8xl text-on-surface leading-[1.1] tracking-tight mb-8">
          The End of <span className="text-secondary italic">Manual Grading.</span>
        </h1>
        <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed mb-12">
          Transition from static forms to our AI-powered semantic grading engine. Instant feedback for students, zero manual review for teachers.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/register" className="px-10 py-5 rounded-full primary-gradient text-on-primary font-display font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center">Start Your Journey</Link>
          <Link href="/dashboard" className="px-10 py-5 rounded-full bg-surface-container-high text-on-surface font-display font-bold text-lg hover:bg-surface-variant transition-colors flex items-center justify-center border border-outline-variant/20">Explore Dashboard</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-center">
          <div className="glass-panel p-10 rounded-2xl border border-outline-variant/20 relative overflow-hidden group min-h-[250px] flex flex-col justify-end items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="font-display font-bold text-2xl text-on-surface mb-3 relative z-10">Semantic AI Grading</h3>
            <p className="text-on-surface-variant leading-relaxed relative z-10">Not just multiple choice. Our two-step semantic algorithm analyzes free-text answers, extracting context and keywords to evaluate true understanding.</p>
          </div>
          <div className="glass-panel p-10 rounded-2xl border border-outline-variant/20 relative overflow-hidden group min-h-[250px] flex flex-col justify-end items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="font-display font-bold text-2xl text-on-surface mb-3 relative z-10">Effortless Generation</h3>
            <p className="text-on-surface-variant leading-relaxed relative z-10">As intuitive as Google Forms, but smarter. Automatically generate complete quizzes and rubrics directly from your curriculum text.</p>
          </div>
          <div className="glass-panel p-10 rounded-2xl border border-outline-variant/20 relative overflow-hidden group min-h-[250px] flex flex-col justify-end items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="font-display font-bold text-2xl text-on-surface mb-3 relative z-10">Instant Explanations</h3>
            <p className="text-on-surface-variant leading-relaxed relative z-10">Students shouldn&apos;t wait weeks to learn from their mistakes. We provide immediate, personalized AI explanations for every incorrect answer.</p>
          </div>
        </div>

        <ComparisonSection />
      </main>
    </div>
  );
}
