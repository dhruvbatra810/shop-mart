# 🛍️ ShopSmart — Next.js AI-Powered Ecommerce

A full-stack ecommerce app built with Next.js 14 App Router, featuring natural language search powered by Claude AI.

---

## 🎨 Theme & Appearance
- **Aesthetic:** Clean, minimalist, and "Light Mode" focused.
- **Backgrounds:** Crisp whites (`bg-white`) and soft off-whites (`bg-zinc-50`).
- **Text:** High-contrast dark grays/blacks (`text-zinc-900`) with subtle subtext (`text-zinc-500`).
- **Styling Details:** Premium UI featuring delicate borders (`border-zinc-200`), soft shadows (`shadow-[0_8px_30px_rgb(0,0,0,0.04)]`), rounded corners (`rounded-2xl` / `rounded-3xl`), and responsive micro-animations on hover and active states. 

---

## 🧱 Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Neon (Serverless Postgres) |
| ORM | Drizzle ORM |
| Auth | NextAuth.js (Google) |
| AI | Anthropic Claude API |
| Deploy | Vercel |

---

## 📁 Folder Structure

```
shopsmart/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Login page
│   ├── (shop)/
│   │   ├── layout.tsx                # Shop layout with navbar, footer
│   │   ├── page.tsx                  # Landing page (SSG)
│   │   ├── products/
│   │   │   ├── page.tsx              # Product listing (ISR)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Product detail (SSG + generateStaticParams)
│   │   ├── search/
│   │   │   └── page.tsx              # AI natural language search
│   │   ├── cart/
│   │   │   └── page.tsx              # Cart page (client component)
│   │   └── orders/
│   │       └── page.tsx              # Order history (SSR, auth-protected)
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth route handler
│   ├── actions/
│   │   ├── cart.ts                   # Server actions — add/remove/clear cart
│   │   ├── orders.ts                 # Server actions — place order
│   │   └── search.ts                 # Server action — AI search
│   ├── layout.tsx                    # Root layout
│   └── loading.tsx                   # Global loading UI
├── components/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── CartItem.tsx
│   ├── SearchBar.tsx                 # AI search input
│   └── Navbar.tsx
├── db/
│   ├── schema.ts                     # Drizzle schema
│   └── index.ts                      # DB connection
├── lib/
│   ├── auth.ts                       # NextAuth config
│   ├── claude.ts                     # Anthropic client
│   └── utils.ts
├── scripts/
│   └── seed.ts                       # Seed 50 fake products
├── .env.local
├── drizzle.config.ts
└── next.config.ts
```

---
<!-- 
## 🚀 Build Plan — Week by Week

---

### ✅ Week 1 — Setup + Product Pages

**Goal:** Get products displaying with correct rendering strategies.

#### Step 1 — Scaffold the project

```bash
npx create-next-app@latest shopsmart --typescript --tailwind --app
cd shopsmart
```

#### Step 2 — Install dependencies

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
npm install next-auth @auth/drizzle-adapter
npm install @anthropic-ai/sdk
```

#### Step 3 — Set up Neon database

1. Go to [neon.tech](https://neon.tech) → create a free project
2. Copy the connection string
3. Create `.env.local`:

```env
DATABASE_URL=your_neon_connection_string
NEXTAUTH_SECRET=any_random_string
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ANTHROPIC_API_KEY=your_anthropic_key
```

#### Step 4 — Define database schema

```ts
// db/schema.ts
import { pgTable, text, integer, decimal, timestamp, boolean } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),       // 'mens', 'womens', 'electronics', 'gifts'
  occasion: text('occasion'),                  // 'casual', 'wedding', 'office', 'party'
  imageUrl: text('image_url').notNull(),
  stock: integer('stock').notNull().default(10),
  inStock: boolean('in_stock').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  items: text('items').notNull(),   // JSON stringified array
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('placed'),  // placed, shipped, delivered
  createdAt: timestamp('created_at').defaultNow(),
})
```

#### Step 5 — Run migrations and seed data

```bash
npx drizzle-kit push
npx tsx scripts/seed.ts
```

Seed script creates 50 products across categories with realistic names, prices (₹299–₹4999), and occasions.

#### Step 6 — Build product listing page (ISR)

```ts
// app/(shop)/products/page.tsx
import { db } from '@/db'
import { products } from '@/db/schema'

