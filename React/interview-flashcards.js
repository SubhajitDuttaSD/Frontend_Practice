/* =============================================================================
 * REACT & REDUX — INTERVIEW FLASHCARDS
 * Reference only. Full answers: THEORY.md
 * =============================================================================
 *
 * TIER 2 — REACT
 * ──────────────
 *  1. Virtual DOM?        → In-memory UI tree; React diffs & patches real DOM
 *  2. Reconciliation?     → Syncing DOM with latest element tree
 *  3. Fiber?              → New reconciler; interruptible, prioritized rendering
 *  4. Why Hooks?          → Reuse logic, no classes, colocate effects
 *  5. useState async?     → Batched updates; use functional setState for chaining
 *  6. useMemo vs useCallback? → cache value vs cache function reference
 *  7. Why child re-renders? → Parent re-render re-runs children by default
 *  8. React.memo?           → Skip render if props shallow-equal
 *  9. Controlled input?   → value + onChange; React owns state
 * 10. Error Boundary?      → Catch render errors; class components only
 * 11. Suspense + lazy?     → Fallback UI while code/data loads
 *
 * TIER 3 — REDUX
 * ──────────────
 * 12. Redux flow?          → dispatch → reducer → new state → UI
 * 13. Pure reducer?        → Predictable, testable, time-travel debugging
 * 14. Middleware?          → Extend dispatch (thunk, logger)
 * 15. RTK benefits?        → Less boilerplate, Immer, createAsyncThunk
 * 16. Redux vs Context?    → Redux for complex state; Context for simple global
 * 17. Avoid Redux when?    → Small app, server state via React Query, local state enough
 *
 * TOPIC FILES
 * ───────────
 *  01-react-basics.js  05-rendering.js
 *  02-virtual-dom.js   06-forms.js
 *  03-fiber.js         07-advanced-react.js
 *  04-hooks.js         08-redux.js
 * ============================================================================= */
