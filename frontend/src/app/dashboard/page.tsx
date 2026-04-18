'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { NavBar } from '@/components/NavBar';
import { QuizCard } from '@/components/QuizCard';
import { formService, FormResponse } from '@/services/formService';

export default function DashboardPage() {
  const [forms, setForms] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadForms = useCallback(async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await formService.getForms(p, 12);
      setForms(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setError('Could not load quizzes. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForms(page);
  }, [loadForms, page]);

  const filtered = forms.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed-variant">
      <NavBar activeLink="explore" showSearch onSearch={setSearch} />

      <main className="min-h-screen pb-24">
        <section className="px-8 lg:px-12 pt-16 pb-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl">Available Quizzes</h2>
            {!loading && (
              <p className="text-on-surface-variant text-sm">
                {forms.length} quiz{forms.length !== 1 ? 'zes' : ''} found
              </p>
            )}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-32">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-24">
              <p className="text-error font-semibold mb-2">{error}</p>
              <button
                onClick={() => loadForms(page)}
                className="mt-4 px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-bold text-sm hover:opacity-80 transition-opacity"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-on-surface-variant font-medium text-lg mb-2">
                {search ? 'No quizzes match your search.' : 'No quizzes yet.'}
              </p>
              <p className="text-on-surface-variant/60 text-sm">
                {!search && 'Be the first to create one!'}
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((form) => (
                  <QuizCard
                    key={form.id}
                    id={form.id}
                    title={form.title}
                  />
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
        </section>
      </main>
    </div>
  );
}