export const revalidate = 3600 // revalidate every hour

export default async function ProductsPage() {
  const allProducts = await db.select().from(products)
  return <ProductGrid products={allProducts} />
}
```

**Why ISR here?** Products change infrequently but need SEO. ISR gives you static speed + periodic freshness without rebuilding on every request.

#### Step 7 — Build product detail page (SSG)

```ts
// app/(shop)/products/[id]/page.tsx
import { db } from '@/db'
import { products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const allProducts = await db.select({ id: products.id }).from(products)
  return allProducts.map((p) => ({ id: p.id }))
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.select().from(products)
    .where(eq(products.id, params.id))
    .then(r => r[0])

  if (!product) notFound()
  return <ProductDetail product={product} />
}
```

**Why SSG here?** Individual product pages are read-heavy. Pre-rendering all 50 at build time means zero DB calls at runtime — pure static file serving.

---

### ✅ Week 2 — Auth + Cart

**Goal:** Users can log in and add items to cart.

#### Step 8 — Set up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable Google+ API
3. Create OAuth credentials → add `http://localhost:3000/api/auth/callback/google` as redirect URI
4. Copy Client ID and Secret to `.env.local`

```ts
// lib/auth.ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Google],
})
```

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

#### Step 9 — Cart with Server Actions + Cookies

Cart state lives in a cookie (no DB needed for guest cart). Server action reads, updates, and writes the cookie.

```ts
// app/actions/cart.ts
'use server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

type CartItem = { id: string; name: string; price: number; qty: number }

export async function addToCart(productId: string, name: string, price: number) {
  const cookieStore = cookies()
  const existing = cookieStore.get('cart')
  const cart: CartItem[] = existing ? JSON.parse(existing.value) : []

  const item = cart.find(i => i.id === productId)
  if (item) {
    item.qty += 1
  } else {
    cart.push({ id: productId, name, price, qty: 1 })
  }

  cookieStore.set('cart', JSON.stringify(cart), { path: '/' })
  revalidatePath('/cart')
}

export async function removeFromCart(productId: string) {
  const cookieStore = cookies()
  const existing = cookieStore.get('cart')
  if (!existing) return

  const cart: CartItem[] = JSON.parse(existing.value)
  const updated = cart.filter(i => i.id !== productId)
  cookieStore.set('cart', JSON.stringify(updated), { path: '/' })
  revalidatePath('/cart')
}
```

**Why server actions for cart?** No need for a separate `/api/cart` route. The action runs on the server, updates the cookie, and revalidates the cart page — all in one function call from the client.

#### Step 10 — Cart page

```ts
// app/(shop)/cart/page.tsx
'use client'
import { addToCart, removeFromCart } from '@/app/actions/cart'

// Read cart from cookie on server, render items, wire up buttons to actions
```

---

### ✅ Week 3 — Checkout + Orders

**Goal:** Users can place orders and view history.

#### Step 11 — Mock checkout flow

No real payment needed. Clicking "Place Order" calls a server action that:
1. Reads cart cookie
2. Inserts a row into `orders` table
3. Clears the cart cookie
4. Redirects to `/orders`

```ts
// app/actions/orders.ts
'use server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { nanoid } from 'nanoid'

export async function placeOrder() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const cookieStore = cookies()
  const cart = JSON.parse(cookieStore.get('cart')?.value ?? '[]')
  if (cart.length === 0) return

  const total = cart.reduce((sum: number, i: any) => sum + i.price * i.qty, 0)

  await db.insert(orders).values({
    id: nanoid(),
    userId: session.user.id,
    items: JSON.stringify(cart),
    total: total.toString(),
    status: 'placed',
  })

  cookieStore.delete('cart')
  redirect('/orders')
}
```

#### Step 12 — Order history page (SSR + auth-protected)

```ts
// app/(shop)/orders/page.tsx
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

// No revalidate = SSR (dynamic rendering on every request)
export default async function OrdersPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const userOrders = await db.select().from(orders)
    .where(eq(orders.userId, session.user.id))
    .orderBy(orders.createdAt)

  return <OrderList orders={userOrders} />
}
```

