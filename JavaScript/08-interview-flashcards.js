/* =============================================================================
 * INTERVIEW FLASHCARDS
 * =============================================================================
 *
 *  1. What is closure?
 *     → Function that remembers variables from its lexical scope after outer fn returns.
 *
 *  2. What is hoisting?
 *     → Declarations processed before execution; var → undefined, let/const → TDZ.
 *
 *  3. What is TDZ?
 *     → Period between scope entry and let/const declaration where access throws ReferenceError.
 *
 *  4. var vs let vs const?
 *     → Scope, hoisting behavior, reassignment, and whether you must initialize.
 *
 *  5. Explain the event loop.
 *     → Sync stack first; drain microtasks; then one macrotask; repeat.
 *
 *  6. Promise.all vs allSettled vs race vs any?
 *     → See 05-promises.js cheat sheet.
 *
 *  7. call vs apply vs bind?
 *     → See 03-this-call-apply-bind.js cheat sheet.
 *
 *  8. Debounce vs throttle?
 *     → Debounce: wait for pause in events, then fire once (search input).
 *     → Throttle: fire at most once per interval (scroll, resize).
 *
 *  9. Shallow vs deep copy?
 *     → Shallow copies top level; nested objects still share references.
 *     → Deep copy recursively clones all nested values.
 *
 * 10. Arrow function vs regular function?
 *     → Arrow: no own this/arguments/new.target; cannot be constructor.
 *
 * 11. curry vs partial application?
 *     → Curry transforms fn into chained single-arg calls; partial fixes some args upfront.
 *
 * 12. compose vs pipe?
 *     → compose runs right-to-left; pipe runs left-to-right.
 *
 * 13. How does an LRU cache work?
 *     → Evict least recently used entry when capacity is exceeded; get/put mark item as recent.
 *
 * 14. Why use exponential backoff?
 *     → Spreads retries apart to let transient failures recover and avoid hammering a service.
 * ============================================================================= */


/* =============================================================================
 * CODING PRACTICE CHECKLIST
 * =============================================================================
 *
 *  [x] map, filter, reduce, forEach polyfills     → 06-array-methods.js
 *  [x] find, some, every, flat, reverse           → 06-array-methods.js
 *  [x] debounce, throttle                           → 07-utility-functions.js
 *  [x] deep copy, shallow copy                      → 07-utility-functions.js
 *  [x] Promise.all polyfill                         → 05-promises.js
 *  [x] Promise.allSettled / race / any polyfills    → 05-promises.js
 *  [x] flatten array, groupBy                        → 06-array-methods.js
 *  [x] memoize                                      → 07-utility-functions.js
 *  [x] counter using closure                        → 02-closures.js
 *  [x] curry, compose, pipe                         → 09-curry-compose-pipe.js
 *  [x] LRU cache                                    → 10-lru-cache.js
 *  [x] flatten object (nested keys → dot notation)  → 11-flatten-object.js
 *  [x] async retry with backoff                     → 12-async-retry-backoff.js
 * ============================================================================= */
