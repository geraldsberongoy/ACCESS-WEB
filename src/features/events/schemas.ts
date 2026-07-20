import { z } from "zod";

const eventStatusSchema = z.enum(["Draft", "Published"]);

const eventTextSchema = z.string()
  .trim()
  .min(2, "This field must be at least 2 characters")
  .max(255, "This field must not exceed 255 characters");

const eventDescriptionSchema = z.string()
  .trim()
  .min(10, "Event description must be at least 10 characters")
  .max(2000, "Event description must not exceed 2000 characters");

const optionalImageUrlSchema = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.string().url("Image URL must be a valid URL").optional()
);

const optionalEventDateSchema = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.string()
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Event date must be a valid date",
    })
    .transform((value) => new Date(value).toISOString())
    .optional()
);

export const EventIdSchema = z.uuid({ message: "Invalid event ID" });

export const CreateEventSchema = z.object({
  title: eventTextSchema,
  content_description: eventDescriptionSchema,
  event_date: optionalEventDateSchema,
  status: eventStatusSchema.default("Draft"),
  image_url: optionalImageUrlSchema,
}).strict();

export const UpdateEventSchema = z.object({
  title: eventTextSchema.optional(),
  content_description: eventDescriptionSchema.optional(),
  event_date: optionalEventDateSchema,
  status: eventStatusSchema.optional(),
  image_url: optionalImageUrlSchema,
}).strict();

export const AdminEventsFilterSchema = z.object({
  status: z.enum(["Published", "Draft", "All"]).default("All"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
}).strict();

export const PublicEventsFilterSchema = z.object({
  status: z.enum(["upcoming", "past", "all"]).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
}).strict();

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type AdminEventsFilterInput = z.infer<typeof AdminEventsFilterSchema>;
export type PublicEventsFilterInput = z.infer<typeof PublicEventsFilterSchema>;