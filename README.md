# Clinic Stock Management Console

A stock management console for clinic supplies built with Next.js 14+, TanStack Query, and shadcn/ui.

**Live Demo:** https://savanna-stock-console.vercel.app

**Test Credentials:** emilys / emilyspass

## Section 1: Design Decisions

### 1.1 Component Architecture

Modular component structure organized by feature/domain with barrel exports.

### 1.2 State Management

- Server state: TanStack Query (caching, refetching, optimistic updates)
- Auth state: React Context + in-memory store
- URL state: Custom useURLState hook
- Form state: React useState

### 1.3 Data Fetching

TanStack Query + Axios with proactive + reactive token refresh strategy.

### 1.4 Styling

Tailwind CSS + shadcn/ui for developer velocity and consistency.

### 1.5 Accessibility

WCAG 2.1 AA compliance target with semantic HTML and keyboard navigation.

## Section 2: Decision Log

1. **URL State:** Custom useURLState hook over nuqs library (simpler, no dependencies)
2. **Optimistic Updates:** Immediate UI updates with rollback on failure
3. **Table View:** Data-dense table over cards for inventory management

## Section 3: Getting Started

```bash
git clone git@github.com:Maureenko/savanna-stock-console.git
cd savanna-stock-console
npm install --legacy-peer-deps
npm run dev
```

### CI/CD Pipeline

GitHub Actions runs format, lint, commitlint, tests on push/PR. Vercel auto-deploys on merge.

### API Limitations

DummyJSON mock API: PUT requests do not persist, 1 min token expiry for testing.

## Section 4: AI Reflection

1. **Best approach:** Incremental, specific prompts for testable steps
2. **Easy:** Project setup, token refresh, table view
3. **Difficult:** Vitest + Next.js 16 conflicts, partial PUT response handling
4. **Interventions:** Error handling for partial data, test configuration
5. **Verification:** Manual testing, build, lint, unit tests, edge cases
6. **Next time:** Tests earlier, explicit error handling, TypeScript interfaces first
7. **AI workflow:** Faster scaffolding, still need review and testing

## Tech Stack

Next.js 16.3.5 | TypeScript 5 | Tailwind CSS 4 | shadcn/ui | TanStack Query 5 | Vitest | GitHub Actions | Vercel
