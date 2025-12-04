'use client';

import { initializeFirebase } from '@/firebase';
import { FirebaseProvider } from './provider';

/**
 * A client-side component that initializes Firebase and sets up the provider.
 * This ensures that Firebase is only initialized once in the browser.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // `initializeFirebase` is idempotent, so it's safe to call here.
  // The actual initialization only happens once.
  const { app, auth, firestore } = initializeFirebase();

  return (
    <FirebaseProvider app={app} auth={auth} db={firestore}>
      {children}
    </FirebaseProvider>
  );
}
