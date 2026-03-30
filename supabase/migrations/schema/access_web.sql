CREATE TYPE "user_role" AS ENUM (
  'Admin',
  'Default',
  'Organization',
  'Pending'
);

CREATE TYPE "asset_status" AS ENUM (
  'Available',
  'Reserved',
  'Borrowed',
  'Maintenance',
  'Lost'
);

CREATE TYPE "asset_condition" AS ENUM (
  'Excellent',
  'Good',
  'Fair',
  'Poor'
);

CREATE TYPE "event_status" AS ENUM (
  'Draft',
  'Published'
);

CREATE TYPE "borrow_status" AS ENUM (
  'Pending',
  'Approved',
  'Rejected',
  'Active',
  'Returned',
  'Cancelled'
);

CREATE TABLE "Users" (
  "id" uuid PRIMARY KEY,
  "email" varchar,
  "role" user_role,
  "organization_name" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "Assets" (
  "id" uuid PRIMARY KEY,
  "target_qr_identifier" uuid UNIQUE,
  "name" varchar,
  "category" varchar,
  "description" text,
  "image_url" varchar,
  "status" asset_status,
  "condition" asset_condition,
  "is_deleted" boolean DEFAULT false,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "Events" (
  "id" uuid PRIMARY KEY,
  "title" varchar,
  "content_description" text,
  "event_date" timestamp,
  "status" event_status,
  "image_url" varchar,
  "created_by" uuid,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "Officers" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "full_name" varchar,
  "email" varchar,
  "position_title" varchar,
  "department" varchar,
  "academic_year" varchar,
  "image_url" varchar,
  "display_order" int,
  "is_active" boolean,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "BorrowRequests" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "borrower_contact_name" varchar,
  "borrower_email" varchar,
  "borrower_phone" varchar,
  "requested_start_date" timestamp,
  "requested_end_date" timestamp,
  "letter_file_url" varchar,
  "status" borrow_status,
  "rejection_reason" text,
  "reviewed_by" uuid,
  "reviewed_at" timestamp,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "BorrowRequestItems" (
  "id" uuid PRIMARY KEY,
  "borrow_request_id" uuid,
  "asset_id" uuid
);

CREATE TABLE "AuditLogs" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "action" varchar,
  "entity_type" varchar,
  "entity_id" uuid,
  "state_changes" jsonb,
  "created_at" timestamp
);

COMMENT ON COLUMN "Users"."id" IS 'References auth.users(id)';

COMMENT ON COLUMN "Assets"."target_qr_identifier" IS 'Unique string for QR generation';

COMMENT ON COLUMN "Assets"."image_url" IS 'Supabase Storage Public URL';

COMMENT ON COLUMN "Assets"."is_deleted" IS 'Soft delete flag';

COMMENT ON COLUMN "Events"."image_url" IS 'Supabase Storage Public URL';

COMMENT ON COLUMN "Events"."created_by" IS 'Admin/Officer';

COMMENT ON COLUMN "Officers"."user_id" IS 'Optional';

COMMENT ON COLUMN "Officers"."email" IS 'Contact email for frontend display';

COMMENT ON COLUMN "Officers"."position_title" IS 'e.g., President, Secretary';

COMMENT ON COLUMN "Officers"."department" IS 'e.g., Computer Engineering';

COMMENT ON COLUMN "Officers"."academic_year" IS 'e.g., 2025-2026';

COMMENT ON COLUMN "Officers"."image_url" IS 'Supabase Storage Public URL';

COMMENT ON COLUMN "Officers"."display_order" IS 'For ordering on frontend';

COMMENT ON COLUMN "Officers"."is_active" IS 'True if currently serving';

COMMENT ON COLUMN "BorrowRequests"."user_id" IS 'Organization';

COMMENT ON COLUMN "BorrowRequests"."borrower_contact_name" IS 'Specific person borrowing';

COMMENT ON COLUMN "BorrowRequests"."letter_file_url" IS 'Supabase Storage Secured/Signed URL';

COMMENT ON COLUMN "BorrowRequests"."rejection_reason" IS 'Reason for rejection, null if not rejected';

COMMENT ON COLUMN "BorrowRequests"."reviewed_by" IS 'Admin/Officer';

COMMENT ON COLUMN "AuditLogs"."user_id" IS 'Who performed the action';

COMMENT ON COLUMN "AuditLogs"."action" IS 'e.g., STATUS_CHANGED, REQUEST_APPROVED';

COMMENT ON COLUMN "AuditLogs"."entity_type" IS 'e.g., Asset, BorrowRequest';

COMMENT ON COLUMN "AuditLogs"."state_changes" IS 'Delta of changes made';


-- "DEFERRABLE INITIALLY IMMEDIATE": Allows pausing the foreign key check until the end of a transaction, default behaviour is to check dependency immediately

ALTER TABLE "Events" ADD FOREIGN KEY ("created_by") REFERENCES "Users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Officers" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "BorrowRequests" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "BorrowRequests" ADD FOREIGN KEY ("reviewed_by") REFERENCES "Users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "BorrowRequestItems" ADD FOREIGN KEY ("borrow_request_id") REFERENCES "BorrowRequests" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "BorrowRequestItems" ADD FOREIGN KEY ("asset_id") REFERENCES "Assets" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "AuditLogs" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
