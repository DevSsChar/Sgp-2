# Accessibility Guard## What's New (Aug 2025)

- Light mode polish: consistent backgrounds, borders, text contrast, and hover states across all component### Dashboard (components/dashboard.jsx)

- Cards for Total Scans, Last Login, Last Report (consistent with StatCard)
- Quick Actions: Run Scan, View History
- Recent Reports list with "issues count" badges
- Before & After Comparisons section showing accessibility improvements
- Legal Risk Mitigation section with:
  - ADA violations fixed, compliance statistics, and estimated legal savings
  - Recent web accessibility legal cases with settlement amounts
  - Visual indicators of impact and risk reduction
- Theme-aligned backgrounds and shadows throughout all sectionsrk mode refinements for the report view (cards, headers, badges, tags, nodes drawer)
- Violations tab: card layout, tags, help links, page-path chips, nodes count, and filters reworked for both themes
- Pages tab: searchable page list with active state; issue counts; node details with code samples
- Dashboard: "Last Login" and "Last Report" wired and theme-friendly; cleaned quick actions and lists
- Dashboard enhancements: before/after comparisons and legal risk mitigation sections with ADA compliance data
- Theme system: single source of truth via ThemeContext + ThemeToggle; no raw `dark:` classes coupled to Tailwind element scope
- Consistent stat cards across Scanner, Report, Dashboard
- Resilient formatting helpers (date/time) and robust URL/path handling in listsing • Auth • Scanner • Reports • Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-0F172A?style=flat-square&logo=nextdotjs&logoColor=white)](https://next-auth.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

Accessible web-scanning with a polished landing page, OAuth login, live scanner, detailed reports (pages, violations, stats), history, and a theme-aware dashboard.

Live wireframe reference: https://preview--access-ai-guardian-ui.lovable.app/

---

## What’s New (Aug 2025)

- Light mode polish: consistent backgrounds, borders, text contrast, and hover states across all components
- Dark mode refinements for the report view (cards, headers, badges, tags, nodes drawer)
- Violations tab: card layout, tags, help links, page-path chips, nodes count, and filters reworked for both themes
- Pages tab: searchable page list with active state; issue counts; node details with code samples
- Dashboard: “Last Login” and “Last Report” wired and theme-friendly; cleaned quick actions and lists
- Theme system: single source of truth via ThemeContext + ThemeToggle; no raw `dark:` classes coupled to Tailwind element scope
- Consistent stat cards across Scanner, Report, Dashboard
- Resilient formatting helpers (date/time) and robust URL/path handling in lists

---

## Highlights

- Hero with accessibility-themed imagery and gradient overlay
- URL input + “Scan My Website” CTA
- Feature grid (Automated Scanner, AI Remediation, One‑Click Fix, Multilingual Reports)
- “How It Works” steps with connecting gradient
- OAuth login (GitHub, Google) via NextAuth
- User Dashboard with stats (Total Scans, Last Login, Last Report), recent reports list, before/after comparisons, and legal risk mitigation insights
- Full Report view with tabs:
  - Summary: report meta, violation overview, top rules
  - Pages: searchable, issue counts, node details, code excerpts
  - Violations: global search/filter, impact summaries, per-violation cards
- Theme-aware light/dark UI everywhere

---

## Tech Stack

- Next.js (App Router)
- React (Client Components)
- Tailwind CSS
- next-auth (GitHub, Google)
- MongoDB via Mongoose
- framer-motion (subtle transitions)
- next/font (Poppins, Roboto)

---

## Project Structure

- App shell and global styles
  - app/layout.js
  - app/page.js
  - app/globals.css
  - app/dark-mode.css
- UI components
  - components/HeroSection.jsx
  - components/middlesection1.jsx
  - components/belowsection1.jsx
  - components/navbar.jsx
  - components/footer.jsx
  - components/login.jsx
  - components/dashboard.jsx
  - components/history.jsx
  - components/scanner.jsx
  - components/report.jsx
  - components/ThemeContext.js
  - components/ThemeToggle.jsx
  - components/SessionWrapper.js
- App routes
  - app/login/page.js
  - app/dashboard/page.js
  - app/history/page.js
  - app/scanner/page.js
  - app/reports/[id]/page.js
- API
  - app/api/auth/[...nextauth]/route.js
  - app/api/user/me/route.js
  - app/api/reports/[id]/route.js
  - app/api/scan/route.js
- Data
  - db/connectDB.mjs
  - models/user.js
  - models/scanReport.js (optional when persisting reports)

---

## Theming (Light & Dark)

The entire UI is theme-aware using a context, not Tailwind’s global `dark` selector, to avoid hydration drift.

- Provider: `components/ThemeContext.js`
- Toggle: `components/ThemeToggle.jsx`
- Usage: `const { darkMode } = useTheme()`
- Pattern:
  - Replace `dark:` class usage with `darkMode ? '...' : '...'`
  - Keep color tokens consistent (e.g., gray-50/100 borders, gray-800/900 backgrounds)
  - Prefer clear text contrast (e.g., `text-gray-900` on light, `text-gray-300/200` on dark)

Key screens that were updated:
- Report (Summary/Pages/Violations)
- History (cards/badges)
- Dashboard (stat cards, recent list)
- Scanner (impact/summary cards)
- Login (panels/buttons)

---

## UI Deep-Dive

### Report (components/report.jsx)

- Tabs
  - Summary: Report Information, Violation Overview (impact totals), Top Violation Rules table
  - Pages: Searchable list (path chips), active state indication, issue counts, node drawer (summary, target, failure text, HTML sample)
  - Violations: Global search + impact filter; cards show impact badge, ID, description, help link, tags, page path, nodes count

- Light mode improvements
  - Card backgrounds: white/gray-50 instead of mismatched tints
  - Borders: gray-100/200; headers use subtle `border-b`
  - Text: darkened to `text-gray-800/900`, supporting body `text-gray-600/700`
  - Links: teal/cyan accents `#00d4ff` with hover underline

- Dark mode refinements
  - Containers: `bg-gray-800/900`, borders `gray-700`
  - Headings: `text-gray-200`, body: `text-gray-300/400`
  - Accent: cyan `#38bdf8` rollovers and active tab markers
  - Node details: proper code block backgrounds and borders

### Dashboard (components/dashboard.jsx)

- Cards for Total Scans, Last Login, Last Report (consistent with StatCard)
- Quick Actions: Run Scan, View History
- Recent Reports list with “issues count” badges
- Theme-aligned backgrounds and shadows

### History (components/history.jsx)

- Responsive report cards with consistent iconography and tag styles
- Light/dark hover states and focus outlines

### Scanner (components/scanner.jsx)

- Impact StatCards consistent with report and dashboard
- Clear progress/empty states

---

## API (overview)

- Auth
  - `app/api/auth/[...nextauth]/route.js`
    - Upserts user on sign-in; sets `lastLoginAt`, initializes `scansCount` and `latestScan`
- Current user
  - `app/api/user/me/route.js` – returns authenticated user (may include `latestScan`)
- Reports
  - `app/api/reports/[id]/route.js` – returns a single report JSON for the Report page
- Scan
  - `app/api/scan/route.js` – kick off a scan (implementation starter available)

Models:
- `models/user.js` – `fullName`, `email` (unique, lowercase), `imageUrl`, managed fields: `role`, `lastLoginAt`, `scansCount`, `latestScan`
- `models/scanReport.js` (optional) – If you choose to persist reports beyond demo

---

## Getting Started

Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)

