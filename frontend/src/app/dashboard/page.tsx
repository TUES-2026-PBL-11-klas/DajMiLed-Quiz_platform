import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { QuizCard } from '@/components/QuizCard';

const availableQuizzes = [
  { id: 1, title: 'Proportions of the Ancients', category: 'History', questionCount: 24, className: 'md:col-span-6 lg:col-span-5' },
  { id: 2, title: 'Stoicism in Modern Life', category: 'Philosophy', questionCount: 12, className: 'md:col-span-6 lg:col-span-7' },
  { id: 3, title: 'The Secret Language of Flora', category: 'Botany', questionCount: 18, className: 'md:col-span-4 lg:col-span-4' },
  { id: 4, title: "Literary Theory: The Hero's Journey", category: 'Literature', questionCount: 15, className: 'md:col-span-4 lg:col-span-4' },
  { id: 5, title: 'The Renaissance Color Palette', category: 'Art', questionCount: 10, className: 'md:col-span-4 lg:col-span-4' },
  { id: 6, title: 'Celestial Navigation & Maps', category: 'Astronomy', questionCount: 20, className: 'md:col-span-7 lg:col-span-7' },
  { id: 7, title: 'The Daily Scholarly Riddle', category: 'Logic', questionCount: 3, className: 'md:col-span-5 lg:col-span-5' }
];

export default function DashboardPage() {
  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed-variant">
      
      <header className="w-full top-0 left-0 bg-surface/90 backdrop-blur-md sticky z-50 border-b border-outline-variant/20">
        <nav className="flex justify-between items-center h-20 px-8 lg:px-12 w-full max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-black text-primary font-display tracking-tight flex items-center gap-2">
            The Modern Scholar
          </Link>
          
          <div className="hidden md:flex items-center gap-10 font-display font-bold tracking-tight lg:mr-auto lg:pl-12">
            <Link href="/dashboard" className="text-primary border-b-2 border-primary pb-1 hover:opacity-80 transition-opacity duration-200">
              Explore
            </Link>
            <Link href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors hover:opacity-80 duration-200">
              My Profile
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input 
                type="text" 
                placeholder="Find a subject..." 
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary text-sm text-on-surface placeholder:text-outline/60 font-medium outline-none transition-all"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity">
              JD
            </div>
          </div>
        </nav>
      </header>

      <main className="min-h-screen pb-24">
        <section className="px-8 lg:px-12 pt-16 pb-16 max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-2xl mb-6">Available Inquiries</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
            {availableQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} {...quiz} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
