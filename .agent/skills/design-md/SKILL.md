---
name: design-md
description: >-
  Use this skill whenever creating, updating, linting, or applying visual design systems using the DESIGN.md format specification (from google-labs-code/design.md).
  This skill guides the structured definition of visual identity (YAML design tokens + Markdown design rationale) for coding agents.
---

# DESIGN.md Specification & Workflow Skill

`DESIGN.md` is a standard format specification by Google Labs Code for describing a visual identity to coding agents. It gives agents a persistent, structured, machine-and-human-readable understanding of a design system.

---

## Key Structure of `DESIGN.md`

A valid `DESIGN.md` consists of two primary layers:
1. **YAML Front Matter**: Machine-readable design tokens delimited by `---` fences at the top of the file.
2. **Markdown Body**: Human-readable design rationale organized into `##` sections explaining *why* those tokens exist and how to apply them.

```markdown
---
name: System Name
version: alpha
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
typography:
  h1:
    fontFamily: Inter, sans-serif
    fontSize: 2.5rem
    fontWeight: 700
  body-md:
    fontFamily: Inter, sans-serif
    fontSize: 1rem
rounded:
  sm: 4px
  md: 8px
spacing:
  sm: 8px
  md: 16px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
---

## Overview
Brand and aesthetic identity overview.

## Colors
Color roles and usage explanations.

## Typography
Type hierarchy and font pairings.
```

---

## Standard Section Ordering (Markdown Body)

Sections in the Markdown body must use `##` level headings and follow this precise order if present:

1. `## Overview` (or `## Brand & Style`)
2. `## Colors`
3. `## Typography`
4. `## Layout` (or `## Layout & Spacing`)
5. `## Elevation & Depth` (or `## Elevation`)
6. `## Shapes`
7. `## Components`
8. `## Do's and Don'ts`

---

## Token Types & Syntax

- **Color**: Valid CSS colors (Hex `#1A1C1E`, `rgb()`, `oklch()`, etc.)
- **Dimension**: Number with unit (`4px`, `1rem`, `-0.02em`)
- **Token Reference**: References inside curly braces like `{colors.primary}`, `{rounded.sm}`
- **Typography**: Objects containing `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, etc.
- **Components**: Maps containing component properties like `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`.

---

## CLI Commands & Tooling

Validate or diff `DESIGN.md` files using the `@google/design.md` package:

### 1. Lint / Validate
```bash
npx @google/design.md lint DESIGN.md
```
*Checks schema validity, broken token references, and WCAG contrast ratios.*

### 2. Diff / Detect Regressions
```bash
npx @google/design.md diff DESIGN.md DESIGN-v2.md
```
*Detects token changes and structural/contrast regressions between versions.*

---

## Useful References & Templates

- Full Specification: [spec.md](./references/spec.md)
- Starter Example: [DESIGN.md](./examples/DESIGN.md)
