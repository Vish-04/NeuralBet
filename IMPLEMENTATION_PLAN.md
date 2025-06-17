## Technical Implementation Document

*MVP: “AI Battle Arena”*
**Stack**: Next.js 15 (App Router, React Server Components) • Tailwind v3.4 • Supabase (PostgreSQL + Auth v2 + Realtime + Edge Functions) • TypeScript • Vercel

**Current Status**: Repository is bootstrapped with complete authentication system, modern UI components, and development tooling. Ready for business logic implementation.

## Implementation Progress Summary

| Section | Status | Priority | Notes |
|---------|--------|----------|--------|
| 1. Repo Bootstrap & Tooling | ✅ Complete | - | Next.js 15, TypeScript, Auth system ready |
| 2. Supabase Auth & Env | ✅ Complete | - | Full auth flow implemented |
| 3. Database Schema | 🔄 Next | High | Replace placeholder with game tables |
| 4. Credit Purchase & Wallet | 📋 Pending | High | Stripe + wallet logic needed |
| 5. Betting Engine & Odds | 📋 Pending | High | Core business logic |
| 6. Game Abstraction Layer | 📋 Pending | Medium | Game engine framework |
| 7. Game Implementations | 📋 Pending | Medium | Connect4, Treasure Hunt, Battleship |
| 8. Public Pages | 🔄 Partial | Medium | Landing page done, need game pages |
| 9. API Layer | 📋 Pending | High | Betting and match APIs |
| 10. Realtime & Presence | 📋 Pending | Medium | Supabase realtime integration |

---

### 0  Document Conventions & Work‑Split Model

| Marker                   | Meaning                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| **(SR)**                 | *Server‑running code* (Next.js API Route Handler, Edge Function, Cron job, Supabase SQL) |
| **(CL)**                 | *Client‑side React component / hook*                                                     |
| **(SHARED)**             | *Package in `/packages/common` that is imported by both client & server*                 |
| **Acceptance Checklist** | Bullet list that an LLM must satisfy before handing the PR                               |
| **Out of Scope**         | Explicitly excluded items to prevent scope creep                                         |

Each numbered section below is an **independent work package**. Give it to one LLM, copy its output into a PR branch, run the checks, then move to the next item.

---

## 1  Repo Bootstrap & Tooling *(SR)* ✅ COMPLETED

**Current State**: Repository is fully bootstrapped with modern tooling

* ✅ Next.js 15 with TypeScript, TailwindCSS, and App Router
* ✅ Comprehensive ESLint + Prettier + TypeScript configuration
* ✅ Husky pre-commit hooks with lint-staged and commitlint
* ✅ Testing setup: Vitest (unit) + Playwright (E2E)
* ✅ Core dependencies installed: @supabase/supabase-js@2.46.1, @tanstack/react-query@4.36.1, zod@3.23.8
* ✅ Package manager: Yarn (preferred over pnpm)
* ✅ Semantic release with automatic changelog

**Note**: Uses Yarn instead of pnpm as package manager. Repository structure is single-app instead of monorepo.

---

## 2  Supabase Project, Auth & Env *(SR)* ✅ COMPLETED

**Current State**: Complete authentication system implemented

* ✅ Supabase clients configured in `src/supabase-clients/`
* ✅ Environment template `.env.local.example` provided
* ✅ Complete auth flow: login, signup, forgot password, update password
* ✅ OAuth support configured (GitHub, Google ready)
* ✅ RLS policies implemented
* ✅ Auth pages: `/login`, `/sign-up`, `/forgot-password`, `/update-password`
* ✅ Protected routes with middleware
* ✅ Auto-generated TypeScript types for database schema

**Ready for**: Business-specific table schema and credit logic implementation.

---

## 3  Database Schema *(SR)* 🔄 NEXT PRIORITY

**Current State**: Basic `items` table exists as placeholder

**Required Migration**: Replace placeholder schema with AI Battle Arena tables

**Commands Available**:
* `yarn db:migration` - Create new migration
* `yarn prod:db:push` - Push schema to Supabase  
* `yarn generate:types:local` - Generate TypeScript types

### 3.1  Core Tables to Implement

| Table      | Columns                                                                                                                                                                            | Notes                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `profiles` | `id uuid PK references auth.users`<br>`display_name text`, `avatar_url text`, `created_at timestamptz`                                                                             |                       |
| `wallets`  | `user_id uuid PK`, `credits numeric(12,2) default 0`, `updated_at timestamptz`                                                                                                     | 1 credits == 0.01 USD |
| `games`    | `id uuid PK`, `slug text unique`, `name text`, `status enum(draft,live,retired)`, `created_at`                                                                                     | metadata only         |
| `matches`  | `id uuid PK`, `game_id uuid FK`, `llm_a text`, `llm_b text`, `winner enum(a,b,draw,null)`, `starts_at`, `finished_at`, `simulated boolean default false`                           | One head‑to‑head      |
| `bets`     | `id uuid PK`, `match_id uuid FK`, `bettor uuid FK`, `side enum(a,b)`, `stake numeric(12,2)`, `odds decimal`, `payout numeric(12,2)`, `created_at`, `settled boolean default false` |                       |

