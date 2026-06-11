# CSS Theory — Interview Answers (Tier 5)

---

## Table of Contents

1. [Box Model](#1-box-model)
2. [Specificity](#2-specificity)
3. [Flexbox vs Grid](#3-flexbox-vs-grid)
4. [Position](#4-position-absolute-vs-relative)
5. [Display & Visibility](#5-display-none-vs-visibility-hidden)
6. [Display Types](#6-inline-vs-block-vs-inline-block)
7. [Pseudo-class vs Pseudo-element](#7-pseudo-class-vs-pseudo-element)
8. [z-index & Layout Shift](#8-what-is-z-index)

---

## 1. Box Model

Every element is a rectangular box with four layers (inside → out):

```
┌─────────────────────────────────────┐
│            MARGIN (transparent)      │
│  ┌───────────────────────────────┐  │
│  │       BORDER                   │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │     PADDING              │  │  │
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │     CONTENT       │  │  │  │
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

| Layer | Purpose |
|-------|---------|
| **Content** | Text, images — `width`/`height` apply here by default |
| **Padding** | Space inside border |
| **Border** | Visible edge |
| **Margin** | Space outside border, between elements |

### `box-sizing`

```css
/* Default — width = content only */
box-sizing: content-box;

/* width includes padding + border (easier layouts) */
box-sizing: border-box;
```

Most resets use `*, *::before, *::after { box-sizing: border-box; }`.

---

## 2. Specificity

When multiple rules target the same element, **specificity** decides which wins (before `!important` and source order).

### Specificity weights (a, b, c, d)

| Selector type | Weight | Example |
|---------------|--------|---------|
| Inline style | 1,0,0,0 | `style="color:red"` |
| ID | 0,1,0,0 | `#header` |
| Class, attribute, pseudo-class | 0,0,1,0 | `.btn`, `[type]`, `:hover` |
| Element, pseudo-element | 0,0,0,1 | `div`, `::before` |

```css
div.nav#menu li.active a { }  /* 0,1,2,2 */
#menu a { }                   /* 0,1,0,1 — loses to above */
```

### Tie-breakers
1. Higher specificity wins
2. Same specificity → **last rule in stylesheet** wins
3. `!important` overrides (avoid in production)

---

## 3. Flexbox vs Grid?

Both are layout systems — different use cases.

| | **Flexbox** | **Grid** |
|---|-------------|----------|
| **Dimension** | **1D** — row OR column | **2D** — rows AND columns |
| **Best for** | Nav bars, aligning items in a row/column, distributing space | Page layouts, dashboards, card grids |
| **Item control** | Items flex/grow/shrink along main axis | Explicit row/column placement |
| **Alignment** | `justify-content`, `align-items` | `place-items`, `grid-template-areas` |

```css
/* Flexbox — horizontal nav */
.nav { display: flex; justify-content: space-between; align-items: center; }

/* Grid — page layout */
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
}
```

**Rule:** Flexbox for **components** (1D alignment). Grid for **page structure** (2D layouts). Often used together.

---

## 4. position absolute vs relative?

| | `relative` | `absolute` |
|---|------------|------------|
| **Document flow** | Stays in flow; original space reserved | **Removed** from flow |
| **Offset** | `top/left` shift from **original position** | `top/left` relative to **nearest positioned ancestor** |
| **Use case** | Fine-tune position, create containing block for children | Overlays, tooltips, dropdowns |

```css
.parent { position: relative; }
.tooltip {
  position: absolute;
  top: 100%;
  left: 0;
}
```

Without positioned ancestor, `absolute` positions relative to **initial containing block** (usually viewport).

### position sticky?

Hybrid of `relative` + `fixed`:

```css
.header {
  position: sticky;
  top: 0;
}
```

- Acts **relative** until scroll reaches threshold (`top: 0`)
- Then **sticks** like `fixed` within its **scroll container**
- Stops sticking at parent's bottom edge

Use for: sticky headers, table column headers, sidebar sections.

---

## 5. display none vs visibility hidden?

| | `display: none` | `visibility: hidden` |
|---|-----------------|----------------------|
| **Rendered** | Not in layout at all | In layout, invisible |
| **Space taken** | **No** — collapsed | **Yes** — gap remains |
| **Children** | Hidden | Can override with `visibility: visible` |
| **Events** | No interaction | No interaction (element still there) |
| **Accessibility** | Removed from a11y tree | Hidden but may still be focusable |

Use `display: none` to fully remove. Use `visibility: hidden` when you need to preserve layout space.

---

## 6. inline vs block vs inline-block?

| | `inline` | `block` | `inline-block` |
|---|----------|---------|----------------|
| **New line** | No — flows with text | Yes — full width row | No — flows inline |
| **Width/height** | Ignored | Respected | Respected |
| **Margin/padding** | Horizontal only (vertical limited) | All sides | All sides |
| **Examples** | `<span>`, `<a>`, `<strong>` | `<div>`, `<p>`, `<h1>` | Buttons, pills, icons |

```css
.pill {
  display: inline-block;
  padding: 4px 12px;  /* works unlike pure inline */
  width: 80px;
}
```

---

## 7. Pseudo class vs pseudo element?

| | **Pseudo-class** | **Pseudo-element** |
|---|------------------|---------------------|
| **Syntax** | Single colon `:hover` | Double colon `::before` |
| **Targets** | **State** of element | **Part** of element |
| **Examples** | `:hover`, `:focus`, `:nth-child(2)`, `:disabled` | `::before`, `::after`, `::first-line`, `::placeholder` |

```css
/* Pseudo-class — state */
a:hover { color: red; }
li:nth-child(odd) { background: #f0f0f0; }

/* Pseudo-element — virtual sub-part */
.quote::before { content: '"'; }
input::placeholder { color: gray; }
```

`:before` / `:after` (single colon) still work for backwards compatibility.

---

## 8. What is z-index?

Controls **stacking order** of positioned elements along the z-axis (toward viewer).

```css
.modal { position: fixed; z-index: 1000; }
.dropdown { position: absolute; z-index: 100; }
```

### Rules
- Only works on **positioned** elements (`relative`, `absolute`, `fixed`, `sticky`) or flex/grid children.
- Higher number = on top.
- **Stacking context** — new context created by `z-index`, `opacity < 1`, `transform`, `filter`. Children can't escape parent's layer.

### What causes layout shift?

**CLS (Cumulative Layout Shift)** — visible content jumps unexpectedly.

| Cause | Fix |
|-------|-----|
| Images without dimensions | `width`/`height` or `aspect-ratio` |
| Ads/embeds loading late | Reserve space with skeleton |
| Web fonts (FOUT/FOIT) | `font-display: swap`, preload fonts |
| Dynamic content injection | Reserve space for banners, toasts |
| `document.write` | Avoid |

```html
<img src="photo.jpg" width="800" height="600" alt="..." />
```

Poor CLS hurts **Core Web Vitals** and UX.

---

## Quick Links

| Topic | File |
|-------|------|
| Box model, specificity | `01-box-model-specificity.js` |
| Flex, Grid, position | `02-layout-position.js` |
| Display, pseudo | `03-display-pseudo.js` |
| z-index, CLS | `04-z-index-layout-shift.js` |
