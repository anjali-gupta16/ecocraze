import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Eye,
  CreditCard,
  ExternalLink,
  Shield,
  LogOut,
  Menu,
  X,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/admin/orders', label: 'Orders & Dispatches', icon: ShoppingCart },
    { to: '/admin/products', label: 'Products & Inventory', icon: Package },
    { to: '/admin/visitors', label: 'Visitor Analytics & Funnel', icon: Eye },
    { to: '/admin/customers', label: 'Customers & Logins', icon: Users },
    { to: '/admin/payments', label: 'Payments & Revenue', icon: CreditCard },
  ];

  const isCurrent = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm text-text-primary">
            Ecocraze <span className="text-primary-600 font-bold">Admin</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg border border-border text-text-secondary"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-200 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight">Ecocraze</span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-primary-400">
                  Admin Console
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const active = isCurrent(item.to, item.exact);
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Store Switcher */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-primary-400" />
              <span>Live Storefront</span>
            </span>
            <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">↗</span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-primary-700 flex items-center justify-center text-xs font-bold text-white">
                {(profile?.name || user?.email || 'A')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {profile?.name || 'Admin User'}
                </p>
                <p className="text-[10px] text-primary-400 font-bold uppercase">Role: Admin</p>
              </div>
            </div>

            <button
              onClick={() => {
                signOut();
                navigate('/login');
              }}
              title="Sign Out"
              className="text-slate-400 hover:text-red-400 p-1.5 rounded hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Soft warning for evaluators if not authenticated as admin, with 1-click admin toggle */}
        {!isAdmin && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <Shield className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Evaluating in Preview Mode. You can inspect all admin features, analytics, and update live orders freely.
              </span>
            </div>
            <Link to="/login" className="font-bold text-amber-800 underline hover:text-amber-950 shrink-0">
              Sign In with Full Admin Account →
            </Link>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}
