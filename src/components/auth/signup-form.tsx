
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useState } from "react";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { doc, serverTimestamp } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "./password-input";
import { signUpSchema } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { PasswordStrength } from "./password-strength";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";

type SignUpFormProps = {
  onSignUpSuccess: () => void;
}

function createUserProfile(db: any, user: User, data: any = {}) {
  const userRef = doc(db, 'users', user.uid);
  const userData = {
    id: user.uid,
    email: user.email,
    displayName: user.displayName || data.displayName || 'Anonymous User',
    phone: user.phoneNumber || data.phone || '',
    role: data.role || 'user',
    clubId: data.clubId || null,
    createdAt: serverTimestamp(),
    pinned: false,
    prefs: '',
    lastLogin: serverTimestamp(),
  };
  setDocumentNonBlocking(userRef, userData, { merge: false });
}

export function SignUpForm({ onSignUpSuccess }: SignUpFormProps) {
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      clubId: "",
      terms: false,
    },
  });

  const role = form.watch("role");

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      createUserProfile(db, user, {
        displayName: values.fullName,
        phone: values.phone,
        role: values.role,
        clubId: values.clubId,
      });

      toast({
        title: "Account Created",
        description: "Welcome! Please sign in to continue.",
      });
      onSignUpSuccess();
      form.reset();
    } catch (e: any) {
      console.error(e);
      let description = 'An unexpected error occurred. Please try again.';
      if (e.code === 'auth/email-already-in-use') {
        description = 'An account with this email already exists.';
      }
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="••••••••" {...field} disabled={isLoading} onChange={(e) => {
                  field.onChange(e);
                  setPassword(e.target.value);
                }} />
              </FormControl>
               <PasswordStrength password={password} />
               <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="••••••••" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select your role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                  disabled={isLoading}
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="user" />
                    </FormControl>
                    <FormLabel className="font-normal">Regular User</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="sunrise_member" />
                    </FormControl>
                    <FormLabel className="font-normal">Sunrise Member</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {role === "sunrise_member" && (
          <FormField
            control={form.control}
            name="clubId"
            render={({ field }) => (
              <FormItem className="animate-in fade-in-0 zoom-in-95 duration-300">
                <FormLabel>Club ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your assigned Club ID" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading}/>
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I accept the terms and conditions
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
