# SSR & Architecture — Interview Answers (Tier 8)

---

## Table of Contents

1. [SSR vs CSR](#1-ssr-vs-csr)
2. [SSR Advantages & Disadvantages](#2-advantages-of-ssr)
3. [Hydration](#3-what-is-hydration)
4. [Next.js](#4-what-is-nextjs)
5. [getServerSideProps vs getStaticProps](#5-getserversideprops-vs-getstaticprops)
6. [When to Choose SSR](#6-when-would-you-choose-ssr)

---

## 1. SSR vs CSR?

| | **SSR (Server-Side Rendering)** | **CSR (Client-Side Rendering)** |
|---|--------------------------------|--------------------------------|
| **Where HTML built** | **Server** on each request (or at build) | **Browser** via JavaScript |
| **First response** | Full/near-full HTML | Empty shell + JS bundle |
| **JS required** | For interactivity (hydration) | For any content |
| **Examples** | Next.js SSR, Remix | Create React App, Vite SPA |

### CSR flow
```
Request → empty <div id="root"> + app.js
Browser downloads JS → React renders → content appears
```

### SSR flow
```
Request → server runs React → HTML sent to browser
Browser shows HTML immediately → JS loads → hydration attaches listeners
```

---

## 2. Advantages of SSR?

| Advantage | Why |
|-----------|-----|
| **Faster First Contentful Paint** | User sees HTML before JS parses |
| **SEO** | Crawlers get full content (important for content sites) |
| **Social previews** | OG meta in initial HTML |
| **Low-powered devices** | Less client rendering work initially |
| **Consistent data** | Server fetches data once, same HTML for all |

---

## 3. Disadvantages of SSR?

| Disadvantage | Why |
|--------------|-----|
| **Server load** | Every request (or revalidation) uses CPU |
| **TTFB can increase** | Server must render before sending bytes |
| **Complexity** | Hydration mismatches, dual environment (server + client) |
| **Cost** | Server infrastructure vs static CDN |
| **Not for highly personalized** real-time UIs without caching strategy |

---

## 4. What is hydration?

**Hydration** attaches React event listeners and state to **server-rendered HTML** on the client.

```
Server sends:  <button>Count: 0</button>  (static HTML)
Client loads:  React "hydrates" — same DOM, now interactive
User clicks:   onClick fires, state updates
```

### Hydration mismatch
If server HTML ≠ client first render → React warning/error:

```jsx
// BAD — server and client differ
<div>{Date.now()}</div>  // different timestamp each render
```

**Fix:** consistent data, `suppressHydrationWarning` only when intentional, client-only components with dynamic import.

### React 18+
**Selective hydration** — prioritize interactive parts. **Streaming SSR** — send HTML in chunks.

---

## 5. What is Next.js?

**Next.js** is a React **full-stack framework** by Vercel with:

| Feature | Description |
|---------|-------------|
| **Routing** | File-based `app/` or `pages/` router |
| **SSR** | Server-render per request |
| **SSG** | Static HTML at build time |
| **ISR** | Revalidate static pages on interval |
| **API routes** | Backend endpoints in same project |
| **Image optimization** | `next/image` |
| **Code splitting** | Automatic per route |

Rendering modes: SSR, SSG, CSR, ISR, RSC (React Server Components in App Router).

---

## 6. getServerSideProps vs getStaticProps?

*(Pages Router — still common in interviews)*

| | `getServerSideProps` | `getStaticProps` |
|---|----------------------|------------------|
| **When runs** | **Every request** (server) | **Build time** (and ISR revalidation) |
| **HTML** | Fresh per request | Pre-built static files |
| **Use case** | User-specific, always fresh data | Blog, marketing, docs |
| **CDN cache** | Harder (dynamic) | Easy — static on CDN |
| **TTFB** | Depends on server + data fetch | Very fast from CDN |

```js
// SSR — every request
export async function getServerSideProps(context) {
  const data = await fetch(`https://api.example.com/user/${context.params.id}`);
  return { props: { user: await data.json() } };
}

// SSG — at build
export async function getStaticProps() {
  const data = await fetch('https://api.example.com/posts');
  return { props: { posts: await data.json() }, revalidate: 60 }; // ISR: revalidate every 60s
}
```

### App Router equivalents (Next.js 13+)
| Old | New |
|-----|-----|
| `getServerSideProps` | `async` Server Component or `fetch` with `cache: 'no-store'` |
| `getStaticProps` | `fetch` with default cache or `generateStaticParams` |

---

## 7. When would you choose SSR?

| Choose SSR when | Choose CSR/SSG when |
|-----------------|---------------------|
| SEO critical (content, e-commerce product pages) | Dashboard behind login (SEO irrelevant) |
| Fast first paint on slow networks/devices | Highly interactive app (Figma-like) |
| Personalized per-user initial view | Content rarely changes (blog → SSG) |
| Social sharing needs correct meta | Static marketing site → SSG on CDN |

### Decision tree
```
Need SEO + fresh data per user?     → SSR (getServerSideProps)
Need SEO + same for all users?      → SSG (getStaticProps)
Behind auth, app-like?              → CSR or SSR for shell only
Mix?                                → Next.js hybrid per page
```

---

## Quick Links

| Topic | File |
|-------|------|
| SSR vs CSR | `01-ssr-vs-csr.js` |
| Hydration | `02-hydration.js` |
| Next.js | `03-nextjs.js` |
