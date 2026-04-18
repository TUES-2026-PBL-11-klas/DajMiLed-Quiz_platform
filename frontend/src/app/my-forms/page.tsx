'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/NavBar';
import { formService, FormResponse } from '@/services/formService';
import { useAuth } from '@/hooks/useAuth';
import { PlusCircle, ExternalLink, ClipboardList } from 'lucide-react';

export default function MyFormsPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [forms, setForms] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadMyForms = useCallback(async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await formService.getMyForms(p, 12);
      setForms(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setError('Could not load your forms. Make sure you are logged in and the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    loadMyForms(page);
  }, [isLoggedIn, loadMyForms, page, router]);

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <NavBar activeLink="my-forms" />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-extrabold text-3xl mb-1">My Quizzes</h1>
            <p className="text-on-surface-variant">Quizzes you&apos;ve created</p>
          </div>
          <Link
            href="/forms/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full primary-gradient text-on-primary font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            New Quiz
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-32">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-24">
            <p className="text-error font-semibold mb-4">{error}</p>
            <button
              onClick={() => loadMyForms(page)}
              className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-bold text-sm hover:opacity-80 transition-opacity"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && forms.length === 0 && (
          <div className="text-center py-32">
            <ClipboardList className="w-16 h-16 text-outline mx-auto mb-4 opacity-40" />
            <p className="text-on-surface-variant font-medium text-lg mb-2">No quizzes yet.</p>
            <p className="text-on-surface-variant/60 text-sm mb-6">
              Create your first quiz to get started.
            </p>
            <Link
              href="/forms/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full primary-gradient text-on-primary font-bold text-sm shadow-md hover:scale-[1.02] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Create Quiz
            </Link>
          </div>
        )}

        {!loading && !error && forms.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 hover:border-primary/30 transition-colors group"
                >
                  <h2 className="font-display font-bold text-lg text-on-surface mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {form.title}
                  </h2>
                  <p className="text-xs text-on-surface-variant mb-4">ID: {form.id}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/quiz/${form.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-bold hover:opacity-80 transition-opacity"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Take Quiz
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-12">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-5 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-sm font-bold disabled:opacity-40 hover:bg-surface-container-high transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-on-surface-variant">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-5 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-sm font-bold disabled:opacity-40 hover:bg-surface-container-high transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
