# Browser Theory — Interview Answers (Tier 4)

Detailed Q&A for how the browser works, DOM/BOM, events, storage, and CORS.

---

## Table of Contents

1. [URL to Page Load](#1-what-happens-when-a-url-is-entered-in-the-browser)
2. [DOM & BOM](#2-what-is-dom)
3. [Events — Bubbling, Capturing, Delegation](#3-event-bubbling)
4. [Web Storage — localStorage, sessionStorage, Cookies](#4-localstorage-vs-sessionstorage)
5. [CORS & Preflight](#5-what-is-cors)

---

## 1. What happens when a URL is entered in the browser?

### Step-by-step flow

```
User enters URL → DNS → TCP/TLS → HTTP request → Response → Parse → Render
```

#### 1. URL parsing
Browser parses protocol (`https`), host (`example.com`), port, path, query, hash.

#### 2. DNS lookup
Resolve domain → IP address. Checks **DNS cache** → OS cache → router → ISP → recursive DNS query.

#### 3. TCP connection
**Three-way handshake** (SYN → SYN-ACK → ACK) with server on port 443 (HTTPS) or 80 (HTTP).

#### 4. TLS handshake (HTTPS)
Negotiate encryption keys, verify certificate (CA chain), establish secure channel.

#### 5. HTTP request
Browser sends request with headers:
- `User-Agent`, `Accept`, `Accept-Encoding` (gzip/br)
- `Cookie` (if any)
- `Cache-Control` / `If-None-Match` (conditional requests)

#### 6. Server response
Status code (200, 301, 404…), headers (`Content-Type`, `Set-Cookie`, `Cache-Control`), body (HTML).

#### 7. Parsing & rendering pipeline

| Phase | What happens |
|-------|----------------|
| **Parse HTML** | Build **DOM tree** token by token |
| **Parse CSS** | Build **CSSOM** (CSS Object Model) |
| **JavaScript** | `<script>` may block parsing (unless `defer`/`async`) |
| **Render tree** | DOM + CSSOM → visible nodes + styles |
| **Layout (Reflow)** | Calculate geometry (position, size) |
| **Paint** | Fill pixels (text, colors, images) |
| **Composite** | GPU layers combined for display |

#### 8. Subresource loading
HTML triggers parallel fetches: CSS, JS, images, fonts — each goes through similar network steps.

#### 9. JavaScript execution
Scripts run, may modify DOM, trigger more fetches (XHR/fetch API).

#### 10. Page interactive
`DOMContentLoaded` → DOM ready. `load` → all resources loaded.

### Interview one-liner
> DNS resolves the host, TCP/TLS connects, HTTP fetches HTML, browser parses into DOM/CSSOM, builds render tree, layouts, paints, and composites — while loading subresources in parallel.

---

## 2. What is DOM?

**DOM (Document Object Model)** is a **tree-structured programming API** representing HTML/XML documents. Each node (element, text, attribute) is an object JavaScript can read and modify.

```html
<html>
  <body>
    <h1 id="title">Hello</h1>
  </body>
</html>
```

```
Document
 └── html
      └── body
           └── h1#title
                └── "Hello" (text node)
```

### Key points
- **Live tree** — changes via JS immediately affect the page.
- **APIs:** `getElementById`, `querySelector`, `createElement`, `appendChild`, `classList`.
- **Not the source HTML** — parsed representation; browser may fix invalid markup.
- **Reflow cost** — DOM changes can trigger layout recalculation.

### What is BOM?

**BOM (Browser Object Model)** is the set of **browser-specific objects** outside the document — the interface between JS and the browser window.

| Object | Purpose |
|--------|---------|
| `window` | Global object, tabs, `open()`, `alert()`, `setTimeout` |
| `navigator` | Browser info, `userAgent`, geolocation |
| `location` | URL (`href`, `reload`, `assign`) |
| `history` | Back/forward (`pushState`) |
| `screen` | Screen dimensions |
| `localStorage` / `sessionStorage` | Web Storage API |

**DOM** = document tree. **BOM** = browser chrome around the document.

---

## 3. Event bubbling?

When an event fires on a **nested element**, it propagates **upward** through ancestors after the target phase.

```
Click on <button> inside <div> inside <body>:

  button (target) → div → body → html → document
                    ↑ bubbling phase
```

```js
button.addEventListener('click', () => console.log('button'));
div.addEventListener('click', () => console.log('div')); // also fires
```

Default for most events (`click`, `input`). Use `event.stopPropagation()` to stop.

---

## 4. Event capturing?

**Capturing** (trickling) goes **down** from `document` → target **before** the target handler runs.

```
document → html → body → div → button (target)
         ↑ capturing phase
```

```js
div.addEventListener('click', handler, true); // third arg true = capture phase
// or { capture: true }
```

### Full event flow (3 phases)

1. **Capture** — window → target
2. **Target** — handlers on the element itself
3. **Bubble** — target → window

Most code uses **bubble phase** (default). Capture is rare but useful for intercepting early.

---

## 5. Event delegation?

Attach **one listener** on a **parent** instead of many on children. Leverages bubbling.

```js
document.getElementById('list').addEventListener('click', (e) => {
    if (e.target.matches('li')) {
        console.log('Clicked:', e.target.textContent);
    }
});
```

```html
<ul id="list">
  <li>Item 1</li>  <!-- dynamically added items work too -->
  <li>Item 2</li>
</ul>
```

### Why is event delegation useful?

| Benefit | Explanation |
|---------|-------------|
| **Fewer listeners** | 1 parent vs 1000 children — less memory |
| **Dynamic elements** | New children automatically handled (no re-bind) |
| **Simpler cleanup** | Remove one listener |
| **Performance** | Especially on large lists/tables |

**Caveat:** Doesn't work for events that don't bubble (`focus`, `blur`, `mouseenter`). Use `focusin`/`focusout` (they bubble) instead.

---

## 6. localStorage vs sessionStorage?

Both part of **Web Storage API** — key/value strings, ~5–10 MB per origin, synchronous API.

| Feature | `localStorage` | `sessionStorage` |
|---------|----------------|------------------|
| **Lifetime** | Until explicitly cleared | Until tab/window closed |
| **Scope** | Same origin, all tabs | Same origin, **one tab** |
| **Survives refresh** | Yes | Yes |
| **Survives new tab** | Yes (shared) | No (isolated per tab) |
| **Sent to server** | No | No |

```js
localStorage.setItem('theme', 'dark');
sessionStorage.setItem('formDraft', JSON.stringify(data));
```

Use `localStorage` for preferences. Use `sessionStorage` for temporary per-tab state (form drafts, wizard steps).

---

## 7. Cookies vs localStorage?

| Feature | Cookies | localStorage |
|---------|---------|--------------|
| **Capacity** | ~4 KB per cookie | ~5–10 MB |
| **Sent with HTTP** | **Yes** — every request to domain | **No** |
| **Expiry** | `Expires` / `Max-Age` | Until cleared |
| **Accessible from** | JS (`document.cookie`) + server | JS only |
| **Use case** | Auth tokens, session ID, tracking | Client-only preferences, cache |

```http
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict
```

**Security:** Sensitive tokens → `HttpOnly` cookies (JS can't read). Don't store JWT in `localStorage` if XSS is a concern.

---

## 8. What is CORS?

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that **blocks** JavaScript from reading responses from a **different origin** unless the server explicitly allows it.

**Origin** = protocol + host + port  
`https://api.example.com` ≠ `https://www.example.com` (different host)

### Without CORS
Browser allows the request but **hides the response** from JS → `Network Error` in console.

### With CORS
Server sends headers:

```http
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Simple vs preflight requests

**Simple request** (no preflight) — all must be true:
- Methods: `GET`, `HEAD`, `POST`
- Only simple headers (`Content-Type`: `text/plain`, `multipart/form-data`, `application/x-www-form-urlencoded`)
- No custom headers like `Authorization`

**Preflight required** when:
- Methods: `PUT`, `DELETE`, `PATCH`
- Custom headers: `Authorization`, `X-Custom-Header`
- `Content-Type: application/json`

---

## 9. Why does preflight request happen?

Browser sends an **`OPTIONS`** request **before** the actual request to ask the server: "Is this cross-origin request allowed?"

```http
OPTIONS /api/users HTTP/1.1
Origin: https://myapp.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization
```

Server responds:

```http
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: DELETE
Access-Control-Allow-Headers: Authorization
Access-Control-Max-Age: 86400
```

### Why?

Protects servers from **forbidden cross-origin writes** that older browsers might have sent without CORS. Ensures server **opts in** to non-simple requests.

If preflight fails → actual request **never sent** → CORS error in browser.

### Interview summary
> CORS restricts cross-origin reads. Preflight (OPTIONS) checks permission before "non-simple" requests (custom headers, JSON body, DELETE, etc.) so servers explicitly approve them.

---

## Quick Links

| Topic | Code file |
|-------|-----------|
| URL → page | `01-url-and-rendering.js` |
| DOM & BOM | `02-dom-and-bom.js` |
| Events | `03-events.js` |
| Storage | `04-storage.js` |
| CORS | `05-cors.js` |
