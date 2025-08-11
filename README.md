This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

UI/UX Wireframe:- https://preview--access-ai-guardian-ui.lovable.app/
## Getting Started

F# AccessibilityGuard – Landing Experience

A Next.js landing experience for AccessibilityGuard, showcasing AI-powered WCAG 2.1 AA website accessibility scanning, remediation, and multilingual reporting.

Live wireframe reference: https://preview--access-ai-guardian-ui.lovable.app/

## Highlights

- Hero section with accessibility-themed background, gradient overlay, and strong headline
- URL input + CTA “Scan My Website”
- Feature cards (Automated Scanner, AI Remediation, One‑Click Fix, Multilingual Reports)
- “How It Works” three‑step process with a connecting gradient line
- Responsive Navbar and Footer
- Mobile-friendly hover/active/focus feedback on cards, links, and CTAs
- Poppins (headings) and Roboto (body) fonts via next/font

## Tech Stack

- Next.js (App Router)  
- React (Client Components)  
- Tailwind CSS  
- next/font (Poppins, Roboto)

## Project Structure

- App shell and global styles
  - [app/layout.js](app/layout.js)
  - [app/page.js](app/page.js)
  - [app/globals.css](app/globals.css)
- UI components
  - Hero: [components/HeroSection.jsx](components/HeroSection.jsx)
  - Features: [components/middlesection1.jsx](components/middlesection1.jsx)
  - How It Works: [components/belowsection1.jsx](components/belowsection1.jsx)
  - Navbar: [components/navbar.jsx](components/navbar.jsx)
  - Footer: [components/footer.jsx](components/footer.jsx)
- Assets
  - public/images (see image guidance below)

## Features

### Hero Section
- Gradient overlay + background image
- Headline with accent “WCAG 2.1 AA”
- URL input with search icon
- Primary CTA “Scan My Website”
- Compliance badges row and subtle scroll indicator

Files:  
- [components/HeroSection.jsx](components/HeroSection.jsx)

Background image:  
- Place a high‑res image at public/images/accessibility-background.jpg (recommended) or update the `src` in the component.
- A subtle grid texture overlay is applied: public/images/grid-pattern.svg.
- Tip: Prefer JPG/PNG for the hero background. Avoid serving SVGs as JPG to prevent MIME type errors.

### Features Grid
- Four cards with icons and titles
- Hover elevation and translate-y animation
- Responsive from 1 → 2 → 4 columns

Files:  
- [components/middlesection1.jsx](components/middlesection1.jsx)

### How It Works
- Three step cards with numbered color badges
- Desktop-only connecting gradient line
- CTA “See It In Action”

Files:  
- [components/belowsection1.jsx](components/belowsection1.jsx)

### Navbar and Footer
- Sticky navbar with desktop links and mobile toggle menu
- Footer with product/company links and social placeholders

Files:  
- [components/navbar.jsx](components/navbar.jsx)  
- [components/footer.jsx](components/footer.jsx)

## Accessibility

- Semantic headings and labels where applicable
- High contrast palette (teal base, cyan/lime accents)
- Keyboard/focus-visible styles on interactive elements
- Mobile-friendly feedback using active states on touch devices

## Responsive Hover/Active/Focus Behavior

To ensure good feedback on small/touch devices, interactive elements include:
- Hover (desktop): shadow/translate/opacity transitions
- Active (touch): slight scale or press effect
- Focus-visible: ring outline for keyboard users

These patterns are used across:
- Feature cards, How It Works cards
- Navbar and footer links
- Primary CTAs

If you want even stronger touch feedback, add “active:scale-[0.98]” / “active:translate-y-[1px]” to buttons/links.

## Images

Place a suitable hero image at:
- public/images/accessibility-background.jpg

Guidelines (from [public/images/README.txt](public/images/README.txt)):
- ≥1920×1080
- Accessibility/WCAG dashboard or symbolism
- Not too busy, so overlay text remains legible

If you keep using a different file (e.g., OIPD.jpeg), update the `src` in [components/HeroSection.jsx](components/HeroSection.jsx).

## Getting Started

Prerequisites:
- Node.js 18+ and npm

Install dependencies:
```bash
npm install
```

Run dev server (Windows PowerShell/CMD):
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

## Tailwind

Configured via [tailwind.config.js](tailwind.config.js) and [app/globals.css](app/globals.css).  
Common classes used:
- Colors: cyan-400, lime-400, red-400, white/… overlays, custom teal (#00483a)
- Animations: fade-in, bounce; optional custom “bounce-subtle” if added
- Effects: shadow, hover:-translate-y-2, transition-all

If you add custom colors/animations (e.g., text-ag-lime-green or animate-bounce-subtle), extend Tailwind in [tailwind.config.js](tailwind.config.js) or define utility classes in [app/globals.css](app/globals.css).

## Customization

- Brand color: update teal/cyan/lime in components and Tailwind theme
- Copy/Headings: edit text in each component
- Icons: replace inline SVGs with your preferred set
- Background: swap hero image and adjust overlay opacity for legibility

## Known Tips

- Next/Image: prefer boolean `fill` prop with `sizes` and `style` or `className` for object-fit. If you use a plain `<img>`, ensure proper `alt` and lazy loading.
- Serve SVGs as .svg; don’t rename them to .jpg to avoid MIME type issues.

## License

MIT (update as needed).

---
Built with Next.js, Tailwind CSS, and care