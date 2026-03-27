# ACCESS Web Portal — Project Overview

## 📋 What is ACCESS?

**ACCESS** (Association of Computer Engineering Students) is a centralized digital platform designed to modernize the administrative and logistical frameworks of student organizations at the Polytechnic University of the Philippines. It serves as a single source of truth for:

- **Organizational Directory** — student leaders, batch officers, class representatives
- **Asset Management** — technical equipment, tools, microcontroller inventory tracking
- **Events & Announcements** — upcoming activities, public information

This web portal unifies information previously scattered across social media and private chats, fostering **transparency and efficiency** for both student leaders and the general student body.

---

## 🛠️ Technology Stack

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| **Frontend**       | Next.js 15+ (App Router), React, TypeScript |
| **Styling**        | Tailwind CSS, PostCSS                       |
| **Backend**        | Next.js Server Actions & API Routes         |
| **Database**       | Supabase (PostgreSQL) with RBAC             |
| **Authentication** | Supabase Auth                               |
| **3D Graphics**    | Three.js (animated hero effects)            |

**Package Manager**: pnpm  
**Node Version**: >=18

---

## 📁 Directory Structure

```
ACCESS-WEB/
├── src/
│   ├── app/                          # Next.js App Router routes
│   │   ├── page.tsx                  # Landing page (/)
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   ├── api/                      # API endpoints & route handlers
│   │   │   ├── route.ts              # Base /api endpoint (test)
│   │   │   └── [...slug]/            # Dynamic catch-all routes
│   │   │       └── route.ts          # Test endpoint for all /api/* paths
│   │   ├── contributors/             # Contributors page route
│   │   ├── db-test/                  # Database connection test page
│   │   └── not-found.tsx             # 404 fallback
│   │
│   ├── features/                     # Domain-specific feature slices
│   │   ├── landing/
│   │   │   ├── index.ts              # Feature barrel export
│   │   │   └── components/
│   │   │       ├── AboutSection.tsx
│   │   │       ├── BorrowSection.tsx
│   │   │       ├── ContributorsSection.tsx
│   │   │       ├── CTASection.tsx
│   │   │       ├── EventsSection.tsx
│   │   │       ├── FAQSection.tsx
│   │   │       ├── FooterSection.tsx
│   │   │       └── MeetTheOfficersSection.tsx
│   │   │
│   │   ├── events/
│   │   │   ├── index.ts
│   │   │   └── components/
│   │   │       └── EventCard.tsx
│   │   │
│   │   ├── officers/
│   │   │   ├── index.ts
│   │   │   └── components/
│   │   │       └── OfficerCard.tsx
│   │   │
│   │   └── effects/
│   │       ├── index.ts
│   │       └── components/
│   │           ├── Crystal.tsx       # 3D crystal effects
│   │           ├── CrystalDice3D.tsx # Dice animation component
│   │           ├── EventsGradientBg.tsx
│   │           └── FloatingBlocks.tsx # Hero section 3D animated cubes
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── index.ts              # Barrel exports for UI components
│   │       └── Navbar.tsx            # Navigation bar
│   │
│   ├── lib/
│   │   └── utils.ts                  # Shared utility functions
│   │
│   ├── providers/
│   │   └── README.md                 # Context providers documentation
│   │
│   ├── configs/
│   │   └── README.md                 # Configuration modules
│   │
│   └── utils/
│       └── README.md                 # Generic helpers documentation
│
├── public/
│   └── BG-ACCESS.webp                # Hero background image
│
├── supabase/
│   └── test_connection.sql           # Database connection test script
│
├── docs/
│   ├── ARCHITECTURE.md               # Detailed technical architecture
│   ├── BACKEND.md                    # Backend API documentation
│   ├── LANDING_PAGE.md               # Landing page technical specs
│   ├── CONTRIBUTING.md               # Contribution guidelines
│   ├── STANDARDS.md                  # Code & design standards
│   ├── DOCKERIZED_SETUP.md           # Docker deployment setup
│   └── backend/
│       ├── API_ENDPOINTS.md          # Full API route reference
│       ├── BEST_PRACTICES.md         # Backend best practices
│       ├── BORROWING_FLOW.md         # Asset borrowing workflow
│       ├── ERD.md                    # Entity-Relationship Diagram
│       ├── IMPLEMENTATION_SPECS.md   # Backend specifications
│       ├── PRD.md                    # Product Requirements
│       └── SCHEMA.dbml               # Database schema (DBML format)
│
├── Dockerfile                        # Docker image definition
├── docker-compose.yml                # Docker Compose services
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── eslint.config.mjs                 # ESLint rules
├── postcss.config.mjs                # PostCSS configuration
├── package.json                      # Project dependencies
├── pnpm-lock.yaml                    # Dependency lock file
├── README.md                         # Main project README
└── PROJECT_OVERVIEW.md               # This file
```

