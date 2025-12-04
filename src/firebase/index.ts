
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { FirebaseClientProvider } from './client-provider';
import {
  FirebaseProvider,
  useFirebaseApp,
  useAuth,
  useFirestore,
} from './provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

/**
 * Initializes Firebase and returns the app, auth, and firestore instances.
 * This function is idempotent, meaning it will only initialize the app once.
 *
 * @returns {FirebaseInstances} The initialized Firebase instances.
 */
function initializeFirebase(): FirebaseInstances {
  let app: FirebaseApp;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}

// Export the initialization function and the providers/hooks
export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebaseApp,
  useAuth,
  useFirestore,
  useUser,
  useCollection,
  useDoc,
};
