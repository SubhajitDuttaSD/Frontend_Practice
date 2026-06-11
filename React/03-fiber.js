/* =============================================================================
 * REACT FIBER
 * Theory: THEORY.md §3
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * Fiber        — unit of work; linked tree (child, sibling, return)
 * Render phase — build fiber tree, interruptible, no DOM writes
 * Commit phase — apply DOM updates, run layout effects (sync)
 *
 * Why Fiber?
 *   Old stack reconciler blocked main thread → jank on large updates
 *   Fiber enables pause/resume, priority, concurrent features
 * ============================================================================= */

// ─── Priority example (conceptual) ───────────────────────────────────────────
//
// User typing in input     → high priority update
// Rendering search results → lower priority (can be deferred)
//
// React 18+: startTransition(() => setSearchResults(data))
//   marks update as non-urgent — keeps input responsive

// ─── Two phases ──────────────────────────────────────────────────────────────
//
// RENDER (interruptible)
//   traverse fibers, compute what changed, mark side-effects
//
// COMMIT (must finish synchronously)
//   mutate DOM, run useLayoutEffect, paint
//   run passive useEffect after paint
