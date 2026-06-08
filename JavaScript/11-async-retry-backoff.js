/* =============================================================================
 * ASYNC RETRY WITH EXPONENTIAL BACKOFF
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * • Retry a failing async fn up to N times before throwing
 * • Backoff: wait delay → delay * factor → delay * factor² … between attempts
 * • Use for flaky APIs, network blips, rate limits
 * • Always set a max retries cap to avoid infinite loops
 *
 * delay sequence example (delay=100, factor=2): 100ms → 200ms → 400ms
 * ============================================================================= */

import { run } from './_shared.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function retryWithBackoff(fn, options = {}) {
    const {
        retries = 3,
        delay = 1000,
        factor = 2,
        onRetry = null,
    } = options;

    let attempt = 0;
    let wait = delay;

    while (true) {
        try {
            return await fn();
        } catch (error) {
            attempt++;
            if (attempt > retries) throw error;

            if (onRetry) onRetry(error, attempt, wait);
            await sleep(wait);
            wait *= factor;
        }
    }
}

run('11.1 async retry with backoff', async () => {
    let calls = 0;

    const flakyFetch = async () => {
        calls++;
        if (calls < 3) throw new Error(`Attempt ${calls} failed`);
        return { data: 'success' };
    };

    const result = await retryWithBackoff(flakyFetch, {
        retries: 3,
        delay: 50,
        factor: 2,
        onRetry: (err, attempt, wait) => {
            console.log(`${err.message} — retrying in ${wait}ms (attempt ${attempt})`);
        },
    });

    console.log(result); // { data: 'success' }
    console.log(`Total calls: ${calls}`); // 3
});
