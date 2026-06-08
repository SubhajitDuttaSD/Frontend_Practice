/* =============================================================================
 * UTILITY FUNCTIONS
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * debounce  — wait for pause in events, then fire once (search input)
 * throttle  — fire at most once per interval (scroll, resize)
 * memoize   — cache function results by arguments
 * shallow   — copies top level; nested objects share references
 * deep copy — recursively clones all nested values
 * ============================================================================= */

import { run } from './_shared.js';

export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

export function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

export function memoize(fn) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

export function shallowCopy(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return [...obj];
    return { ...obj };
}

export function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(deepCopy);
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, deepCopy(v)])
    );
}

run('7.1 deep vs shallow copy', () => {
    const original = { name: 'John', address: { city: 'New York' } };

    const deep = deepCopy(original);
    deep.address.city = 'Los Angeles';
    console.log(original.address.city); // New York
    console.log(deep.address.city);   // Los Angeles

    const shallow = shallowCopy(original);
    shallow.address.city = 'Chicago';
    console.log(original.address.city); // Chicago (nested ref shared)
    console.log(shallow.address.city);  // Chicago
});
