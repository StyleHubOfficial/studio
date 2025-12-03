'use server';

import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from 'firebase/auth';
import {
  doc,
  Firestore,
  serverTimestamp,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { z } from 'zod';
import { redirect } from 'next/navigation';

import { initializeFirebase } from '@/firebase';
import { loginSchema, signUpSchema } from '@/lib/schemas';

async function getFirebaseAuth(): Promise<Auth> {
  const { auth } = initializeFirebase();
  return auth;
}

async function getFirebaseFirestore(): Promise<Firestore> {
  const { firestore } = initializeFirebase();
  return firestore;
}

type FormState =
  | {
      success?: boolean;
      error?: string;
    }
  | null;

export async function login(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields provided.',
    };
  }

  const auth = await getFirebaseAuth();
  const { emailOrPhone, password } = validatedFields.data;

  try {
    await signInWithEmailAndPassword(auth, emailOrPhone, password);
    return { success: true };
  } catch (e: any) {
    return { error: 'Invalid credentials. Please try again.' };
  }
}

async function createUserProfile(db: Firestore, user: User, data: any = {}) {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || data.displayName,
      phone: user.phoneNumber || data.phone,
      role: data.role || 'regular',
      clubId: data.clubId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function signup(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = signUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      error: 'Invalid fields. Please check your input and try again.',
    };
  }

  const auth = await getFirebaseAuth();
  const db = await getFirebaseFirestore();
  const { email, password, fullName, phone, role, clubId } =
    validatedFields.data;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await createUserProfile(db, user, {
      displayName: fullName,
      phone,
      role,
      clubId,
    });

    return { success: true };
  } catch (e: any) {
    console.error(e);
    if (e.code === 'auth/email-already-in-use') {
      return { error: 'An account with this email already exists.' };
    }
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function googleSignIn() {
  const auth = await getFirebaseAuth();
  const db = await getFirebaseFirestore();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await createUserProfile(db, user);
    redirect('/dashboard');
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    // This will be caught by the nearest error boundary
    if (error.code !== 'auth/popup-closed-by-user') {
      throw new Error('Failed to sign in with Google. Please try again.');
    }
  }
}
