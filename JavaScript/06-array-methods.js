/* =============================================================================
 * ARRAY METHODS & POLYFILLS
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * map     — transform each element → new array (same length)
 * filter  — keep elements where cb returns truthy
 * reduce  — accumulate to single value
 * find    — first match or undefined
 * some    — any match?
 * every   — all match?
 * flat    — flatten nested arrays to given depth
 * ============================================================================= */

Array.prototype.myMap = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
    }
    return result;
};

Array.prototype.myFilter = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) result.push(this[i]);
    }
    return result;
};

Array.prototype.myReduce = function (callback, initialValue) {
    let start = 0;
    let accumulator = initialValue;
    if (accumulator === undefined) {
        if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value');
        accumulator = this[0];
        start = 1;
    }
    for (let i = start; i < this.length; i++) {
        accumulator = callback(accumulator, this[i], i, this);
    }
    return accumulator;
};

Array.prototype.myForEach = function (callback) {
    for (let i = 0; i < this.length; i++) callback(this[i], i, this);
};

Array.prototype.myFind = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) return this[i];
    }
    return undefined;
};

Array.prototype.myFindIndex = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) return i;
    }
    return -1;
};

Array.prototype.myIncludes = function (value) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === value) return true;
    }
    return false;
};

Array.prototype.mySome = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) return true;
    }
    return false;
};

Array.prototype.myEvery = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (!callback(this[i], i, this)) return false;
    }
    return true;
};

Array.prototype.myFlat = function (depth = 1) {
    if (depth < 1) return this.slice();
    return this.reduce((acc, val) => {
        if (Array.isArray(val)) acc.push(...val.myFlat(depth - 1));
        else acc.push(val);
        return acc;
    }, []);
};

Array.prototype.myReverse = function () {
    const result = [];
    for (let i = this.length - 1; i >= 0; i--) result.push(this[i]);
    return result;
};

/** Flatten array — alternative to myFlat polyfill */
export function flatten(arr, depth = Infinity) {
    return depth <= 0 ? arr.slice() : arr.reduce(
        (acc, val) => acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val),
        []
    );
}

/** Group array items by key derived from callback or property name */
export function groupBy(arr, keyFn) {
    return arr.reduce((groups, item) => {
        const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
        (groups[key] ??= []).push(item);
        return groups;
    }, {});
}
