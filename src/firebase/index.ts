import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import {
  useAuth,
  useFirebase,
  useFirebaseApp,
  useFirestore,
} from './provider';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

if (firebaseConfig.projectId) {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);
}

function initializeFirebase() {
  if (firebaseConfig.projectId) {
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }
  return { firebaseApp, auth, firestore };
}

export {
  useAuth,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  initializeFirebase,
};
