/* =============================================================================
 * EVENT LOOP & ASYNC
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * Call Stack   → runs synchronous code (one thing at a time)
 *
 * MACROTASKS (Task Queue) — one per event loop tick
 *   setTimeout, setInterval, setImmediate (Node), I/O, UI events
 *
 * MICROTASKS (Microtask Queue) — ALL drained before the next macrotask
 *   Promise.then / catch / finally, queueMicrotask(), async/await
 *
 * ORDER (each tick):
 *   1. Run all sync code (call stack)
 *   2. Drain ALL microtasks (including ones added while draining)
 *   3. Run ONE macrotask
 *   4. Repeat from step 2
 *
 * MEMORY TRICK: Microtasks have higher priority — they always run before the next timer.
 * ============================================================================= */


// ─── 4.1 Sync vs setTimeout (macrotask) ─────────────────────────────────────

// console.log('A');
// setTimeout(() => console.log('B'), 0);
// console.log('C');
// console.log('D');

// Output: A → C → D → B
//
// setTimeout goes to the macrotask queue. Sync code (A, C, D) runs first while
// the call stack is busy. B runs only after the stack is empty.


// ─── 4.2 Promise (microtask) before setTimeout (macrotask) ──────────────────

// console.log('A');
// setTimeout(() => console.log('timeout'), 0);
// Promise.resolve().then(() => console.log('promise'));
// console.log('B');

// Output: A → B → promise → timeout
//
// Promise.then is a microtask. All microtasks run before any macrotask (setTimeout).


// ─── 4.3 queueMicrotask vs setTimeout ────────────────────────────────────────

// console.log('1-sync');
// queueMicrotask(() => console.log('2-micro'));
// setTimeout(() => console.log('3-macro'), 0);
// console.log('4-sync');

// Output: 1-sync → 4-sync → 2-micro → 3-macro
//
// queueMicrotask() is explicitly a microtask — same priority as Promise.then.


// ─── 4.4 Multiple microtasks drain before any macrotask ────────────────────

// console.log('start');
// setTimeout(() => console.log('timeout-1'), 0);
// setTimeout(() => console.log('timeout-2'), 0);
// Promise.resolve().then(() => console.log('promise-1'));
// Promise.resolve().then(() => console.log('promise-2'));
// queueMicrotask(() => console.log('microtask'));
// console.log('end');

// Output: start → end → promise-1 → promise-2 → microtask → timeout-1 → timeout-2
//
// ALL microtasks finish before ANY setTimeout callback runs, even if timers were
// scheduled first.


// ─── 4.5 Promise chain — each .then is a separate microtask ─────────────────

// Promise.resolve(1)
//     .then((val) => { console.log(val); return val + 1; })
//     .then((val) => console.log(val));
// console.log('sync');

// Output: sync → 1 → 2
//
// Each .then callback is scheduled as its own microtask. They run in order after
// sync code, but only after the previous .then completes.


// ─── 4.6 Microtask inside microtask — still before macrotask ────────────────

// console.log('A');
// setTimeout(() => console.log('macro'), 0);
// Promise.resolve().then(() => {
//     console.log('B');
//     Promise.resolve().then(() => console.log('C'));
// });
// Promise.resolve().then(() => console.log('D'));
// console.log('E');

// Output: A → E → B → D → C → macro
//
// EXPLANATION:
// Step 1 — Sync: A, E
// Step 2 — Microtask queue drains:
//   • First .then  → B (schedules C as a new microtask)
//   • Second .then → D
//   • C runs next  → C was added during drain, but still before any macrotask
// Step 3 — Macrotask: macro
//
// Rule: the microtask queue must fully empty before the next macrotask runs.


// ─── 4.7 setTimeout inside Promise ─────────────────────────────────────────

// console.log('1');
// setTimeout(() => console.log('2'), 0);
// Promise.resolve().then(() => {
//     console.log('3');
//     setTimeout(() => console.log('4'), 0);
// });
// Promise.resolve().then(() => console.log('5'));
// console.log('6');

// Output: 1 → 6 → 3 → 5 → 2 → 4
//
// EXPLANATION:
// Step 1 — Sync: 1, 6. setTimeout(2) is queued as macrotask.
// Step 2 — Microtasks: 3 runs (queues setTimeout 4), then 5 runs.
// Step 3 — Macrotasks in FIFO order: 2 was queued before 4, so 2 → 4.
//
// setTimeout inside a .then does NOT run immediately — it joins the macrotask
// queue after all current microtasks finish.


// ─── 4.8 async/await — await resumes as a microtask ────────────────────────

// async function foo() {
//     console.log('async-start');
//     await Promise.resolve();
//     console.log('async-after-await');
// }
// console.log('sync-start');
// foo();
// console.log('sync-end');

// Output: sync-start → async-start → sync-end → async-after-await
//
// Code before await runs synchronously. Code after await is scheduled as a
// microtask (same as .then). So sync-end runs before async-after-await.


// ─── 4.9 Full mix — classic interview puzzle ─────────────────────────────────

// console.log('script-start');
// setTimeout(() => console.log('setTimeout-1'), 0);
// Promise.resolve()
//     .then(() => {
//         console.log('promise-1');
//         setTimeout(() => console.log('setTimeout-2'), 0);
//     })
//     .then(() => console.log('promise-2'));
// setTimeout(() => console.log('setTimeout-3'), 0);
// Promise.resolve().then(() => console.log('promise-3'));
// console.log('script-end');


// Output:
// script-start
// script-end
// promise-1
// promise-2
// promise-3
// setTimeout-1
// setTimeout-3
// setTimeout-2
//
// EXPLANATION:
// Step 1 — Sync: script-start, script-end
// Step 2 — Microtasks (in order):
//   • promise-1 (from first .then; also queues setTimeout-2)
//   • promise-2 (chained .then from same Promise — runs after promise-1)
//   • promise-3 (separate Promise)
// Step 3 — Macrotasks (FIFO — order they were queued):
//   • setTimeout-1 (queued early)
//   • setTimeout-3 (queued before promise-1 ran)
//   • setTimeout-2 (queued inside promise-1 microtask — last in line)
