# Clinic Stock Management Console

A stock management console for clinic supplies built with Next.js 16, React 19, TanStack Query 5, and shadcn/ui. Designed for Savannah Informatics as part of the Web Engineer take-home assessment.

**Live Demo:** https://savanna-stock-console.vercel.app

**Test Credentials:** `emilys` / `emilyspass`

---

## Table of Contents

1. [Section 1: Design](#section-1-design)
2. [Section 2: Build](#section-2-build)
3. [Section 3: Deployment & CI/CD](#section-3-deployment--cicd)
4. [Section 4: AI Reflection](#section-4-ai-reflection)

---

## Section 1: Design

### 1.1 Component Architecture

The application follows a modular component architecture organized by feature domain:

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/              # Public login page
│   └── items/              # Protected stock list & detail
├── components/
│   ├── auth/               # Authentication components
│   ├── common/             # Shared UI states (Loading, Error, Empty)
│   ├── layout/             # Dashboard shell (Topbar, Sidebar)
│   ├── stock/              # Stock-specific components
│   └── ui/                 # shadcn/ui primitives
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, API clients, stores
├── test/                   # Test setup and mocks
└── types/                  # TypeScript definitions
```

**Key Components:**

- `DashboardLayout` - Shell with collapsible sidebar and topbar
- `Sidebar` - Category navigation with active state highlighting
- `Topbar` - Branding and user account info
- `DashboardStats` - Summary cards (Total, Low Stock, Out of Stock, Needs Attention)
- `StockTable` - Data-dense table with row styling, status badges, quick actions
- `ActivityLog` - Audit timeline showing stock change history
- `StockCorrectionForm` - Optimistic update form with validation

### 1.2 State Management

State is deliberately separated by source and lifetime:

| State Type       | Location                        | Why                                                                            |
| ---------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| **Server State** | TanStack Query                  | Caching, background refetching, optimistic updates, stale-while-revalidate     |
| **Auth State**   | React Context + In-memory store | Access token in memory (security), refresh token in localStorage (persistence) |
| **URL State**    | Custom `useURLState` hook       | Browser history integration, shareable links, reload preservation              |
| **Form State**   | Local `useState`                | Ephemeral, component-scoped, no need for global state                          |

**Why TanStack Query for server state:**

- Automatic caching with configurable stale time (30s default, 5min for categories)
- Background refetching on window focus (disabled for better UX on slow connections)
- Built-in loading/error states reduce boilerplate
- Query key management prevents stale search results (race condition handling)
- Optimistic updates with automatic rollback on failure

**Why Context + in-memory for auth:**

- Access tokens should not persist in localStorage (XSS risk)
- Refresh tokens need persistence for session restoration
- Hybrid approach: memory for sensitive token, localStorage for recovery

**Why custom URL state hook over nuqs:**

- Simpler implementation for our specific needs
- No additional dependencies
- Full control over URL parameter handling
- Automatic page reset when filters change

### 1.3 Data Fetching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                        Request Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Component                                                   │
│      │                                                       │
│      ▼                                                       │
│  useProducts() ─── queryKey changes ──► Previous query       │
│      │                                   abandoned           │
│      ▼                                                       │
│  TanStack Query                                              │
│      │                                                       │
│      ▼                                                       │
│  Axios Interceptor ─── Token expired? ──► Proactive refresh  │
│      │                                                       │
│      ▼                                                       │
│  DummyJSON API                                               │
│      │                                                       │
│      ▼                                                       │
│  Response ─── 401? ──► Reactive refresh ──► Retry request    │
│      │                                                       │
│      ▼                                                       │
│  Cache updated ──► UI re-renders                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Query Configuration:**

- `staleTime: 30000` - Data considered fresh for 30 seconds
- `gcTime: 300000` - Unused data cached for 5 minutes
- `retry: 1` - Single retry on failure
- `refetchOnWindowFocus: false` - Disabled for clinic tablet use case (patchy wifi)

**Stale Search Response Handling:**
When the user types quickly, multiple search requests may be in flight. TanStack Query handles this via query key management:

1. Each search term creates a unique query key
2. When query key changes, the old query is marked inactive
3. When the slow response arrives, it updates the old query's cache, not the current one
4. The UI only displays data for the current query key

This is tested in `useProducts.integration.test.tsx`.

### 1.4 Token Refresh Architecture

The application uses a dual-strategy token refresh:

**Proactive Refresh (Request Interceptor):**

```typescript
// Before each request, check if token expires within 30 seconds
if (accessToken && isTokenExpired(accessToken)) {
  accessToken = await refreshAccessToken();
}
```

**Reactive Refresh (Response Interceptor):**

```typescript
// On 401 response, attempt refresh and retry
if (error.response?.status === 401 && !originalRequest._retry) {
  const newToken = await refreshAccessToken();
  return apiClient(originalRequest);
}
```

**Concurrent Request Handling:**
When multiple requests get 401 simultaneously, only ONE refresh is triggered:

```typescript
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// First request triggers refresh, others queue up
if (!isRefreshing) {
  isRefreshing = true;
  const newToken = await refreshAccessToken();
  onTokenRefreshed(newToken); // Notifies all subscribers
} else {
  // Wait for ongoing refresh
  return new Promise((resolve) => {
    subscribeTokenRefresh((token) => {
      resolve(apiClient(originalRequest));
    });
  });
}
```

This is tested in `axios.test.ts`.

### 1.5 Styling Approach

- **Framework:** Tailwind CSS 4 with CSS custom properties
- **Component Library:** shadcn/ui (base-nova style)
- **Brand Colors:** Savannah Informatics purple (#2D1B4E) + lime green (#A4D233)
- **Design Tokens:** Defined in `globals.css` using oklch color space

**Color System:**

```css
:root {
  --primary: oklch(0.25 0.08 290); /* Savannah purple */
  --success: oklch(0.78 0.18 115); /* Savannah lime */
  --warning: oklch(0.75 0.15 75); /* Amber for low stock */
  --destructive: oklch(0.577 0.245 27); /* Red for out of stock */
}
```

**Responsive Breakpoints:**

- Mobile: 360px+ (minimum supported)
- Tablet: 640px+ (sm)
- Desktop: 1024px+ (lg)

### 1.6 Accessibility Approach

Implemented toward WCAG 2.1 AA with:

- **Semantic HTML:** Proper heading hierarchy, landmark regions, lists
- **Keyboard Navigation:** Full tab flow through all interactive elements
- **Focus Management:** Visible focus rings, focus trap in modals
- **ARIA Attributes:**
  - `role="alert"` on error messages
  - `aria-label` on icon buttons and inputs
  - `aria-expanded` on collapsible sections
  - `aria-current="page"` on active pagination
  - `aria-invalid` and `aria-describedby` on form errors
- **Color Contrast:** Brand colors tested for sufficient contrast
- **Screen Reader Text:** `.sr-only` class for icon-only buttons

**Keyboard Flow Verified:**

1. Tab through topbar → sidebar → main content
2. Enter/Space activates buttons and links
3. Escape closes mobile sidebar
4. Arrow keys in select dropdowns

### 1.7 Decision Log

#### Decision 1: Custom URL State Hook vs nuqs Library

**Decision:** Implement custom `useURLState` hook

**Alternative Rejected:** Use `nuqs` library for URL state management

**Why:**

- Our URL state needs are simple (5 parameters)
- nuqs adds 15KB to bundle for features we don't need
- Custom hook gives us exact control over page reset behavior
- Easier to understand and maintain for this scope
- No dependency version conflicts with Next.js 16

#### Decision 2: Optimistic Updates for Stock Correction

**Decision:** Use TanStack Query's optimistic update pattern

**Alternative Rejected:** Wait for server response before updating UI

**Why:**

- Clinic staff need immediate feedback when correcting stock counts
- Slow network (patchy wifi in wards) would create frustrating UX
- Rollback on failure is handled automatically by TanStack Query
- The assessment explicitly mentions slow network as a testing scenario

#### Decision 3: Data-Dense Table vs Card Grid

**Decision:** Use table layout with hidden columns on mobile

**Alternative Rejected:** Card grid that works better on mobile

**Why:**

- Inventory management is a data-dense workflow
- Staff need to scan multiple items quickly
- Table allows sorting by columns (future enhancement)
- Hidden columns approach keeps essential data visible on mobile
- Cards would require more scrolling to see the same information

#### Decision 4: In-Memory Access Token Storage

**Decision:** Store access token in memory, refresh token in localStorage

**Alternative Rejected:** Store both tokens in localStorage

**Why:**

- Access tokens in localStorage are vulnerable to XSS attacks
- Memory storage is cleared on page close (more secure)
- Refresh token in localStorage enables session restoration
- Proactive refresh ensures fresh token before requests

#### Decision 5: Sidebar Category Navigation

**Decision:** Collapsible sidebar with category list

**Alternative Rejected:** Dropdown select for category filtering

**Why:**

- Categories are central to navigation in a stock console
- Sidebar provides at-a-glance view of all categories
- Active state highlighting shows current filter
- Collapsible design works on desktop and mobile
- Matches common dashboard UX patterns

---

## Section 2: Build

### Required Behavior Implementation

| Requirement                      | Implementation                                  | Verification                                              |
| -------------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| Sign in with 1-min token expiry  | `expiresInMins: 1` in login request             | Manual test: token expires mid-session, refresh triggered |
| Token refresh mid-session        | Proactive (30s buffer) + Reactive (401 handler) | `axios.test.ts` - concurrent refresh tests                |
| Paginated stock list (194 items) | `useProducts` with skip/limit params            | URL shows `?page=2`, API receives correct skip            |
| Category filter                  | Sidebar + URL state sync                        | Click category, URL updates, table filters                |
| Sort control                     | `SortSelect` component                          | Sort by title/price, asc/desc                             |
| Search box                       | `SearchInput` with 300ms debounce               | Type query, URL updates after debounce                    |
| Item detail route                | `/items/[id]` with preserved filters            | Back link maintains search/filter state                   |
| Stock correction                 | `StockCorrectionForm` with PUT request          | Optimistic update, rollback on error                      |
| Stale search handling            | TanStack Query key management + AbortSignal     | `useProducts.integration.test.tsx`                        |
| Filter resets page               | `setCategory`, `setSearch` reset page to 1      | Change filter on page 3, URL shows page=1                 |
| URL persistence                  | `useURLState` with shallow routing              | Reload browser, state preserved                           |
| Loading/Empty/Error states       | Dedicated components in `common/`               | Tested with `?delay=2000` and `/http/500`                 |
| Keyboard usability               | Focus rings, ARIA labels, semantic HTML         | Manual keyboard-only navigation                           |
| 360px width support              | Responsive design, hidden columns               | DevTools device emulation                                 |

### Running Locally

```bash
# Clone the repository
git clone https://github.com/Maureenko/savanna-stock-console.git
cd savanna-stock-console

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open http://localhost:3000
```

### Available Scripts

| Script                  | Description              |
| ----------------------- | ------------------------ |
| `npm run dev`           | Start development server |
| `npm run build`         | Production build         |
| `npm run start`         | Start production server  |
| `npm run lint`          | Run ESLint               |
| `npm run lint:fix`      | Fix linting issues       |
| `npm run format`        | Format with Prettier     |
| `npm run format:check`  | Check formatting         |
| `npm run test`          | Run tests in watch mode  |
| `npm run test:run`      | Run tests once           |
| `npm run test:coverage` | Run tests with coverage  |

### Test Coverage

```
 PASS  src/hooks/useDebounce.test.ts
 PASS  src/lib/axios.test.ts
 PASS  src/hooks/useProducts.integration.test.tsx
 PASS  src/components/stock/Pagination.test.tsx
 PASS  src/lib/auth-store.test.ts
 PASS  src/lib/utils.test.ts

Test Files:  6 passed
Tests:       39 passed
```

**Key Tests:**

- `axios.test.ts` - Token refresh concurrency, proactive refresh, failure handling
- `useProducts.integration.test.tsx` - Stale search response handling, query key management
- `Pagination.test.tsx` - Page calculation, ellipsis logic, boundaries
- `auth-store.test.ts` - Token storage, persistence, authentication state

### API Limitations & Workarounds

| Limitation                       | Impact                             | Workaround                                                  |
| -------------------------------- | ---------------------------------- | ----------------------------------------------------------- |
| PUT doesn't persist              | Stock corrections reset on refresh | Documented in UI, optimistic updates for immediate feedback |
| 1-min token expiry               | Aggressive for production          | Intentional for testing refresh logic                       |
| No activity log endpoint         | Can't fetch real audit history     | Simulated deterministic history based on product ID         |
| Categories don't filter + search | Search ignores category            | UI shows warning when both active                           |

---

## Section 3: Deployment & CI/CD

### Deployment

- **Platform:** Vercel
- **URL:** https://savanna-stock-console.vercel.app
- **Deployment Branch:** `main`
- **Trigger:** Automatic deployment on successful merge to main

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):

```
Pull Request → main
       │
       ▼
┌──────────────────┐
│  npm ci          │  Install dependencies
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  format:check    │  Prettier formatting check
└────────┬─────────┘
         │ (blocks on failure)
         ▼
┌──────────────────┐
│  lint            │  ESLint checks
└────────┬─────────┘
         │ (blocks on failure)
         ▼
┌──────────────────┐
│  commitlint      │  Conventional commit check
└────────┬─────────┘
         │ (blocks on failure)
         ▼
┌──────────────────┐
│  test:run        │  Vitest test suite
└────────┬─────────┘
         │ (blocks on failure)
         ▼
┌──────────────────┐
│  build           │  Next.js production build
└────────┬─────────┘
         │ (blocks on failure)
         ▼
┌──────────────────┐
│  Merge allowed   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Vercel deploy   │  Automatic production deployment
└──────────────────┘
```

**Blocking Checks:**

- `format:check` - Unformatted code fails the build
- `lint` - Linting errors fail the build
- `commitlint` - Non-conventional commits fail the build
- `test:run` - Test failures fail the build
- `build` - TypeScript/build errors fail the build

### Local Quality Hooks

- **Husky:** Git hooks for local enforcement
- **commit-msg:** Runs commitlint on commit messages
- **pre-commit:** Runs lint-staged for formatting

---

## Section 4: AI Reflection

_Note: This section requires your personal reflection on AI usage during the project. The structure below follows the assessment rubric - fill in your actual experience._

### 4.1 AI Usage Per Section

**Section 1 (Design):**

- [Your answer: What did you use AI for in the design phase?]

**Section 2 (Build):**

- [Your answer: What parts did AI help scaffold? What did you write yourself?]

**Section 3 (Deployment/CI):**

- [Your answer: Did AI help configure GitHub Actions, Husky, or Vercel?]

**Section 4 (AI Reflection):**

- [Your answer: Did you use AI to draft any part of this reflection?]

### 4.2 Tools Used

- [List the AI tools you used]
- [Describe any spec-driven or agent workflow if applicable]
- [If no framework used, describe how you structured the work]

### 4.3 Successful AI Example

**Problem:** [Describe a problem you faced]

**Prompt:** [What did you ask the AI?]

**AI Suggestion:** [What did it suggest?]

**Outcome:** [How did it help? What did you implement?]

### 4.4 Incorrect AI Output Example

**What happened:** [Describe when AI output was wrong or incomplete]

**How you caught it:** [How did you identify the issue?]

**What you changed:** [How did you fix it?]

### 4.5 Decisions Made Without AI

1. **[Decision 1]:** [Why you trusted your own judgment]
2. **[Decision 2]:** [Why you trusted your own judgment]

### 4.6 Code You'd Struggle to Defend

[Point to a specific part of the codebase and explain why]

### 4.7 Actual Time Spent

- Design: [X hours]
- Build: [X hours]
- Deployment/CI: [X hours]
- Documentation: [X hours]
- **Total:** [X hours]

---

## Tech Stack

| Category     | Technology                     |
| ------------ | ------------------------------ |
| Framework    | Next.js 16.3.5                 |
| Language     | TypeScript 5                   |
| UI Library   | React 19                       |
| Styling      | Tailwind CSS 4                 |
| Components   | shadcn/ui                      |
| Server State | TanStack Query 5               |
| HTTP Client  | Axios                          |
| Testing      | Vitest + Testing Library + MSW |
| Linting      | ESLint 9                       |
| Formatting   | Prettier                       |
| Git Hooks    | Husky + Commitlint             |
| CI/CD        | GitHub Actions                 |
| Hosting      | Vercel                         |

---

## License

This project was created as part of a technical assessment for Savannah Informatics.
