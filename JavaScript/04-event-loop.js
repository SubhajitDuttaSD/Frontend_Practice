/* =============================================================================
 * EVENT LOOP & ASYNC
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * Call Stack  → runs synchronous code (LIFO)
 * Web APIs    → setTimeout, fetch, DOM events (browser / libuv in Node)
 * Task Queue  → macrotasks (setTimeout, setInterval, I/O)
 * Microtask Q → Promise.then, queueMicrotask, MutationObserver
 *
 * Order: sync code → ALL microtasks → one macrotask → repeat
 * Microtasks always drain before the next macrotask.
 * ============================================================================= */

import { run } from './_shared.js';

run('4.1 setTimeout vs sync', () => {
    console.log('A');
    setTimeout(() => console.log('B'), 0);
    console.log('C');
    console.log('D');
    // A → C → D → B
});

run('4.2 microtask before macrotask', () => {
    console.log('A');
    setTimeout(() => console.log('timeout'), 0);
    Promise.resolve().then(() => console.log('promise'));
    console.log('B');
    // A → B → promise → timeout
});

run('4.3 promise chain', () => {
    Promise.resolve(1)
        .then((val) => { console.log(val); return val + 1; }) // 1
        .then((val) => console.log(val));                    // 2
});
