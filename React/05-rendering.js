/* =============================================================================
 * RENDERING & PERFORMANCE
 * Theory: THEORY.md §5
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * Re-render triggers: state change, parent re-render, context change
 * React.memo       — skip re-render if props shallow-equal
 * Shallow compare  — Object.is on each prop (reference equality for objects)
 * ============================================================================= */

// ─── Child re-renders with parent (default) ──────────────────────────────────

// function Parent() {
//     const [count, setCount] = useState(0);
//     return (
//         <>
//             <button onClick={() => setCount(c => c + 1)}>{count}</button>
//             <Child name="Alice" />  {/* re-renders every Parent click */}
//         </>
//     );
// }

// ─── React.memo — skip if props unchanged ────────────────────────────────────

// const Child = React.memo(function Child({ name }) {
//     return <span>{name}</span>;
// });

// ─── Unnecessary render — new object every time ──────────────────────────────

// BAD for memoized child:
// <Child style={{ color: 'red' }} />  // new object reference each render
//
// FIX:
// const style = useMemo(() => ({ color: 'red' }), []);
// <Child style={style} />

// ─── Context causes all consumers to re-render ───────────────────────────────

// BAD:
// <UserContext.Provider value={{ user, logout }}>  // new object every render
//
// FIX: memoize value or split contexts
