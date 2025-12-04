'use client';

import AuthPage from '@/components/auth/AuthPage';
import { FirebaseClientProvider } from '@/firebase';

export default function Home() {
  return (
    <FirebaseClientProvider>
      <AuthPage />
    </FirebaseClientProvider>
  );
}
