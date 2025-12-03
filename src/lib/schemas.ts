import { z } from 'zod';

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

export const signUpSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
  role: z.enum(['user', 'sunrise_member'], { required_error: "Please select a role." }),
  clubId: z.string().optional(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions."
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
}).refine((data) => {
    if (data.role === 'sunrise_member') {
        return !!data.clubId && data.clubId.length > 0;
    }
    return true;
}, {
    message: "Club ID is required for Sunrise members.",
    path: ["clubId"],
});

export const loginSchema = z.object({
  emailOrPhone: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().optional(),
});
