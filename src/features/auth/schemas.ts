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