"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from '../ui/skeleton';
import { AnimatedBrand } from './animated-brand';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordStrength } from './password-strength';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

// --- Form Schemas ---
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signUpSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    role: z.enum(["user", "sunrise_member"]),
    clubId: z.string().optional(),
    terms: z.boolean().refine(val => val === true, { message: "You must accept the terms." }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});


// --- Helper Functions & Components ---
const GoogleIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.86 2.25-4.82 2.25-3.73 0-6.75-3.1-6.75-6.95s3.02-6.95 6.75-6.95c2.18 0 3.52.86 4.38 1.69l2.6-2.58C18.04 3.82 15.61 2.5 12.48 2.5c-5.47 0-9.9 4.5-9.9 9.95s4.43 9.95 9.9 9.95c5.23 0 9.5-3.5 9.5-9.65 0-.64-.07-1.25-.2-1.83l-9.32.01z" fill="currentColor"/></svg>;
const AppleIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"><title>Apple</title><path d="M12.003 17.81c-.003-3.234 2.22-4.897 4.408-4.907-1.035-1.62-2.835-1.923-4.417-1.923-3.419 0-5.992 2.37-5.992 5.658 0 3.337 2.68 4.965 5.992 4.965 1.455 0 2.926-.538 4.333-1.46-.11.06-2.906 1.67-4.324-1.533zm1.185-15.31c1.55-.05 3.015.908 3.828 2.235-1.285.88-2.54 2.64-2.223 4.507 1.44.138 3.23-1.145 4.398-2.6-2.13-2.29-5.12-2.5-6-.242-.01-.01 0 0 0 0z" fill="currentColor"/></svg>;

async function upsertUserProfile(db: Firestore, user: User, details: any = {}) {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      displayName: user.displayName || details.displayName || 'Anonymous User',
      phone: user.phoneNumber || details.phone || '',
      role: details.role || 'user',
      clubId: details.clubId || null,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    }, { merge: true });
  } else {
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
  }
}

// --- Login Form ---
function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (!auth) {
      toast({ variant: "destructive", title: "Error", description: "Firebase not initialized." });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "Welcome back!", description: "You have successfully signed in." });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Sign In Error:", error);
      toast({ variant: "destructive", title: "Sign In Failed", description: error.message || "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Signing In..." : "Sign In"}</Button>
      </form>
    </Form>
  );
}

// --- Sign Up Form ---
function SignUpForm({ onSignUpSuccess }: { onSignUpSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const auth = useAuth();
    const db = useFirestore();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { fullName: "", email: "", phone: "", password: "", confirmPassword: "", role: "user", terms: false },
    });

    const role = form.watch("role");

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        if (!auth || !db) {
            toast({ variant: "destructive", title: "Error", description: "Firebase not initialized." });
            return;
        }
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            await upsertUserProfile(db, userCredential.user, {
                displayName: values.fullName,
                phone: values.phone,
                role: values.role,
                clubId: values.clubId,
            });
            toast({ title: "Account Created!", description: "Please check your email to verify your account." });
            onSignUpSuccess();
        } catch (error: any) {
            console.error("Sign Up Error:", error);
            toast({ variant: "destructive", title: "Sign Up Failed", description: error.message || "An unexpected error occurred." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><PasswordStrength password={field.value} /><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                     <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Account Type</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="user" /></FormControl><FormLabel className="font-normal">Personal</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="sunrise_member" /></FormControl><FormLabel className="font-normal">Sunrise Club Member</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                    <FormMessage /></FormItem>
                )} />

                {role === "sunrise_member" && (
                    <FormField control={form.control} name="clubId" render={({ field }) => (
                        <FormItem><FormLabel>Club ID</FormLabel><FormControl><Input placeholder="Enter your club ID" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                )}

                <FormField control={form.control} name="terms" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl><div className="space-y-1 leading-none">
                      <FormLabel>Accept terms and conditions</FormLabel>
                      <FormMessage />
                  </div></FormItem>
                )} />


                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Creating Account..." : "Create Account"}</Button>
            </form>
        </Form>
    );
}

// --- Main Auth Page Component ---
export default function AuthPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
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

  return (
    <>
      <Toaster />
      <div className="relative flex min-h-screen w-full items-center justify-center p-4">
          <AnimatedBrand />
          <div className="z-10 w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
             <AuthForm />
          </div>
      </div>
    </>
  );
}

// --- Auth Form Component ---
function AuthForm() {
  const [activeTab, setActiveTab] = useState("signin");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();

  const handleGoogleSignIn = async () => {
    if (!auth || !db) {
        toast({ variant: "destructive", title: "Error", description: "Firebase not initialized."});
        return;
    }
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      await upsertUserProfile(db, result.user);
      toast({ title: "Welcome back!", description: `Signed in as ${result.user.displayName || result.user.email}` });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error.code === 'auth/popup-closed-by-user') {
        setIsGoogleLoading(false);
        return;
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized for OAuth operations. Please check your Firebase Console settings under Authentication > Settings > Authorized domains.";
      }
      toast({ variant: "destructive", title: "Sign In Failed", description: errorMessage });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-muted/95 text-foreground backdrop-blur-lg border border-accent/30 rounded-2xl shadow-[0_0_20px_4px_hsla(var(--accent),0.3)]">
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 mb-4 text-accent"><Logo /></div>
        <CardTitle className="font-headline text-3xl">AI News Access</CardTitle>
        <CardDescription className="text-foreground/80">Professional AI News — Personalized & Realtime</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2 bg-black/10">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <div className="py-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={true} type="button">
                {isGoogleLoading ? "Signing In..." : <><GoogleIcon /> Google</>}
              </Button>
              <Button variant="outline" className="w-full" disabled><AppleIcon /> Apple</Button>
            </div>
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-muted/95 px-2 text-sm text-muted-foreground backdrop-blur-sm">OR</span>
            </div>
          </div>
          <TabsContent value="signin"><LoginForm /></TabsContent>
          <TabsContent value="signup"><SignUpForm onSignUpSuccess={() => setActiveTab("signin")} /></TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 text-xs text-muted-foreground">
        <p className="text-center">By continuing, you agree to our <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.</p>
      </CardFooter>
    </Card>
  );
}
