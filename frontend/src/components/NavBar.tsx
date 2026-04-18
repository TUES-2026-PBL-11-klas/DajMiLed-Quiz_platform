'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, PlusCircle, BookOpen, Search } from 'lucide-react';

interface NavBarProps {
  activeLink?: 'explore' | 'create' | 'my-forms';
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export function NavBar({ activeLink, showSearch, onSearch }: NavBarProps) {
  const { isLoggedIn, username, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : '?';

  return (
    <header className="w-full top-0 left-0 bg-surface/90 backdrop-blur-md sticky z-50 border-b border-outline-variant/20">
      <nav className="flex justify-between items-center h-20 px-8 lg:px-12 w-full max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-2xl font-black text-primary font-display tracking-tight flex items-center gap-2"
        >
          The Modern Scholar
        </Link>

        <div className="hidden md:flex items-center gap-8 font-display font-bold tracking-tight lg:mr-auto lg:pl-12">
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 transition-opacity duration-200 hover:opacity-80 ${
              activeLink === 'explore'
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-on-surface-variant font-medium'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Explore
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/forms/create"
                className={`flex items-center gap-1.5 transition-opacity duration-200 hover:opacity-80 ${
                  activeLink === 'create'
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant font-medium'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                Create
              </Link>
              <Link
                href="/my-forms"
                className={`transition-opacity duration-200 hover:opacity-80 ${
                  activeLink === 'my-forms'
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant font-medium'
                }`}
              >
                My Forms
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="relative hidden md:block w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                type="text"
                placeholder="Search quizzes..."
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary text-sm text-on-surface placeholder:text-outline/60 font-medium outline-none transition-all"
              />
            </div>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center font-bold text-on-primary-container text-sm">
                {initials}
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-error transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold px-4 py-2 rounded-full primary-gradient text-on-primary shadow-sm hover:scale-[1.02] transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
