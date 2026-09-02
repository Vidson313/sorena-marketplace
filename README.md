<div align="center">

# Sorena Marketplace (سورنا مارکت)

**Full-Featured Digital Marketplace Platform Built with Next.js 14, Supabase & Stripe**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel_Production-000000?style=for-the-badge&logo=vercel)](https://sorena-tempo1-two.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-emerald?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)

<p align="center">
  <a href="https://sorena-tempo1-two.vercel.app"><b>🌐 Live Demo</b></a> •
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#database-architecture">Database</a> •
  <a href="#quick-start">Quick Start</a>
</p>

</div>

---

## 🌟 Overview

**Sorena Marketplace** is a high-performance, production-ready digital goods platform engineered for selling source codes, developer templates, CMS themes, and digital assets.

Engineered from the ground up with the **Next.js 14 App Router (RSC)**, **Supabase SSR** for robust multi-tenant authentication and Row-Level Security (RLS), and a responsive RTL-first UI using **Tailwind CSS** and **Radix UI / shadcn/ui** primitives.

---

## 🚀 Key Features

### 🛒 Customer Experience
- **Catalog & Advanced Filtering:** Filter by categories (Web, Mobile, WordPress, E-commerce), price ranges, tech stacks, and difficulty levels.
- **RTL & Dark Mode:** Native Right-to-Left (RTL) Persian typography via `Vazirmatn` font with zero-layout-shift dark/light theme switching.
- **Interactive Shopping Flow:** Real-time cart state, favorites watchlist, review and Q&A system for each digital product.
- **Secure Instant Delivery:** Automatic download link generation upon verified payment.

### 🛡️ Core & Backend
- **Supabase SSR Architecture:** Modern server/client Supabase patterns with cookie-based auth session management.
- **Granular Row-Level Security (RLS):** 6+ migration scripts enforcing strict database-level security policies and zero data leaks.
- **Role-Based Access Control (RBAC):** Distinct permission tiers for regular customers, verified sellers, and administrators.
- **Stripe & Payment Gateways:** Webhook-driven payment reconciliation and automated order fulfillment.

### 📊 Admin & Creator Dashboard
- **Product Management:** Full CRUD interface for adding products, assigning tags/tech stacks, uploading assets, and managing discounts.
- **Order Tracking & Analytics:** Real-time order status, revenue metrics, and user management.
- **Support & Ticket Engine:** Built-in customer support ticketing system.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Server Components, Server Actions & Streaming |
| **Language** | TypeScript 5 | Strict end-to-end type safety |
| **Database & Auth** | Supabase (PostgreSQL) | Auth SSR, Row-Level Security & Storage |
| **Styling & UI** | Tailwind CSS + Radix UI | Accessible headless primitives & custom glassmorphism |
| **Animation** | Framer Motion | Fluid micro-interactions and route transitions |
| **Payments** | Stripe API | Checkout sessions and webhook listeners |
| **Icons** | Lucide React | Modern, consistent iconography |

---

## 🗄️ Database Architecture

The PostgreSQL schema is managed via reproducible SQL migrations located in [`/supabase/migrations`](./supabase/migrations):

```
├── categories              # Product categories (Web, Mobile, CMS, etc.)
├── technologies            # Tech tags (React, Next.js, Laravel, etc.)
├── products                # Main catalog entity with pricing & metadata
├── product_technologies    # Many-to-many relationship mapping
├── product_files           # Secure asset storage references
├── orders & order_items    # Order history & transaction state
├── reviews & questions     # Social proof & user interactions
├── favorites & cart_items  # User personalized state
├── discount_codes          # Promotional vouchers engine
└── support_tickets         # Customer support messaging
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js `20.x` or higher
- npm, pnpm, or yarn
- A Supabase project (cloud or local)

### 1. Clone & Install
```bash
git clone https://github.com/Vidson313/sorena-marketplace.git
cd sorena-marketplace
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your credentials:
```bash
cp .env.example .env.local
```

Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Migrations
Apply the database schema to your Supabase instance:
```bash
npx supabase db push
# or run the SQL files from /supabase/migrations in Supabase SQL Editor
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Project Structure

```
sorena-marketplace/
├── src/
│   ├── app/
│   │   ├── (auth)/         # Sign-in, sign-up, forgot-password
│   │   ├── admin/          # Admin portal (products, orders, reviews, users)
│   │   ├── dashboard/      # Customer user dashboard & order history
│   │   ├── products/       # Catalog & [slug] product detail page
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout flow & payment handling
│   │   ├── layout.tsx      # Root RTL layout + Theme provider
│   │   └── page.tsx        # Homepage with hero, categories & featured items
│   ├── components/
│   │   ├── ui/             # Radix-based reusable UI primitives
│   │   ├── navbar.tsx      # Navigation with auth state & cart count
│   │   ├── hero.tsx        # Hero banner section
│   │   └── product-card.tsx# Product display card with badges
│   ├── lib/                # Database queries & utility helpers
│   └── types/              # TypeScript definitions
├── supabase/
│   ├── migrations/         # 6 reproducible SQL migration scripts
│   └── server.ts           # Supabase SSR client helper
└── public/                 # Static assets & images
```

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">
  <sub>Developed with clean architecture by <a href="https://github.com/Vidson313">Vidson313</a></sub>
</div>

---

## ☁️ Deployment

### Option 1: Vercel (Recommended — 1-Click)
1. Push this repository to GitHub.
2. Import project into [Vercel Dashboard](https://vercel.com/new).
3. Set environment variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.).
4. Hit **Deploy**.

### Option 2: Cloudflare Pages (Git Integration)
1. In Cloudflare Dashboard, go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select `sorena-marketplace`.
3. Build preset: **Next.js**.
4. Build command: `npx @cloudflare/next-on-pages`.
5. Output directory: `.vercel/output/static`.
6. Add environment variable: `NODE_VERSION = 20`.
