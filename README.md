# 🍃 ECOCRAZE — Singularity V1.0

**ECOCRAZE** is a next-generation, AI-ready multi-channel B2B & retail wholesale e-commerce platform built for the modern eco-friendly disposable tableware industry. It features a stunning Eco-Modern/Glassmorphism UI, automated bulk tiered-pricing engines, instant WhatsApp dispatch orchestration, live order tracking with a 5-step visual timeline, and an all-in-one private administration command center.

Live URL: [https://ecocraze.vercel.app](https://ecocraze.vercel.app)  
GitHub Repository: [https://github.com/anjali-gupta16/ecocraze](https://github.com/anjali-gupta16/ecocraze)

---

## 🚀 Key Features & Modules

### 1. 🔐 Role-Based Access Control (RBAC) & Authentication
- **Admin**: Full access to the private `/admin` command center, gross revenue accounting, inventory management, customer registries, security audit logs, and order dispatch pipelines.
- **Wholesale Customer**: Access to wholesale discounts, dynamic cart recalculations, tax invoice generation, 1-click reorder history, and personalized profile dashboards.
- **Guest / Retail Shopper**: Open catalog browsing, search and filter capabilities, and instant checkout with real-time tier calculation.
- **1-Click Evaluation Gateways**: Instant login shortcuts (`/customer` and `/admin-access`) with pre-populated credentials for seamless evaluation without manual typing.

### 2. 🏷️ Dynamic B2B Bulk Tiered Pricing Engine
- **Automated Price Breaks**: Instant wholesale quantity discounts (e.g. 1–9, 10–49, 50+ packets) applied dynamically in the product stepper and shopping cart.
- **Transparent Savings Badges**: Real-time visualization of per-packet savings percentage and gross discount amounts encouraging higher cart values.
- **Free Shipping Threshold**: Dynamic animated progress bar showing the remaining amount required for free freight shipping (orders ≥ ₹999).
- **GSTIN Tax Invoicing**: Dedicated GST number capture at checkout for business input tax credit claims.

### 3. 💬 WhatsApp Ordering Hub & Direct Conversational Commerce
- **1-Click WhatsApp Ordering**: Prefilled WhatsApp orders with itemized product names, quantities, wholesale discounts, delivery addresses, and total costs.
- **Floating Communication Hub**: Global reactive WhatsApp contact widget for quick inquiries, bulk rate negotiations, and logistics support.
- **Automated Message Templating**: Direct integration via `VITE_WHATSAPP_PHONE` enabling zero-friction procurement for restaurant and catering partners.

### 4. 💳 Hybrid Dual-Rail Payments
- **Razorpay Online Gateway**: Full test mode integration supporting Credit/Debit Cards, NetBanking, and Wallets with secure signature tracking.
- **Instant UPI QR Scanner**: Dynamic embedded UPI QR modal allowing immediate direct payment scanning via PhonePe, Google Pay, and Paytm.
- **Cash on Delivery (COD)**: Traditional B2B settlement workflow with order status tracking.
- **Graceful Fallback (Demo Mode)**: If keys are missing, the system gracefully processes mock checkouts without failing or breaking presentations.

### 5. 🛡️ Private Admin Command Center & Operations HQ (`/admin`)
- **Gross Turnover & Analytics**: Real-time gross turnover KPI cards, average order values (AOV), and 7-day revenue area charts powered by Recharts.
- **Telemetry Funnel & Visitor Tracking**: Full behavioral telemetry logging `page_view`, `product_view`, `add_to_cart`, `checkout_started`, and `order_placed` events into Supabase, complete with a 5-stage checkout funnel with drop-off analytics.
- **Live Inventory & Pricing Editor**: Full CRUD over catalog items, bulk tier adjustment, stock increment/decrement, and low-stock threshold alerts (< 350 units).
- **Order Dispatch Workflow**: 5-stage order transition (`Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`) with cancel and refund management.
- **Security & Failed Login Audit**: Continuous audit log recording all successful entries and suspicious failed authentication attempts.

### 6. 🎨 UI/UX & Aesthetics
- Built with a tailored **Eco-Modern / Glassmorphism** aesthetic.
- Features dynamic micro-animations, glowing emerald badges (`#16A34A`), frosted translucent glass cards, and reactive hover states.
- Fully responsive across mobile, tablet, and ultra-wide screens with accessible color contrast and modern typography.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Vanilla CSS tokens (`src/index.css`), Tailwind CSS v4, Lucide React (Icons)
- **Routing & State**: React Router DOM v7 (SPA with `vercel.json` rewrites), Context API (`AuthContext`, `CartContext`)
- **Visualizations**: Recharts (Interactive Revenue Trends, Sales Area Charts)
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Auth Session Tokens)
- **Payments**: Razorpay Checkout SDK + Direct UPI QR Scanner Card
- **Hosting & CI/CD**: Vercel (Edge Network) + GitHub Actions/Webhooks

---

## 🏗️ System Architecture

```text
+------------------------------------------------------------------------------------+
|                                    CLIENT TIER                                     |
|  [ Storefront ]      [ Bulk Catalog ]     [ Shopping Cart ]     [ Admin Console ]  |
|  (Home/Products)     (Quantity Tiers)     (Dynamic Savings)     (KPIs & Analytics) |
+------------------------------------------+-----------------------------------------+
                                           |
                                  React Router v7 / SPA
                                           |
+------------------------------------------v-----------------------------------------+
|                                    LOGIC TIER                                      |
|  [ AuthContext ]      [ CartContext ]      [ Telemetry Engine ]     [ Mock Store ] |
|  (RBAC & Sessions)    (Tier Calculations)  (useTracking / GA4)      (Offline Fall) |
+------------------+-----------------------+-----------------------+-----------------+
                   |                       |                       |
+------------------v-----+   +-------------v----------+   +--------v-----------------+
|     PAYMENT RAILS      |   |   WHATSAPP API HUB     |   |   DATABASE & AUTH (RLS)  |
| - Razorpay SDK         |   | - Direct Prefilled URL |   | - Supabase PostgreSQL    |
| - Dynamic UPI QR Modal |   | - 1-Click B2B Dispatch |   | - Profiles, Orders, Logs |
| - COD Settlement Engine|   | - Phone Concierge      |   | - Row-Level Security     |
+------------------------+   +------------------------+   +--------------------------+
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/anjali-gupta16/ecocraze.git
cd ecocraze
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```

Add your configuration keys:
```env
# Supabase Configuration (Optional - built-in fallback activated if blank)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Razorpay Test Mode Key ID
VITE_RAZORPAY_KEY_ID=rzp_test_PlateConnectDemo

# WhatsApp Order & Support Phone (Country code without '+')
VITE_WHATSAPP_PHONE=917676349773

# Optional Google Analytics 4 Measurement ID
VITE_GA4_MEASUREMENT_ID=
```

> 💡 **Graceful Fallback (Offline Mode):** If Supabase keys are not provided, Ecocraze automatically launches in **Integrated Demo Mode** loaded with all 12 seed products, sample orders, and live telemetry so your demonstration never breaks.

### 4. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to view the application.

---

## 🗄️ Database Schema (Supabase)

The project includes production-ready database scripts located in [`supabase/schema.sql`](supabase/schema.sql) and [`supabase/seed.sql`](supabase/seed.sql):

- **`profiles`**: User profiles linked to Supabase Auth (`id`, `full_name`, `company_name`, `phone`, `role`, `gstin`).
- **`products`**: Catalog items (`id`, `name`, `category`, `size`, `price`, `stock`, `image_url`, `active`).
- **`bulk_pricing`**: Quantity break definitions (`product_id`, `min_qty`, `max_qty`, `unit_price`).
- **`orders`**: Customer purchase records (`order_number`, `user_id`, `total_amount`, `discount_amount`, `status`, `shipping_address`).
- **`order_items`**: Line items per order (`order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`).
- **`payments`**: Transaction records (`order_id`, `amount`, `payment_method`, `transaction_id`, `status`).
- **`events`**: Behavioral analytics log (`session_id`, `event_type`, `page_path`, `product_id`, `metadata`).
- **`security_logs`**: Authentication audit trails for security monitoring.

*(Row Level Security (RLS) policies ensure clients only view their own records while administrators retain system-wide visibility).*

---

## 🔑 Quick Access & Demo Credentials

| Role | 1-Click Fast Link | Email | Password |
|---|---|---|---|
| **Wholesale Customer** | [`/customer`](https://ecocraze.vercel.app/customer) | `anjali.gupta.ashok16@gmail.com` | `Anjali@123456` |
| **Admin Operations** | [`/admin-access`](https://ecocraze.vercel.app/admin-access) | `anshumangupta2501@gmail.com` | `Admin@123456` |

---

## 🚢 Deployment on Vercel

1. Import repository `anjali-gupta16/ecocraze` on [Vercel](https://vercel.com/).
2. Verify Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click **Deploy**. The included `vercel.json` ensures all client-side routes seamlessly rewrite to `index.html`.

---

## 👨‍💻 Developed For
Built as a comprehensive hackathon project showcasing the integration of **Modern Web Technologies, Dynamic Bulk B2B Commerce, Hybrid Payments, and Telemetry Analytics** to solve real-world distribution challenges for eco-friendly disposable tableware.
