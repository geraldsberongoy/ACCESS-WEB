import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────
// SCHEMAS: Zod validation schemas for Officer CRUD operations
// Purpose: Ensure data integrity before it hits the database
// ─────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────
// HELPER: Convert string to Title Case
// Example: "computer engineering" → "Computer Engineering"
// ─────────────────────────────────────────────────────────────────────────
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Base schema fields that are reusable
const fullNameSchema = z.string()
  .trim()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must not exceed 100 characters")
  .transform(val => toTitleCase(val)); // Normalize to Title Case

const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .pipe(
    z.email({ message: "Please enter a valid email address" })
  );

const positionTitleSchema = z.string()
  .trim()
  .min(2, "Position title must be at least 2 characters")
  .max(50, "Position title must not exceed 50 characters")
  .refine((val) => !/\d/.test(val), {
    message: "Position title must not contain numbers",
  })
  .transform(val => toTitleCase(val)); // Normalize to Title Case

const departmentSchema = z.string()
  .trim()
  .min(2, "Department must be at least 2 characters")
  .max(100, "Department must not exceed 100 characters")
  .transform(val => toTitleCase(val)); // Normalize to Title Case

const academicYearSchema = z.string()
  .trim()
  .regex(/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY (e.g., 2025-2026)");

const imageUrlSchema = z.string()
  .url("Image URL must be a valid URL")
  .optional()
  .or(z.literal(""));

// ─────────────────────────────────────────────────────────────────────────
// CREATE OFFICER SCHEMA
// Used when: Admins create a new officer via form or API
// Fields: All required for creating a new officer
// ─────────────────────────────────────────────────────────────────────────
export const CreateOfficerSchema = z.object({
  full_name: fullNameSchema,
  email: emailSchema,
  position_title: positionTitleSchema,
  department: departmentSchema,
  academic_year: academicYearSchema,
  image_url: imageUrlSchema,
  // Coerce lets HTML form values like "true" and "1" pass validation.
  is_active: z.coerce.boolean().default(true),
  display_order: z.coerce.number().int().min(0).optional(),
});

// ─────────────────────────────────────────────────────────────────────────
// UPDATE OFFICER SCHEMA
// Used when: Admins update an existing officer
// Fields: All optional since we're only updating specific fields
// ─────────────────────────────────────────────────────────────────────────
export const UpdateOfficerSchema = z.object({
  full_name: fullNameSchema.optional(),
  email: emailSchema.optional(),
  position_title: positionTitleSchema.optional(),
  department: departmentSchema.optional(),
  academic_year: academicYearSchema.optional(),
  image_url: imageUrlSchema.optional(),
  is_active: z.coerce.boolean().optional(),
  display_order: z.coerce.number().int().min(0).optional(),
}).strict(); // Ensure no extra fields are sent

// ─────────────────────────────────────────────────────────────────────────
// REORDER OFFICERS SCHEMA
// Used when: Admins bulk update the display_order of multiple officers
// ─────────────────────────────────────────────────────────────────────────
export const ReorderOfficersSchema = z.object({
  officers: z.array(
    z.object({
      id: z.string().uuid("Invalid officer ID"),
      display_order: z.number().int().min(0),
    })
  ).min(1, "At least one officer must be provided"),
});

// ─────────────────────────────────────────────────────────────────────────
// TYPE EXPORTS
// These TypeScript types are inferred from the Zod schemas
// They provide type safety for our service functions
// ─────────────────────────────────────────────────────────────────────────
export type CreateOfficerInput = z.infer<typeof CreateOfficerSchema>;
export type UpdateOfficerInput = z.infer<typeof UpdateOfficerSchema>;
export type ReorderOfficersInput = z.infer<typeof ReorderOfficersSchema>;
