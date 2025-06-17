# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**NeuralBet2** is a modern Next.js 15 web application built with TypeScript, React 19, TailwindCSS, and Supabase. Originally based on Andrew Ting's NextJS-Supabase template, it implements a complete authentication system with protected routes and a professional UI component library.

## Essential Development Commands

**This project uses Yarn as the package manager. Always use `yarn` instead of `npm`.**

### Core Development
```bash
# Start development server with Turbopack
yarn dev

# Build for production  
yarn build

# Start production server
yarn start

# Install dependencies (Yarn is preferred)
yarn install
```

### Database & Supabase
```bash
# Generate TypeScript types from Supabase schema
yarn generate:types:local

# Push database schema to Supabase
yarn prod:db:push

# Reset local database
yarn local:db:reset

# Create new migration
yarn db:migration

# Deploy Supabase functions
yarn prod:deploy

# Serve functions locally
yarn dev:functions
```

### Testing & Quality
```bash
# Run unit tests (Vitest)
yarn test

# Run tests in watch mode
yarn test:watch

# Run E2E tests (Playwright)
yarn test:e2e

# Lint and format code
yarn lint

# Type checking
yarn tsc

# Semantic commit (with commitizen)
yarn commit
```

## Architecture & Structure

### Frontend Architecture
- **Next.js 15** with App Router and Turbopack
- **React 19 RC** with server components and suspense
- **TypeScript 5.5.4** with strict typing
- **TailwindCSS 3.4.10** with Radix UI components
- **Framer Motion** for animations
- **TanStack React Query** for data fetching

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Realtime)
- **Row Level Security (RLS)** implemented
- Auto-generated TypeScript types in `src/lib/database.types.ts`
- Current schema: simple `items` table (placeholder)

### Route Structure
```
src/app/
├── (dynamic-pages)/
│   ├── (main-pages)/        # Main app pages (dashboard, results)
│   │   └── (logged-in-pages)/ # Protected routes
│   └── (login-pages)/       # Authentication pages
└── (external-pages)/        # Public pages (about, privacy, terms)
```

### Component Organization
- `src/components/ui/` - Radix UI component library
- `src/components/Auth/` - Authentication components
- `src/lib/` - Utilities and database types
- `src/supabase-clients/` - Supabase client configurations

## Required Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Configure Supabase variables in `.env.local`:**
   ```
   SUPABASE_PROJECT_REF=your-project-ref
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Setup Supabase project:**
   ```bash
   yarn supabase link --project-ref <project-ref>
   yarn supabase db push
   yarn generate:types:local
   ```

## Development Workflow

### Authentication System
- Complete auth flow with Supabase Auth
- Login/Signup pages with form validation
- Password reset functionality
- OAuth support configured (Google, GitHub)
- Protected routes with middleware

### UI Components
- Comprehensive Radix UI component library
- Dark mode support with next-themes
- Responsive design patterns
- Animation support with Framer Motion

### Database Patterns
- TypeScript types auto-generated from Supabase schema
- Row Level Security (RLS) policies implemented
- Server and client-side data fetching examples
- TanStack React Query for client-side caching

## Code Quality & Conventions

- **ESLint + Prettier** configuration enforced
- **Husky** pre-commit hooks with lint-staged
- **Commitlint** for conventional commit messages
- **Semantic release** with automatic changelog
- **TypeScript strict mode** enabled

## Troubleshooting

### Husky Issues
If pre-commit hooks fail:
```bash
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

### Type Generation Issues
Ensure `.env.local` is properly configured before running:
```bash
yarn generate:types:local
```

## Current State
The application includes a complete authentication system, professional landing page, and UI component library. The dashboard and results pages contain placeholder content ready for feature implementation.