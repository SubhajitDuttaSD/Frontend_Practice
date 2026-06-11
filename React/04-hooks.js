/* =============================================================================
 * REACT HOOKS
 * Theory: THEORY.md §4
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * useState       — local state + setter
 * useEffect      — side effects after render; cleanup on unmount/deps change
 * useRef         — mutable .current, no re-render
 * useMemo        — cache computed value
 * useCallback    — cache function reference
 * useReducer     — state via reducer(state, action)
 * useContext     — read context value
 * ============================================================================= */

// ─── useState ────────────────────────────────────────────────────────────────

// const [count, setCount] = useState(0);
// setCount(count + 1);       // may batch; same render sees stale count
// setCount(c => c + 1);      // functional update — use when next depends on prev

// ─── useEffect lifecycle ─────────────────────────────────────────────────────

// useEffect(() => {
//     // mount + every update (no deps)
// }, []);
// // ↑ mount only
//
// useEffect(() => {
//     fetchData(id);
//     return () => cleanup(); // runs before next effect + unmount
// }, [id]);
// // ↑ runs when id changes

// ─── useRef — DOM + mutable value ────────────────────────────────────────────

// const inputRef = useRef(null);
// <input ref={inputRef} />
// inputRef.current.focus();
//
// const timerRef = useRef(null); // store timer ID without re-render

// ─── useMemo vs useCallback ──────────────────────────────────────────────────

// const sorted = useMemo(() => expensiveSort(items), [items]);     // cache VALUE
// const onClick = useCallback(() => submit(id), [id]);             // cache FUNCTION

// ─── useReducer ──────────────────────────────────────────────────────────────

// function reducer(state, action) {
//     switch (action.type) {
//         case 'increment': return { count: state.count + 1 };
//         default: return state;
//     }
// }
// const [state, dispatch] = useReducer(reducer, { count: 0 });
// dispatch({ type: 'increment' });

// ─── useContext ──────────────────────────────────────────────────────────────

// const theme = useContext(ThemeContext);
