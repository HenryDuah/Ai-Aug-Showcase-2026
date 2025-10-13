# AI Lab Guided Tour

## Overview

The AI Lab Guided Tour is a mobile-first, tablet-friendly web application designed for Sand's physical medical innovation lab. It provides visitors with an interactive self-guided experience through five specialized sections showcasing cutting-edge healthcare technologies. The application features product displays with images, descriptions, product videos (YouTube or direct upload), impact statements, and a feedback collection system to capture visitor engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**October 13, 2025 - UI/UX Improvements & Product Brochure Feature**
- Updated text across the application:
  - Welcome page: Capitalized tagline to "Discover Innovative Medical Technologies Transforming Healthcare"
  - Section page: Changed instruction text to "Tap on any product card to view details" (removed audio reference)
- Enhanced video rendering with multi-platform support:
  - Added Vimeo video support with iframe embed
  - Improved HTML5 video player with multiple source formats (mp4, webm, ogg)
  - Added aspect-video container for consistent sizing across all video types
  - Added preload="metadata" and object-contain styling for better video display
- Redesigned product card layout for better tablet/desktop experience:
  - Implemented responsive grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
  - Reduced card size with responsive padding and font sizes
  - Added line-clamp for text overflow prevention (2 lines for titles, 3 for descriptions)
  - Updated badge from "Audio Available" to "Video" with Video icon
  - Cards now maintain equal heights in grid with flex layout
- Removed video file upload size restrictions:
  - Removed 50MB limit from video uploads
  - ObjectUploader component now supports unlimited file sizes
  - UI text updated to indicate "any size" for video uploads
- Added centered content layout for desktop/tablet:
  - Overview page: Content below header centered with max-w-4xl container (header remains full width)
  - Product detail page: Content below header centered with max-w-4xl container (header remains full width)
  - Improves readability on larger screens while maintaining mobile responsiveness
- Simplified video upload workflow:
  - Removed manual YouTube/Vimeo URL input
  - Video URL field now read-only and auto-populated on upload
  - Single "Upload Video File (any size)" button for all video uploads
  - Clear format guidance: "Supported formats: MP4, MOV, AVI, WMV, WebM"
- Added Product Brochure feature:
  - New optional brochureUrl field in product schema (text, nullable)
  - PDF upload capability in product form with read-only URL field
  - Brochure viewer dialog on product detail page with embedded PDF
  - Upload button styled with outline variant
  - ObjectUploader enhanced with buttonVariant prop for consistent styling
  - Brochure section only displays when PDF is available
- Cleared all product video URLs to provide clean slate for video file uploads

**October 10, 2025 - Product Schema Updates**
- Removed "How it Works" field completely from the application
  - Removed from schema (shared/schema.ts)
  - Removed from storage layer (server/storage.ts)
  - Removed from product form (client/src/pages/product-form.tsx)
  - Removed from product detail page (client/src/pages/product-detail.tsx)
  - Removed from all products in products.json
- Made "The Impact" field required (previously optional)
  - Updated schema to make theImpact non-nullable
  - Updated form label to show "The Impact" (removed "Optional")
  - Product detail page displays "The Impact" section prominently
- Converted video system from audio to support YouTube URLs and video uploads
  - Changed schema from audioUrl to videoUrl (required field)
  - Form supports both YouTube URL text input and video file upload via ObjectUploader
  - Product detail page renders YouTube URLs in iframe and other URLs in HTML5 video player
  - All products updated with valid YouTube video URLs
- Renamed "Video Guide" to "Product Video" and made it required
- Admin panel updated to show only visible products (onDisplay: true)

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
- `/product/:productId` - Detailed product view with full description, product video, and impact statement
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
- `POST /api/objects/upload` - Get upload URL for video files (admin, requires authentication)
- `GET /objects/:objectPath(*)` - Serve uploaded video files (public endpoint)

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
   - `videoUrl` (text, required) - Product video URL (YouTube or direct link)
   - `brochureUrl` (text, nullable) - Product brochure PDF URL (optional)
   - `theImpact` (text, required) - Impact statement describing the product's effect
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

**Product Video Upload & Display**
- Direct video file upload using Replit Object Storage
- Uppy-based file uploader with no size restrictions (any file size supported)
- Allowed video formats: mp4, mov, avi, wmv, webm, and all video/* types
- Video files stored in private object storage directory
- Served publicly via `/objects/` endpoint
- Supports YouTube URLs, Vimeo URLs, and direct video file uploads
- YouTube/Vimeo videos displayed via iframe embed
- Direct video files displayed via HTML5 video player with multiple source formats
- Required field for all products

**Product Brochure Upload & Display**
- Optional PDF brochure upload for additional product information
- Direct PDF file upload using Replit Object Storage
- Uppy-based file uploader with outline button variant
- PDF files stored in private object storage directory
- Served publicly via `/objects/` endpoint
- Brochure viewer displays PDF in a dialog modal with iframe embed
- Dialog is max-w-4xl with 70vh height for optimal viewing
- Brochure section only appears on product detail page when PDF is available
- Optional field - products can exist without brochures

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
- Direct video file upload for products
- Changes persist to products JSON file
- Real-time updates across the application
- Button text shows "Add Product" for new products, "Update Product" for edits
- Filters to show only visible products (onDisplay: true)

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