### 3.2  Materialized Views & Functions

* `v_wallet_balance` — live aggregate (credits-in minus credits‑out).
* `fn_place_bet(match_id, side, stake)` — atomic bet + wallet debit.
* `fn_settle_match(match_id)` — writes `winner`, credits winners.

### 3.3  RLS Policies

* Wallet: user can select row where `user_id = auth.uid()`.
* Bets: insert/select where `bettor = auth.uid()`; admins bypass.

**Acceptance Checklist**

* `yarn local:db:reset` followed by `supabase db diff` → no drift.
* `yarn generate:types:local` updates `src/lib/database.types.ts`
* All tables have proper RLS policies

**Out of Scope**: Edge function code.

---

## 4  Credit Purchase & Wallet Module

### 4.1  Stripe *(SR)*

* Create test product “Credit Pack”.
* Webhook `/api/stripe/webhook` verifies signature, on `checkout.session.completed` → `wallets.credits += value`.

### 4.2  Client Checkout *(CL)*

* `/buy-credits` page calls `/api/stripe/create‑session?amount=`.

**Acceptance Checklist**

* Manual Stripe test card adds credits.
* Wallet balance updates in <2 s via Supabase realtime.

**Out of Scope**: production Stripe keys rotation.

---

## 5  Betting Engine & House Odds *(SR)*

**Algorithm**

1. For each `game_id`, maintain **Elo** for every LLM in `llm_ratings` table (`rating float default 1200`).
2. **Odds Generator CRON** (daily edge function):

   * Simulate 1 000 Monte‑Carlo matches with current ratings.
   * For each potential pairing compute P(win).
   * Convert to money‑line odds (American style) with house edge 5 %.
   * Insert/update `matches` with generated odds.

**Interfaces**

```ts
// packages/common/types.ts
export type Odds = { a: number; b: number }; // e.g. +120 / -140
```

**Acceptance Checklist**

* `supabase functions invoke simulate_odds` populates ≥10 matches.
* Unit tests verify odds edge ≈ 5 %.

**Out of Scope**: fancy ML.

---

## 6  Game Abstraction Layer *(SHARED)*

Purpose: plug any game with a **pure‑function rules engine** + optional visual renderer.

```ts
// packages/common/gameEngine.ts
export interface GameEngine<S, M> {
  /** initial immutable board */
  initialState: S;
  /** apply player move, return new state & optional winner */
  reducer: (state: S, move: M, by: 'a' | 'b') => { state: S; winner?: 'a'|'b'|'draw' };
  /** pretty‑print for logs */
  toString: (state: S) => string;
}
```

* Provide **ref impl** for Connect4 in `/packages/games/connect4.ts`.
* Wrapper that feeds engine into a generic React hook `useLocalGame(engine)`.

**Acceptance Checklist**

* Jest snapshot tests for reducer edge cases.

**Out of Scope**: UI canvas.

---

## 7  Game Implementations

### 7.1  Connect4 *(CL+SHARED)*

* Board rendered with CSS grid.
* Hover preview, real‑time piece drop animation.

### 7.2  Treasure Hunt Finder *(CL+SHARED)*

* 10×10 grid, each click reveals emoji 🔍 / 🪙.
* LLMs produce `row,col` guesses; fastest to find treasure wins.

### 7.3  Battleship *(CL+SHARED)*

* Traditional 10×10, hidden fleets.
* For MVP, pregenerated boards (seeded by match ID).

**Acceptance Checklist (per game)**

1. Playable by two browser tabs, state syncs via Supabase realtime channel `/match:{id}`.
2. `POST /api/matches/:id/run` runs headless engine vs stored LLM endpoints and writes winner.

**Out of Scope**: arbitrary custom games.

---

## 8  Public Pages & Navigation *(CL)*

| Route          | Purpose                                                |
| -------------- | ------------------------------------------------------ |
| `/`            | Hero, “Play • Watch • Bet” CTA                         |
| `/lobby`       | List of live & upcoming matches, odds, quick bet modal |
| `/match/[id]`  | Spectator view: board, chat, odds ticker               |
| `/portfolio`   | History of user bets & wallet                          |
| `/buy-credits` | Stripe checkout                                        |
| `/admin`       | (role=admin) simulate odds, force‑settle, CRUD LLMs    |

Use **Headless UI + Tailwind** for dialog / menu.

**Acceptance Checklist**

* Lighthouse perf > 90 on `/`.
* No hydration errors.

---

## 9  API Layer (Next.js Route Handlers) *(SR)*

| Method | URL                          | Auth  | Logic                                  |
| ------ | ---------------------------- | ----- | -------------------------------------- |
| `POST` | `/api/bets`                  | user  | call `fn_place_bet`                    |
| `POST` | `/api/matches/:id/run`       | admin | triggers LLM calls + `fn_settle_match` |
| `POST` | `/api/stripe/create-session` | user  | create Stripe checkout                 |
| `POST` | `/api/stripe/webhook`        | none  | Stripe signature check                 |

