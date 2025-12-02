"use client";

import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { AnimatedBrand } from '@/components/auth/animated-brand';
import { InitialContentSkeleton } from '@/components/auth/initial-content-skeleton';

type AuthPageProps = {
  initialContent: string;
};

export default function AuthPage({ initialContent }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state on app load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Show skeleton for 2.5 seconds to showcase the UI

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="relative flex h-48 w-full flex-col items-center justify-center lg:h-screen lg:w-2/5">
        <AnimatedBrand />
        <div className="z-10 text-center text-primary p-4">
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">AI News Access</h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-2">Professional AI News — Personalized & Realtime</p>
        </div>
      </div>
      <main className="flex flex-1 items-center justify-center p-4 lg:p-8 bg-grid-slate-900/[0.05]">
        <div className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
            {isLoading ? (
                <InitialContentSkeleton content={initialContent} />
            ) : (
                <AuthForm />
            )}
        </div>
      </main>
    </div>
  );
}
