/* =============================================================================
 * this — CALL, APPLY, BIND
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * Method          | Invokes now? | Args format        | Returns
 * ────────────────|──────────────|────────────────────|──────────────────
 * fn.call(ctx, a) | Yes          | comma-separated    | fn's return value
 * fn.apply(ctx)   | Yes          | array of args      | fn's return value
 * fn.bind(ctx)    | No           | partial args OK    | new bound function
 *
 * Arrow functions — no own `this`; inherit from enclosing lexical scope
 * ============================================================================= */

import { run } from './_shared.js';

export function greet(greeting = 'Hello') {
    console.log(`${greeting}, ${this.name}`);
}

run('3.1 call / apply / bind', () => {
    const person = { name: 'John' };
    greet.call(person);       // Hello, John
    greet.apply(person);      // Hello, John
    greet.bind(person)('Hi'); // Hi, John
});

run('3.2 arrow vs regular method', () => {
    const obj3 = {
        name: 'John',
        show() { console.log(this.name); }, // John
    };
    obj3.show();

    const obj4 = {
        name: 'Jane',
        show: () => console.log(this?.name), // undefined (lexical this)
    };
    obj4.show();
});

run('3.3 setTimeout with bind', () => {
    const user = {
        name: 'John',
        show() {
            console.log(this?.name ?? 'undefined (lost this)');
        },
    };

    user.show();                            // John — direct call, this = user
    setTimeout(user.show, 0);               // undefined (lost this) — passed as bare callback
    setTimeout(user.show.bind(user), 0);    // John — bind locks this to user
});
