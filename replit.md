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
- `/` - Welcome screen with lab introduction and health icon
- `/overview` - Lab overview with section navigation and product search
- `/section/:sectionId` - Individual section views (1-5) displaying products
- `/product/:productId` - Detailed product view with full description and audio
- `/feedback` - Visitor feedback form with validation
- `/admin` - Admin panel for product management (requires authentication)
- `/admin/product/new` - Create new product with file upload (admin)
- `/admin/product/:id` - Edit existing product (admin)
- `/analytics` - Analytics dashboard with feedback statistics (admin)
- `/qr-codes` - QR code generator for section direct access

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
- `POST /api/products` - Create new product (admin, requires authentication)
- `PATCH /api/products/:id` - Update product (admin, requires authentication)
- `DELETE /api/products/:id` - Delete product (admin, requires authentication)
- `PATCH /api/products/:id/display` - Update product display status (admin, requires authentication)
- `POST /api/feedback` - Submit visitor feedback
- `GET /api/feedback` - Retrieve all feedback submissions (admin, requires authentication)
- `GET /api/feedback/export` - Export feedback as CSV file (admin, requires authentication)
- `POST /api/objects/upload` - Get upload URL for audio files (admin, requires authentication)
- `GET /objects/:objectPath(*)` - Serve uploaded audio files (public endpoint)

**Data Access Layer**
- Storage abstraction with `IStorage` interface for flexibility
- Feedback data persists to PostgreSQL database via Drizzle ORM
- Product data loaded from JSON file (`server/data/products.json`) on startup
- Products cached in-memory with write-through to JSON file for admin updates

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

**Product Search & Filtering**
- Real-time search across all products from overview page
- Searches by name, company, type, and description
- Graceful error handling with retry functionality
- Loading states and disabled controls during data fetch

**Audio File Upload & Playback**
- Direct audio file upload using Replit Object Storage
- Uppy-based file uploader with size and type restrictions (max 10MB, audio formats)
- Audio files stored in private object storage directory
- Served publicly via `/objects/` endpoint
- Custom audio player component with play/pause controls
- Progress tracking and duration display
- Automatic cleanup on component unmount
- Optional audio guides for products

**Image Viewing**
- Full-screen image overlay modal
- Click-to-close or overlay-tap-to-close interactions
- Optimized for mobile touch interactions

**Section Navigation**
- Linear flow with previous/next navigation
- Direct section access from overview page or QR codes
- Visual section identification with gradient color coding

**Feedback Collection**
- React Hook Form with Zod resolver for validation
- Multi-select product interest tracking
- Success feedback with toast notifications
- Data persists to PostgreSQL database

**Authentication System**
- Passport.js with local strategy for admin authentication
- Express-session with PostgreSQL store for persistent sessions
- Secure session management with httpOnly cookies
- Admin user seeding on startup
- Protected admin routes with requireAuth middleware

**Admin Panel**
- Full product CRUD operations (create, read, update, delete)
- Toggle product visibility by section
- Direct audio file upload for products
- Changes persist to products JSON file
- Real-time updates across the application
- Button text shows "Save" for new products, "Update Product" for edits

**Analytics Dashboard**
- Total submissions and visitor statistics
- Most interesting products ranking
- Recent feedback display with visitor details
- CSV export functionality with proper escaping

**QR Code Generation**
- Generate QR codes for all 5 sections
- Individual and bulk download options
- Direct section access via QR scan
- Usage instructions for physical lab setup

## External Dependencies

**Database**
- Neon serverless PostgreSQL via `@neondatabase/serverless`
- Connection via `DATABASE_URL` environment variable
- Drizzle ORM for database interactions

**Object Storage**
- Replit Object Storage backed by Google Cloud Storage
- `@google-cloud/storage` for object storage client
- Environment variables: `PRIVATE_OBJECT_DIR`, `PUBLIC_OBJECT_SEARCH_PATHS`
- Used for storing uploaded audio files

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

**File Upload**
- Uppy (@uppy/core, @uppy/react, @uppy/aws-s3, @uppy/dashboard)
- Client-side file upload with progress tracking
- Direct-to-storage uploads using presigned URLs
- File type and size validation

**Data Fetching**
- TanStack Query for async state management
- Built-in caching and background refetching
- Optimistic updates support

**QR Code Generation**
- qrcode library for generating QR codes
- Generates data URLs for section direct links
- Download functionality for printing