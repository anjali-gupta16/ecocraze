# Ecocraze — Eco-Friendly B2B Wholesale Tableware E-Commerce

> Built for the 2-day Hackathon. A production-ready, responsive B2B and retail e-commerce platform for eco-friendly **Paper Plates, Dona Bowls, and Tissue Papers** with automated bulk-tier pricing, private admin console, visitor analytics funnel, Razorpay test payments, and WhatsApp wholesale ordering.

---

## 🌟 Highlights & Key Features

- **Automated Bulk Pricing Tiers:** Instant tier discounts (e.g. 1–9, 10–49, 50+ packets) applied dynamically in the cart with visible per-packet wholesale savings.
- **WhatsApp Direct Ordering:** Floating WhatsApp hub + "Order on WhatsApp" and "Order Cart on WhatsApp" with formatted prefilled messages using `VITE_WHATSAPP_PHONE`.
- **Public Storefront:**
  - **Home:** Hero value prop, category showcases, why-choose-us, wholesale bestsellers grid, enterprise deals banner, client testimonials.
  - **Products Catalog:** Multi-category filter pills, live search bar, price & savings sort, responsive catalog grid.
  - **Product Detail:** Live bulk price breaks table, interactive quantity stepper with dynamic subtotal recalculation, food-grade eco credentials, and related products.
  - **Cart & Checkout:** Dynamic bulk discount highlights, free shipping progress bar (orders ≥ ₹999), 10-digit phone and PIN validation, GSTIN input credit option.
  - **Order Confirmation & My Account:** 5-step visual dispatch timeline (`Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`), order history, and **1-click Reorder** button.
  - **About & Contact:** Brand mission, sustainability statistics, inquiry form with WhatsApp sales escalation, depot loading hours.
- **Private Admin Console (`/admin`):**
  - **Overview:** Gross turnover KPIs, Recharts 7-day revenue area chart, recent orders table, low-stock alerts.
  - **Visitors Analytics:** Daily/weekly/monthly trends, unique visitors, most viewed pages, top viewed products, and 5-stage checkout funnel with drop-off rates.
  - **Customers & Security:** Registered client accounts, aggregate successful logins, security audit on failed login attempts.
  - **Orders Management:** Live search, dispatch stage dropdown, payment confirmation, cancel & refund processing.
  - **Products & Inventory:** Full CRUD, bulk pricing tier editor, real-time stock adjustment, safety threshold alerts (< 350 pkts).
  - **Payments & Revenue Accounting:** Strictly separates **Total Gross Sales**, **Revenue Received**, **Pending Collections**, **Refunds Processed**, and **Average Order Value (AOV)**.
- **Event Tracking Telemetry:** Logs all user actions (`page_view`, `product_view`, `add_to_cart`, `checkout_started`, `login`, `register`, `order_placed`) to Supabase `events` table with session IDs and optional Google Analytics 4 snippet.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18 + TypeScript** | Client-side application framework |
| **Vite** | Blazing-fast build tool and dev server |
| **Tailwind CSS v4** | Custom theme tokens from Stitch (#16A34A Leaf Green, Amber accents) |
| **React Router v7** | Multi-page client routing with shared layouts |
| **Supabase** | PostgreSQL database, Row-Level Security (RLS), and authentication |
| **Recharts** | Interactive admin area charts and bar graphs |
| **Lucide React** | Consistent, modern icon set |
| **Razorpay** | Test mode online payments with server-side settlement validation |

---

## 🚀 Quick Start & Local Setup

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the template file to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Razorpay Test Mode Key ID (Default public test key enabled)
VITE_RAZORPAY_KEY_ID=rzp_test_EcocrazeDemo

# WhatsApp Phone Number (International format without '+')
VITE_WHATSAPP_PHONE=919876543210

# Optional Google Analytics 4 Measurement ID
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **Note on Offline/Demo Mode:** If you run the app before configuring Supabase keys, Ecocraze automatically activates an integrated fallback store loaded with all 12 seed products, sample orders, and live analytics, allowing full offline evaluation!

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Supabase Database & RLS Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and create a project.
2. Go to **SQL Editor** in the left sidebar.
3. Open `supabase/schema.sql` from this repository, paste the entire SQL into the editor, and click **Run**.
   - This creates `profiles`, `products`, `bulk_pricing`, `orders`, `order_items`, `payments`, and `events` tables with all RLS policies and user creation triggers.
4. Open `supabase/seed.sql`, paste into the editor, and click **Run**.
   - This populates 12 initial products across Paper Plates, Dona Bowls, and Tissue Papers with 3 bulk pricing tiers each.

---

## 🔐 Admin Access & Demo Credentials

To access `/admin`, log in with an administrator account:
- **Email:** `admin@Ecocraze.in`
- **Password:** `Admin@123456`

*(Alternatively, use the **"Fill Admin Demo"** button on the `/login` page for one-click evaluator login!)*

---

## 💳 Razorpay Test Mode Flow

- Test card payments, UPI, and NetBanking are initialized via `initiateRazorpayPayment()` using test credentials.
- Order records are created initially with `payment_status: 'pending'`.
- Status is only updated to `'paid'` upon verified gateway handler completion and recorded into the `payments` table.
- Cash on Delivery (COD) is available as an alternative checkout option.

---

## 🚢 Deployment on Vercel (Step-by-Step)

Follow these exact steps to deploy Ecocraze on [Vercel](https://vercel.com/):

### 1. Import Project
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** ➔ **Project**.
3. Select your GitHub repository: `anjali-gupta16/ecocraze`.

### 2. Configure Build & Output Settings
Vercel automatically detects Vite, but verify the following settings:
- **Framework Preset:** `Vite`
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3. Environment Variables (Required for Full Functionality)
In the **Environment Variables** section during project import (or under **Settings ➔ Environment Variables**):

| Key | Example Value | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://xyzcompany.supabase.co` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase Anon Public Key |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_PlateConnectDemo` | Razorpay Test Key ID |
| `VITE_WHATSAPP_PHONE` | `917676349773` | WhatsApp Order & Support Phone |
| `VITE_GA4_MEASUREMENT_ID` | `G-XXXXXXXXXX` *(Optional)* | Google Analytics 4 Measurement ID |

> 💡 **Offline/Demo Fallback:** If environment variables are omitted or blank, the app runs smoothly with its built-in in-memory catalog, mock orders, and full demo data.

### 4. SPA Routing Configuration
The included [vercel.json](file:///c:/paper%20plate/vercel.json) automatically handles single-page application (SPA) client-side routes, ensuring that refreshing on sub-paths like `/products`, `/checkout`, or `/admin` routes directly to `index.html` without 404 errors.

---

## 🔧 Common Build & Deployment Troubleshooting

### Issue: `npm run build` fails with TS1005 / TS1109 errors
- **Cause:** Duplicate or misplaced syntax in data files or TypeScript declarations.
- **Fix:** Fixed in latest commit by cleaning `src/lib/productsData.ts` and verifying `tsc && vite build` compiles cleanly with zero errors.

### Issue: 404 on page refresh on Vercel
- **Cause:** Missing client-side route rewrites.
- **Fix:** Handled by [vercel.json](file:///c:/paper%20plate/vercel.json) rewrites:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```

---

## 📜 License
MIT License. Built for Ecocraze hackathon submission.

