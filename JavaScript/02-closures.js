/* =============================================================================
 * CLOSURES
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * • Closure = function + lexical environment it was created in
 * • Inner function retains access to outer variables even after outer returns
 * • Use cases: data privacy, factories, event handlers, partial application
 * ============================================================================= */

import { run } from './_shared.js';

run('2.1 basic closure', () => {
    function outer() {
        let count = 0;
        return function () {
            count++;
            console.log(count); // 1, 2, 3
        };
    }
    const inner = outer();
    inner();
    inner();
    inner();
});

/** Counter factory — classic closure interview question */
export function createCounter(initial = 0) {
    let count = initial;
    return {
        increment() { return ++count; },
        decrement() { return --count; },
        getCount() { return count; },
    };
}

run('2.2 createCounter', () => {
    const counter = createCounter();
    console.log(counter.increment()); // 1
    console.log(counter.increment()); // 2
    console.log(counter.decrement()); // 1
    console.log(counter.getCount());  // 1
});
