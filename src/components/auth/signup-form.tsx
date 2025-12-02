"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "./password-input";
import { signUpSchema } from "@/lib/schemas";
import { signup } from "@/app/auth/actions";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PasswordStrength } from "./password-strength";

type SignUpFormProps = {
  onSignUpSuccess: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating Account..." : "Create Account"}
    </Button>
  );
}

export function SignUpForm({ onSignUpSuccess }: SignUpFormProps) {
  const [state, formAction] = useFormState(signup, null);
  const { toast } = useToast();
  const [password, setPassword] = useState("");

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "regular",
      clubId: "",
      terms: false,
    },
  });

  const role = form.watch("role");

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Account Created",
        description: "Welcome! Please sign in to continue.",
      });
      onSignUpSuccess();
      form.reset();
    }
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: state.error,
      });
    }
  }, [state, onSignUpSuccess, form, toast]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                  <Input placeholder="you@example.com" {...field} />
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
                  <Input placeholder="(123) 456-7890" {...field} />
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
                <PasswordInput placeholder="••••••••" {...field} onChange={(e) => {
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
                <PasswordInput placeholder="••••••••" {...field} />
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
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="regular" />
                    </FormControl>
                    <FormLabel className="font-normal">Regular</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="club_member" />
                    </FormControl>
                    <FormLabel className="font-normal">School CLUB Member</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {role === "club_member" && (
          <FormField
            control={form.control}
            name="clubId"
            render={({ field }) => (
              <FormItem className="animate-in fade-in-0 zoom-in-95 duration-300">
                <FormLabel>Club ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your assigned Club ID" {...field} />
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
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
        <SubmitButton />
      </form>
    </Form>
  );
}
