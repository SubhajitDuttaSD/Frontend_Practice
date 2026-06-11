/* =============================================================================
 * ADVANCED REACT
 * Theory: THEORY.md §7
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * forwardRef     — pass ref to child DOM/component
 * HOC            — fn(Component) => EnhancedComponent (legacy pattern)
 * Context        — avoid prop drilling; don't overuse for frequent updates
 * Error Boundary — catch render errors (class only)
 * Suspense       — show fallback while children load
 * lazy()         — code-split component import
 * ============================================================================= */

// ─── forwardRef ──────────────────────────────────────────────────────────────

// const FancyInput = forwardRef((props, ref) => (
//     <input ref={ref} className="fancy" {...props} />
// ));
// parent: <FancyInput ref={inputRef} />

// ─── HOC pattern ─────────────────────────────────────────────────────────────

// function withLoading(Component) {
//     return function Wrapped(props) {
//         if (props.isLoading) return <Spinner />;
//         return <Component {...props} />;
//     };
// }
// Prefer custom hooks today: useUser(), useAuth()

// ─── lazy + Suspense ─────────────────────────────────────────────────────────

// const Settings = lazy(() => import('./Settings'));
//
// <Suspense fallback={<Spinner />}>
//     <Settings />
// </Suspense>

// ─── Error Boundary (class only) ─────────────────────────────────────────────

// class ErrorBoundary extends React.Component {
//     state = { hasError: false };
//     static getDerivedStateFromError() { return { hasError: true }; }
//     componentDidCatch(error, info) { log(error, info); }
//     render() {
//         return this.state.hasError ? <Fallback /> : this.props.children;
//     }
// }