**Why SSR here?** Order data is user-specific and changes after every purchase. Static or ISR would show stale data. SSR ensures the latest orders are always fetched.

---

### ✅ Week 4 — AI Search + Polish

**Goal:** Natural language search + deploy.

#### Step 13 — AI search server action

This is the star feature. User types anything → Claude extracts structured filters → you query the DB.

```ts
// app/actions/search.ts
'use server'
import Anthropic from '@anthropic-ai/sdk'
import { db } from '@/db'
import { products } from '@/db/schema'
import { and, lte, eq, ilike } from 'drizzle-orm'

const client = new Anthropic()

type SearchFilters = {
  category?: string
  maxPrice?: number
  occasion?: string
  keyword?: string
}

export async function aiSearch(query: string) {
  // Step 1: Ask Claude to extract structured filters from the query
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `Extract shopping filters from this search query. Return ONLY valid JSON, no explanation.
      
Query: "${query}"

Return this exact shape:
{
  "category": "mens" | "womens" | "electronics" | "gifts" | null,
  "maxPrice": number | null,
  "occasion": "casual" | "wedding" | "office" | "party" | null,
  "keyword": "main product keyword" | null
}

Examples:
- "gifts for dad under 500" → { "category": "gifts", "maxPrice": 500, "occasion": null, "keyword": "dad" }
- "kurta for wedding" → { "category": "mens", "maxPrice": null, "occasion": "wedding", "keyword": "kurta" }
- "budget office shoes" → { "category": null, "maxPrice": 1500, "occasion": "office", "keyword": "shoes" }`
    }]
  })

  // Step 2: Parse filters
  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  const filters: SearchFilters = JSON.parse(text)

  // Step 3: Build DB query from filters
  const conditions = []
  if (filters.category) conditions.push(eq(products.category, filters.category))
  if (filters.maxPrice) conditions.push(lte(products.price, filters.maxPrice.toString()))
  if (filters.occasion) conditions.push(eq(products.occasion, filters.occasion))
  if (filters.keyword) conditions.push(ilike(products.name, `%${filters.keyword}%`))

  const results = await db.select().from(products)
    .where(conditions.length ? and(...conditions) : undefined)
    .limit(20)

  return { results, filters } // return filters too so UI can show "Searching for: wedding kurtas under ₹2000"
}
```

#### Step 14 — Search page

```ts
// app/(shop)/search/page.tsx
'use client'
import { useState } from 'react'
import { aiSearch } from '@/app/actions/search'
import ProductGrid from '@/components/ProductGrid'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState(null)

  const handleSearch = async () => {
    setLoading(true)
    const { results, filters } = await aiSearch(query)
    setResults(results)
    setAppliedFilters(filters)
    setLoading(false)
  }

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        placeholder='Try "gifts for dad under ₹500" or "kurta for wedding"'
      />
      <button onClick={handleSearch}>Search</button>
      {appliedFilters && (
        <p>Showing results for: {JSON.stringify(appliedFilters)}</p>
      )}
      {loading ? <p>Thinking...</p> : <ProductGrid products={results} />}
    </div>
  )
}
```

#### Step 15 — Performance polish

```ts
// Use next/image everywhere for auto-optimization
import Image from 'next/image'
<Image src={product.imageUrl} width={400} height={400} alt={product.name} />

// Add loading.tsx for streaming
// app/(shop)/products/loading.tsx
export default function Loading() {
  return <div>Loading products...</div> // replace with skeleton UI
}

// Add Suspense boundaries in layouts for streaming
import { Suspense } from 'react'
<Suspense fallback={<ProductSkeleton />}>
  <ProductGrid />
</Suspense>
```

#### Step 16 — Deploy to Vercel

```bash
# Push to GitHub first
git init
git add .
git commit -m "initial commit"
git remote add origin your_github_repo
git push -u origin main
```

