import { z } from "zod";

/**
 * Login Schema
 * Validates that the input is a properly formatted email 
 * and that the password isn't just whitespace.
 */
export const LoginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z.string().min(1, { error: "Password is required" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;


/**
 * SignUp Schema
 * Includes organization validation.
 * Automatically strips invisible whitespace
 */
export const SignUpSchema = z.object({
  email: z.string().trim().pipe(
    z.email({ error: "Please enter a valid email address" })
  ),
  password: z.string().min(8, { error: "Password must be at least 8 characters" }),
  organizationName: z.string().min(1, { error: "Organization name is required" }).trim(),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;


/**
 * Forgot Password Schema
 */
export const ForgotPasswordSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;


/**
 * Reset Password Schema
 * Includes >8 char and matching password validation
 */
export const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
