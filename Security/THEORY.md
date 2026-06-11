# Security Theory — Interview Answers (Tier 7)

---

## Table of Contents

1. [XSS](#1-what-is-xss)
2. [React XSS Protection](#2-how-does-react-protect-against-xss)
3. [dangerouslySetInnerHTML](#3-what-is-dangerouslysetinnerhtml)
4. [SQL Injection](#4-what-is-sql-injection)
5. [Prepared Statements](#5-how-do-prepared-statements-help)
6. [CSP](#6-what-is-csp)

---

## 1. What is XSS?

**XSS (Cross-Site Scripting)** — attacker injects **malicious JavaScript** into a page that other users execute in their browser.

### Impact
- Steal cookies/tokens (`document.cookie`)
- Keylogging, phishing overlays
- Perform actions as the victim
- Deface page

### Types of XSS

| Type | How | Example |
|------|-----|---------|
| **Stored (Persistent)** | Malicious script **saved on server** (DB, comment) | Comment field stores `<script>steal()</script>` — every viewer runs it |
| **Reflected** | Script in **URL/input reflected** in response immediately | `?search=<script>alert(1)</script>` echoed back unescaped |
| **DOM-based** | JS on page reads untrusted data (`location.hash`) and writes to DOM unsafely | `innerHTML = location.hash` — no server involvement |

### Prevention
- **Escape output** — encode `<`, `>`, `"`, `'`, `&`
- **Content-Security-Policy** — restrict script sources
- **HttpOnly cookies** — JS can't read session cookie
- **Sanitize HTML** — DOMPurify if rich text needed
- Never `eval()`, `innerHTML` with user input

---

## 2. How does React protect against XSS?

React **escapes by default** when rendering JSX:

```jsx
const userInput = '<img src=x onerror=alert(1)>';
return <div>{userInput}</div>;
// Renders as text: &lt;img src=x onerror=alert(1)&gt;
// Script does NOT execute
```

React creates text nodes — doesn't use `innerHTML` for interpolated values.

### Exceptions (you must protect)
- `dangerouslySetInnerHTML`
- Passing URLs to `<a href={userUrl}>` without validation (`javascript:` protocol)
- Rendering raw HTML from CMS/API

---

## 3. What is dangerouslySetInnerHTML?

React's escape hatch to render **raw HTML strings**:

```jsx
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
```

**Name is intentional** — bypasses XSS protection. Only use with **trusted or sanitized** content (DOMPurify).

```jsx
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userHtml) }} />
```

Never pass unsanitized user input directly.

---

## 4. What is SQL Injection?

Attacker injects **malicious SQL** through user input that gets concatenated into queries.

```js
// VULNERABLE
const query = `SELECT * FROM users WHERE email = '${email}'`;
// email = "' OR '1'='1" → returns all users
// email = "'; DROP TABLE users; --" → disaster
```

### Impact
- Read/modify/delete any data
- Bypass authentication
- Execute admin commands (depending on DB permissions)

---

## 5. How do prepared statements help?

**Parameterized queries** — SQL and data sent **separately**. DB treats input as **data only**, never as SQL code.

```js
// SAFE — prepared statement
const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
stmt.execute(email); // email always treated as string value
```

```sql
-- Even if email = "' OR '1'='1"
-- DB searches for literal string "' OR '1'='1", not boolean logic
```

| String concat | Prepared statement |
|---------------|-------------------|
| Input becomes SQL | Input is bound parameter |
| Parser can't distinguish | Parser sees fixed query shape |

Also use: ORMs (Prisma, Sequelize), input validation, least-privilege DB users.

---

## 6. What is CSP?

**Content Security Policy** — HTTP header (or `<meta>`) telling browser **which resources are allowed to load/run**.

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.trusted.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  frame-ancestors 'none';
```

### What it prevents
- **Inline script injection** — blocks unauthorized `<script>` and `onclick`
- **Loading malicious external JS**
- **Data exfiltration** via `connect-src`

### Common directives
| Directive | Controls |
|-----------|----------|
| `script-src` | JavaScript sources |
| `style-src` | CSS |
| `img-src` | Images |
| `connect-src` | fetch, XHR, WebSocket |
| `frame-ancestors` | Who can embed page (clickjacking) |

**Note:** `'unsafe-inline'` weakens XSS protection — prefer nonces or hashes in strict CSP.

```http
script-src 'self' 'nonce-abc123'
```

---

## Quick Links

| Topic | File |
|-------|------|
| XSS | `01-xss.js` |
| SQL Injection | `02-sql-injection.js` |
| CSP | `03-csp.js` |