1. Go to [vercel.com](https://vercel.com) → Import GitHub repo
2. Add all environment variables from `.env.local`
3. Deploy — done ✅

---

## 🎯 Rendering Strategy Summary

| Page | Strategy | Why |
|------|----------|-----|
| Landing `/` | SSG | Never changes, pure static |
| Products `/products` | ISR (1hr) | Changes infrequently, needs SEO |
| Product detail `/products/[id]` | SSG + generateStaticParams | Pre-render all, fastest possible |
| Search `/search` | CSR | Interactive, user-driven |
| Cart `/cart` | CSR + Server Actions | Real-time user state |
| Orders `/orders` | SSR | Auth-dependent, always fresh |

---

## 💬 Interview Talking Points

- **"Why ISR for products and not SSR?"** — Products change maybe once a day. SSR would hit the DB on every request unnecessarily. ISR gives static speed with hourly freshness.
- **"Why server actions for cart instead of API routes?"** — Cart mutations are internal — no external client needs to hit them. Server actions remove the round-trip overhead and co-locate the mutation with the UI.
- **"How does the AI search work?"** — Claude extracts structured intent from natural language, which I then use to build a typed DB query. The AI handles ambiguity; the DB handles data — clean separation.
- **"How would you scale this?"** — Add Redis for cart instead of cookies for multi-device support. Add pgvector for semantic product search. CDN caching for static pages is already handled by Vercel.

---

## 📦 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npx drizzle-kit push # Push schema to Neon
npx tsx scripts/seed.ts  # Seed 50 products
``` -->

---

# Extended Development Roadmap

> Current state: product listing, AI search, cart, Google auth — all working.
> Goal: grow from here into a production-grade, interview-ready full-stack app.

---

## Phase 1 — Frontend Polish (Beginner → Comfortable)

### What to build
- Skeleton loading screens replacing plain spinners
- Product image zoom on hover, smooth page transitions
- Fully responsive mobile layout (drawer nav, bottom cart bar)
- Toast notifications for cart actions (added, removed, error)
- Dark mode toggle persisted to `localStorage`

### Concepts you will learn
- `framer-motion` basics: `motion.div`, `AnimatePresence`, layout animations
- Tailwind `group-hover`, `peer`, and `data-*` attribute patterns
- CSS `view-transitions` API (Next.js 14 has experimental support)
- `next/font` for zero-layout-shift typography

### Tools
- `framer-motion` — animations and micro-interactions
- `sonner` or `react-hot-toast` — toast system
- `next-themes` — dark mode

### Task
Build a `ProductCard` that animates in on scroll, shows a quick-add button on hover, and fires a toast when added to cart. Time-box to 2 days.

---

## Phase 2 — State Management & Performance (Intermediate)

### What to build
- Replace cookie cart with `Zustand` store (synced to `localStorage` for guests, DB for logged-in users)
- Optimistic UI on cart mutations (update count instantly, roll back on error)
- Infinite scroll on product listing using `react-query` / `TanStack Query`
- `next/image` with blur placeholder on every image
- Route-level `loading.tsx` and `Suspense` boundaries everywhere

### Concepts you will learn
- Client-side cache invalidation vs. server revalidation (`revalidatePath`, `revalidateTag`)
- Optimistic updates pattern: update UI → mutate server → reconcile
- Stale-while-revalidate caching model
- `React.lazy` + `dynamic(() => import(...))` for code splitting heavy components
- Web Vitals: LCP, CLS, INP — how to measure with Lighthouse

### Tools
- `zustand` — lightweight global state
- `@tanstack/react-query` — server state, caching, pagination
- `next/dynamic` — lazy loading

### Task
Migrate cart to Zustand. Add optimistic +/- buttons on cart page. Measure before/after LCP with `next build && next start`.

---

## Phase 3 — Payment Integration (Intermediate)

### What to build
- Stripe Checkout integration (hosted checkout page — easiest, production-safe)
- Webhook handler to update order status on payment success
- Order confirmation email (via Resend or Nodemailer)
- Persist real order records in DB after payment confirmed

### Concepts you will learn
- Stripe payment flow: `PaymentIntent` → Checkout Session → webhook
- Webhook signature verification (security critical — never skip)
- Idempotency keys to prevent duplicate orders
- Server-sent events / polling for payment status

### Tools
- `stripe` (npm) — Stripe Node SDK
- `resend` — transactional email
- Stripe Dashboard for test card numbers

### Task
Implement the full flow: add to cart → click "Pay" → Stripe Checkout → webhook fires → order marked `paid` in DB → confirmation email sent. Test with card `4242 4242 4242 4242`.

---

## Phase 4 — AI-First Features (Intermediate → Advanced)

### What to build
- **Chat-based shopping assistant** — floating chat widget, Claude answers product questions and recommends items from your DB
- **Personalized recommendations** — "You might also like" section using browse history stored in `localStorage` + Claude ranking
- **Smart search suggestions** — debounced autocomplete using Claude to predict intent as you type

### Concepts you will learn
- Streaming AI responses with `ReadableStream` and Next.js `StreamingResponse`
- Tool use / function calling — give Claude access to a `searchProducts` function so it can query your DB mid-conversation
- `useOptimistic` hook for streaming chat UI
- Rate limiting AI routes to prevent abuse

### Tools
- `@anthropic-ai/sdk` (streaming) — already installed
- `ai` (Vercel AI SDK) — simplifies streaming chat in Next.js
- `upstash/ratelimit` — Redis-based rate limiting (free tier)

### Task
Build a chat widget that floats bottom-right. User asks "show me red dresses under ₹1500" — Claude calls your `searchProducts` tool and streams results directly into the chat.

---

## Phase 5 — PWA (Intermediate)

### What to build
- Web app manifest (`manifest.json`) — app name, icons, theme color
- Service worker caching product images and static assets for offline use
- "Add to Home Screen" install prompt
- Offline fallback page shown when network is unavailable

### Concepts you will learn
- Cache-first vs. network-first vs. stale-while-revalidate strategies in service workers
- `next-pwa` plugin (wraps Workbox — Google's service worker library)
- App shell pattern: cache the shell, stream the content

### Tools
- `next-pwa` — zero-config PWA for Next.js
- Chrome DevTools Application tab for debugging service workers

### Task
Install `next-pwa`, configure it, and verify your app installs on an Android device. Check that product images load offline after first visit.

---

## Phase 6 — Go Backend (Secondary, Gradual)

> Build this in parallel with frontend phases. Start small.

### Step 1 — Go basics + REST API
**What:** A standalone Go service with `GET /products`, `POST /orders`, `GET /orders/:userId`

**Concepts:** Go modules, `net/http`, JSON encoding, struct tags, error handling idioms

**Tools:** `chi` router (lightweight, idiomatic), `sqlx` (SQL + structs), `pgx` (Postgres driver)

**Task:** Re-implement your products API in Go. Point your Next.js app at `localhost:8080` instead of Drizzle. See both work identically.

---

### Step 2 — Auth in Go (JWT)
**What:** `POST /auth/login` issues a JWT. Protected routes verify it via middleware.

**Concepts:** JWT structure (header.payload.signature), `RS256` vs `HS256`, refresh token rotation, middleware chaining in Go

**Tools:** `golang-jwt/jwt`, `bcrypt` for password hashing

**Task:** Add email/password auth to Go backend. Implement a `RequireAuth` middleware that extracts and validates the JWT from the `Authorization` header.

---

### Step 3 — Database design
**What:** Proper relational schema — `users`, `products`, `orders`, `order_items`, `reviews`

**Concepts:** Foreign keys, indexes, `EXPLAIN ANALYZE` for query planning, DB migrations with `goose` or `migrate`

**Tools:** `goose` for migrations, `sqlc` (generates type-safe Go from SQL queries — highly recommended)

**Task:** Write raw SQL migrations. Use `sqlc` to generate Go query functions. No ORM — builds real SQL understanding.

---

### Step 4 — Caching with Redis
**What:** Cache `GET /products` responses for 60 seconds in Redis

**Concepts:** Cache-aside pattern, TTL, cache invalidation on write, Redis data types (string, hash, sorted set)

**Tools:** `go-redis/redis`, Upstash Redis (free serverless Redis)

**Task:** Add Redis caching to the products endpoint. Log cache hits vs. misses. Measure response time improvement with `hyperfine` or `ab`.

---

### Step 5 — File storage
**What:** Upload product images to Cloudflare R2 or AWS S3. Store only the URL in DB.

**Concepts:** Presigned URLs (client uploads directly to S3, never through your server), CDN distribution, image resizing with Lambda/Workers

**Tools:** `aws-sdk-go-v2`, Cloudflare R2 (S3-compatible, free egress)

**Task:** Build `POST /upload` that returns a presigned URL. Wire the admin product form to upload images before saving.

---

### Step 6 — Background jobs
**What:** Send order confirmation email asynchronously after order is placed

**Concepts:** Message queues (producer/consumer), at-least-once delivery, dead letter queues, job retries with backoff

**Tools:** `asynq` (Go job queue backed by Redis), or `pgqueue` if you want pure Postgres

**Task:** Replace synchronous email sending with an `asynq` job. Verify email still arrives even if the job fails once and retries.

---

## Phase 7 — DevOps & Deployment

### Dockerize
```dockerfile
# Multi-stage build keeps image small
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS runner
COPY --from=builder /app/.next/standalone ./
CMD ["node", "server.js"]
```

**Concepts:** Multi-stage builds, `.dockerignore`, environment variable injection at runtime, `docker-compose` for local dev (app + postgres + redis together)

**Task:** `docker compose up` should start your entire stack locally with one command.

---

### CI/CD with GitHub Actions
```yaml
# .github/workflows/ci.yml
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build && npm run lint
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

**Concepts:** Workflows, jobs, secrets, environment protection rules, artifact caching for faster builds

---

### Logging & Monitoring
- **Frontend:** Vercel Analytics (free) + Sentry for error tracking
- **Backend Go:** Structured JSON logging with `slog` (stdlib in Go 1.21+), ship to Axiom or Grafana Loki
- **Uptime:** Better Uptime or UptimeRobot (free)

---

### Scalability basics
- **Rate limiting:** `upstash/ratelimit` on AI routes and auth endpoints
- **DB connection pooling:** PgBouncer or Neon's built-in pooler
- **Static assets:** Already on Vercel's CDN. For Go backend, put behind Cloudflare for free DDoS protection and caching.

---

## Unique Standout Features

### 1. AI Stylist / Outfit Builder
User uploads a photo (or picks a vibe: "office casual", "beach wedding") and Claude suggests complete outfits from your product catalog using vision + tool use. Each item is clickable and adds to cart. This is rare in portfolio projects and directly demos multimodal AI + tool use.

### 2. Smart Cart with Price Drop Alerts
When a logged-in user adds an item to their wishlist instead of cart, a background job (asynq) checks the price daily. On drop, an email is sent instantly. Teaches background jobs, cron scheduling, and transactional email — all real production patterns.

### 3. Social Proof Live Feed
A small websocket connection (`/ws/activity`) streams anonymized real-time events: "Someone in Mumbai just bought Air Max 90". Fake-able with seeded events for demo. Teaches WebSockets in Go (`gorilla/websocket`), pub/sub with Redis channels, and SSE as a simpler alternative.

---

## Learning Path Summary

| Phase | Focus | Timeline |
|-------|-------|----------|
| 1 — UI Polish | framer-motion, dark mode, skeletons | 1 week |
| 2 — State + Perf | Zustand, TanStack Query, optimistic UI | 1–2 weeks |
| 3 — Payments | Stripe, webhooks, email | 1 week |
| 4 — AI Features | Streaming, tool use, chat widget | 1–2 weeks |
| 5 — PWA | Service workers, offline, installable | 3–4 days |
| 6a — Go REST API | chi, sqlx, migrations | 1–2 weeks |
| 6b — Go Auth + Redis | JWT, caching, background jobs | 1–2 weeks |
| 7 — DevOps | Docker, CI/CD, monitoring | 1 week |

> Don't wait to finish frontend before starting Go. After Phase 2, you can do Phase 6a in parallel — they are independent.

---

## Stack at Completion

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, TypeScript, Tailwind, Framer Motion, Zustand, TanStack Query |
| AI | Claude API (streaming, tool use, vision) |
| Payments | Stripe |
| Go backend | chi, sqlc, pgx, asynq, go-redis |
| Database | Neon Postgres (primary), Redis (cache + jobs) |
| Storage | Cloudflare R2 + CDN |
| Auth | NextAuth (Google), JWT (Go backend) |
| DevOps | Docker, GitHub Actions, Vercel (frontend), Fly.io or Railway (Go backend) |
| Monitoring | Sentry, Vercel Analytics, structured logging |
