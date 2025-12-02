'use server';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  doc,
  Firestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { z } from 'zod';

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
  const { email, password, role, clubId, fullName, phone } =
    validatedFields.data;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: fullName,
      phone: phone,
      role: role,
      clubId: clubId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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
