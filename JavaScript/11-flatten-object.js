/* =============================================================================
 * FLATTEN OBJECT (nested keys → dot notation)
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * Input:  { a: 1, b: { c: 2, d: { e: 3 } } }
 * Output: { 'a': 1, 'b.c': 2, 'b.d.e': 3 }
 *
 * • Recurse into plain objects only (skip arrays unless you want bracket notation)
 * • Build key path with prefix + '.' + key
 * • Base case: non-object values assigned directly
 * ============================================================================= */

import { run } from './_shared.js';

export function flattenObject(obj, prefix = '', result = {}) {
    for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            flattenObject(value, path, result);
        } else {
            result[path] = value;
        }
    }
    return result;
}

run('11.1 flatten object', () => {
    const nested = {
        a: 1,
        b: {
            c: 2,
            d: { e: 3 },
        },
        f: [1, 2],
    };

    console.log(flattenObject(nested));
    // { a: 1, 'b.c': 2, 'b.d.e': 3, f: [1, 2] }
});
