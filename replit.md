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

The application utilizes Drizzle ORM with a PostgreSQL database, specifically Neon serverless PostgreSQL. The schema defines three primary tables:
- **products**: Stores product details including `name`, `company`, `description`, `image`, `videoUrl` (optional), `videoType` (optional), `brochureUrl` (optional), `website` (optional), `theImpact` (required), `features`, `sectionId`, `sectionName`, `onDisplay` status, and analytics tracking fields (`viewCount`, `videoClickCount`, `websiteClickCount`).
- **feedback**: Captures visitor feedback with fields like `visitorName`, `visitorCompany`, `visitorEmail`, `visitorPhone`, `comments`, and `submittedAt`.
- **productFeedback**: Captures product-specific feedback with fields like `productId`, `visitorName` (optional), `visitorEmail` (optional), `comments` (optional), and `submittedAt`.

### Application Features

- **Product Search & Filtering**: Real-time search across product attributes from the overview page.
- **Product Video Management**: Supports direct video file uploads (any size, various formats) to Replit Object Storage, YouTube, and Vimeo URLs. Videos are displayed via HTML5 player or iframe embeds. Video type labels (Overview/Demo) are optional and displayed under "Product Video" heading.
- **Product Brochure Management**: Optional PDF brochure uploads to Replit Object Storage, displayed in an embedded viewer modal.
- **Product Website Links**: Optional website URL field for products, displayed as clickable link on product detail page.
- **Image Viewing**: Full-screen image overlay modal for product images.
- **Section Navigation**: Simplified navigation with close button to return to current section (replaced previous/next section buttons).
- **Feedback Collection**: Two-tier feedback system:
  - General visitor feedback form with validation (React Hook Form, Zod) to capture overall tour feedback
  - Product-specific feedback form at end of each product detail page for targeted product insights
  - All feedback stored in PostgreSQL database
- **Authentication System**: Passport.js with local strategy and Express-session for secure admin login.
- **Admin Panel**: Provides full CRUD operations for products, product visibility toggling, direct file uploads, and persistence to PostgreSQL database.
- **Analytics Tracking System**: Automatic and transparent tracking of visitor engagement:
  - Product view count (tracked automatically when product detail page loads)
  - Video play click count (tracked when visitor clicks video play button)
  - Website link click count (tracked when visitor clicks website link)
  - All tracking endpoints are public (unauthenticated) to capture visitor interactions
- **Analytics Dashboard**: Comprehensive admin dashboard showing:
  - Total engagement metrics (product views, video clicks, website clicks)
  - Most viewed products (top 5)
  - General and product-specific feedback counts
  - Products with most feedback
  - CSV export functionality for both general and product-specific feedback
- **QR Code Generation**: Generates QR codes for each section and feedback page, with download options for physical deployment.

## External Dependencies

- **Database**: Neon serverless PostgreSQL (`@neondatabase/serverless`) via Drizzle ORM.
- **Object Storage**: Replit Object Storage (Google Cloud Storage) for video and brochure file uploads, using `@google-cloud/storage`.
- **UI Libraries**: shadcn/ui (built on Radix UI), Tailwind CSS, Lucide React for icons.
- **Form & Validation**: React Hook Form, Zod, and Hookform resolvers.
- **File Upload**: Uppy (`@uppy/core`, `@uppy/react`, `@uppy/aws-s3`, `@uppy/dashboard`) for client-side direct-to-storage uploads.
- **Data Fetching**: TanStack Query for asynchronous state management, caching, and background refetching.
- **QR Code Generation**: `qrcode` library for generating scannable QR codes.

## Recent Changes

**October 17, 2025 - Analytics Tracking and QR Code Enhancements**
- **Analytics Tracking Implementation**: Added comprehensive visitor engagement tracking system
  - Database columns added: `viewCount`, `videoClickCount`, `websiteClickCount` to products table
  - Created public API endpoints for tracking: `/api/products/:id/track-view`, `/api/products/:id/track-video-click`, `/api/products/:id/track-website-click`
  - Frontend integration: Product detail page automatically tracks views on mount, tracks clicks on video play and website links
  - All tracking is transparent and non-blocking to visitor experience
- **Analytics Dashboard Redesign**: Completely rebuilt `/analytics` page with comprehensive metrics
  - Total engagement metrics: product views, video clicks, website clicks displayed in card format
  - Most viewed products section showing top 5 products with view counts
  - Feedback summary section showing both general and product-specific feedback counts
  - Products with most feedback section highlighting engagement leaders
  - CSV download buttons for both general feedback and product-specific feedback
  - All sections include proper data visualization and empty state handling
- **Product Feedback CSV Export**: Added `/api/product-feedback/export` endpoint for downloading product-specific feedback as CSV
- **Feedback Page QR Code**: Added QR code generation for "Share your Thoughts" feedback page in admin QR codes section
- **Storage Layer Updates**: Added `getAllProductFeedback()` method to both MemStorage and DbStorage classes for analytics aggregation
- **End-to-End Testing**: Verified all tracking, analytics dashboard, and CSV export functionality working correctly

**October 16, 2025 (Later) - Final UI Polish and Logo Updates**
- **White Logo Implementation**: Replaced dark/black logo with white logo on all tour pages (overview, section, and feedback) while keeping dark logo on main landing page for better visibility against different backgrounds
- **Feedback Page Simplification**: Removed subtitle "How was your experience today?" from feedback page - now shows only "Share your Thoughts" heading with no subtitle for cleaner design
- **Feedback Page Layout**: Added centered container with max-width (max-w-4xl mx-auto) to feedback page for consistent layout with other pages
- **Product Detail Layout**: Moved website section to appear just before the product feedback section (after Key Features) for better information flow and visibility
- **Skip Tour Feature**: Added "Skip Tour - Share Your Thoughts" button on overview page allowing visitors to provide feedback directly without taking the full tour
- **Product Website Display**: Changed website link text from displaying the full URL to showing "Product Website" for cleaner, more professional presentation

**October 16, 2025 - UI Updates and Product-Specific Feedback**
- **Landing Page Updates**: Split welcome text into two lines - "Welcome to the" in black above "Innovative Healthcare Solutions Showcase" in gradient colors
- **Overview Page Branding**: Changed "AI Lab Overview" to "Showcase Overview" to align with rebrand; removed "Explore five innovative sections" subheading
- **About Tour Section**: Updated paragraph with new copy emphasizing visitor experience and Sand's innovation leadership; bold "Innovative Healthcare Solutions Showcase" text
- **Sand Logo Addition**: Added Sand logo to overview page, section pages, and feedback page (positioned on right side of headers) - note: NOT on product detail pages to avoid brand confusion with featured company solutions
- **Product Website Field**: 
  - Added optional website field to product schema (text, nullable)
  - Added website input to admin product form (labeled "Website (Optional)")
  - Display website as clickable link on product detail page when populated
  - Proper null handling throughout form → API → database pipeline
- **Product Detail Navigation**: Replaced previous/next section buttons with single close button that returns to current section for cleaner UX
- **Product-Specific Feedback System**:
  - Created productFeedback table with fields: productId, visitorName (optional), visitorEmail (optional), comments (optional), submittedAt
  - Added POST /api/product-feedback endpoint with Zod validation
  - Implemented feedback form at end of product detail page with heading "Share your views on this product (Optional)"
  - Form includes optional name, email, and comments fields
  - Success toast on submission, form clears after successful save
  - All data persists to PostgreSQL database

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