/* =============================================================================
 * VIRTUAL DOM, RECONCILIATION & DIFFING
 * Theory: THEORY.md §2
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * Virtual DOM    — in-memory JS tree representing UI
 * Reconciliation — process of syncing DOM with latest element tree
 * Diffing        — O(n) heuristic compare of old vs new tree
 *
 * Diffing rules:
 *   1. Different type  → replace entire subtree
 *   2. Same type       → update props, diff children
 *   3. Lists need keys → stable identity across renders
 * ============================================================================= */

// ─── Why keys matter in lists ────────────────────────────────────────────────

// BAD — no key: React may re-render/remount more than needed on reorder
// items.map(item => <li>{item.name}</li>)

// GOOD — stable unique key
// items.map(item => <li key={item.id}>{item.name}</li>)

// ─── Reconciliation flow (conceptual) ────────────────────────────────────────
//
// State changes
//   → Component re-runs, returns new element tree
//   → React diffs new tree vs previous (Virtual DOM / Fiber tree)
//   → Computes minimal DOM operations (patch)
//   → Commit phase applies changes to real DOM

// ─── Element type change → full replace ──────────────────────────────────────
//
// Before: <div><Counter /></div>
// After:  <span><Counter /></span>
// Result: div unmounted, span mounted — Counter remounts too
