# Product Requirements Document: ACCESS Borrowing System & CMS

## 1. Overview
The ACCESS Borrowing System and CMS is a web-based application designed to manage the showcase of events for the community while streamlining the process of tracking and borrowing organizational assets within the College of Engineering and Architecture (CEA). The system utilizes QR codes to track physical assets effectively.

## 2. Target Audience & Roles
- **Admins (ACCESS Officers/Staff)**: Responsible for managing assets, user accounts, posting events, and reviewing borrow requests.
- **Borrowers (Organizations inside CEA)**: Authorized organizations who can request to borrow assets for specific timeframes.
- **Public/Guest**: Non-authenticated users who can view the events showcased on the public-facing frontend.

## 3. Core Features & Specifications

### 3.1 Content Management System (CMS) & Frontend
- **Events Management**: Admins can Create, Read, Update, and Delete (CRUD) events.
- **Frontend Showcasing**: A public-facing web page listing upcoming and past events with details (e.g., date, description, images).

### 3.2 Asset Management Module
- **Asset Registry**: Admins can add items to the system detailing the Name, Category, Condition, and Status.
- **QR Code Integration**: 
  - The system will generate a unique QR code for each registered physical asset.
  - Scanning the QR code (typically printed as a sticker on the asset) will quickly reveal its current state and details to the Admin, facilitating fast check-ins and check-outs.

### 3.3 User Authentication & Account Management
- **Self-Registration**: Users can create their own accounts by providing their details (email, password, organization name). By default, new accounts are assigned a restricted "Pending" role.
- **Admin Approval & Role Upgrade**: Admins review newly registered accounts in their dashboard and upgrade their role to "Organization" to grant them borrowing privileges.
- **Self-Serve Account Recovery**: Users can independently initiate a password reset process. The system will email them a secure, time-limited link to reset their password without requiring admin intervention.

### 3.4 Borrowing Workflow
- **Item Discovery**: Logged-in Borrowers can view a catalog of available items.
- **Availability Check**: Borrowers can view a schedule to ensure their desired items are available during their intended span of time/days.
- **Request Form Submission**:
  - Despite being logged in as an Organization, the specific borrower fills out dynamic identification details: Name, Organization, Email, and Contact Number.
  - Borrower selects items and requested dates.
  - Borrower uploads a digital copy (PDF/Image) of the formal request letter.
- **System Notification**: Upon submission, a pop-up reminds the borrower: *"Please bring the hard copy of the letter together with an ID upon going to ACCESS office to get the items borrowed."*

### 3.5 Lender (ACCESS Admin) Workflow
- **Request Assessment**: Admins monitor a dashboard for pending requests, where they can review the borrower's details and the uploaded letter.
- **Approval/Rejection**: Admins decide to approve or reject the request based on availability and letter validity.
- **Automated Email Notifications**: The system automatically emails the borrower outlining whether their request was approved (and items are ready to be picked up) or rejected.

---

## 4. Development Phases

### Phase 1: Foundation & User Management
- Set up the project structure, Supabase database, and repository.
- Implement the authentication system using Supabase Auth (self-registration with Pending role).
- Build the Admin dashboard for reviewing pending registrations and upgrading user roles.

### Phase 2: CMS & Event Showcasing
- Configure Supabase Storage buckets for public media.
- Build the backend and Admin interfaces for managing Events and Officers.
- Develop the public-facing frontend UI to display events and officer listings.

### Phase 3: Asset Management & QR Code Module
- Develop the database schema and CRUD operations for Assets on the Admin dashboard.
- Integrate the QR code generation library to produce downloadable and printable QR stickers.
- Build the QR scanning endpoint (a mobile-responsive view for Admins to update asset statuses on the go).

### Phase 4: Borrowing System Frontend & Backend
- Build the Borrower catalog to view items and their availability schedules.
- Develop the Borrow Request form including the file upload mechanism for the request letter.
- Implement the conflict-checking logic to prevent double-booking of items.
- Add the pop-up notification post-submission.

### Phase 5: Administrative Review & Notifications
- Construct the Admin interface for reviewing pending requests.
- Integrate a transactional email service (e.g., Resend, SendGrid) to dispatch approval/rejection notifications.
- Implement asset state transition logic (e.g., Available -> Reserved -> Borrowed -> Returned).

### Phase 6: QA, UAT, and Launch
- Implement Audit Logging via Postgres Triggers.
- Perform rigorous unit, integration, and End-to-End testing.
- Conduct User Acceptance Testing (UAT) with the ACCESS officers.
- Finalize production deployment and monitor initial usage.

