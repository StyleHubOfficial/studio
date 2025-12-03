"use client";

import { AuthForm } from '@/components/auth/auth-form';
import { AnimatedBrand } from '@/components/auth/animated-brand';
import { InitialContentSkeleton } from '@/components/auth/initial-content-skeleton';

type AuthPageProps = {
  initialContent: string;
  initialContentLoading: boolean;
};

export default function AuthPage({ initialContent, initialContentLoading }: AuthPageProps) {
  
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <AnimatedBrand />
      <div className="z-10 w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-500 p-4">
        {initialContentLoading ? (
            <InitialContentSkeleton content={initialContent} />
        ) : (
            <AuthForm />
        )}
      </div>
    </div>
  );
}
