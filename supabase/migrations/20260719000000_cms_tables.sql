CREATE TABLE "SiteContent" (
  "key" varchar PRIMARY KEY,
  "value" jsonb NOT NULL,
  "updated_by" uuid REFERENCES "Users"(id),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "FAQItems" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "question" text NOT NULL,
  "answer" text NOT NULL,
  "display_order" int DEFAULT 0,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "ContactMessages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "full_name" varchar NOT NULL,
  "email" varchar NOT NULL,
  "course_year_section" varchar,
  "contact_number" varchar,
  "organization" varchar,
  "purpose" text,
  "concern" text NOT NULL,
  "is_read" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now()
);

ALTER TABLE "BorrowRequests"
  ADD COLUMN IF NOT EXISTS "course_year_section" varchar,
  ADD COLUMN IF NOT EXISTS "purpose" text,
  ADD COLUMN IF NOT EXISTS "additional_info" text,
  ADD COLUMN IF NOT EXISTS "organization_name" varchar,
  ADD COLUMN IF NOT EXISTS "requested_item" varchar;

ALTER TABLE "BorrowRequests" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

INSERT INTO "SiteContent" ("key", "value") VALUES
(
  'hero',
  '{"titleLines":["Association of Concerned","Computer Engineering","for Service"],"subtitle":"Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum","primaryCtaLabel":"Get Started","secondaryCtaLabel":"Get In Touch"}'::jsonb
),
(
  'about',
  '{"title":"About Us","body":"Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur."}'::jsonb
),
(
  'officers_section',
  '{"title":"Meet the Officers","subtitle":"We are a community of student leaders and innovators committed to advancing technology, collaboration, and excellence within PUP.","templateImageUrl":"/meet-the-officers.webp"}'::jsonb
)
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "FAQItems" ("question", "answer", "display_order") VALUES
(
  'Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  0
),
(
  'Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  1
),
(
  'Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  2
),
(
  'Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  3
),
(
  'Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  4
),
(
  'Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  5
),
(
  'Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  6
),
(
  'Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  7
);
