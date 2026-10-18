# 🌱 Ecocraze — Eco-Friendly B2B Wholesale Tableware E-Commerce

<div align="center">

[![GitHub Repository](https://img.shields.io/badge/GitHub-anjali--gupta16%2Fecocraze-181717?style=for-the-badge&logo=github)](https://github.com/anjali-gupta16/ecocraze)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**A high-performance, full-stack B2B and retail e-commerce platform built for biodegradable food packaging, paper plates, dona bowls, and napkins.**

Featuring dynamic bulk-tier wholesale pricing, seamless WhatsApp ordering, multi-method checkouts (Razorpay, UPI QR, COD), comprehensive telemetry tracking, and an executive administration console.

[Explore Repository](https://github.com/anjali-gupta16/ecocraze) · [Report Bug](https://github.com/anjali-gupta16/ecocraze/issues) · [Request Feature](https://github.com/anjali-gupta16/ecocraze/issues)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [🛍️ Public Storefront](#️-public-storefront)
  - [📦 B2B Bulk Tier Engine](#-b2b-bulk-tier-engine)
  - [💳 Checkouts & Payments](#-checkouts--payments)
  - [📊 Private Admin Console](#-private-admin-console)
  - [📈 Telemetry & Conversion Funnel](#-telemetry--conversion-funnel)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Quick Start & Local Setup](#-quick-start--local-setup)
- [Database & Supabase Setup](#-database--supabase-setup)
- [Demo Credentials](#-demo-credentials)
- [Vercel Deployment Guide](#-vercel-deployment-guide)
- [Contributing & License](#-contributing--license)

---

## 🌿 Overview

**Ecocraze** solves the packaging supply chain challenge for caterers, restaurants, event planners, and retail distributors by transitioning from single-use plastics to certified biodegradable alternatives. 

Unlike traditional consumer shops, Ecocraze features a specialized **B2B Bulk-Tier Pricing Engine** that automatically calculates bulk discounts in real-time, displays volume savings, supports GST billing, and offers both digital payment gateways and instant **WhatsApp Wholesale Ordering**.

---

## ✨ Key Features

### 🛍️ Public Storefront
- **Dynamic Homepage:** Hero showcase, sustainable value pillars, category navigator, top-selling wholesale packages, and customer reviews.
- **Interactive Products Catalog:** 
  - Filter by category (*Paper Plates*, *Dona Bowls*, *Tissue Papers*, *Meal Trays*).
  - Instant live text search and multi-criteria sorting (Price, Popularity, Wholesale Savings).
  - Real-time stock status badge (*In Stock*, *Low Stock*, *Out of Stock*).
- **Product Detail Page:**
  - Interactive quantity selector with automatic tier break highlights.
  - Subtotal calculator displaying total cost and bulk savings.
  - Food-grade quality certifications, grease resistance indicators, and related items.
- **Order Lifecycle Tracking:**
  - 5-step visual tracking timeline: `Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`.
  - Comprehensive customer order history with **1-Click Instant Reorder**.

### 📦 B2B Bulk Tier Engine
- Automatically scales unit prices based on order volume (e.g., 1–9 pkts, 10–49 pkts, 50+ pkts).
- Transparent savings matrix rendered directly on both catalog cards and product detail views.
- Automatic free shipping progress tracker when cart value exceeds ₹999.

### 💳 Checkouts & Payments
- **Razorpay Integration:** Full test mode gateway supporting Cards, NetBanking, and UPI.
- **Direct UPI QR Scanner:** Interactive payment modal with scan-to-pay QR code and transaction UTR verification.
- **Cash on Delivery (COD):** Available for verified local distributors.
- **B2B Billing:** Integrated company GSTIN input for tax input credit claims.
- **WhatsApp Direct Ordering:** One-click dispatch with pre-filled, formatted order summary via WhatsApp API.

### 📊 Private Admin Console (`/admin`)
- **Executive Dashboard:** Turnover KPIs, 7-day revenue trend area chart, pending dispatch alerts, and stock safety monitoring.
- **Catalog & Inventory Control:** Full CRUD interface for adding products, adjusting inventory, modifying bulk tiers, and setting low-stock thresholds (< 350 units).
- **Order Pipeline Manager:** Filter orders by status, change dispatch stages, inspect customer details, and record manual payment verifications.
- **Revenue & Settlement Accounting:** Clear financial segregation of:
  - *Gross Turnover*
  - *Settled Collections*
  - *Pending Receivables*
  - *Refunds Processed*
  - *Average Order Value (AOV)*
- **Security & Authentication Audit:** Client registry tracking last active sessions and failed login attempts.

### 📈 Telemetry & Conversion Funnel
- Automated logging for key user journey events (`page_view`, `product_view`, `add_to_cart`, `checkout_started`, `order_placed`).
- Admin funnel analytics visualizing conversion efficiency and drop-off percentages at each step.
- Built-in session tracking that functions with Supabase or falls back seamlessly to offline state.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Type-safe, component-driven UI architecture |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility styling with custom eco-green theme tokens |
| **Build & Tooling** | [Vite 6](https://vitejs.dev/) | Sub-second HMR and production bundle optimization |
| **Routing** | [React Router v7](https://reactrouter.com/) | SPA client-side routing with nested layouts |
| **Database & Auth** | [Supabase](https://supabase.com/) | PostgreSQL backend with Row Level Security (RLS) policies |
| **Data Visualization** | [Recharts](https://recharts.org/) | Responsive SVG charts for revenue and analytics telemetry |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent icons across storefront and admin |
| **Payments** | [Razorpay](https://razorpay.com/) + UPI | Multi-channel payment gateway and manual settlement workflows |

---

## 📂 Project Architecture

```
paper-plate/
├── public/                 # Static assets, icons, and UPI payment QR assets
├── src/
│   ├── assets/             # Brand logos and banners
│   ├── components/
│   │   ├── admin/          # KPI cards, revenue charts, and admin tables
│   │   ├── auth/           # Route guards (RequireAuth) and login forms
│   │   ├── cart/           # Cart items, bulk calculators, and checkout summaries
│   │   ├── layout/         # PublicLayout, AdminLayout, Navbar, Footer, WhatsApp floating button
│   │   ├── order/          # 5-step visual delivery timeline
│   │   ├── product/        # BulkPricingTable, ProductGrid, ProductCard
│   │   └── ui/             # Reusable Badge, Button, Card, Modal, Input, Spinner
│   ├── contexts/           # AuthContext, CartContext (state management)
│   ├── hooks/              # Custom telemetry hooks (useTracking)
│   ├── lib/                # Supabase client, Razorpay helper, WhatsApp messaging, mock fallback data
│   ├── pages/
│   │   ├── admin/          # AdminOverview, AdminOrders, AdminProducts, AdminPayments, AdminVisitors
│   │   └── public/         # HomePage, ProductsPage, ProductDetailPage, CartPage, CheckoutPage, etc.
│   ├── types/              # Comprehensive TypeScript interfaces
│   ├── App.tsx             # Root route definitions
│   └── main.tsx            # Application entry point
├── supabase/
│   ├── schema.sql          # Complete PostgreSQL schema with RLS and triggers
│   └── seed.sql            # Seed dataset for 12 eco-friendly products and bulk tiers
├── .env.example            # Environment variable template
├── vercel.json             # SPA redirect configuration for Vercel
└── package.json            # Project dependencies and build scripts
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or later)
- `npm` or `yarn` / `pnpm`

### 1. Clone the Repository
```bash
git clone https://github.com/anjali-gupta16/ecocraze.git
cd ecocraze
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```

Open `.env` and fill in your keys (or leave blank to use the **Zero-Config Offline Demo Mode**):
```env
# Supabase Configuration (Leave blank for offline mock mode)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Razorpay Test Mode Key
VITE_RAZORPAY_KEY_ID=rzp_test_EcocrazeDemo

# WhatsApp Wholesale Contact (Include country code, no + sign)
VITE_WHATSAPP_PHONE=917676349773

# Optional Google Analytics 4
VITE_GA4_MEASUREMENT_ID=
```

> **Offline Demo Mode:** If Supabase keys are not set, Ecocraze automatically launches with a full in-memory fallback store loaded with 12 seed products, sample orders, and live analytics!

### 4. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to explore the application.

---

## 🗄️ Database & Supabase Setup

To enable cloud persistence and real authentication:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Paste the contents of `supabase/schema.sql` and click **Run** to set up:
   - `profiles` with role-based access (`admin` vs `customer`).
   - `products` and `bulk_pricing` tables.
   - `orders`, `order_items`, and `payments` tables with full Row-Level Security.
   - `events` telemetry tracking table.
4. Paste the contents of `supabase/seed.sql` and click **Run** to populate initial products and bulk discount rules.
5. Copy your **Project URL** and **Anon Key** from *Project Settings ➔ API* into your `.env`.

---

## 🔐 Demo Credentials

Quick access accounts for testing the platform:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@ecocraze.in` | `Admin@123456` | Full access to `/admin` dashboard, catalog CRUD, orders, and telemetry |
| **Retail Customer** | `client@restaurant.com` | `Customer@123` | Storefront, cart, checkout, order tracking, and account history |

*(Tip: You can also use the **"Fill Admin Demo"** button directly on the `/login` page for 1-click login!)*

---

## 🚢 Vercel Deployment Guide

Deploy your own live version in less than 2 minutes:

1. Push your repository to your GitHub account (`https://github.com/anjali-gupta16/ecocraze`).
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select and import the `ecocraze` repository.
4. Verify build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add your environment variables from `.env` under **Environment Variables**.
6. Click **Deploy**. *(The included `vercel.json` automatically handles all SPA route rewrites to avoid 404s on page refresh.)*

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Developed by <a href="https://github.com/anjali-gupta16">Anjali Gupta</a> · Built with React & Tailwind CSS</sub>
</div>
