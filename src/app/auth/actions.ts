"use server";

import { z } from "zod";
import { loginSchema, signUpSchema } from "@/lib/schemas";

type FormState = {
    success?: boolean;
    error?: string;
} | null;

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: "Invalid fields provided.",
    };
  }
  
  // Simulate Firebase auth
  await new Promise(res => setTimeout(res, 1000));

  // In a real app, you'd call Firebase auth here.
  // For this demo, we'll check for a dummy user.
  if (validatedFields.data.emailOrPhone === "admin@example.com" && validatedFields.data.password === "Password123!") {
    return { success: true };
  }

  return { error: "Invalid credentials. Please try again." };
}


export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = signUpSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
          error: "Invalid fields. Please check your input and try again.",
        };
    }

    const { email, role, clubId, fullName, phone } = validatedFields.data;

    // Simulate Firebase user creation & Firestore document write
    await new Promise(res => setTimeout(res, 1500));
    
    console.log("Creating user:", { email, role, clubId, fullName, phone });
    // In a real app:
    // 1. If role is 'club_member', call a cloud function to validate clubId.
    // 2. await auth.createUserWithEmailAndPassword(email, password);
    // 3. await db.collection('users').doc(user.uid).set({ ... });
    // 4. If 'club_member', call cloud function to set custom claims.

    return { success: true };
}
