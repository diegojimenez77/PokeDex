---
name: Prism Dex
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#eabcb6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#b08781'
  outline-variant: '#5f3f3a'
  surface-tint: '#ffb4aa'
  primary: '#ffb4aa'
  on-primary: '#690003'
  primary-container: '#ff5545'
  on-primary-container: '#5c0002'
  inverse-primary: '#c0000a'
  secondary: '#bcc2ff'
  on-secondary: '#00189a'
  secondary-container: '#2638b8'
  on-secondary-container: '#aab3ff'
  tertiary: '#98cbff'
  on-tertiary: '#003354'
  tertiary-container: '#2b97e4'
  on-tertiary-container: '#002c49'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930005'
  secondary-fixed: '#dfe0ff'
  secondary-fixed-dim: '#bcc2ff'
  on-secondary-fixed: '#000b62'
  on-secondary-fixed-variant: '#2335b5'
  tertiary-fixed: '#cee5ff'
  tertiary-fixed-dim: '#98cbff'
  on-tertiary-fixed: '#001d33'
  on-tertiary-fixed-variant: '#004a77'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  card-gap: 20px
---

## Brand & Style

The design system is centered on high-fidelity data visualization and emotional connection. It targets a modern audience that values both efficiency and aesthetic delight. The UI evokes a sense of "premium discovery"—making the act of browsing a massive database feel like exploring a high-end digital encyclopedia.

The design style is **Modern/Glassmorphic**. It utilizes clean, semi-transparent surfaces to create depth without clutter. By layering vibrant "type-based" colors behind frosted glass cards, the interface feels dynamic and alive. The aesthetic balances the playfulness of the subject matter with the sophistication of a modern productivity app, ensuring it feels like a professional tool rather than a toy.

## Colors

This design system utilizes a "Contextual Vibrancy" approach. While the core interface defaults to a deep, neutral dark mode (to make creature artwork pop), the primary accent colors are derived from the 18 elemental types. 

Each Pokemon entry or category should adopt its specific type color as its thematic anchor. In Light Mode, these colors are used for subtle backgrounds and borders; in Dark Mode, they are used for glows, gradients, and high-contrast accents. The "Pokeball Red" (#FF1C1C) is reserved for critical actions, branding, and global states.

## Typography

The typography system relies on **Inter** for its exceptional readability and systematic feel. To maintain a premium look, we use tight tracking on large headings and generous line-heights for body text. 

Hierarchy is established through weight rather than just size. Taxonomic data (like Weight, Height, and Species) should use `label-caps` for a structured, scientific appearance. Pokemon names should always utilize `display-lg` or `headline-md` to command immediate attention.

## Layout & Spacing

This design system employs a **Fluid Grid** with a strict 8px base unit. The layout is designed to be highly responsive, shifting from a single-column detailed view on mobile to a multi-column masonry grid on desktop.

Content containers use a standard 24px padding to ensure elements have room to breathe, preventing the UI from feeling "cramped." Large-scale sections should be separated by 48px to 64px to create clear mental breaks between different types of data (e.g., separating Base Stats from Evolution Chains).

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Ambient Glows**. 

Instead of traditional black shadows, this design system uses "Tinted Shadows" that adopt a percentage of the underlying element's type color. Surfaces are tiered as follows:
- **Level 0 (Background):** Deep charcoal or pure white.
- **Level 1 (Cards):** Semi-transparent (80-90% opacity) with a 16px backdrop blur.
- **Level 2 (Modals/Popovers):** Higher opacity (95%) with a subtle 1px inner light border to simulate a glass edge.

Interactive elements should "lift" on hover, increasing the blur radius and the intensity of the colored glow behind them.

## Shapes

The shape language is **Rounded**, communicating friendliness and modern tech. 
- **Standard Cards:** 1rem (16px) corner radius.
- **Buttons and Inputs:** 0.5rem (8px) for a precise, clickable feel.
- **Type Badges:** Fully pill-shaped to distinguish them from structural UI elements.

The circular motif of the Pokeball is repeated throughout the system—used in loading indicators, progress rings, and as a ghosted background element (watermark) in headers.

## Components

### Buttons
Primary buttons use a solid fill of the relevant Type Color with white text. Secondary buttons use a "Ghost" style with a 1px border and a subtle background tint on hover. 

### Sleek Cards
Pokemon cards should feature a top-aligned image that overflows the card boundary slightly. The background of the card should be a subtle gradient of the Pokemon's primary type color (at 10% opacity) to provide instant visual recognition.

### Pokeball Loading Spinner
The loading state is a minimalist, two-tone Pokeball icon that rotates 360 degrees while the center button "pulses" with a soft white glow.

### Type Chips
Small, pill-shaped indicators with high-contrast backgrounds and white text. Each chip should include a tiny, simplified vector icon of the type (e.g., a flame for Fire, a droplet for Water).

### Stat Bars
Horizontal progress bars with rounded ends. The "fill" of the bar should use a gradient from a neutral grey to the specific Type Color, providing a visual sense of power levels.

### Search & Filters
The search bar is a floating, glassmorphic input with a Pokeball icon as the "clear" or "search" trigger. Filters should appear as a horizontal scrolling list of Type Chips.