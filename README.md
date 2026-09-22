# Meridian — Academic Publishing & Research Platform (Frontend)

A React + Vite + TypeScript frontend scaffold for the Academic Publishing
Platform SRS. No other framework — this is a plain Vite SPA using
`react-router-dom` for routing, CSS Modules for styling, and no state
library beyond React context/hooks.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # type-checks (tsc -b) then builds to dist/
npm run preview    # serve the production build locally
npm run lint        # oxlint
```

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` once the Django
REST Framework backend (SRS section 6/7) is deployed. Until then, every
`features/*/api/*.ts` call tries the real endpoint first and falls back to
local mock data (`src/mocks/`), so the whole app is click-through-able with
no backend running.

## Folder structure

```
src/
├── app/                      # App shell
│   ├── App.tsx                #   root component
│   ├── providers/              #   BrowserRouter + AuthProvider
│   └── routes/                 #   AppRouter (route table), ProtectedRoute, path constants
│
├── components/
│   ├── layout/                 # Header (+ mega menu), Footer, MainLayout, DashboardLayout (+ Sidebar)
│   └── ui/                     # Design-system primitives: Button, Badge, ContentCard,
│                                #   SearchBar, FacetFilters, Pagination, Tabs, DataTable,
│                                #   EmptyState, StatCard — imported via `components/ui`
│
├── features/                   # One folder per SRS module. Each contains any of:
│   │                            #   api/        — calls the future REST endpoint, falls back to mocks
│   │                            #   components/ — pieces used only within that feature
│   │                            #   pages/       — routed screens
│   │                            #   types.ts     — feature-specific types
│   │                            #   context/    — feature-scoped React context (auth only)
│   ├── auth/                    # Sign in / register, AuthContext, role checks
│   ├── home/                    # Landing page: hero/search, featured content, module grid
│   ├── search/                  # Global research discovery (facets, tabs, pagination)
│   ├── journals/                # Journals A–Z, journal detail (issues, editorial board)
│   ├── articles/                # Article detail (abstract, citation export, related articles)
│   ├── books/                   # Books listing + detail (chapters)
│   ├── caseStudies/              # Teaching cases (learning objectives, instructor resources)
│   ├── publishing/               # Author guidelines, submission dashboard, new-submission form
│   ├── peerReview/               # Reviewer dashboard (invitations)
│   ├── editorial/                # Editor dashboard (submission queue, decisions)
│   ├── openAccess/               # OA policy/FAQ page
│   ├── researchServices/         # Author services page
│   ├── institutional/            # Librarian/institution usage analytics + subscriptions
│   ├── admin/                    # Admin dashboard (users & roles, audit log)
│   ├── notifications/            # Saved-search alerts
│   └── bookmarks/                # Reading list
│
├── pages/                      # Standalone pages with no dedicated feature folder
│                                #   (About, 404, account/bookmarks, account/alerts)
│
├── services/api/                # `client.ts` fetch wrapper (base URL, auth header, error
│                                #   shape) + `endpoints.ts` centralizing every REST path
│
├── mocks/                       # Mock data mirroring the SRS DB design — used by every
│                                #   feature's api/ layer until the backend exists
│
├── hooks/                       # useDebounce, useDocumentTitle
├── types/                       # Shared domain types (User, Role, AccessType, SearchResultItem…)
├── constants/                   # Navigation tree, role labels, access-type labels
├── styles/                      # tokens.css (design tokens), reset.css, global.css
└── utils/                       # formatDate, formatAuthors, formatCitation
```

### Why this shape

- **`features/` is domain-first, not type-first.** Everything about
  "journals" — its API call, its cards, its pages — lives in one folder,
  so a change to one SRS module never means hunting across `pages/`,
  `components/`, `api/` at the top level.
- **`components/ui` is the only place with reusable, generic UI.** If a
  component is used by more than one feature (e.g. the result card shown
  on Search, Home and every listing page), it belongs here — not
  duplicated inside a feature.
- **`services/api/client.ts` is the single fetch wrapper.** Every feature's
  `api/*.ts` file is a thin set of functions built on top of it, so
  swapping auth handling, base URL, or error format happens in one place.
- **Mocks live next to, not inside, features**, so the same mock article
  can back the Home page, Search results, and the Journal page's issue
  list without three copies drifting apart.

## Routing & access control

`app/routes/AppRouter.tsx` is the single route table. Public pages render
inside `MainLayout` (global header + search + footer). The four role
dashboards — **Submissions** (author), **Peer Review** (reviewer),
**Editorial** (editor), **Admin** — render inside `DashboardLayout` (adds a
role-scoped sidebar) and are wrapped in `ProtectedRoute`, which checks
`AuthContext` against the role list for that route (see
`constants/roles.ts` for the SRS section 1.2 role matrix). Sign-in is
currently a mock (`features/auth/context/AuthContext.tsx`) — swap
`authApi.login`/`register` in once the Django auth endpoints are live.

## Design system

`styles/tokens.css` defines an original palette and type system,
deliberately distinct from Emerald's own branding per the SRS's brand
guidance: deep navy ink, warm paper background, an oxblood accent for
emphasis, and a library-gilt ochre used for the "Open access" label.
Headings use Source Serif 4; UI and body text use Source Sans 3 (both
loaded from Google Fonts in `styles/global.css`).

Every component under `components/ui` reads from these tokens, so
retheming later — or applying the platform's real brand once decided —
means editing `tokens.css`, not hunting through component files.

## Content-type access labels

Every journal, article, book and case study carries an `accessType`:
`open_access`, `subscription`, or `free_preview`. The `AccessBadge`
component (`components/ui/Badge/Badge.tsx`) renders the right label and
color everywhere content is listed, matching the SRS's requirement for
clear, consistent access labeling.

## What's stubbed vs. real

- **Real:** routing, layouts, the full design system, all listed pages,
  client-side search/filter/pagination over mock data, forms (submission,
  sign-in, register) with local state and validation.
- **Stubbed for the backend:** authentication (mock session only),
  editorial decisions, review submission, and all analytics numbers.
  Each is marked with a comment pointing at the relevant SRS section/FR
  and the endpoint it should call once Django is live.
