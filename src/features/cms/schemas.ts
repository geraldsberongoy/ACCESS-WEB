import { z } from "zod";

export const HeroContentSchema = z.object({
  titleLines: z.array(z.string().min(1)).min(1).max(5),
  subtitle: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
});

export const AboutContentSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export const OfficersSectionContentSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  templateImageUrl: z.string().min(1),
  officersImageUrl: z.string().optional(),
});

export const FAQItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  display_order: z.coerce.number().int().min(0).optional(),
  is_active: z.coerce.boolean().optional(),
});

export const UpdateFAQItemSchema = FAQItemSchema.partial().extend({
  id: z.string().uuid(),
});

export const ContactMessageSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  courseYearSection: z.string().min(1),
  contactNumber: z.string().min(1),
  organization: z.string().min(1),
  purpose: z.string().min(1),
  concern: z.string().min(1),
});

export const BorrowRequestSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  courseYearSection: z.string().min(1),
  contactNumber: z.string().min(1),
  organization: z.string().min(1),
  purpose: z.string().min(1),
  additionalInfo: z.string().optional(),
  item: z.string().min(1),
  startDate: z.string().min(1),
  startHour: z.string().min(1),
  startMinute: z.string().min(1),
  startPeriod: z.enum(["AM", "PM"]),
  endDate: z.string().min(1),
  endHour: z.string().min(1),
  endMinute: z.string().min(1),
  endPeriod: z.enum(["AM", "PM"]),
});

export type HeroContent = z.infer<typeof HeroContentSchema>;
export type AboutContent = z.infer<typeof AboutContentSchema>;
export type OfficersSectionContent = z.infer<typeof OfficersSectionContentSchema>;

export const DEFAULT_HERO_CONTENT: HeroContent = {
  titleLines: [
    "Association of Concerned",
    "Computer Engineering",
    "for Service",
  ],
  subtitle:
    "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
  primaryCtaLabel: "Get Started",
  secondaryCtaLabel: "Get In Touch",
};

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  title: "About Us",
  body: "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur.",
};

export const DEFAULT_OFFICERS_SECTION_CONTENT: OfficersSectionContent = {
  title: "Meet the Officers",
  subtitle:
    "We are a community of student leaders and innovators committed to advancing technology, collaboration, and excellence within PUP.",
  templateImageUrl: "/meet-the-officers.webp",
  officersImageUrl: "",
};
