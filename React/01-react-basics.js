/* =============================================================================
 * REACT BASICS — JSX, Elements, createElement
 * Theory: THEORY.md §1
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * React     — UI library, component-based, declarative
 * JSX       — syntax sugar for React.createElement()
 * Element   — plain object { type, props, key, ref } — not a DOM node
 * Component — function or class that returns elements
 * ============================================================================= */

// ─── JSX compiles to createElement ───────────────────────────────────────────

// JSX:
// const element = <h1 className="greeting">Hello, {name}</h1>;

// Compiles to:
const element = {
    type: 'h1',
    props: {
        className: 'greeting',
        children: 'Hello, World',
    },
    key: null,
    ref: null,
};

// Equivalent with createElement (conceptual):
// React.createElement('h1', { className: 'greeting' }, `Hello, ${name}`);

// ─── Function component returns elements ─────────────────────────────────────

// function Greeting({ name }) {
//     return <h1>Hello, {name}</h1>;
// }

// ─── Why React over vanilla JS ───────────────────────────────────────────────
//
// Vanilla:  document.getElementById('app').innerHTML = ...  (manual sync)
// React:    setState → UI updates automatically from state
//
// Benefits: reusable components, predictable data flow, easier scaling
