# AI Lab Guided Tour

## Overview

The AI Lab Guided Tour is a mobile-first, tablet-friendly web application for Sand's physical medical innovation lab. Its purpose is to provide visitors with an interactive self-guided experience through five specialized sections showcasing cutting-edge healthcare technologies. The application features product displays with rich media (images, descriptions, videos, brochures), impact statements, and a feedback collection system to capture visitor engagement. The business vision is to enhance the visitor experience, provide valuable information, and gather insights into product interest, positioning Sand at the forefront of medical innovation display.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for fast development. Wouter handles client-side routing, and TanStack Query manages server state and data fetching. The UI is constructed with shadcn/ui components (based on Radix UI) and styled using Tailwind CSS, adhering to a mobile-first responsive design. A custom color system based on HSL values ensures consistent branding.

### Backend Architecture

The backend is an Express.js server developed with TypeScript, following a RESTful API design. It uses middleware for request logging and JSON parsing. All product and feedback data now persists in PostgreSQL database using Drizzle ORM with the DbStorage implementation. Zod schemas are used for robust data validation across the API.

### Database Design

The application utilizes Drizzle ORM with a PostgreSQL database, specifically Neon serverless PostgreSQL. The schema defines two primary tables:
- **products**: Stores product details including `name`, `company`, `description`, `image`, `videoUrl` (optional), `videoType` (optional), `brochureUrl` (optional), `theImpact` (required), `features`, `sectionId`, `sectionName`, and `onDisplay` status.
- **feedback**: Captures visitor feedback with fields like `visitorName`, `visitorEmail`, `interestingProducts`, `comments`, and `submittedAt`.

### Application Features

- **Product Search & Filtering**: Real-time search across product attributes from the overview page.
- **Product Video Management**: Supports direct video file uploads (any size, various formats) to Replit Object Storage, YouTube, and Vimeo URLs. Videos are displayed via HTML5 player or iframe embeds.
- **Product Brochure Management**: Optional PDF brochure uploads to Replit Object Storage, displayed in an embedded viewer modal.
- **Image Viewing**: Full-screen image overlay modal for product images.
- **Section Navigation**: Linear navigation flow with direct access via overview or QR codes.
- **Feedback Collection**: Form with validation (React Hook Form, Zod) to capture visitor feedback, stored in PostgreSQL.
- **Authentication System**: Passport.js with local strategy and Express-session for secure admin login.
- **Admin Panel**: Provides full CRUD operations for products, product visibility toggling, direct file uploads, and persistence to PostgreSQL database.
- **Analytics Dashboard**: Displays feedback statistics, most interesting products, and offers CSV export.
- **QR Code Generation**: Generates QR codes for each section, with download options for physical deployment.

## External Dependencies

- **Database**: Neon serverless PostgreSQL (`@neondatabase/serverless`) via Drizzle ORM.
- **Object Storage**: Replit Object Storage (Google Cloud Storage) for video and brochure file uploads, using `@google-cloud/storage`.
- **UI Libraries**: shadcn/ui (built on Radix UI), Tailwind CSS, Lucide React for icons.
- **Form & Validation**: React Hook Form, Zod, and Hookform resolvers.
- **File Upload**: Uppy (`@uppy/core`, `@uppy/react`, `@uppy/aws-s3`, `@uppy/dashboard`) for client-side direct-to-storage uploads.
- **Data Fetching**: TanStack Query for asynchronous state management, caching, and background refetching.
- **QR Code Generation**: `qrcode` library for generating scannable QR codes.

## Recent Changes

**October 14, 2025 - Hidden Product Management for Admins**
- **Fixed Admin Panel Product Visibility**: Removed filter that hid products when marked as not visible, preventing admins from making them visible again
- **Visual Indicators for Hidden Products**: 
  - Hidden products now display with dimmed background (`bg-muted/50 opacity-75`)
  - "Hidden" badge appears next to product name for easy identification
  - Status text clearly shows "Visible" or "Hidden" state
- **Complete Product Management**: Admins can now view and toggle visibility of all products (both visible and hidden) from the admin panel
- **Visitor Protection**: Hidden products remain invisible on visitor-facing pages while being fully manageable in admin panel

**October 13, 2025 - Optional Video Field Handling Improvements**
- **Fixed Product Form Mode Detection**: Corrected edit mode logic to use `!!productId && productId !== "new"` ensuring create route displays "Add New Product" and edit route displays "Edit Product"
- **Radix UI Select Component Compatibility**: Changed video type clear option from empty string to `"__NONE__"` sentinel value to satisfy Radix UI's requirement that SelectItem values cannot be empty strings
- **Enhanced Backend Validation**: Added defensive coercion in both POST and PATCH endpoints to handle `"__NONE__"` sentinel value, converting it to null along with empty strings and legacy "none" values
- **Improved User Experience**: Removed confusing static helper text from video URL field that appeared as validation error; label already indicates field is optional
- **End-to-End Video Workflow**: Confirmed all video field operations work correctly:
  - Create products without video (fields stored as null)
  - Add video URL and type to existing products
  - Clear video fields (converts to null, not empty string)
  - Cleared fields remain null on subsequent edits
- **Data Consistency**: Video fields now flow correctly through entire system: form → cleanup → API → database with proper null handling at each layer

**October 13, 2025 (Earlier) - Database Migration for Production Persistence**
- **Complete Product Storage Migration**: Migrated from JSON file storage to PostgreSQL database
  - Created DbStorage class replacing MemStorage for production-ready persistence
  - All 25 products successfully migrated from `server/data/products.json` to database
  - Migration script (`server/migrate-products.ts`) uses upsert logic to preserve product IDs
  - SQL-level filtering for `onDisplay` status prevents hidden products from loading
  - Admin panel now persists product changes across deployments
  - Fixes deployment issues: products and admin changes survive Replit's read-only filesystem
- **Database Schema Updates**: 
  - Added `brochure_url` column to products table
  - Removed obsolete `how_it_works` column
- **TypeScript Improvements**: Fixed type safety for features array handling in create/update operations

**October 13, 2025 (Earlier) - File Upload System Enhancements**
- **Upload Progress Visibility**: Added real-time progress indicators showing upload percentage and completion status outside the Uppy modal
- **Non-Blocking Uploads**: Made video uploads optional when editing existing products (required only for new products)
- **URL Normalization Fix**: Implemented proper file URL normalization system
  - Added `/api/objects/normalize` endpoint to convert Google Cloud Storage URLs to visitor-accessible paths
  - Upload handlers now normalize URLs after upload completes
  - Fallback path extraction ensures resilience when environment variables aren't configured
  - Files are properly accessible to visitors at paths like `/objects/uploads/{id}`
  - Complete upload flow: file upload → GCS signed URL → normalize to /objects/ path → save to product → visitors can view