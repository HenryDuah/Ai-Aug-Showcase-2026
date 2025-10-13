# AI Lab Guided Tour

## Overview

The AI Lab Guided Tour is a mobile-first, tablet-friendly web application for Sand's physical medical innovation lab. Its purpose is to provide visitors with an interactive self-guided experience through five specialized sections showcasing cutting-edge healthcare technologies. The application features product displays with rich media (images, descriptions, videos, brochures), impact statements, and a feedback collection system to capture visitor engagement. The business vision is to enhance the visitor experience, provide valuable information, and gather insights into product interest, positioning Sand at the forefront of medical innovation display.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for fast development. Wouter handles client-side routing, and TanStack Query manages server state and data fetching. The UI is constructed with shadcn/ui components (based on Radix UI) and styled using Tailwind CSS, adhering to a mobile-first responsive design. A custom color system based on HSL values ensures consistent branding.

### Backend Architecture

The backend is an Express.js server developed with TypeScript, following a RESTful API design. It uses middleware for request logging and JSON parsing. Product data is loaded from a JSON file and cached in-memory with write-through for admin updates, while feedback data persists in a PostgreSQL database. Zod schemas are used for robust data validation across the API.

### Database Design

The application utilizes Drizzle ORM with a PostgreSQL database, specifically Neon serverless PostgreSQL. The schema defines two primary tables:
- **products**: Stores product details including `name`, `company`, `description`, `image`, `videoUrl` (required), `brochureUrl` (optional), `theImpact` (required), `features`, `sectionId`, `sectionName`, and `onDisplay` status.
- **feedback**: Captures visitor feedback with fields like `visitorName`, `visitorEmail`, `interestingProducts`, `comments`, and `submittedAt`.

### Application Features

- **Product Search & Filtering**: Real-time search across product attributes from the overview page.
- **Product Video Management**: Supports direct video file uploads (any size, various formats) to Replit Object Storage, YouTube, and Vimeo URLs. Videos are displayed via HTML5 player or iframe embeds.
- **Product Brochure Management**: Optional PDF brochure uploads to Replit Object Storage, displayed in an embedded viewer modal.
- **Image Viewing**: Full-screen image overlay modal for product images.
- **Section Navigation**: Linear navigation flow with direct access via overview or QR codes.
- **Feedback Collection**: Form with validation (React Hook Form, Zod) to capture visitor feedback, stored in PostgreSQL.
- **Authentication System**: Passport.js with local strategy and Express-session for secure admin login.
- **Admin Panel**: Provides full CRUD operations for products, product visibility toggling, direct file uploads, and persistence to the product JSON file.
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

**October 13, 2025 - File Upload System Enhancements**
- **Upload Progress Visibility**: Added real-time progress indicators showing upload percentage and completion status outside the Uppy modal
- **Non-Blocking Uploads**: Made video uploads optional when editing existing products (required only for new products)
- **URL Normalization Fix**: Implemented proper file URL normalization system
  - Added `/api/objects/normalize` endpoint to convert Google Cloud Storage URLs to visitor-accessible paths
  - Upload handlers now normalize URLs after upload completes
  - Fallback path extraction ensures resilience when environment variables aren't configured
  - Files are properly accessible to visitors at paths like `/objects/uploads/{id}`
  - Complete upload flow: file upload → GCS signed URL → normalize to /objects/ path → save to product → visitors can view