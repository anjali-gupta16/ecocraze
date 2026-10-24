import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, Leaf, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, profile, signOut, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const showNav = Boolean(user && !isAuthPage);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border" style={{ boxShadow: 'var(--shadow-sticky)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/' : '/login'} className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">
              Eco<span className="text-primary-600">craze</span>
            </span>
          </Link>

          {/* Desktop Nav - ONLY visible when logged in AND not on auth pages */}
          {showNav && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-text-secondary hover:text-primary-600 hover:bg-primary-50/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Admin Dashboard Quick Access Button */}
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Dashboard</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            )}

            {/* Cart - ONLY visible when logged in AND not on auth pages */}
            {showNav && (
              <Link
                to="/cart"
                className="relative p-2 rounded-lg hover:bg-primary-50 transition-colors"
                title="View Wholesale Cart"
              >
                <ShoppingCart className="w-5 h-5 text-text-secondary" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu when logged in, or Login/Register buttons when not logged in or on auth pages */}
            {showNav ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    {(profile?.name || user?.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-text-primary">
                    {profile?.name || 'Account'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-border z-50 py-2" style={{ boxShadow: 'var(--shadow-card-hover)' }}>
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-semibold text-text-primary">{profile?.name}</p>
                        <p className="text-xs text-text-muted">{user?.email}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-primary-50 hover:text-primary-700"
                      >
                        <User className="w-4 h-4" /> My Account
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-primary-50 hover:text-primary-700"
                        >
                          <Shield className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => { signOut(); setProfileOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {location.pathname !== '/login' && (
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 bg-primary-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Login
                  </Link>
                )}
                {location.pathname !== '/register' && (
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs sm:text-sm font-semibold border border-primary-200 transition-colors"
                  >
                    Register
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle - ONLY visible when showNav is true */}
            {showNav && (
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav - ONLY when showNav is true */}
        {showNav && mobileOpen && (
          <div className="md:hidden border-t border-border py-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-text-secondary hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
