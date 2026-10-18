import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { useTracking } from '../../hooks/useTracking';
import { useAuth } from '../../contexts/AuthContext';

export default function PublicLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  useTracking(); // tracks page_views and ga4

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary antialiased selection:bg-primary-100 selection:text-primary-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {user ? (
        <>
          <Footer />
          <WhatsAppButton />
        </>
      ) : (
        <footer className="py-6 border-t border-border bg-white text-center text-xs text-text-muted">
          <p>© {new Date().getFullYear()} Ecocraze. Wholesale B2B Platform. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}
