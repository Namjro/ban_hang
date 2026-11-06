---
version: alpha
name: Heritage
description: Architectural Minimalism meets Journalistic Gravitas.
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
  on-primary: "#FFFFFF"
  on-tertiary: "#FFFFFF"
typography:
  h1:
    fontFamily: Public Sans, sans-serif
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.2
  body-md:
    fontFamily: Public Sans, sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  label-caps:
    fontFamily: Space Grotesk, monospace
    fontSize: 0.75rem
    fontWeight: 600
    letterSpacing: 0.05em
rounded:
  sm: 4px
  md: 8px
  lg: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.sm}"
    padding: 12px 24px
  button-primary-hover:
    backgroundColor: "#9E3825"
---

## Overview

Architectural Minimalism meets Journalistic Gravitas. The UI evokes a premium matte finish — a high-end broadsheet or contemporary gallery.

## Colors

The palette is rooted in high-contrast neutrals and a single accent color.

- **Primary (#1A1C1E):** Deep ink for headlines and core text.
- **Secondary (#6C7278):** Sophisticated slate for borders, captions, metadata.
- **Tertiary (#B8422E):** "Boston Clay" — the sole driver for primary interaction.
- **Neutral (#F7F5F2):** Warm limestone foundation, softer than pure white.

## Typography

Clear contrast between crisp sans-serif headings and technical monospace labels.

- **Headings (Public Sans):** Strong, clean weight for section titles.
- **Body (Public Sans):** Legible standard text size with generous line height.
- **Labels (Space Grotesk):** All-caps technical cues for tags and meta labels.

## Layout & Spacing

Clean grid structure with predictable 8-point spacing increments (`sm: 8px`, `md: 16px`, `lg: 24px`).

## Elevation & Depth

Flat aesthetic with subtle borders (`1px solid {colors.secondary}`) rather than heavy box shadows.

## Shapes

Subtle rounded corners (`4px` for buttons and inputs, `8px` for cards) to preserve a crisp, modern form.

## Components

- **Primary Button:** Uses Tertiary background with high contrast white text and 4px border radius.

## Do's and Don'ts

- **Do:** Maintain high contrast ratios for text elements.
- **Don't:** Mix multiple bright accent colors; stick to Boston Clay for primary calls-to-action.
