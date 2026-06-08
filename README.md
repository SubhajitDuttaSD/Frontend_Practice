# Learning

Personal notes and practice for frontend interviews — focused on JavaScript fundamentals, theory, and common coding patterns.

## Repository structure

```
Learning/
└── JavaScript/
    ├── THEORY.md                 Theory Q&A (concepts & interview answers)
    ├── interview-flashcards.js   Quick flashcards & practice checklist
    ├── index.js                  Entry point — loads all topics
    ├── _shared.js                Shared config (RUN_EXAMPLES toggle)
    ├── 01-scope-hoisting-tdz.js
    ├── 02-closures.js
    ├── 03-this-call-apply-bind.js
    ├── 04-event-loop.js
    ├── 05-promises.js
    ├── 06-array-methods.js
    ├── 07-utility-functions.js
    ├── 08-curry-compose-pipe.js
    ├── 09-lru-cache.js
    ├── 10-flatten-object.js
    └── 11-async-retry-backoff.js
```

## How to use

| Goal | Where to go |
|------|-------------|
| Understand concepts | [`JavaScript/THEORY.md`](JavaScript/THEORY.md) |
| Review quick Q&A | [`JavaScript/interview-flashcards.js`](JavaScript/interview-flashcards.js) |
| Study implementations | Numbered `01`–`11` files in [`JavaScript/`](JavaScript/) |
| Run all topics | `node JavaScript/index.js` |
| Run a single topic | `node JavaScript/02-closures.js` |

Set `RUN_EXAMPLES = true` in `JavaScript/_shared.js` to execute quiz snippets and demos.

## Topics covered

**Theory** — execution context, hoisting, TDZ, closures, event loop, objects, functions, async/Promises.

**Code** — polyfills (map, filter, reduce, …), `debounce` / `throttle`, `memoize`, `groupBy`, `curry` / `compose` / `pipe`, LRU cache, flatten object, async retry with backoff, and more.
