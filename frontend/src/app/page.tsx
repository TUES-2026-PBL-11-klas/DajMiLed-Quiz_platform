import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen relative overflow-hidden flex flex-col">
      <div 
        className="absolute inset-0 z-0 bg-scholarly-texture opacity-10" 
        aria-label="subtle library texture"
      />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-fixed-dim opacity-20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary-fixed opacity-20 rounded-full blur-[120px]" />
      
      <nav className="relative z-10 flex justify-between items-center h-24 px-8 md:px-16 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-black text-primary font-display tracking-tight">
          The Modern Scholar
        </div>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-6 py-2.5 rounded-full font-bold text-primary hover:bg-surface-container-low transition-colors"
          >
             Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-2.5 rounded-full font-bold primary-gradient text-on-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Get Started
          </Link>
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
          <Link 
            href="/register" 
            className="px-10 py-5 rounded-full primary-gradient text-on-primary font-display font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            Start Your Journey
          </Link>
          <Link 
            href="/dashboard" 
            className="px-10 py-5 rounded-full bg-surface-container-high text-on-surface font-display font-bold text-lg hover:bg-surface-variant transition-colors flex items-center justify-center border border-outline-variant/20"
          >
            Explore Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-center">
          <div className="glass-panel p-10 rounded-2xl border border-outline-variant/20 relative overflow-hidden group min-h-[250px] flex flex-col justify-end items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="font-display font-bold text-2xl text-on-surface mb-3 relative z-10">Semantic AI Grading</h3>
            <p className="text-on-surface-variant leading-relaxed relative z-10">
              Not just multiple choice. Our two-step semantic algorithm analyzes free-text answers, extracting context and keywords to evaluate true understanding.
            </p>
          </div>
          
          <div className="glass-panel p-10 rounded-2xl border border-outline-variant/20 relative overflow-hidden group min-h-[250px] flex flex-col justify-end items-center">
             <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="font-display font-bold text-2xl text-on-surface mb-3 relative z-10">Effortless Generation</h3>
            <p className="text-on-surface-variant leading-relaxed relative z-10">
              As intuitive as Google Forms, but smarter. Automatically generate complete quizzes and rubrics directly from your curriculum text.
            </p>
          </div>
          
          <div className="glass-panel p-10 rounded-2xl border border-outline-variant/20 relative overflow-hidden group min-h-[250px] flex flex-col justify-end items-center">
             <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="font-display font-bold text-2xl text-on-surface mb-3 relative z-10">Instant Explanations</h3>
            <p className="text-on-surface-variant leading-relaxed relative z-10">
               Students shouldn't wait weeks to learn from their mistakes. We provide immediate, personalized AI explanations for every incorrect answer.
            </p>
          </div>
        </div>

        <section className="mt-32 mb-16 w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6 text-on-surface">The Scholarly Upgrade.</h2>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">We bridged the gap between intuitive design and advanced artificial intelligence.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way Card */}
            <div className="p-10 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/60 flex flex-col justify-between group hover:bg-surface-container transition-colors duration-500">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8 text-center w-full">The Static Past</h3>
                <h4 className="font-display text-3xl font-bold text-on-surface mb-8 text-center">Legacy Platforms</h4>
                
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-error mt-2.5 shrink-0 opacity-40" />
                    <p className="text-on-surface font-medium leading-relaxed">
                      Manual grading of open-ended questions takes hours of teacher time.
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-error mt-2.5 shrink-0 opacity-40" />
                    <p className="text-on-surface font-medium leading-relaxed">
                      Rigid formats often penalize students for minor typos or capitalization.
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-error mt-2.5 shrink-0 opacity-40" />
                    <p className="text-on-surface font-medium leading-relaxed">
                      Students wait days for feedback, losing the "teachable moment" entirely.
                    </p>
                  </li>
                </ul>
              </div>
              
              <div className="mt-12 pt-8 border-t border-outline-variant/10 italic text-primary font-bold text-sm">
                "As slow as it is outdated."
              </div>
            </div>

            {/* The Modern Scholar Card */}
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
                    <p className="text-on-surface font-medium leading-relaxed">
                      Semantic AI grades complex free-text answers with 94%+ accuracy.
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <p className="text-on-surface font-medium leading-relaxed">
                      AI-generated test variations from your own text in a single click.
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <p className="text-on-surface font-medium leading-relaxed">
                      Real-time explanations for mistakes ensure immediate learning.
                    </p>
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

      </main>
    </div>
  );
}
