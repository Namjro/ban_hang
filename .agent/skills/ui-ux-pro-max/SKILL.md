---
name: ui-ux-pro-max
description: >-
  Expert UI/UX intelligence system for requirement analysis, user personas, user flows,
  information architecture, design direction, color palette selection, typography pairings,
  spacing systems, component architecture, responsive behavior, and accessibility specifications.
  Use this skill during Phase 1 (UX/UI Analysis & Design Direction) before implementing frontend code.
---

# UI UX Pro Max — Design Intelligence & UX Analysis Skill

This skill provides comprehensive UI/UX reasoning, design systems intelligence, and strategic design direction to prevent generic "AI-slop" interfaces and build production-ready, accessible, and conversion-optimized digital products.

## Core Capabilities & Workflow

### 1. Requirement & User Experience Analysis
- **User Persona & Context**: Understand the target audience, primary user tasks, cognitive load, and device usage context.
- **User Flow & Information Architecture**: Map out multi-step user journeys, clear navigation paths, content hierarchies, and state transitions.
- **Accessibility Baseline**: Define WCAG 2.1 AA/AAA compliance targets (contrast ratios, keyboard focus, touch targets >= 44x44px).

### 2. Design Direction & Aesthetic Selection
Select and commit to a clear, intentional design style tailored to the domain:
- **Enterprise / SaaS**: Clean, high-density, subtle borders, muted neutral backgrounds, high-contrast typography, refined accent colors.
- **Editorial / Storytelling**: Distinctive typography, strong visual hierarchy, generous whitespace, high-impact imagery.
- **Modern Minimal / Neo-SaaS**: Bold typography, subtle micro-textures, crisp 1px borders (`border-neutral-200` / `rgba(255,255,255,0.1)`), deliberate accent highlights.

### 3. Design Tokens System
Always output concrete design tokens:
- **Color Palette**:
  - `primary`: Core brand action color.
  - `neutral` scale: 9-step scale (`50` to `950`) for background, surface, border, and text.
  - `semantic` colors: Success, Warning, Error, Info (with foreground, background, and border tokens).
  - Contrast ratios verified against WCAG standards (>= 4.5:1 for body text, >= 3:1 for large text).
- **Typography Scale**:
  - Font families: Intentional pairings (e.g., Sans-serif for UI, Display font for hero/headings).
  - Sizes: `xs` (12px), `sm` (14px), `base` (16px), `lg` (18px), `xl` (20px), `2xl` (24px), `3xl` (30px), `4xl` (36px).
  - Line heights: Body text `1.5 - 1.7`, Headings `1.15 - 1.3`.
- **Spacing & Layout Grid**:
  - 4px/8px grid system (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
  - Container breakpoints: Mobile (`< 768px`), Tablet (`768px - 1023px`), Desktop (`>= 1024px`), Wide (`>= 1280px`).

### 4. Component System & State Specifications
Define specifications for every component:
- Required states: Default, Hover, Active, Focus-Visible, Disabled, Loading, Empty, Error.
- Responsive adaptation: How cards, tables, forms, modals, and sidebars reflow across screen sizes.

## Output Format for Phase 1
When executing Phase 1 UX/UI analysis, produce:
1. **UX Analysis & Information Hierarchy**
2. **Design Direction & Mood**
3. **Design Tokens (YAML or CSS Variables format)**
4. **Component Matrix & State Definitions**
5. **Responsive Breakdown Rules**
