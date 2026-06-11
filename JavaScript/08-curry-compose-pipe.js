/* =============================================================================
 * CURRY, COMPOSE & PIPE
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * curry   — transform f(a, b, c) into f(a)(b)(c); partial application
 * compose — combine fns right-to-left: compose(f, g)(x) === f(g(x))
 * pipe    — combine fns left-to-right:  pipe(f, g)(x) === g(f(x))
 *
 * Use cases: reusable pipelines, config-driven transforms, functional style
 * ============================================================================= */

import { run } from './_shared.js';

/**
 * Curries a function — collect args until fn.length is reached, then invoke.
 *
 * add(1)(2)(3)  →  wait → wait → call add(1, 2, 3)
 */
export function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args); // all args ready
        }
        return (...more) => curried(...args, ...more); // wait for more args
    };
}

/** Applies functions right-to-left */
export function compose(...fns) {
    return (value) => fns.reduceRight((acc, fn) => fn(acc), value);
}

/** Applies functions left-to-right */
export function pipe(...fns) {
    return (value) => fns.reduce((acc, fn) => fn(acc), value);
}

run('8.1 curry', () => {
    const add = (a, b, c) => a + b + c;
    const curriedAdd = curry(add);

    console.log(curriedAdd(1)(2)(3));    // 6
    console.log(curriedAdd(1, 2)(3));    // 6
    console.log(curriedAdd(1)(2, 3));    // 6
});

run('8.2 compose vs pipe', () => {
    const double = (x) => x * 2;
    const increment = (x) => x + 1;

  // compose: increment(double(5)) → 11
    console.log(compose(increment, double)(5)); // 11

  // pipe: double(increment(5)) → 12
    console.log(pipe(increment, double)(5));    // 12
});
