'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// Define the shape of the context
interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

// Create the context with a default null value
const FirebaseContext = createContext<FirebaseContextType | null>(null);

interface FirebaseProviderProps {
  children: React.ReactNode;
  app?: FirebaseApp;
  auth?: Auth;
  db?: Firestore;
}

/**
 * The main Firebase provider component.
 * It makes Firebase app, auth, and firestore instances available to children.
 */
export function FirebaseProvider({
  children,
  app,
  auth,
  db,
}: FirebaseProviderProps) {
  const contextValue = useMemo(
    () => ({
      app: app || null,
      auth: auth || null,
      db: db || null,
    }),
    [app, auth, db]
  );

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

// --- Context Hooks ---

/**
 * Hook to get the entire Firebase context.
 * Throws an error if used outside of a FirebaseProvider.
 */
function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

/**
 * Hook to get the Firebase App instance.
 * Throws an error if the app is not available.
 */
export function useFirebaseApp(): FirebaseApp {
  const { app } = useFirebase();
  if (!app) {
    throw new Error('Firebase App not available. Ensure you are using a client provider.');
  }
  return app;
}

/**
 * Hook to get the Firebase Auth instance.
 * Throws an error if Auth is not available.
 */
export function useAuth(): Auth {
  const { auth } = useFirebase();
  if (!auth) {
    throw new Error('Firebase Auth not available. Ensure you are using a client provider.');
  }
  return auth;
}

/**
 * Hook to get the Firestore instance.
 * Throws an error if Firestore is not available.
 */
export function useFirestore(): Firestore {
  const { db } = useFirebase();
  if (!db) {
    throw new Error('Firestore not available. Ensure you are using a client provider.');
  }
  return db;
}
