/* =============================================================================
 * ARRAY METHODS & POLYFILLS
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * map       — transform each element → new array (same length)
 * filter    — keep elements where cb returns truthy
 * reduce    — accumulate to single value
 * forEach   — run cb on each element (no return value)
 * find      — first match or undefined
 * findIndex — index of first match or -1
 * includes  — array contains value? (boolean)
 * some      — any element matches?
 * every     — all elements match?
 * flat      — flatten nested arrays to given depth
 * reverse   — new array with elements reversed (this polyfill does not mutate)
 * flatten   — standalone flatten helper
 * groupBy   — group items into object by key
 * ============================================================================= */


// ─── map — transform each element ────────────────────────────────────────────

const mapArr = [1, 2, 3, 4, 5];

const mapped = mapArr.map((item, index) => ({
    item: item + 1,
    index,
}));

console.log('map:', mapped);
// map: [ { item: 2, index: 0 }, { item: 3, index: 1 }, ... ]

Array.prototype.myMap = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
    }
    return result;
};


// ─── filter — keep matching elements ─────────────────────────────────────────

const filterArr = [1, 2, 3, 4, 5, 6];

const evens = filterArr.filter((n) => n % 2 === 0);

console.log('filter:', evens);
// filter: [2, 4, 6]

Array.prototype.myFilter = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) result.push(this[i]);
    }
    return result;
};


// ─── reduce — accumulate to one value ────────────────────────────────────────

const reduceArr = [1, 2, 3, 4];

const sum = reduceArr.reduce((acc, n) => acc + n, 0);
const max = reduceArr.reduce((acc, n) => (n > acc ? n : acc));

console.log('reduce sum:', sum);   // reduce sum: 10
console.log('reduce max:', max);   // reduce max: 4

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


// ─── forEach — side effects, returns undefined ───────────────────────────────

const forEachArr = [1, 2, 3];
const doubled = [];

forEachArr.forEach((n, i) => {
    doubled.push(n * 2);
});

console.log('forEach:', doubled);
// forEach: [2, 4, 6]

Array.prototype.myForEach = function (callback) {
    for (let i = 0; i < this.length; i++) callback(this[i], i, this);
};


// ─── find — first matching element ───────────────────────────────────────────

const users = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
    { id: 3, name: 'Charlie', active: true },
];

const firstActive = users.find((user) => user.active);

console.log('find:', firstActive);
// find: { id: 1, name: 'Alice', active: true }

Array.prototype.myFind = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) return this[i];
    }
    return undefined;
};


// ─── findIndex — index of first match ────────────────────────────────────────

const inactiveIndex = users.findIndex((user) => !user.active);

console.log('findIndex:', inactiveIndex);
// findIndex: 1

Array.prototype.myFindIndex = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) return i;
    }
    return -1;
};


// ─── includes — check if value exists ────────────────────────────────────────

const fruits = ['apple', 'banana', 'mango'];

console.log('includes:', fruits.includes('banana'));  // includes: true
console.log('includes:', fruits.includes('grape'));   // includes: false

Array.prototype.myIncludes = function (value) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === value) return true;
    }
    return false;
};


// ─── some — at least one match? ──────────────────────────────────────────────

const ages = [12, 16, 21, 25];

console.log('some:', ages.some((age) => age >= 18));  // some: true

Array.prototype.mySome = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) return true;
    }
    return false;
};


// ─── every — all match? ──────────────────────────────────────────────────────

const scores = [80, 90, 75, 88];

console.log('every:', scores.every((s) => s >= 60));  // every: true
console.log('every:', scores.every((s) => s >= 80));  // every: false

Array.prototype.myEvery = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (!callback(this[i], i, this)) return false;
    }
    return true;
};


// ─── flat — flatten nested arrays ────────────────────────────────────────────

const nested = [1, [2, 3], [4, [5, 6]]];

console.log('flat(1):', nested.flat(1));  // flat(1): [1, 2, 3, 4, [5, 6]]
console.log('flat(2):', nested.flat(2));  // flat(2): [1, 2, 3, 4, 5, 6]

Array.prototype.myFlat = function (depth = 1) {
    if (depth < 1) return this.slice();
    return this.reduce((acc, val) => {
        if (Array.isArray(val)) acc.push(...val.myFlat(depth - 1));
        else acc.push(val);
        return acc;
    }, []);
};


// ─── reverse — reversed copy (polyfill does not mutate original) ───────────────

const reverseArr = [1, 2, 3, 4];

console.log('reverse:', [...reverseArr].reverse());
// reverse: [4, 3, 2, 1]

Array.prototype.myReverse = function () {
    const result = [];
    for (let i = this.length - 1; i >= 0; i--) result.push(this[i]);
    return result;
};


// ─── flatten — standalone recursive flatten ──────────────────────────────────

const deepNested = [1, [2, [3, 4]], 5];

console.log('flatten:', flatten(deepNested));
// flatten: [1, 2, 3, 4, 5]

export function flatten(arr, depth = Infinity) {
    return depth <= 0 ? arr.slice() : arr.reduce(
        (acc, val) => acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val),
        []
    );
}


// ─── groupBy — group objects by property or key function ─────────────────────

const people = [
    { name: 'Alice', dept: 'Engineering' },
    { name: 'Bob', dept: 'Design' },
    { name: 'Charlie', dept: 'Engineering' },
];

console.log('groupBy:', groupBy(people, 'dept'));
// groupBy: {
//   Engineering: [{ name: 'Alice', ... }, { name: 'Charlie', ... }],
//   Design: [{ name: 'Bob', ... }]
// }

export function groupBy(arr, keyFn) {
    return arr.reduce((groups, item) => {
        const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
        (groups[key] ??= []).push(item);
        return groups;
    }, {});
}
