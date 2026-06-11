/* =============================================================================
 * FORMS — Controlled vs Uncontrolled
 * Theory: THEORY.md §6
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * Controlled   — value={state} + onChange → React owns the value
 * Uncontrolled — defaultValue + ref → DOM owns the value
 * Prefer controlled for validation, conditional UI, single source of truth
 * Use refs for: file inputs, one-time read on submit, third-party widgets
 * ============================================================================= */

// ─── Controlled input ────────────────────────────────────────────────────────

// const [email, setEmail] = useState('');
//
// <input
//     type="email"
//     value={email}
//     onChange={e => setEmail(e.target.value)}
// />
//
// React state is the single source of truth

// ─── Uncontrolled input ──────────────────────────────────────────────────────

// const inputRef = useRef(null);
//
// <input type="text" defaultValue="John" ref={inputRef} />
//
// function handleSubmit() {
//     console.log(inputRef.current.value); // read DOM on submit
// }

// ─── When to use refs instead of controlled ──────────────────────────────────
//
// • File upload: <input type="file" ref={fileRef} />
// • Simple login form — read once on submit
// • Integrating non-React date picker / rich text editor
