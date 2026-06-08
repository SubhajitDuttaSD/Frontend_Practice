/* =============================================================================
 * PROMISES
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * Promise.all        — all resolve → array of results; any reject → immediate reject
 * Promise.allSettled — wait for all; never rejects; [{status, value|reason}]
 * Promise.race       — first settle (resolve OR reject) wins
 * Promise.any        — first resolve wins; rejects only if ALL reject (AggregateError)
 * ============================================================================= */

export function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!promises.length) return resolve([]);
        const results = new Array(promises.length);
        let settled = 0;
        promises.forEach((p, i) => {
            Promise.resolve(p).then(
                (val) => {
                    results[i] = val;
                    if (++settled === promises.length) resolve(results);
                },
                reject
            );
        });
    });
}

export function promiseAllSettled(promises) {
    return Promise.all(
        promises.map((p) =>
            Promise.resolve(p).then(
                (value) => ({ status: 'fulfilled', value }),
                (reason) => ({ status: 'rejected', reason })
            )
        )
    );
}

export function promiseRace(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach((p) => Promise.resolve(p).then(resolve, reject));
    });
}

export function promiseAny(promises) {
    return new Promise((resolve, reject) => {
        const errors = [];
        let rejected = 0;
        if (!promises.length) {
            reject(new AggregateError([], 'All promises were rejected'));
            return;
        }
        promises.forEach((p, i) => {
            Promise.resolve(p).then(
                resolve,
                (err) => {
                    errors[i] = err;
                    if (++rejected === promises.length) {
                        reject(new AggregateError(errors, 'All promises were rejected'));
                    }
                }
            );
        });
    });
}
