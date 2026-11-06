# DESIGN.md Format Specification

A format specification for describing a visual identity to coding agents. `DESIGN.md` gives agents a persistent, structured understanding of a design system.

---

## File Structure

A `DESIGN.md` file has two main layers:

1. **YAML Front Matter**: Machine-readable design tokens, delimited by `---` fences at the top of the file.
2. **Markdown Body**: Human-readable design rationale organized into `##` sections.

The tokens are the normative values. The prose provides context for how to apply them.

---

## Token Schema

```yaml
version: <string>          # optional, current: "alpha"
name: <string>             # required
description: <string>      # optional
omitted: <string[] | OmittedSection[]> # optional, list of sections to intentionally omit
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <token-name>: <string | token reference>
```

---

## Token Types

| Type | Format | Example |
|:-----|:-------|:--------|
| Color | Any CSS color (hex, `rgb()`, `oklch()`, named) | `"#1A1C1E"`, `"oklch(62% 0.18 250)"` |
| Dimension | number + unit (`px`, `em`, `rem`) | `48px`, `-0.02em` |
| Token Reference | `{path.to.token}` | `{colors.primary}` |
| Typography | object with `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` | See example below |

### Typography Object Example
```yaml
typography:
  h1:
    fontFamily: Public Sans, sans-serif
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  body-md:
    fontFamily: Public Sans, sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
```

---

## Section Order

Sections in the markdown body use `##` headings. Present sections must follow this order:

1. Overview (or Brand & Style)
2. Colors
3. Typography
4. Layout (or Layout & Spacing)
5. Elevation & Depth (or Elevation)
6. Shapes
7. Components
8. Do's and Don'ts

---

## Component Tokens

Components map a name to a group of sub-token properties:

```yaml
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.sm}"
    padding: 12px 24px
  button-primary-hover:
    backgroundColor: "{colors.tertiary-container}"
```

Valid component properties include:
- `backgroundColor`
- `textColor`
- `typography`
- `rounded`
- `padding`
- `size`
- `height`
- `width`

---

## Validation & Tooling

Run automated checks using `@google/design.md`:

```bash
# Validate contrast ratios, broken references, schema
npx @google/design.md lint DESIGN.md

# Compare two design system versions
npx @google/design.md diff DESIGN.md DESIGN-v2.md
```
