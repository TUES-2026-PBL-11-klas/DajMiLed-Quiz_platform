"use client";

import React from 'react';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';

export default function ComponentLab() {
  const { addToast } = useToast();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-display font-bold">Component Lab</h1>
        <p className="text-on-surface-variant">The Modern Scholar Design System Test Area</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-display font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="tertiary">Tertiary Button</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" isLoading>Loading State</Button>
          <Button variant="primary" disabled>Disabled State</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-display font-semibold">Toast Notifications</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="secondary" 
            onClick={() => addToast("This is a success message!", "success")}
          >
            Show Success Toast
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => addToast("This is an error message optimized for security.", "error")}
          >
            Show Error Toast
          </Button>
          <Button 
            variant="tertiary" 
            onClick={() => addToast("Just some general information.", "info")}
          >
            Show Info Toast
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-display font-semibold">Tonal Layering & Glass</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <h3 className="font-medium mb-2">Surface Container Low</h3>
            <p className="text-sm text-on-surface-variant">Background for sectioning content.</p>
          </div>
          <div className="p-6 bg-surface-container-highest rounded-xl">
            <h3 className="font-medium mb-2">Surface Container Highest</h3>
            <p className="text-sm text-on-surface-variant">Primary card background.</p>
          </div>
        </div>
        <div className="p-12 bg-primary/10 rounded-2xl relative overflow-hidden">
          <div className="glass-overlay p-6 rounded-xl ambient-shadow max-w-xs mx-auto text-center border border-outline-variant/20">
            <h3 className="font-bold text-primary mb-2">Glassmorphism</h3>
            <p className="text-sm">Floating element with 20px blur.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
