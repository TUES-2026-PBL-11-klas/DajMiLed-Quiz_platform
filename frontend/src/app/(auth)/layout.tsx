import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center relative overflow-hidden">

      <div 
        className="absolute inset-0 z-0 bg-scholarly-texture opacity-20" 
        aria-label="atmospheric close-up of vintage leather books, inkwell, and parchment paper on a dark oak desk with soft morning sunlight streaming through a library window"
      />
      

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-fixed-dim opacity-30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary-fixed opacity-20 rounded-full blur-[120px]" />
      
      <main className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">

        <div className="hidden lg:flex flex-col space-y-8 pr-12">
          <div>
            <span className="font-display font-extrabold text-primary text-4xl tracking-tighter mb-4 block">
              The Modern Scholar
            </span>
            <h1 className="font-display font-bold text-5xl text-on-surface leading-tight tracking-tight">
              Where curious minds find their <span className="text-secondary italic">rhythm.</span>
            </h1>
          </div>
          <p className="text-lg text-on-surface-variant max-w-md leading-relaxed">
            Join our community of lifelong learners. Access premium research papers, interactive quizzes, and a global network of scholarly progress.
          </p>

        </div>


        <div className="flex justify-center lg:justify-end">
          {children}
        </div>
      </main>


    </div>
  );
}
