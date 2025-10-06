# AI Lab Guided Tour

## Overview

The AI Lab Guided Tour is a mobile-first, tablet-friendly web application designed for Sand's physical medical innovation lab. It provides visitors with an interactive self-guided experience through five specialized sections showcasing cutting-edge healthcare technologies. The application features product displays with images, descriptions, audio guides, and a feedback collection system to capture visitor engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with CSS variables for theming
- Custom color system using HSL values for consistent design language
- Mobile-first responsive design approach

**State Management Strategy**
- React Query handles all server state (products, feedback)
- Local component state for UI interactions (modals, audio playback, form inputs)
- No global client state library needed due to React Query's caching

**Routing Structure**
- `/` - Welcome screen with lab introduction
- `/overview` - Lab overview with section navigation
- `/section/:sectionId` - Individual section views (1-5) displaying products
- `/product/:productId` - Detailed product view with full description and audio
- `/feedback` - Visitor feedback form

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- RESTful API design pattern
- Middleware-based request logging and JSON parsing
- Development mode with Vite middleware integration for SPA serving

**API Endpoints**
- `GET /api/products` - Retrieve all products
- `GET /api/products/section/:sectionId` - Get products filtered by section
- `GET /api/products/:id` - Get single product details
- `POST /api/feedback` - Submit visitor feedback

**Data Access Layer**
- Storage abstraction with `IStorage` interface for flexibility
- Current implementation uses in-memory storage (`MemStorage` class)
- Designed for easy migration to database-backed storage
- Sample product data initialized on server start

**Data Validation**
- Zod schemas for runtime type validation
- Drizzle-zod integration for schema-to-validation conversion
- Request body validation before database operations

### Database Design

**Schema Definition**
- Drizzle ORM with PostgreSQL dialect for type-safe database access
- Schema defined in `shared/schema.ts` for use across client and server

**Tables**

1. **products**
   - `id` (varchar, primary key) - Unique product identifier
   - `name`, `company`, `type`, `description` (text) - Product metadata
   - `image` (text) - Product image URL
   - `audioUrl` (text, nullable) - Optional audio guide URL
   - `features` (json array) - List of product features
   - `sectionId` (integer) - Section assignment (1-5)
   - `sectionName` (text) - Section display name
   - `onDisplay` (boolean) - Visibility flag

2. **feedback**
   - `id` (varchar, primary key) - Auto-generated UUID
   - `visitorName`, `visitorEmail`, `visitorCompany` (text, nullable) - Visitor info
   - `interestingProducts` (json array) - Selected product IDs
   - `comments` (text, nullable) - Free-form feedback
   - `submittedAt` (timestamp) - Submission timestamp

**Migration Strategy**
- Migrations stored in `/migrations` directory
- Drizzle Kit handles schema migrations with `db:push` command

### Application Features

**Audio Playback**
- Custom audio player component with play/pause controls
- Progress tracking and duration display
- Automatic cleanup on component unmount

**Image Viewing**
- Full-screen image overlay modal
- Click-to-close or overlay-tap-to-close interactions
- Optimized for mobile touch interactions

**Section Navigation**
- Linear flow with previous/next navigation
- Direct section access from overview page
- Visual section identification with gradient color coding

**Form Handling**
- React Hook Form with Zod resolver for validation
- Multi-select product interest tracking
- Success feedback with toast notifications

## External Dependencies

**Database**
- Neon serverless PostgreSQL via `@neondatabase/serverless`
- Connection via `DATABASE_URL` environment variable
- Drizzle ORM for database interactions

**UI Libraries**
- Radix UI primitives for 30+ accessible components (dialogs, dropdowns, tabs, etc.)
- Tailwind CSS with PostCSS for styling
- Embla Carousel for potential carousel implementations
- Lucide React for icon system

**Development Tools**
- Replit-specific plugins for runtime error overlay and dev banner
- Vite plugin for development cartographer
- TSX for TypeScript execution in development

**Font Services**
- Google Fonts API for "Open Sans" and "Architects Daughter" font families
- Preconnect optimization for faster font loading

**Build & Runtime**
- esbuild for server bundle compilation
- Node.js for production runtime
- TypeScript compiler for type checking

**Form & Validation**
- React Hook Form for form state management
- Zod for schema validation
- Hookform resolvers for integration

**Data Fetching**
- TanStack Query for async state management
- Built-in caching and background refetching
- Optimistic updates support