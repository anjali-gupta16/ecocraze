import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Auth gate — redirects unauthenticated visitors to /login.
 * Preserves the attempted URL so login can redirect back.
 */
export default function RequireAuth({
  children,
  requireAdmin = false,
}: {
  children: React.ReactElement;
  requireAdmin?: boolean;
}) {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Still checking session — show nothing (avoids flash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin && profile?.role !== 'admin') {
    return <Navigate to="/login?error=admin_required" state={{ from: location }} replace />;
  }

  return children;
}
