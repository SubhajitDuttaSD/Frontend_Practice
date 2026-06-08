# JavaScript Theory — Interview Answers

Quick-reference theory guide. For runnable examples, see the numbered topic files (`01`–`11`) and `interview-flashcards.js`.

---

## Table of Contents

1. [Execution Context](#1-execution-context)
2. [Hoisting](#2-hoisting)
3. [Scope & Closures](#3-scope--closures)
4. [Event Loop](#4-event-loop)
5. [Objects](#5-objects)
6. [Functions](#6-functions)
7. [Async JavaScript](#7-async-javascript)

---

## 1. Execution Context

### What happens when a JavaScript program starts executing?

1. The JavaScript engine creates a **Global Execution Context (GEC)**.
2. Memory is allocated for variables and functions (creation phase).
3. Code runs line by line in the **execution phase**.
4. Each function call creates a new **Function Execution Context** and pushes it onto the **Call Stack**.
5. When a context finishes, it is popped off the stack. Async work is handed to Web APIs / libuv and handled later via the **Event Loop**.

### What is the Execution Context?

An **Execution Context** is the environment in which JavaScript code is evaluated and executed. It contains:

- **Variable Environment** — `var`, function declarations, and `let`/`const` bindings
- **`this` binding** — determined by how the function is called
- **Outer Environment link** — reference to the parent scope (for scope chain / closures)
- **Code evaluation** — running the actual statements

Types: **Global Execution Context** (one per program) and **Function Execution Context** (one per function invocation).

### What is the Call Stack?

The **Call Stack** is a LIFO stack that tracks which function is currently running.

- When a function is called → its execution context is **pushed** onto the stack.
- When a function returns → its context is **popped** off.
- Only the function at the **top** of the stack runs at any moment.
- A stack overflow occurs when calls exceed the maximum stack size (e.g. infinite recursion).

### How does JavaScript execute code line by line?

JavaScript is **single-threaded** — one call stack, one thing at a time.

1. **Parse** source into an AST.
2. **Compile** (JIT) and create execution context(s).
3. **Creation phase** — allocate memory, hoist declarations, set up scope chain and `this`.
4. **Execution phase** — run statements top to bottom; function calls create new contexts on the stack.
5. Async callbacks (`setTimeout`, Promises) are delegated and run later when the stack is clear.

### What is the Global Execution Context?

The **Global Execution Context** is created when a script first runs.

- In browsers: `window` is the global object; top-level `this` is `window`.
- In Node.js: `global` is the global object.
- Variables declared with `var` at the top level become properties of the global object.
- `let`/`const` at the top level are global but **not** attached to the global object.

---

## 2. Hoisting

### What is hoisting?

**Hoisting** is JavaScript's behavior of processing declarations during the **creation phase** before line-by-line execution.

| Declaration            | Hoisted? | Initial value at hoist |
|------------------------|----------|-------------------------|
| `var`                  | Yes      | `undefined`             |
| `let` / `const`        | Yes      | TDZ (uninitialized)     |
| Function declaration   | Yes      | Full function body      |
| Function expression    | No*      | `var` part only → `undefined` |

\*If assigned to `var`, the variable name is hoisted as `undefined`; the function value is assigned at the assignment line.

```js
console.log(foo); // undefined
var foo = 10;

console.log(bar); // ReferenceError (TDZ)
let bar = 10;
```

**Code:** `01-scope-hoisting-tdz.js`

### Why does `var` return `undefined`?

`var` declarations are hoisted and **initialized to `undefined`** during the creation phase. The assignment happens later in the execution phase.

```js
console.log(a); // undefined — declared but not yet assigned
var a = 10;
console.log(a); // 10
```

### What is the Temporal Dead Zone (TDZ)?

The **TDZ** is the period between entering a scope and the actual `let`/`const` declaration line. The binding exists but is **uninitialized** — accessing it throws a `ReferenceError`.

```js
{
  // TDZ for `x` starts here
  // console.log(x); // ReferenceError
  let x = 5;        // TDZ ends
}
```

### Why are `let` and `const` different from `var`?

| Feature        | `var`              | `let`           | `const`              |
|----------------|--------------------|-----------------|----------------------|
| Scope          | Function           | Block           | Block                |
| Hoist value    | `undefined`        | TDZ             | TDZ                  |
| Reassignment   | Yes                | Yes             | No (binding frozen)  |
| Re-declaration | Yes (same scope)   | No              | No                   |
| Must initialize| No                 | No              | Yes                  |

`const` prevents **reassigning the binding** — for objects, properties can still be mutated unless the object is frozen.

### Are function expressions hoisted?

**No** — only the variable name is hoisted (if declared with `var`), not the function value.

```js
foo(); // Works — full function is hoisted
function foo() {}

bar(); // TypeError: bar is not a function (bar is undefined)
var bar = function () {};
```

---

## 3. Scope & Closures

### What is lexical scope?

**Lexical scope** (static scope) means a function's scope is determined by **where it is written** in the source code, not where it is called. Inner functions can access variables from outer scopes; outer scopes cannot access inner variables.

```js
let a = 10;
function outer() {
  let b = 20;
  function inner() {
    console.log(a, b); // 10, 20 — lexical access
  }
  inner();
}
```

### What is a closure?

A **closure** is a function bundled together with its **lexical environment** — it remembers variables from the scope where it was created, even after the outer function has returned.

```js
function outer() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
const counter = outer();
counter(); // 1
counter(); // 2
```

**Code:** `02-closures.js`

### Why are closures useful?

- **Data privacy** — hide state (counters, module pattern)
- **Factory functions** — create configured objects/functions
- **Event handlers** — retain context and state across callbacks
- **Partial application / currying** — fix some arguments for later
- **Memoization** — cache results in a closed-over `Map`

### Can closures cause memory leaks?

**Yes**, in some cases:

- A closure holds references to outer variables → those values stay in memory as long as the closure is reachable.
- Common leak: attaching closures to DOM nodes that are removed but still referenced elsewhere.
- Long-lived callbacks (intervals, global event listeners) that close over large objects.

**Fix:** null out references when done, remove listeners, avoid unnecessary closures in hot paths.

### Real-world examples of closures?

| Use case              | Example                                      |
|-----------------------|----------------------------------------------|
| Module pattern        | Private variables via IIFE + returned API    |
| `createCounter()`     | Encapsulated increment/decrement             |
| `debounce` / `throttle` | Closed-over `timeoutId` / `lastCall`       |
| `memoize`             | Closed-over `cache` Map                      |
| React hooks           | State retained across re-renders             |
| `once()` helper       | Run a function only on first call            |

---

## 4. Event Loop

### Explain the Event Loop.

The **Event Loop** lets JavaScript handle async work on a single thread:

1. Run **synchronous** code on the **Call Stack**.
2. When the stack is empty, process **all microtasks** (Promise callbacks, `queueMicrotask`).
3. Then pick **one macrotask** (`setTimeout`, I/O, UI events) and run it.
4. Repeat.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Call Stack │ ←── │  Event Loop  │ ──→ │  Microtask Queue │
└─────────────┘     └──────────────┘     └─────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Macrotask Q  │
                    └──────────────┘
```

**Code:** `04-event-loop.js`

### What are microtasks?

**Microtasks** are high-priority async callbacks scheduled after the current script completes but **before** the next macrotask.

Examples: `Promise.then/catch/finally`, `queueMicrotask()`, `MutationObserver`.

All microtasks in the queue are drained before the event loop moves to macrotasks.

### What are macrotasks?

**Macrotasks** (task queue) are lower-priority async work scheduled for the next event loop tick.

Examples: `setTimeout`, `setInterval`, I/O callbacks, `setImmediate` (Node), UI rendering events.

### Why does `Promise` execute before `setTimeout`?

`Promise.then` schedules a **microtask**. `setTimeout` schedules a **macrotask**.

Order after sync code: **all microtasks first** → then one macrotask.

```js
console.log('A');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('B');
// A → B → promise → timeout
```

### Explain async execution in JavaScript.

JavaScript itself runs **synchronously** on one thread. Async behavior comes from:

1. **Web APIs / Node libuv** — handle timers, network, file I/O off the main thread.
2. **Callbacks** placed in task/microtask queues when work completes.
3. **Event Loop** — picks queued callbacks when the call stack is empty.

`async/await` is syntactic sugar over Promises — `await` pauses the async function and resumes via a microtask when the Promise settles.

---

## 5. Objects

### Difference between `Object` and `Map`?

| Feature           | `Object`                    | `Map`                          |
|-------------------|-----------------------------|--------------------------------|
| Keys              | Strings or Symbols          | Any type (objects, primitives) |
| Key order         | Mostly insertion (with caveats) | Guaranteed insertion order   |
| Size              | Manual (`Object.keys`)      | `.size` property               |
| Default prototype | `Object.prototype`          | No keys by default             |
| Iteration         | `for...in` / `Object.entries` | Built-in iterator `.forEach` |
| Performance       | Fine for records/DTOs       | Better for frequent add/delete |
| JSON              | Native `JSON.stringify`     | Not directly serializable      |

Use **Object** for structured records. Use **Map** when keys are non-strings or you need frequent key lookups with arbitrary types.

### Difference between `Set` and `Array`?

| Feature        | `Array`              | `Set`                    |
|----------------|----------------------|--------------------------|
| Duplicates     | Allowed              | Not allowed (unique values)|
| Index access   | `arr[i]` — O(1)      | No index — use iteration |
| Order          | Insertion order      | Insertion order          |
| Use case       | Ordered lists        | Unique collection, fast `.has()` |
| Methods        | `map`, `filter`, etc.| `add`, `delete`, `has`   |

`Set` is ideal for deduplication and membership checks (`O(1)` average).

### What is shallow copy?

A **shallow copy** duplicates the **top level** only. Nested objects/arrays still **share references** with the original.

```js
const original = { a: 1, nested: { b: 2 } };
const copy = { ...original };

copy.nested.b = 99;
console.log(original.nested.b); // 99 — same nested reference
```

Methods: spread `{...obj}`, `Object.assign()`, `[...arr]`.

**Code:** `07-utility-functions.js`

### What is deep copy?

A **deep copy** recursively clones **all nested** values so the copy is fully independent.

```js
const copy = structuredClone(original); // modern built-in
// or custom recursive clone / JSON.parse(JSON.stringify()) with limitations
```

`JSON` approach fails for `Date`, `Map`, `Set`, functions, `undefined`, and circular references.

### Difference between `Object.freeze()` and `Object.seal()`?

| Method            | Can add keys? | Can delete keys? | Can modify values? |
|-------------------|---------------|------------------|--------------------|
| `Object.seal()`   | No            | No               | Yes                |
| `Object.freeze()` | No            | No               | No (shallow)       |

Both are **shallow** — nested objects can still be mutated unless frozen recursively.

```js
const obj = { a: 1, nested: { b: 2 } };
Object.freeze(obj);
obj.a = 99;           // silently fails (or throws in strict mode)
obj.nested.b = 99;    // works — nested not frozen
```

---

## 6. Functions

### Difference between function declaration and function expression?

|                        | Declaration `function foo() {}` | Expression `const foo = function () {}` |
|------------------------|---------------------------------|-------------------------------------------|
| Hoisting               | Fully hoisted                   | Variable hoisted only (`undefined`)       |
| Can call before line   | Yes                             | No                                        |
| Name in stack traces   | Always named                    | Anonymous unless named expression         |

```js
declared(); // OK
function declared() {}

expressed(); // TypeError
const expressed = function () {};
```

### Difference between normal and arrow functions?

| Feature           | Regular function     | Arrow function          |
|-------------------|----------------------|-------------------------|
| `this`            | Dynamic (call site)  | Lexical (from enclosing scope) |
| `arguments`       | Yes                  | No (use rest `...args`) |
| `new` / constructor | Yes                | No                      |
| `prototype`       | Yes                  | No                      |
| Method syntax     | `obj.method()`       | Poor choice for object methods needing `this` |

**Code:** `03-this-call-apply-bind.js`

### Explain `this`.

`this` is the **execution context object** — determined by **how** a function is called:

| Call style                  | `this` value                    |
|-----------------------------|---------------------------------|
| `obj.method()`              | `obj`                           |
| Plain call `fn()`           | `undefined` (strict) / `global` |
| `new Fn()`                  | Newly created instance          |
| `fn.call(ctx, ...)`         | `ctx`                           |
| Arrow function              | Lexical `this` from outer scope |

### Explain `call`, `apply`, and `bind`.

All three control the `this` value of a function.

| Method   | Invokes immediately? | Arguments        | Returns              |
|----------|----------------------|------------------|----------------------|
| `.call()`  | Yes                | Comma-separated  | Function return value |
| `.apply()` | Yes                | Array of args    | Function return value |
| `.bind()`  | No                 | Partial args OK  | New bound function   |

```js
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}
const person = { name: 'John' };

greet.call(person, 'Hello');
greet.apply(person, ['Hello']);
greet.bind(person)('Hello');
```

**Code:** `03-this-call-apply-bind.js`

### What is currying?

**Currying** transforms a function that takes multiple arguments into a sequence of functions each taking **one** argument (or fewer arguments at a time).

```js
const add = (a, b, c) => a + b + c;
const curriedAdd = (a) => (b) => (c) => a + b + c;

curriedAdd(1)(2)(3); // 6
```

Enables partial application and reusable specialized functions.

**Code:** `08-curry-compose-pipe.js`

---

## 7. Async JavaScript

### What is a Promise?

A **Promise** is an object representing the eventual result of an async operation.

- Starts pending.
- Settles once as **fulfilled** (with a value) or **rejected** (with a reason).
- `.then()` / `.catch()` / `.finally()` register callbacks for settlement.

Promises help avoid callback hell and provide a standard model for async composition.

### Promise states?

| State        | Meaning                          |
|--------------|----------------------------------|
| `pending`    | Initial — not yet settled        |
| `fulfilled`  | Operation succeeded with a value |
| `rejected`   | Operation failed with a reason   |

Once fulfilled or rejected, a Promise is **immutable** — state cannot change again.

### Difference between `Promise.all` and `Promise.allSettled`?

|                  | `Promise.all`                    | `Promise.allSettled`              |
|------------------|----------------------------------|-----------------------------------|
| Resolves when    | All promises resolve             | All promises settle (any outcome) |
| Rejects when     | Any promise rejects (immediate)  | Never rejects                     |
| Result           | Array of values                  | `[{status, value/reason}, ...]`   |
| Use case         | All must succeed                 | Need every outcome regardless   |

```js
// all — fails fast
await Promise.all([p1, p2, p3]);

// allSettled — always wait for all
const results = await Promise.allSettled([p1, p2, p3]);
```

**Code:** `05-promises.js`

### Difference between `Promise.any` and `Promise.race`?

|                  | `Promise.race`              | `Promise.any`                        |
|------------------|-----------------------------|--------------------------------------|
| Wins on          | First **settle** (resolve or reject) | First **resolve** only        |
| Rejects when     | First rejection             | All promises reject (`AggregateError`) |
| Use case         | Timeout patterns            | First successful response (fallback)   |

```js
Promise.race([slow, fast]);     // first to finish — reject or resolve
Promise.any([api1, api2, api3]); // first success; ignore rejections until all fail
```

### What is `async/await` internally?

`async/await` is **syntactic sugar** over Promises:

- An `async` function **always returns a Promise**.
- `await` pauses execution inside the async function until the Promise settles.
- On resolve → execution resumes with the value.
- On reject → throws inside the async function (catchable with `try/catch`).

Roughly equivalent:

```js
async function fetchData() {
  const res = await fetch('/api');
  return res.json();
}

// Similar to:
function fetchData() {
  return fetch('/api').then((res) => res.json());
}
```

The engine transforms `await` into Promise `.then()` chains via the microtask queue — no true multi-thread blocking.

**Code:** `04-event-loop.js`, `05-promises.js`, `11-async-retry-backoff.js`

---

## Quick Links

| Topic              | Theory section | Code file                    |
|--------------------|----------------|------------------------------|
| Hoisting / TDZ     | §2             | `01-scope-hoisting-tdz.js`   |
| Closures           | §3             | `02-closures.js`             |
| call / apply / bind| §6             | `03-this-call-apply-bind.js` |
| Event Loop         | §4             | `04-event-loop.js`           |
| Promises           | §7             | `05-promises.js`             |
| Array methods      | —              | `06-array-methods.js`        |
| Utilities          | §5             | `07-utility-functions.js`    |
| Curry / compose    | §6             | `08-curry-compose-pipe.js`   |
| Flashcards         | —              | `interview-flashcards.js`    |
