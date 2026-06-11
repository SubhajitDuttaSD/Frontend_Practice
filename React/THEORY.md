# React Theory — Interview Answers

Quick-reference theory guide. Code snippets and examples live in the numbered topic files (`01`–`08`).

---

## Table of Contents

**Tier 2 — React**

1. [React Basics](#1-react-basics)
2. [Virtual DOM & Reconciliation](#2-virtual-dom--reconciliation)
3. [React Fiber](#3-react-fiber)
4. [Hooks](#4-hooks)
5. [Rendering](#5-rendering)
6. [Forms](#6-forms)
7. [Advanced React](#7-advanced-react)

**Tier 3 — Redux**

8. [Redux](#8-redux)

---

## 1. React Basics

### What is React?

**React** is a JavaScript library for building user interfaces using a **component-based**, **declarative** model. You describe what the UI should look like for a given state; React updates the DOM when state changes.

### Why React instead of vanilla JS?

| Vanilla JS | React |
|------------|-------|
| Manual DOM updates (`querySelector`, `innerHTML`) | Declarative UI from state |
| State scattered across DOM and variables | Single source of truth in component state |
| Hard to reason about UI sync bugs | Predictable re-render from state → UI |
| No built-in component reuse | Composable, reusable components |
| Scaling leads to spaghetti code | Ecosystem (hooks, router, patterns) |

React shines when UI has **dynamic data**, **many interactive parts**, and **shared state** across views.

### What is JSX?

**JSX** (JavaScript XML) is syntax extension that lets you write HTML-like markup inside JavaScript. It is **not** HTML — it compiles to `React.createElement()` calls.

```jsx
const el = <h1 className="title">Hello</h1>;
// compiles to:
const el = React.createElement('h1', { className: 'title' }, 'Hello');
```

### How does JSX work internally?

1. **Babel** (or similar) transforms JSX → `React.createElement(type, props, ...children)`.
2. `createElement` returns a plain **React element object** (description of UI).
3. React's renderer (e.g. `react-dom`) turns element trees into real DOM nodes.

JSX rules: one root (or Fragment), `className` not `class`, camelCase attributes, expressions in `{ }`.

### What is a React Element?

A **React element** is a lightweight, immutable plain object describing what to render:

```js
{
  type: 'div',           // tag name or component function/class
  props: { id: 'app' },  // attributes + children
  key: null,
  ref: null,
}
```

Elements are **not** DOM nodes and **not** component instances — they are instructions React uses during reconciliation.

---

## 2. Virtual DOM & Reconciliation

### What is Virtual DOM?

The **Virtual DOM** is an in-memory representation of the UI — a tree of JavaScript objects (React elements / fibers) mirroring the real DOM structure. React keeps this tree in memory and updates the real DOM only where needed.

### Why does React use Virtual DOM?

- **Batching** — collect multiple state updates, compute one diff, apply minimal DOM changes.
- **Abstraction** — same React model works for web, native (React Native), etc.
- **Performance** — direct DOM manipulation is slow; diffing in JS is cheaper than rewriting large DOM sections blindly.

*(Note: React's real advantage is its update model + Fiber, not "Virtual DOM" alone — other frameworks also optimize DOM updates.)*

### How does React compare Virtual DOM trees?

On re-render, React builds a **new element tree** and compares it with the **previous tree** (reconciliation). It identifies:

- New nodes to **mount**
- Nodes to **unmount**
- Nodes to **update** (props changed)
- Nodes that can **stay** (same type + key → reuse instance)

### What is reconciliation?

**Reconciliation** is React's process of updating the DOM to match the latest React element tree. It walks both trees, decides what changed, and applies the smallest set of DOM operations.

Triggered when: `setState`, `useState` dispatch, parent re-render, context change, etc.

### What is diffing?

**Diffing** is the algorithm reconciliation uses to compare trees efficiently. Heuristics (O(n) not O(n³)):

1. **Different element types** → tear down old subtree, build new one.
2. **Same type** → update props on existing DOM node, recurse on children.
3. **`key` prop** → match list items across renders (reorder vs recreate).

```jsx
// Without keys — inefficient reorder
{items.map(item => <li>{item}</li>)}

// With keys — stable identity
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

---

## 3. React Fiber

### What is React Fiber?

**Fiber** is React's **reconciliation engine** (since React 16). Each unit of work is a **Fiber node** — a JS object representing a component, DOM node, or root, linked in a tree with `child`, `sibling`, and `return` pointers.

### Why was Fiber introduced?

The old **stack reconciler** was **synchronous and blocking** — once rendering started, it ran to completion. Large updates caused jank (dropped frames, unresponsive input).

### What problems did Fiber solve?

- **Interruptible rendering** — pause work, resume later.
- **Prioritization** — urgent updates (typing, clicks) ahead of slow ones (data fetch render).
- **Concurrent features** — Suspense, transitions, `useDeferredValue`.
- **Better error boundaries** and incremental hydration paths.

### How does Fiber improve rendering?

Fiber splits work into **units** and schedules them via a **work loop**:

1. **Render phase** (interruptible) — build/update fiber tree, compute changes. No DOM writes yet.
2. **Commit phase** (synchronous) — apply DOM mutations, run layout effects, paint.

React can **yield** to the browser between fiber units, keeping the main thread responsive.

---

## 4. Hooks

### What problem do Hooks solve?

Before Hooks (class pain points):

- Reusing stateful logic required HOCs/render props (wrapper hell).
- `this` binding confusion in classes.
- Related lifecycle logic split across `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`.
- No easy way to share state between unrelated components without context/redux.

Hooks let function components hold **state**, **side effects**, and **shared logic** via custom hooks.

### Explain useState

```jsx
const [count, setCount] = useState(0);
```

- Returns current state value + updater function.
- Re-render scheduled when updater runs.
- Initial value: value or lazy initializer `useState(() => expensive())`.
- Updates may be **batched**; functional updates `setCount(c => c + 1)` when next state depends on previous.

### Why are state updates asynchronous?

React **batches** multiple `setState` / `setCount` calls for performance — one re-render instead of many. The state variable in the **same synchronous block** still shows the old value until the next render.

```jsx
setCount(count + 1);
setCount(count + 1);
// count increases by 1, not 2 — both read same stale count

setCount(c => c + 1);
setCount(c => c + 1);
// increases by 2 — functional updaters chain correctly
```

Also: rendering is not immediate; React schedules updates.

### Explain useEffect lifecycle

```jsx
useEffect(() => {
  // Effect — runs after paint (mount + updates)
  return () => {
    // Cleanup — runs before next effect + on unmount
  };
}, [deps]);
```

| Dependency array | Behavior |
|------------------|----------|
| Omitted | Run after **every** render |
| `[]` | Run once on **mount**, cleanup on **unmount** |
| `[a, b]` | Run when `a` or `b` change |

Replaces `componentDidMount` + `componentDidUpdate` + `componentWillUnmount` for side effects (fetch, subscriptions, DOM sync).

### Explain useRef

```jsx
const ref = useRef(initialValue);
```

- `.current` persists across renders **without** causing re-render when changed.
- **DOM refs:** `ref={inputRef}` → `inputRef.current` is the DOM node.
- **Mutable values:** store timer IDs, previous values, instance-like data.

### Explain useMemo

```jsx
const expensive = useMemo(() => compute(a, b), [a, b]);
```

**Caches a computed value** — recomputes only when dependencies change. Use for expensive calculations, stabilizing object/array references passed to optimized children.

### Explain useCallback

```jsx
const handler = useCallback(() => doSomething(a), [a]);
```

**Caches a function reference** — returns same function instance until deps change. Equivalent to `useMemo(() => fn, deps)`.

### Difference between useMemo and useCallback?

| Hook | Caches | Returns |
|------|--------|---------|
| `useMemo` | **Result** of a function | Value |
| `useCallback` | **Function itself** | Function |

```jsx
useMemo(() => fn, deps)   // ≈ useCallback(fn, deps) for the function reference
useCallback(fn, deps)     // ≈ useMemo(() => fn, deps)
```

Use when referential equality matters (`React.memo`, `useEffect` deps, child optimization) — not everywhere by default.

### Explain useReducer

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

- `reducer(state, action) => newState` — pure function.
- Better for **complex state** with multiple sub-values or when next state depends on previous in structured ways.
- Same dispatch identity across renders — predictable for context.

### Explain useContext

```jsx
const value = useContext(MyContext);
```

Reads nearest `MyContext.Provider` value. Subscribes component to context changes → re-renders when provider value changes.

---

## 5. Rendering

### Why does a component re-render?

A component re-renders when:

1. Its **state** changes (`useState`, `useReducer`).
2. Its **parent** re-renders (default — children always re-render).
3. **Context** it consumes changes.
4. **`forceUpdate`** (rare, classes).

Re-render = function runs again → new JSX → reconciliation.

### When does React.memo help?

`React.memo(Component)` skips re-render if **props are shallow-equal** to previous render.

```jsx
const Child = React.memo(function Child({ name }) {
  return <span>{name}</span>;
});
```

Helps when parent re-renders often but child props are unchanged. Pair with `useCallback` / `useMemo` for stable prop references.

### Why does a child re-render when a parent re-renders?

**Default React behavior:** parent render → React calls child components again. React does not assume children are independent — props might have changed (shallow compare happens only with `memo`).

### How does React compare props?

**Shallow comparison** — same keys, each prop `Object.is` equal to previous:

- Primitives: value equality.
- Objects/arrays/functions: **reference** equality — new `{}` every render = "changed" even if contents identical.

### What causes unnecessary renders?

- Parent re-render cascading to unmemoized children.
- New object/array/function literals as props every render.
- Context provider value recreated each render (`value={{ user }}`).
- State stored too high in tree (whole subtree re-renders).
- Unstable keys in lists causing remounts.

**Fixes:** `React.memo`, `useMemo`/`useCallback`, split context, colocate state, state management libraries.

---

## 6. Forms

### Controlled vs Uncontrolled Components?

| | Controlled | Uncontrolled |
|---|------------|--------------|
| **Value source** | React state | DOM itself |
| **Input value** | `value={state}` + `onChange` | `defaultValue` or ref reads `.value` |
| **Single source of truth** | React state | DOM |

```jsx
// Controlled
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled
<input defaultValue="John" ref={inputRef} />
```

### Why are controlled inputs preferred?

- Instant validation and formatting.
- Conditional UI from input value.
- Consistent with React data flow.
- Easier testing and predictable state.
- Disable/submit logic from state.

### When should you use refs instead?

- Simple forms where you only read values on submit.
- File inputs (`<input type="file">` — often uncontrolled).
- Integrating non-React libraries (jQuery plugins, date pickers).
- Focus management, scroll, measuring DOM.
- Avoiding re-render on every keystroke for huge forms (rare).

---

## 7. Advanced React

### What is forwardRef?

```jsx
const Input = React.forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));
```

Lets a parent pass a **ref** to a child's DOM node or imperative handle. Function components don't accept `ref` by default.

### What are Higher Order Components (HOC)?

A **HOC** is a function that takes a component and returns a new component with extra props or behavior:

```jsx
function withAuth(WrappedComponent) {
  return function Authenticated(props) {
    if (!props.isLoggedIn) return <Login />;
    return <WrappedComponent {...props} />;
  };
}
```

Pattern for cross-cutting concerns (auth, logging, data fetching). Largely replaced by **custom hooks** today.

### What is Context API?

Mechanism to pass data through the tree **without** prop drilling:

```jsx
const ThemeContext = createContext('light');
<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>
```

### When should Context NOT be used?

- **Frequently changing** values (every keystroke) — all consumers re-render.
- **Server state** — use React Query / SWR / Redux instead.
- Replacing all prop passing — overuse hurts component reuse and clarity.
- Fine-grained high-frequency updates — consider Zustand, Jotai, or colocated state.

Good for: theme, locale, auth user, feature flags — **low-frequency, app-wide** data.

### Error Boundaries?

Components that **catch JS errors in child tree** during render/lifecycle and show fallback UI instead of crashing the whole app.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? <h1>Something went wrong.</h1> : this.props.children;
  }
}
```

### Why can only class components be Error Boundaries?

React only implements error-boundary lifecycle methods (`getDerivedStateFromError`, `componentDidCatch`) on **class components**. No hook equivalent yet (`useErrorBoundary` doesn't exist in core React).

*(Libraries like `react-error-boundary` wrap this pattern.)*

### What is Suspense?

```jsx
<Suspense fallback={<Spinner />}>
  <LazyComponent />
</Suspense>
```

Lets components **"wait"** for async data or code before rendering. Shows `fallback` while waiting. Used with `lazy()` and data-fetching frameworks (Relay, Next.js, React 19 patterns).

### What is lazy loading?

**Code splitting** — load component JS only when needed:

```jsx
const Dashboard = React.lazy(() => import('./Dashboard'));
```

Reduces initial bundle size. Must wrap in `<Suspense>`.

---

## 8. Redux

### Why Redux?

Centralized **predictable state container** for JavaScript apps:

- Single store for app state.
- Explicit state changes via **actions**.
- **Time-travel** debugging, middleware, DevTools.
- Useful when many components need same data or state changes are complex.

### Redux flow?

```
UI → dispatch(action) → reducer(state, action) → new state → UI re-renders
```

1. User interacts → component **dispatches** plain action `{ type, payload }`.
2. **Reducer** (pure) computes new state.
3. **Store** notifies subscribers.
4. Connected / `useSelector` components re-render with new state.

### What is a reducer?

Pure function `(state, action) => newState`. No mutations — return new object/array copies. Handles specific `action.type` cases.

### Why must reducers be pure?

- **Predictable** — same input → same output.
- **Debuggable** — time-travel, replay actions.
- **Testable** — no side effects in reducer itself (side effects go in middleware/thunks).

No API calls, no `Date.now()`, no mutating `state` in place.

### What is middleware?

Functions that sit **between dispatch and reducer** — extend dispatch:

```js
dispatch → middleware chain → reducer
```

Examples: **redux-thunk** (async actions), **redux-logger**, custom analytics.

### Redux Toolkit advantages?

Official recommended approach — reduces boilerplate:

- `configureStore` — sensible defaults, DevTools, middleware.
- `createSlice` — actions + reducer in one place, Immer for "mutable" syntax.
- `createAsyncThunk` — async logic with pending/fulfilled/rejected.
- Built-in Immer, RTK Query for data fetching.

### What is createAsyncThunk?

```js
const fetchUser = createAsyncThunk('users/fetch', async (id) => {
  return api.getUser(id);
});
```

Auto-generates `pending`, `fulfilled`, `rejected` action types. Handles async dispatch and integrates with reducers via `extraReducers`.

### Redux vs Context API?

|--------------| Redux ------------------------------| Context |
|--------------|-------------------------------------|---------|
| Purpose -----| Full state management --------------| Prop drilling avoidance |
| Updates -----| Selective subscribe (`useSelector`) | All consumers re-render on value change |
| DevTools ----| Yes --------------------------------| No |
| Middleware --| Yes --------------------------------| No |
| Boilerplate -| Higher (lower with RTK) ------------| Low |
| Best for ----| Complex global state, async --------| Theme, auth, low-frequency data |

### When would you avoid Redux?

- Small/medium apps with local + light context state.
- Server state handled by React Query / SWR (don't duplicate in Redux).
- State mostly component-local.
- Team overhead not worth it for simple CRUD UI.

**Rule:** start simple (useState + context); add Redux when pain is real (shared mutable state, complex flows, debugging needs).

---

## Quick Links

| Topic | Theory section | Code file |
|-------|----------------|-----------|
| JSX, Elements | §1 | `01-react-basics.js` |
| Virtual DOM, Diffing | §2 | `02-virtual-dom.js` |
| Fiber | §3 | `03-fiber.js` |
| Hooks | §4 | `04-hooks.js` |
| Rendering | §5 | `05-rendering.js` |
| Forms | §6 | `06-forms.js` |
| Advanced | §7 | `07-advanced-react.js` |
| Redux | §8 | `08-redux.js` |
