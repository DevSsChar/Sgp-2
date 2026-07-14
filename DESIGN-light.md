---
name: Clinical Brutalist HUD
colors:
  surface: '#f8fafa'
  surface-dim: '#d8dada'
  surface-bright: '#f8fafa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f4'
  surface-container: '#eceeee'
  surface-container-high: '#e6e8e8'
  surface-container-highest: '#e1e3e3'
  on-surface: '#191c1d'
  on-surface-variant: '#3e4948'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#eff1f1'
  outline: '#6f7978'
  outline-variant: '#bec9c7'
  surface-tint: '#086a67'
  primary: '#004d4b'
  on-primary: '#ffffff'
  primary-container: '#016764'
  on-primary-container: '#94e2de'
  inverse-primary: '#86d4d0'
  secondary: '#006d40'
  on-secondary: '#ffffff'
  secondary-container: '#00f999'
  on-secondary-container: '#006e40'
  tertiary: '#434545'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b5c5c'
  on-tertiary-container: '#d4d5d4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a2f0ec'
  primary-fixed-dim: '#86d4d0'
  on-primary-fixed: '#00201f'
  on-primary-fixed-variant: '#00504d'
  secondary-fixed: '#56ffa8'
  secondary-fixed-dim: '#00e38b'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#00522f'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f8fafa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e3'
typography:
  display-lg:
    fontFamily: JetBrains Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  code-xs:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1.2'
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style
The design system transitions the "Technical Brutalist HUD" into a high-visibility "Lab Mode." It is engineered for precision, clarity, and rapid data processing within a clinical, high-stakes environment.

The aesthetic is **Clinical Brutalism**: it retains the raw, unrefined structural elements of brutalist design—such as sharp corners and visible grids—but executes them with a sterile, high-contrast palette. The emotional response is one of absolute authority, technical rigor, and industrial efficiency. It feels like a high-end diagnostic interface or a precision engineering toolset.

## Colors
The palette is anchored by **Clinical White (#f5f7f7)**, providing a sterile canvas that minimizes eye strain during long-term monitoring. 

- **Primary Teal (#016764):** Recalibrated for light mode to ensure WCAG AA compliance against white backgrounds. Used for primary actions and active states.
- **Neon Mint (#00FF9D):** Reserved strictly for status indicators, "online" states, and successful data pings.
- **Technical Gray (#121414):** The core ink color. Used for all critical text and iconography to maintain maximum legibility.
- **Surface Layering:** Depth is achieved through subtle shifts in gray value rather than shadows. Containers utilize `#f0f2f2` and `#e8eaea` to create clear information hierarchies.

## Typography
This design system utilizes **JetBrains Mono** exclusively. As a monospaced typeface, it ensures that numerical data aligns vertically across rows, which is critical for HUD-style data comparison.

- **Weight Usage:** Bold weights (700) are used for headers and primary labels to cut through the clinical white background. Regular weights (400) are used for dense technical descriptions.
- **Letter Spacing:** Headlines use tight tracking for a "packed" technical look, while labels use expanded tracking to improve scanability at small sizes.
- **Alignment:** All text should follow a strict grid alignment; avoid centered text unless within a specific status badge.

## Layout & Spacing
The layout is governed by a **4x4 dot grid pattern** at 4% opacity, which must be visible in the background of the main viewport. 

- **Grid Model:** Use a 12-column fluid grid for desktop and a 4-column grid for mobile.
- **Spacing Logic:** All margins, padding, and component heights must be multiples of 4px.
- **Borders as Structure:** Layout sections are divided by 1px solid borders (`#d1d5d5`). No gutters are used between primary containers; they should share borders to maximize screen real estate, creating a "tiled" HUD effect.

## Elevation & Depth
In this design system, **shadows are strictly prohibited.** Depth is conveyed through a "stacked pane" logic using color and borders:

1.  **Level 0 (Base):** Clinical White (#f5f7f7) with the 4px dot grid.
2.  **Level 1 (Panels):** Surface Primary (#FFFFFF) with a 1px solid border.
3.  **Level 2 (In-panel Containers):** Surface Secondary (#f0f2f2).
4.  **Level 3 (Active/Highlight):** Primary Teal (#016764) background with White text.

Visual hierarchy is reinforced by the density of the technical labels and the thickness of internal dividing lines.

## Shapes
The shape language is **uncompromisingly sharp.** All corners are 0px. 

This 0-radius rule applies to:
- Buttons and Inputs.
- Cards and Modals.
- Checkboxes and Selection Indicators.
- Status Badges and Tooltips.

The only exception is for circular status dots (e.g., a "live" indicator) which remain true circles to distinguish them from interactive UI elements.

## Components

### Buttons
- **Primary:** Solid Teal (#016764) background, White text, 0px radius. On hover, shifts to Technical Gray (#121414).
- **Secondary:** Transparent background, 1px border (#d1d5d5), Technical Gray text. On hover, background becomes Surface Secondary (#f0f2f2).
- **Ghost:** No border, Technical Gray text. Used for low-priority actions in toolbars.

### Input Fields
- **Default:** 1px border (#d1d5d5), Surface Primary background, monospaced text.
- **Focus:** 1px border Primary Teal (#016764). The label should shift to a "negative" block (Teal background, White text) positioned top-left of the field.

### Data Chips
- Small, rectangular blocks with 1px borders. Use "label-caps" typography. For active filters, use the Primary Teal background.

### Cards & Panels
- Must have a header section with a 1px bottom border. 
- Headers often include a "Coordination Tag" in the top right (e.g., `[SECTION_01]`) in 11px JetBrains Mono to enhance the HUD aesthetic.

### Data Visualizations
- Lines must be 1px or 2px thick. Use Neon Mint (#00FF9D) for positive trends and Primary Teal (#016764) for neutral baselines. Avoid gradients; use solid fills or hatch patterns for area charts.