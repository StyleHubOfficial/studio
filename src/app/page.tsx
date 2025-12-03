'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { generatePersonalizedInitialContent } from '@/ai/flows/personalized-initial-content';
import AuthPage from '@/components/auth/auth-page';
import { useUser } from '@/firebase/auth/use-user';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export default function Home() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [personalizedContent, setPersonalizedContent] = useState('');
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && user) {
      router.push('/dashboard');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await generatePersonalizedInitialContent({
          interests: 'Artificial Intelligence, machine learning, technology trends',
          location: 'San Francisco, CA',
        });
        setPersonalizedContent(content.contentSnippet);
      } catch (error) {
        console.error('Failed to fetch personalized content:', error);
        setPersonalizedContent('Could not load personalized content at the moment.');
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (userLoading || user) {
    // Show a full-page loading skeleton while checking auth state
    // or when redirecting the user.
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return <AuthPage initialContent={personalizedContent} initialContentLoading={contentLoading} />;
}
