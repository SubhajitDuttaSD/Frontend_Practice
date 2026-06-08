/** Set to true to run examples when executing a topic file or index.js */
export const RUN_EXAMPLES = false;

export function run(label, fn) {
    if (!RUN_EXAMPLES) return;
    console.log(`\n--- ${label} ---`);
    const result = fn();
    return result?.then?.();
}