Install
```bash
npm install
```

Environment (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<base64-32B>
GITHUB_ID=<id>
GITHUB_SECRET=<secret>
GOOGLE_ID=<id>
GOOGLE_SECRET=<secret>
MONGODB_URI="mongodb+srv://USER:PASS@cluster0.ckhtw2k.mongodb.net/access_guard?retryWrites=true&w=majority&appName=Cluster0"
```

Generate a secret (Windows PowerShell)
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Run (dev)
```bash
npm run dev
# http://localhost:3000
```

Build & Start
```bash
npm run build
npm start
```

Lint
```bash
npm run lint
```

---

## Design Tokens & Patterns

- Accent (light): `#00483a` headings, `#00d4ff` links/primary CTAs
- Accent (dark): `#38bdf8` interactive focus/hovers
- Surface
  - Light: `white`, `gray-50`, borders: `gray-100/200`
  - Dark: `gray-800/900`, borders: `gray-700`
- Text
  - Light: headings `gray-800/900`, body `gray-600/700`
  - Dark: headings `gray-200`, body `gray-300/400`
- Status
  - critical/serious/moderate/minor: red/orange/amber/yellow families
  - needs‑review: neutral gray

---

## Accessibility

- Focus-visible styles on links, buttons, inputs
- High color contrast in both themes
- Semantic structure on cards, lists, and tables
- Keyboard-friendly navigation and summary/details sections

---

## Troubleshooting

- Hydration mismatch
  - Theme is client-only via context. Avoid `dark:` CSS at the root; prefer conditional classes with `darkMode` state.
- Missing user data in dashboard
  - Ensure NextAuth callback populates `lastLoginAt` and that `/api/user/me` is reachable.
- MongoDB writes to `test`
  - Database name must appear before `?` in the URI: `...mongodb.net/access_guard?...`, not `...mongodb.net/?.../access_guard`.

---

## Roadmap

- Persist scan reports (`scanReport` model) and wire History/Report to DB
- Bulk export and shareable report URLs
- Advanced filters (WCAG levels, tags)
- Lighthouse/Pa11y integration experiments
- Enhanced legal compliance tracking with jurisdiction-specific guidelines
- Timeline view of accessibility improvements with historical comparisons
- Risk calculator based on industry, traffic, and violation severity