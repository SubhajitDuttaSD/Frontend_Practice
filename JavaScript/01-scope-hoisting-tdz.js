/* =============================================================================
 * SCOPE, HOISTING & TDZ
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * • var   — function-scoped, hoisted (initialized as undefined), reassignable
 * • let   — block-scoped, hoisted but in TDZ until declaration, reassignable
 * • const — block-scoped, hoisted but in TDZ, must init, no reassignment
 * • TDZ   — Temporal Dead Zone: let/const exist but cannot be accessed before
 *           their declaration line (ReferenceError)
 * • Hoisting — declarations moved to top of scope during compilation phase
 * ============================================================================= */

import { run } from './_shared.js';

run('1.1 var hoisting', () => {
    console.log(a); // undefined (hoisted, not initialized yet)
    var a = 10;
    console.log(a); // 10
});

run('1.2 let TDZ', () => {
    // console.log(a); // ReferenceError: Cannot access 'a' before initialization
    let a = 10;
    console.log(a); // 10
});

run('1.3 const TDZ', () => {
    // console.log(a); // ReferenceError
    const a = 10;
    console.log(a); // 10
});

run('1.4 function scope + var shadowing', () => {
    var a = 10;
    function test() {
        console.log(a); // undefined — local `a` is hoisted, shadows outer
        var a = 20;
    }
    test();
});

run('1.5 block scope', () => {
    let a = 10;
    {
        let a = 20;
        console.log(a); // 20 — inner block
    }
    console.log(a); // 10 — outer scope
});
