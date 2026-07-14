---
name: Cipher-X Vision
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bec9c7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#889392'
  outline-variant: '#3e4948'
  surface-tint: '#86d4d0'
  primary: '#86d4d0'
  on-primary: '#003735'
  primary-container: '#016764'
  on-primary-container: '#94e2de'
  inverse-primary: '#086a67'
  secondary: '#ffffff'
  on-secondary: '#003828'
  secondary-container: '#36ffc4'
  on-secondary-container: '#007255'
  tertiary: '#ffb693'
  on-tertiary: '#532206'
  tertiary-container: '#884c2d'
  on-tertiary-container: '#ffc9b0'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a2f0ec'
  primary-fixed-dim: '#86d4d0'
  on-primary-fixed: '#00201f'
  on-primary-fixed-variant: '#00504d'
  secondary-fixed: '#36ffc4'
  secondary-fixed-dim: '#00e1ab'
  on-secondary-fixed: '#002116'
  on-secondary-fixed-variant: '#00513c'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb693'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#6f381a'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: JetBrains Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-base:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
spacing:
  base: 4px
  unit-1: 0.25rem
  unit-2: 0.5rem
  unit-4: 1rem
  unit-8: 2rem
  container-max: 1440px
  gutter: 16px
---

## Brand & Style
The brand personality for this design system is a fusion of clinical precision and "hacker-ethos" technicality. It targets power users, developers, and security analysts who require high information density without sacrificing aesthetic intent. The emotional response is one of total control and absolute clarity.

The design style is **Technical Minimalism** with a **Brutalist** edge. It utilizes structured grid alignment, monospaced typography, and a "HUD" (Heads-Up Display) aesthetic. The UI is defined by high-contrast interfaces that oscillate between a "White Lab" clinical mode and a "Dark Terminal" operational mode. A recurring 2D geometric pattern motif—based on a 4x4 pixel dot grid or a fine isometric mesh—is used to provide texture to large background surfaces, reinforcing the digital-first nature of the product.

## Colors
The color palette is anchored by "Signature Teal" (#016764), used as a precise functional accent for primary actions and status indicators. 

- **Dark Theme (Primary):** The "Hacker" aesthetic. Deep neutrals create a void-like background, allowing the teal and an auxiliary neon-mint (#00FFC2) to pop. Surface levels are achieved through subtle shifts in hex values rather than shadows.
- **Light Theme:** The "Clinical" aesthetic. It uses cool off-whites and surgical grays. The Teal accent becomes more authoritative and professional against the light backdrop.
- **Background Motif:** In both modes, a subtle 2D dot grid pattern (#000000 with 0.03 opacity in light; #FFFFFF with 0.03 opacity in dark) is applied to the base background layer to eliminate flat "dead" space.

## Typography
This design system utilizes **JetBrains Mono** exclusively to maintain a consistent technical rhythm. The monospaced nature ensures that data columns align perfectly, critical for the "Vision" aspect of the brand.

Headlines should be set with tight line-heights and slightly negative letter-spacing to feel impactful and "engineered." Labels must always be uppercase with generous letter-spacing to distinguish them as metadata or UI descriptors. Body text remains at a comfortable 14px to maximize data density while maintaining legibility through the font's high x-height.

## Layout & Spacing
The layout follows a **4px hard grid** system. All components, padding, and margins must be multiples of 4. 

- **Grid Model:** A 12-column fluid grid is used for desktop, transitioning to a 4-column grid for mobile. 
- **Borders as Spacing:** In this system, borders are "inside" the layout. Use 1px solid strokes for all container divisions to reinforce the blueprint-like structure.
- **Density:** Content should be packed tightly (Unit-2 or Unit-4) to reflect a high-utility environment, with Unit-8 reserved only for major section breaks.

## Elevation & Depth
Elevation is expressed through **Tonal Layering and Bold Outlines** rather than soft shadows.

- **Stacking:** Higher elevation is represented by lighter surface colors in Dark Mode and darker/more saturated strokes in Light Mode. 
- **Shadows:** Avoid ambient shadows. Use "Hard Shadows" (100% opacity, 2px offset) in the accent color (#016764) only for active states or floating tooltips to give a subtle "retro-tech" lift.
- **Glassmorphism:** Use sparingly for overlays (modals/drawers). Implement a heavy backdrop blur (20px) with a semi-transparent background (60% opacity) to maintain focus on the technical data underneath.

## Shapes
The shape language is **Sharp (0px)**. 

To evoke a sense of military-grade precision and digital structural integrity, every corner in the UI is a 90-degree angle. This includes buttons, input fields, cards, and even focus states. The only exception is for circular status dots (e.g., "System Live").

## Components
- **Buttons:** Rectangular with 1px solid borders. Primary buttons use a solid Teal fill with white text. Secondary buttons are "ghost" style with teal text and borders.
- **Chips:** Small, uppercase monospaced text within a 1px border. Use background fills only for "Critical" or "Active" status alerts.
- **Inputs:** Hard-edged boxes. In Dark Mode, the background is slightly darker than the surface. In Light Mode, it is a pale gray. Active states use a 2px Teal bottom-border.
- **Lists:** Rows are separated by 1px horizontal lines. Hover states trigger a subtle background tint change (3% opacity shift).
- **Cards:** No shadows. Cards are defined by a 1px border. Header areas within cards should have a distinct background fill (cool gray in light mode, deep charcoal in dark mode) to separate title from content.
- **Data Visualizers:** Use the geometric motif as a background for charts. All graph lines must be 2px thick with sharp joins (no curves).