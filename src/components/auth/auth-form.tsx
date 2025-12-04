
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, User, AuthError } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, Firestore } from "firebase/firestore";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SignUpForm } from "./signup-form";
import { LoginForm } from "./login-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";

// Fake social icons for layout
const GoogleIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.86 2.25-4.82 2.25-3.73 0-6.75-3.1-6.75-6.95s3.02-6.95 6.75-6.95c2.18 0 3.52.86 4.38 1.69l2.6-2.58C18.04 3.82 15.61 2.5 12.48 2.5c-5.47 0-9.9 4.5-9.9 9.95s4.43 9.95 9.9 9.95c5.23 0 9.5-3.5 9.5-9.65 0-.64-.07-1.25-.2-1.83l-9.32.01z" fill="currentColor"/></svg>;
const AppleIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"><title>Apple</title><path d="M12.003 17.81c-.003-3.234 2.22-4.897 4.408-4.907-1.035-1.62-2.835-1.923-4.417-1.923-3.419 0-5.992 2.37-5.992 5.658 0 3.337 2.68 4.965 5.992 4.965 1.455 0 2.926-.538 4.333-1.46-.11.06-2.906 1.67-4.324-1.533zm1.185-15.31c1.55-.05 3.015.908 3.828 2.235-1.285.88-2.54 2.64-2.223 4.507 1.44.138 3.23-1.145 4.398-2.6-2.13-2.29-5.12-2.5-6-.242-.01-.01 0 0 0 0z" fill="currentColor"/></svg>;

// Helper function to create user profile in Firestore
async function createUserProfile(db: Firestore, user: User) {
  if (!db) throw new Error("Database connection failed");
  
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const userData = {
      uid: user.uid, // Good practice to store UID inside the doc too
      email: user.email,
      displayName: user.displayName || 'Anonymous User',
      phone: user.phoneNumber || '',
      photoURL: user.photoURL || '',
      role: 'user',
      clubId: null,
      createdAt: serverTimestamp(),
      pinned: false,
      prefs: '',
      lastLogin: serverTimestamp(),
    };
    // Use setDoc with merge: true to be safe, though not strictly necessary if checking exists()
    await setDoc(userRef, userData, { merge: true });
  } else {
    // Update last login if user exists
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
  }
}

export function AuthForm() {
  const [activeTab, setActiveTab] = useState("signin");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    // 1. Validation: Ensure SDKs are ready
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Firebase services are not initialized yet. Please refresh.",
      });
      return;
    }

    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    
    // Optional: Force account selection prompt every time
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      // 2. Authentication
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // 3. Database Sync
      await createUserProfile(db, user);

      // 4. Success Feedback & Redirect
      toast({
        title: "Welcome back!",
        description: `Signed in as ${user.displayName || user.email}`,
      });
      
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      
      // 5. Smart Error Handling
      let errorMessage = "An unexpected error occurred.";
      
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the window, no need to show an error toast
        setIsGoogleLoading(false);
        return; 
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized for OAuth operations. Check Firebase Console.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Only one popup request is allowed at a time.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: errorMessage,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md bg-muted/95 text-foreground backdrop-blur-lg border border-accent/30 rounded-2xl shadow-[0_0_20px_4px_hsla(var(--accent),0.3)]">
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 mb-4 text-accent">
            <Logo />
        </div>
        <CardTitle className="font-headline text-3xl">AI News Access</CardTitle>
        <CardDescription className="text-foreground/80">
          Professional AI News — Personalized & Realtime
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2 bg-black/10">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <div className="py-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleSignIn} 
                  disabled={isGoogleLoading}
                  type="button"
                >
                  {isGoogleLoading ? (
                    "Signing In..."
                  ) : (
                    <><GoogleIcon /> Google</>
                  )}
                  </Button>
                <Button variant="outline" className="w-full" disabled><AppleIcon/> Apple</Button>
              </div>
              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-muted/95 px-2 text-sm text-muted-foreground backdrop-blur-sm">OR</span>
              </div>
          </div>
          <TabsContent value="signin">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm onSignUpSuccess={() => setActiveTab("signin")} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 text-xs text-muted-foreground">
        <p className="text-center">By continuing, you agree to our <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.</p>
        <div className="flex w-full justify-between items-center mt-2">
            <a href="#" className="underline hover:text-primary">Need help?</a>
            <Select defaultValue="en">
                <SelectTrigger className="w-auto h-8 text-xs gap-1 bg-transparent border-0 focus:ring-0">
                    <Languages className="h-3 w-3" />
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </CardFooter>
    </Card>
  );
}
