/* =============================================================================
 * LRU CACHE (Least Recently Used)
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * • Fixed capacity; evict least recently used item when full
 * • get(key)  — return value and mark as recently used
 * • put(key, value) — insert/update and mark as recently used
 * • Map preserves insertion order — delete + re-set moves entry to end (MRU)
 * • Evict from front (keys().next()) when over capacity
 *
 * Interview tip: O(1) get/put with Map; doubly-linked list + hash map is the
 * classic answer when they ask for a "proper" data-structure implementation.
 * ============================================================================= */

import { run } from './_shared.js';

export class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return undefined;

        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value); // move to most-recent end
        return value;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const lruKey = this.cache.keys().next().value;
            this.cache.delete(lruKey);
        }
        this.cache.set(key, value);
    }
}

run('9.1 LRU cache', () => {
    const cache = new LRUCache(2);

    cache.put('a', 1);
    cache.put('b', 2);
    console.log(cache.get('a')); // 1 — marks 'a' as recent

    cache.put('c', 3);           // evicts 'b' (least recently used)
    console.log(cache.get('b')); // undefined
    console.log(cache.get('c')); // 3
});
