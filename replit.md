# AI Lab Guided Tour

## Overview

The AI Lab Guided Tour is a mobile-first, tablet-friendly web application designed for Sand's physical medical innovation lab. Its primary purpose is to offer visitors an interactive self-guided experience through specialized sections showcasing cutting-edge healthcare technologies. The application features detailed product displays with rich media, impact statements, and a feedback system to gauge visitor engagement. The project aims to enhance the visitor experience, disseminate valuable information, and gather insights into product interest, thereby positioning Sand as a leader in medical innovation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, utilizing Vite for development and Wouter for client-side routing. TanStack Query manages data fetching and server state. UI components are developed using shadcn/ui (based on Radix UI) and styled with Tailwind CSS, adhering to a mobile-first responsive design. A custom HSL-based color system ensures brand consistency.

### Backend Architecture

The backend uses Express.js with TypeScript, implementing a RESTful API. It includes middleware for logging and JSON parsing. Data persistence for products and feedback is handled by a PostgreSQL database using Drizzle ORM and DbStorage. Zod schemas provide robust data validation for all API endpoints.

### Database Design

The application uses Drizzle ORM with Neon serverless PostgreSQL. The schema includes three main tables:
- **products**: Stores comprehensive product details, including classification, evidence, technical specifications, hardware, regulatory information, user types, and analytics tracking fields such as `viewCount`, `videoClickCount`, and `websiteClickCount`.
- **feedback**: Captures general visitor feedback, including `visitorName`, `visitorCompany`, `visitorEmail`, `visitorPhone`, `comments`, and `submittedAt`.
- **productFeedback**: Records product-specific feedback, including `productId`, optional `visitorName`, `visitorEmail`, `comments`, `visitorRole`, `visitorRoleOther`, and `submittedAt`.

### Application Features

- **Product Management**: Full CRUD operations for products via an admin panel, including visibility toggling, direct file uploads, and persistence to PostgreSQL.
- **Product Display**: Rich media support for product details (images, videos, brochures, website links). Product cards and detail pages are designed for clarity and comprehensive information, using expandable sections.
- **Navigation & UI**: Simplified section navigation and full-screen image overlays.
- **Feedback System**: A two-tier system for general visitor feedback and product-specific feedback, both with validation and storage in PostgreSQL.
- **Authentication**: Secure admin login using Passport.js with a local strategy and Express-session.
- **Analytics**: Automatic tracking of visitor engagement (product views, video clicks, website clicks) with a comprehensive admin dashboard displaying key metrics, most viewed products, feedback summaries, and CSV export functionality.
- **QR Code Generation**: Creation of QR codes for sections and feedback pages, with download options for physical deployment.
- **File Uploads**: Supports direct video and brochure file uploads to Replit Object Storage with progress visibility and URL normalization.

## External Dependencies

- **Database**: Neon serverless PostgreSQL (`@neondatabase/serverless`) via Drizzle ORM.
- **Object Storage**: Replit Object Storage (Google Cloud Storage) for file uploads, using `@google-cloud/storage`.
- **UI Libraries**: shadcn/ui (Radix UI), Tailwind CSS, Lucide React.
- **Form & Validation**: React Hook Form, Zod, Hookform resolvers.
- **File Upload**: Uppy (`@uppy/core`, `@uppy/react`, `@uppy/aws-s3`, `@uppy/dashboard`).
- **Data Fetching**: TanStack Query.
- **QR Code Generation**: `qrcode` library.