# AccessibilityGuard – Landing + Auth + Dashboard

A Next.js app that showcases AI-powered WCAG 2.1 AA accessibility scanning with a polished marketing site, OAuth login, and a starter user dashboard.

Live wireframe reference: https://preview--access-ai-guardian-ui.lovable.app/

## Highlights

- Hero section with accessibility-themed background, gradient overlay, and strong headline
- URL input + CTA “Scan My Website”
- Feature cards (Automated Scanner, AI Remediation, One‑Click Fix, Multilingual Reports)
- “How It Works” three‑step process with a connecting gradient line
- Responsive Navbar and Footer
- Mobile-friendly hover/active/focus feedback on cards, links, and CTAs
- Poppins (headings) and Roboto (body) fonts via next/font
- OAuth login (GitHub, Google) with NextAuth
- User session surfaced in Navbar (avatar, name, link), plus Sign out
- User Dashboard template with stats (Total Scans, Last Login, Last Report)

## Tech Stack

- Next.js (App Router)
- React (Client Components)
- Tailwind CSS
- next-auth (GitHub, Google)
- Mongoose (MongoDB)
- next/font (Poppins, Roboto)

## Project Structure

- App shell and global styles
  - app/layout.js
  - app/page.js
  - app/globals.css
- UI components
  - Hero: components/HeroSection.jsx
  - Features: components/middlesection1.jsx
  - How It Works: components/belowsection1.jsx
  - Navbar: components/navbar.jsx
  - Footer: components/footer.jsx
  - Login: components/login.jsx (two provider cards + blurred background shapes)
  - Dashboard: components/dashboard.jsx
  - Session Provider: components/SessionWrapper.js
- Auth API
  - app/api/auth/[...nextauth]/route.js
  - app/api/user/me/route.js
- DB
  - db/connectDB.mjs
  - models/user.js
  - (optional) models/scanReport.js for storing scan results

## Authentication

- NextAuth with GitHub and Google providers
- Session available via useSession in client components
- Navbar shows:
  - User avatar (if present)
  - Name
  - Link to Profile (external) or Dashboard
  - Sign out button (desktop and mobile)
- Login page (app/login/page.js) redirects authenticated users to dashboard

Environment variables in .env.local (project root):
- NEXTAUTH_URL=http://localhost:3000
- NEXTAUTH_SECRET=your_base64_secret
- GITHUB_ID=...
- GITHUB_SECRET=...
- GOOGLE_ID=...
- GOOGLE_SECRET=...
- MONGODB_URI=mongodb+srv://USER:PASS@cluster0.ckhtw2k.mongodb.net/access_guard?retryWrites=true&w=majority&appName=Cluster0

Generate a secret (Windows PowerShell):
- node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

## Database

- Connection helper: db/connectDB.mjs
  - Loads .env.local from project root
  - Reuses a cached connection in dev
- Ensure your MONGODB_URI targets the access_guard database (db name must be before ?)
  - Correct: ...mongodb.net/access_guard?...
  - Incorrect: ...mongodb.net/?.../access_guard (falls back to test)
- User model: models/user.js
  - Required: fullName, email (unique, lowercase)
  - Optional: imageUrl
  - Managed: role ('user'), lastLoginAt, scansCount (0), latestScan (ObjectId)
  - Default collection: users

(Optional) Scan reports model (if you add reports):
- models/scanReport.js: stores per-scan summary, issues, timestamps; user references via user: ObjectId

## API

- Auth: app/api/auth/[...nextauth]/route.js
  - On sign-in: upsert user by email, set lastLoginAt, set imageUrl if provided
  - Initializes scansCount/latestScan on first insert
- Current user: app/api/user/me/route.js
  - GET returns the authenticated user (optionally populate latestScan)

## Features

### Hero Section
- Gradient overlay + background image
- Headline with accent “WCAG 2.1 AA”
- URL input with search icon
- Primary CTA “Scan My Website”
- Compliance badges row and subtle scroll indicator

Background image:
- public/images/accessibility-background.jpg (recommended) or update src in component
- Subtle grid texture overlay: public/images/grid-pattern.svg
- Prefer JPG/PNG for hero backgrounds

### Features Grid
- Four cards with icons and titles
- Hover elevation and translate-y animation
- Responsive from 1 → 2 → 4 columns

### How It Works
- Three step cards with numbered color badges
- Desktop-only connecting gradient line
- CTA “See It In Action”

### Navbar and Footer
- Sticky navbar with desktop links and mobile toggle
- Navbar shows session user and sign out when authenticated
- Footer with product/company links and social placeholders

### Login Experience
- Dedicated login page showing two provider cards (Google and GitHub)
- Animated blurred background shapes (slow, desynchronized; respects prefers-reduced-motion)
- Touch-friendly hover/active/focus styles

### Dashboard
- components/dashboard.jsx
- Stats:
  - Total Scans: from user.scansCount
  - Last Login: user.lastLoginAt (set during sign-in)
  - Last Report: prefers user.latestScan.createdAt (if populated) else newest report
- List of recent reports (wire up once scanReport model and endpoints are added)

## Accessibility

- Semantic headings and labels where applicable
- High contrast palette (teal base, cyan/lime accents)
- Focus-visible styles on interactive elements
- Mobile-friendly feedback using active states on touch devices

## Responsive Hover/Active/Focus Behavior

- Hover (desktop): shadow/translate/opacity transitions
- Active (touch): slight scale/press effect
- Focus-visible: ring outline for keyboard users
- Applied across cards, links, and CTAs

## Images

- public/images/accessibility-background.jpg
- public/images/grid-pattern.svg

Guidelines:
- ≥1920×1080
- Clean enough for readable overlay text
- WCAG/accessibility themed

## Getting Started

Prerequisites:
- Node.js 18+ and npm
- MongoDB Atlas project/cluster

Install dependencies:
```bash
npm install
```

Create .env.local:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<base64-32B>
GITHUB_ID=<id>
GITHUB_SECRET=<secret>
GOOGLE_ID=<id>
GOOGLE_SECRET=<secret>
MONGODB_URI="mongodb+srv://USER:PASS@cluster0.ckhtw2k.mongodb.net/access_guard?retryWrites=true&w=majority&appName=Cluster0"
```

Run dev server (Windows):
```bash
npm run dev
```
Open http://localhost:3000

Build and run:
```bash
npm run build
npm start
```

Lint:
```bash
npm run lint
```

## Troubleshooting

- Hydration mismatch in Navbar:
  - Gate mobile menu with a mounted flag; avoid SSR/client markup drift
- React hooks lint errors:
  - Call hooks unconditionally at the top of components (e.g., useRouter, useSession)
- MongoDB writing to test:
  - Ensure db name is before ?, e.g., /access_guard?...

## License

MIT (update as needed).