/* Events — Theory: THEORY.md §3
 * Bubbling: target → ancestors (default)
 * Capturing: document → target (addEventListener(..., true))
 * Delegation: one listener on parent, e.target for child
 */

// document.getElementById('list').addEventListener('click', (e) => {
//     if (e.target.matches('li')) handleItem(e.target);
// });
