# TurboForm Web

TurboForm is an AI-powered form builder. This repository contains the web frontend built with Next.js, providing a modern user interface for creating, managing, and distributing forms with AI assistance.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Development Workflow](#development-workflow)
- [Authentication](#authentication)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **AI Form Generation**: Instantly create forms using natural language prompts
- **Drag-and-Drop Editor**: Customize forms with an intuitive interface
- **Form Analytics**: Track submissions and analyze response data
- **Vector Search**: Use AI to search across form responses semantically
- **Responsive Design**: Optimized for mobile, tablet, and desktop experiences

## Architecture

TurboForm's web frontend is built with:

- [Next.js](https://nextjs.org/) (App Router) - React framework for server-side rendering
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn](https://ui.shadcn.com/) - Component library built on Radix UI
- [SWR](https://swr.vercel.app/) - React hooks for data fetching
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Supabase](https://supabase.com/) - Auth, database access, and file storage

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) v8 or later
- Access to the TurboForm API (see the `workers` repository for API setup)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/turboform.git
   cd turboform/web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env.local` (create it if it doesn't exist)
   - Fill in the required variables:

   ```
   # Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # API configuration
   API_BASE_URL=https://api.turboform.ai
   # API_BASE_URL=http://localhost:8787 # For local development

   # Stripe credentials (optional for payment features)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   NEXT_PUBLIC_STRIPE_PRICE_ID=your_stripe_price_id

   # Turnstile for CAPTCHA (optional)
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development Workflow

### Code Style

- Use kebab-case for React component file names (e.g., `user-card.tsx`)
- Prefer named exports for components

### State Management

- Use React Context for global state management
- Use SWR for data fetching and caching
- Follow React hooks best practices

### Commands

```bash
# Development
npm run dev            # Start development server
npm run lint           # Run ESLint

# Database
npm run gen-db-types   # Generate TypeScript types from Supabase

# Deployment
npm run build          # Build the application
npm run preview        # Preview the built application
npm run deploy         # Deploy to production
```

## Authentication

TurboForm uses Supabase Auth for user authentication with the following features:

- Email/password authentication
- OAuth providers (Google, GitHub, etc.)
- Anonymous user sessions with upgrade path
- Protected routes and client-side auth checks

## API Integration

The web application communicates with the TurboForm API located in the `workers` repository:

- All frontend API calls are proxied through Next.js API routes in `src/app/api/`
- The API endpoints follow RESTful patterns
- Authentication is handled via Supabase Auth tokens

## Deployment

TurboForm web can be deployed using Cloudflare Pages:

1. Make sure you've built the application:

   ```bash
   npm run build
   npm run pages:build
   ```

2. Deploy to Cloudflare Pages:
   ```bash
   npm run deploy
   ```

Alternatively, you can deploy to other platforms like Vercel or Netlify.

## Contributing

We welcome contributions to TurboForm! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the project's code style
4. Commit your changes: `git commit -m 'Add some amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Follow the established project structure and patterns
- Write clean, maintainable code with appropriate comments
- Ensure all linting and type checking passes before submitting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
