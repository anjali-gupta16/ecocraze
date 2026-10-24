import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Auth gate — redirects unauthenticated visitors to /login.
 * For admin routes, requires a separate admin login session.
 * Preserves the attempted URL so login can redirect back.
 */
export default function RequireAuth({
  children,
  requireAdmin = false,
}: {
  children: React.ReactElement;
  requireAdmin?: boolean;
}) {
  const { user, profile, loading, isAdmin, adminAuthenticated } = useAuth();
  const location = useLocation();

  // Still checking session — show nothing (avoids flash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  let effectiveUser = user;
  let effectiveIsAdmin = isAdmin || profile?.role === 'admin';

  // Instant fallback check to localStorage to eliminate state hydration timing issues
  if (!effectiveUser) {
    try {
      const saved = localStorage.getItem('ecocraze_demo_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) effectiveUser = parsed.user;
        const savedEmail = (parsed.user?.email || parsed.profile?.email || '').toLowerCase();
        if (
          parsed.profile?.role === 'admin' ||
          savedEmail === 'anshumangupta2501@gmail.com' ||
          savedEmail === 'anjali.gupta.ashok16@gmail.com' ||
          savedEmail === 'admin@ecocraze.com' ||
          savedEmail.includes('admin')
        ) {
          effectiveIsAdmin = true;
        }
      }
    } catch {}
  }

  // Admin routes: must be an admin user AND have authenticated via admin login page
  if (requireAdmin) {
    if (!effectiveUser || !effectiveIsAdmin || !adminAuthenticated) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  }

  if (!effectiveUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