---

## 🚀 Key Features

### Landing Page (`src/app/page.tsx`)

- **Hero Section** with animated background and 3D floating blocks
- **Navigation Bar** with links to key sections
- **Multiple Content Sections**:
  - About ACCESS
  - Borrow/Asset Management
  - Upcoming Events
  - Meet the Officers
  - FAQ
  - Call-to-Action & Footer

### API Routes (`src/app/api/`)

- **`/api`** — Base endpoint for testing API functionality
- **`/api/[...slug]`** — Dynamic catch-all route for flexible endpoint testing

### Test Pages

- **`/contributors`** — Contributors listing page
- **`/db-test`** — Database connection testing interface

---

## 🏗️ Architecture Highlights

### Modular Feature Slices

The codebase follows a **feature-oriented architecture** where each business domain (landing, events, officers, effects) is self-contained:

```
features/
├── landing/     # All landing page components
├── events/      # Event-related components
├── officers/    # Officer directory components
└── effects/     # Visual effects & animations
```

### UI Component Library

Shared UI primitives live in `src/components/ui/` and are exported via barrel files for clean imports:

```typescript
import { Navbar } from "@/components/ui";
```

### Separation of Concerns

- **`src/app/`** — Routes and page layouts only
- **`src/features/`** — Business logic and components
- **`src/components/`** — Reusable design system primitives
- **`src/lib/`** — Infrastructure and generic utilities

---

## 📦 Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp envexample .env.local
# Edit .env.local with your Supabase credentials
```

### Development

```bash
# Start dev server
pnpm dev
# Open http://localhost:3000
```

### Build & Test

```bash
# Build for production
pnpm build

# Run production build
pnpm start

# Test database connection
# Visit http://localhost:3000/db-test
```

### Docker

```bash
# Build Docker image
docker build -t access-web .

# Run with Docker Compose
docker-compose up
```

---

## 📚 Documentation Map

| Document                                          | Purpose                                    |
| ------------------------------------------------- | ------------------------------------------ |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)           | High-level tech stack & design decisions   |
| [LANDING_PAGE.md](docs/LANDING_PAGE.md)           | Hero section & landing page implementation |
| [BACKEND.md](docs/BACKEND.md)                     | Backend services & server actions          |
| [API_ENDPOINTS.md](docs/backend/API_ENDPOINTS.md) | Complete API route reference               |
| [ERD.md](docs/backend/ERD.md)                     | Database schema & relationships            |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md)           | How to contribute to the project           |
| [STANDARDS.md](docs/STANDARDS.md)                 | Code style & conventions                   |
| [DOCKERIZED_SETUP.md](docs/DOCKERIZED_SETUP.md)   | Docker deployment guide                    |

---

## 🎨 Design Philosophy

- **Clean & Light** — GDG branding with Google color accents
- **Modular Components** — Avoid monolithic 300+ line pages
- **Event-Based Navigation** — Intuitive user flows
- **Accessibility First** — WCAG compliance where possible

---

## 🔧 Development Workflow

1. **Create a feature branch** — `git checkout -b feature/my-feature`
2. **Work on feature** — Keep components small and modular
3. **Test locally** — `pnpm dev` and visit relevant pages
4. **Build check** — `pnpm build` must pass before PR
5. **Submit PR** — Follow [CONTRIBUTING.md](docs/CONTRIBUTING.md) guidelines
6. **Code review** — Ensure adherence to [STANDARDS.md](docs/STANDARDS.md)

---

## 📝 Environment Setup

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

For more details, see `envexample` file.

---

## 📞 Questions?

Refer to the detailed documentation in the `docs/` folder or check [CONTRIBUTING.md](docs/CONTRIBUTING.md) for community guidelines.

Happy coding! 🚀