All handlers in `/src/app/api/**/route.ts` with `zod` validation.

**Acceptance Checklist**

* 100 % typed; `pnpm type‑check` passes.
* Error responses in RFC 7807 format.

---

## 10  Realtime & Presence *(CL+SR)*

* Supabase **channel** `match:{id}` broadcasts JSON patches `{type:'move',payload:…}`.
* Presence sub‑channel for viewer count.

**Acceptance Checklist**

* Refreshing page keeps current board state.
* Viewer counter accurate within ±1.

---

## 11  Admin Dashboard *(CL)*

* Guards `session.user.role === 'service_role' OR 'admin'`.
* Tabs: Matches, LLMs, Ratings, Payout Ledger.
* Bulk “Generate Matches” button -> call simulate edge function.

**Acceptance Checklist**

* Hidden from non‑admins via RLS & UI.

---

## 12  Security & Compliance

* use **Supabase RLS** everywhere.
* CSRF: Next.js built‑in `next-safe-middleware`.
* Stripe webhook signature & replay prevention.
* Logging: Supabase `logflare` extension.

---

## 13  Dev Ops

* **Vercel** Preview env per PR (env vars via encrypted project tokens).
* **Cron**: Vercel Cron → invoke `/api/cron/update‑odds` daily.
* **Edge Functions**: heavy simulations run in Supabase Edge.

---

## 14  Testing Strategy

| Layer             | Tool                                       | Coverage Target |
| ----------------- | ------------------------------------------ | --------------- |
| Pure game engines | Jest                                       | 95 %            |
| React components  | React Testing Library                      | critical paths  |
| API routes        | Supertest                                  | 80 %            |
| End‑to‑end        | Playwright • CI matrix (Chromium + WebKit) | ″happy path″    |

---

## 15  MVP Cut Line & Stretch Ideas

### Must‑Have to Ship

* Connect4 playable vs two canned LLM endpoints (e.g. `http://localhost:5001/llm_a/move`).
* Credit wallet, bet placement, automatic settlement, payouts.
* Basic lobby + match pages.

### Stretch

* Social sharing image (OG) generator.
* Referral credits.
* On‑chain credits (USDC/Solana) via Supabase Wallet extension.

---

### Current File / Folder Structure

```
src/
  app/
    (dynamic-pages)/
      (main-pages)/
        dashboard/page.tsx          # Protected route (placeholder)
        results/page.tsx            # Protected route (placeholder)
        faq/page.tsx                # ✅ Complete
        page.tsx                    # ✅ Landing page complete
      (login-pages)/
        login/page.tsx              # ✅ Complete auth flow
        sign-up/page.tsx
        forgot-password/page.tsx
        update-password/page.tsx
    (external-pages)/
      about/page.tsx                # ✅ Static pages complete
      privacy/page.tsx
      terms/page.tsx
    api/                            # 🔄 API routes needed:
      # bets/route.ts               # Needed for betting
      # matches/[id]/run/route.ts   # Needed for match execution
      # stripe/webhook/route.ts     # Needed for payments
  Components/
    ui/                             # ✅ Complete Radix UI library
    Auth/                           # ✅ Auth components complete
    # Connect4Board.tsx            # 🔄 Game components needed
    # BetSlip.tsx                  # 🔄 Betting components needed
  lib/
    database.types.ts               # ✅ Auto-generated Supabase types
    utils.ts                        # ✅ Utility functions
  supabase-clients/                 # ✅ Supabase client configs
supabase/
  migrations/                       # 🔄 Need AI Battle Arena schema
  # functions/                     # 🔄 Edge functions needed
  #   simulate_odds/index.ts
```

**Legend**: ✅ Complete | 🔄 In Progress/Needed | # Commented = Not Yet Created

---

## Quick Commands Reference

**This project uses Yarn, not pnpm. Always use `yarn` commands.**

```bash
# Development
yarn dev                    # Start dev server with Turbopack
yarn build                  # Production build
yarn test                   # Run unit tests
yarn test:e2e              # Run E2E tests
yarn lint                   # Lint and format code

# Database
yarn db:migration          # Create new migration
yarn prod:db:push          # Push schema to Supabase
yarn generate:types:local  # Generate TypeScript types
yarn local:db:reset        # Reset local database

# Supabase
yarn dev:functions         # Serve functions locally
yarn prod:deploy          # Deploy functions to production
```

## How to Use This Document

1. **Assign a section** to an LLM agent.
2. Copy **Tasks** & **Acceptance Checklist** into the PR description.
3. After CI passes & human review, merge.
4. Continue until Sections 1‑10 are merged ⇒ MVP ready to deploy.

**Next Priority**: Section 3 (Database Schema) - Replace placeholder `items` table with AI Battle Arena schema.


