# Performance Theory — Interview Answers (Tier 6)

Frequently asked at product companies.

---

## Table of Contents

1. [React App Optimization](#1-how-would-you-optimize-a-slow-react-app)
2. [useMemo — When to Use / Avoid](#2-when-should-you-use-usememo)
3. [Bundling — Code Splitting, Tree Shaking, Lazy Loading](#3-what-is-code-splitting)
4. [Virtualization](#4-what-is-virtualization)
5. [Bundle Size & Lighthouse](#5-how-do-you-reduce-bundle-size)
6. [Debugging Performance](#6-how-would-you-debug-performance-issues)

---

## 1. How would you optimize a slow React app?

### Diagnose first
1. **React DevTools Profiler** — which components re-render and how long?
2. **Chrome Performance tab** — long tasks, layout thrashing?
3. **Lighthouse / Web Vitals** — LCP, INP, CLS
4. **Bundle analyzer** — what's in the JS bundle?

### Optimization checklist

| Area | Actions |
|------|---------|
| **Re-renders** | `React.memo`, `useMemo`, `useCallback`, colocate state, split context |
| **Lists** | Stable `key`, virtualization for 1000+ items |
| **Bundle** | Code splitting, lazy routes, tree shaking, remove unused deps |
| **Network** | Compress (gzip/brotli), CDN, HTTP/2, preload critical assets |
| **Images** | WebP/AVIF, lazy load, responsive `srcset`, dimensions |
| **Fonts** | Subset, `font-display: swap`, preload |
| **SSR/SSG** | Faster first paint (Next.js) |
| **Web Workers** | Offload heavy computation off main thread |

### Process
> Measure → find bottleneck → fix one thing → measure again. Don't optimize blindly.

---

## 2. When should you use useMemo?

Use `useMemo` when:

1. **Expensive calculation** — sorting/filtering large arrays, heavy transforms.
2. **Referential stability** — passing objects/arrays to `React.memo` children.
3. **Effect dependencies** — stable object reference to avoid effect re-runs.

```jsx
const sorted = useMemo(() => expensiveSort(items), [items]);
const style = useMemo(() => ({ color: theme.primary }), [theme.primary]);
```

---

## 3. When should you avoid useMemo?

**Don't use by default** — memoization has its own cost (memory + comparison).

Avoid when:

| Situation | Why |
|-----------|-----|
| Cheap computation | `useMemo` overhead > savings |
| Primitives | `count + 1` doesn't need memo |
| Every render anyway | Deps change every time → never cached |
| Premature optimization | Profile first; no measured problem |

```jsx
// BAD — unnecessary
const doubled = useMemo(() => count * 2, [count]);

// GOOD — expensive
const report = useMemo(() => generateReport(10000 rows), [rows]);
```

**Rule:** Use when Profiler shows a problem or referential equality is required.

---

## 4. What is code splitting?

Split app into **smaller JS chunks** loaded on demand instead of one huge bundle.

```jsx
// Route-based splitting
const Dashboard = lazy(() => import('./Dashboard'));

// Webpack/Vite automatic chunk per dynamic import
import('./heavy-chart').then(module => module.render());
```

**Benefits:** Faster initial load (less JS to parse/execute). User downloads code for current route only.

---

## 5. What is tree shaking?

Build tool (**Webpack, Rollup, Vite**) removes **dead code** — exports that are never imported.

```js
// utils.js exports add, subtract, multiply
import { add } from './utils'; // only add bundled; subtract/multiply shaken out
```

Requirements:
- **ES modules** (`import`/`export`)
- Side-effect-free modules (or mark `"sideEffects": false` in package.json)

---

## 6. What is lazy loading?

Load resources **only when needed**:

| Type | Example |
|------|---------|
| **Components** | `React.lazy(() => import('./Modal'))` |
| **Images** | `<img loading="lazy" />` |
| **Routes** | Dynamic import per route |
| **Data** | Infinite scroll fetch on scroll |

```jsx
<Suspense fallback={<Spinner />}>
  <LazyDashboard />
</Suspense>
```

---

## 7. What is virtualization?

Render **only visible items** in a long list — not all 10,000 DOM nodes.

```
Viewport shows items 50–60
DOM contains ~20 nodes (buffer above/below)
Scroll → recycle nodes, update content
```

Libraries: `react-window`, `react-virtualized`, `@tanstack/react-virtual`.

**When:** Lists/tables with 100s–1000s of rows where full render causes jank.

---

## 8. How do you reduce bundle size?

| Technique | How |
|-----------|-----|
| **Analyze** | `webpack-bundle-analyzer`, `source-map-explorer` |
| **Code splitting** | Dynamic imports, route-based chunks |
| **Tree shaking** | ESM imports, avoid barrel files importing everything |
| **Replace heavy libs** | `lodash-es` + specific imports vs full `lodash` |
| **Remove unused deps** | Audit `package.json` |
| **Compression** | Brotli/gzip on server |
| **Polyfills** | Only what you need (`core-js` targeted) |
| **Images/fonts** | External CDN, subset fonts |

---

## 9. What is Lighthouse?

Google's **automated auditing tool** (Chrome DevTools → Lighthouse tab) measuring:

| Category | Metrics |
|----------|---------|
| **Performance** | LCP, TBT, CLS, Speed Index |
| **Accessibility** | ARIA, contrast, labels |
| **Best Practices** | HTTPS, console errors |
| **SEO** | Meta tags, crawlability |
| **PWA** | Service worker, manifest |

Run in CI (Lighthouse CI) to catch regressions. Lab tool — supplement with **field data** (CrUX, RUM).

---

## 10. How would you debug performance issues?

### Step-by-step

1. **Reproduce** — specific page/action, device throttling.
2. **Chrome Performance** — record, find long tasks (>50ms), layout/paint spikes.
3. **React Profiler** — flamegraph of component render times.
4. **Network tab** — waterfall, large assets, blocking requests.
5. **Coverage tab** — unused JS/CSS.
6. **Memory** — leaks from detached DOM nodes, growing heap.
7. **Web Vitals** — `web-vitals` library → RUM in production.

### Common findings

| Symptom | Likely cause |
|---------|--------------|
| Slow first load | Large bundle, no splitting, render-blocking JS |
| Janky scroll | Too many DOM nodes, no virtualization |
| Input lag | Main thread blocked, heavy sync work |
| Layout jump | Images without dimensions (CLS) |

---

## Quick Links

| Topic | File |
|-------|------|
| React optimization | `01-react-optimization.js` |
| Bundling | `02-bundling.js` |
| Virtualization | `03-virtualization.js` |
| Lighthouse & debugging | `04-measuring-debugging.js` |
