import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Auth Gate
import RequireAuth from './components/auth/RequireAuth';

// Public Pages
import HomePage from './pages/public/HomePage';
import ProductsPage from './pages/public/ProductsPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/public/CheckoutPage';
import OrderConfirmationPage from './pages/public/OrderConfirmationPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AccountPage from './pages/public/AccountPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminOverview from './pages/admin/AdminOverview';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminVisitors from './pages/admin/AdminVisitors';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReviews from './pages/admin/AdminReviews';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes with Shared Navbar, Footer & WhatsApp FAB */}
            <Route path="/" element={<PublicLayout />}>
              {/* Auth-gated pages — unauthenticated users go to /login */}
              <Route index element={<RequireAuth><HomePage /></RequireAuth>} />
              <Route path="products" element={<RequireAuth><ProductsPage /></RequireAuth>} />
              <Route path="products/:id" element={<RequireAuth><ProductDetailPage /></RequireAuth>} />
              <Route path="cart" element={<RequireAuth><CartPage /></RequireAuth>} />
              <Route path="checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
              <Route path="order-confirmation/:id" element={<RequireAuth><OrderConfirmationPage /></RequireAuth>} />
              <Route path="account" element={<RequireAuth><AccountPage /></RequireAuth>} />
              <Route path="about" element={<RequireAuth><AboutPage /></RequireAuth>} />
              <Route path="contact" element={<RequireAuth><ContactPage /></RequireAuth>} />

              {/* Open pages — no auth required */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Admin Routes - Auth & Admin Gate */}
            <Route
              path="/admin"
              element={
                <RequireAuth requireAdmin={true}>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="visitors" element={<AdminVisitors />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reviews" element={<AdminReviews />} />
            </Route>

            {/* Dedicated Admin Login Portal */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Direct 1-Click Access Links */}
            <Route path="/customer" element={<Navigate to="/login" replace />} />
            <Route path="/admin-access" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
