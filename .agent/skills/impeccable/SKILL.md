---
name: impeccable
description: >-
  Use this skill to audit, review, polish, and critique frontend UI/UX implementations.
  Checks visual design, typography, contrast, spacing, alignment, visual hierarchy, responsiveness,
  keyboard accessibility, interaction states, and performance, categorizing issues by severity
  (Critical, High, Medium, Low) and providing actionable fixes.
---

# Impeccable — UI/UX Review, Audit & Quality Assurance Skill

Impeccable acts as a strict, expert design review engine and quality gate for frontend interfaces.

## Review Dimensions & Quality Gates

### 1. Visual Quality & Typography
- **Alignment & Grid**: All elements adhere to a consistent 4px/8px alignment grid. No accidental 1px-3px offsets.
- **Contrast & Legibility**: Text meets WCAG AA standards (4.5:1 for body, 3:1 for headers).
- **Visual Hierarchy**: Primary actions dominate; secondary actions are quiet; metadata is subdued.
- **Consistency**: Buttons, inputs, badges, and cards share uniform border-radius, padding, and elevation tokens.

### 2. User Experience (UX) & Interactions
- **Feedback & States**: Immediate visual feedback for click/tap/hover. Clear loading indicators on async actions.
- **Form Usability**: Clear labels, sensible placeholders, inline validation messages, visible password toggles where appropriate.
- **Error Handling**: Graceful recovery paths, clear error copy (explaining what went wrong and how to fix it).

### 3. Responsive & Touch Experience
- **Fluid Breakpoints**: Seamless rendering on Mobile (375px+), Tablet (768px+), Desktop (1024px+), and Large screens (1440px+).
- **Touch Targets**: Minimum 44x44px for interactive elements on mobile.
- **No Horizontal Overflow**: Elements wrap or scroll within their designated containers without breaking viewport width.

### 4. Accessibility (A11y)
- **Keyboard Navigation**: Full Tab/Shift+Tab navigation with visible focus rings.
- **Screen Reader Support**: Semantic HTML tags (`<nav>`, `<main>`, `<button>`, `<label>`), valid `aria-*` tags.
- **Reduced Motion**: Respects `prefers-reduced-motion` media queries.

### 5. Performance & Code Quality
- **Asset Optimization**: Responsive images, SVG icons, minimal reflow/repaint triggers.
- **CSS Hygiene**: Structured CSS variables, no redundant overrides, clean class naming.

## Issue Categorization & Severity Levels

When producing an Impeccable Audit Report, classify issues into:
- **CRITICAL**: Functional breakage, inaccessible content, missing mandatory states, severe layout collapse.
- **HIGH**: Contrast failures, broken mobile responsive layout, missing focus rings, unhandled error states.
- **MEDIUM**: Spacing inconsistencies, suboptimal visual hierarchy, abrupt transitions, minor typography alignment.
- **LOW**: Micro-polish opportunities, subtle hover enhancements, code simplification.

## Auto-Fix Protocol
After reporting issues, immediately implement safe code fixes for identified Critical, High, and Medium issues.
