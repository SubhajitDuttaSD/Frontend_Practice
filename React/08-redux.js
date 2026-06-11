/* =============================================================================
 * REDUX & REDUX TOOLKIT
 * Theory: THEORY.md §8
 * =============================================================================
 *
 * CHEAT SHEET
 * ───────────
 * Store     → single state tree
 * Action    → { type, payload } plain object
 * Reducer   → pure (state, action) => newState
 * Dispatch  → send action to store
 * Flow:     UI → dispatch → reducer → new state → UI
 *
 * RTK: configureStore, createSlice, createAsyncThunk
 * ============================================================================= */

// ─── Classic Redux flow ──────────────────────────────────────────────────────
//
// const action = { type: 'counter/increment' };
// dispatch(action);
// const newState = reducer(state, action);
// subscribers re-render (useSelector)

// ─── Pure reducer example ────────────────────────────────────────────────────

// function counterReducer(state = { count: 0 }, action) {
//     switch (action.type) {
//         case 'increment':
//             return { ...state, count: state.count + 1 }; // no mutation
//         default:
//             return state;
//     }
// }

// ─── Redux Toolkit createSlice ───────────────────────────────────────────────

// const counterSlice = createSlice({
//     name: 'counter',
//     initialState: { value: 0 },
//     reducers: {
//         increment(state) { state.value += 1; }, // Immer allows "mutation"
//     },
// });
// dispatch(counterSlice.actions.increment());

// ─── createAsyncThunk ────────────────────────────────────────────────────────

// const fetchUser = createAsyncThunk('users/fetch', async (userId) => {
//     const res = await api.getUser(userId);
//     return res.data;
// });
// // auto-dispatches: users/fetch/pending, fulfilled, rejected

// ─── Redux vs Context ────────────────────────────────────────────────────────
//
// Redux:     complex global state, middleware, DevTools, selective subscribe
// Context:   theme, locale, auth — low-frequency, avoid frequent updates
