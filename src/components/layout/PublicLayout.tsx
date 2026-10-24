import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { useTracking } from '../../hooks/useTracking';
import { useAuth } from '../../contexts/AuthContext';
import { saveCustomerVisit } from '../../lib/store';

export default function PublicLayout() {
  const { pathname } = useLocation();
  const { user, profile } = useAuth();
  useTracking(); // tracks page_views and ga4

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Track customer visits whenever a customer visits or navigates the customer website
  useEffect(() => {
    if (profile?.email) {
      const sessionKey = `pc_cust_visit_${profile.email}_session`;
      const lastVisitTime = sessionStorage.getItem(sessionKey);
      if (!lastVisitTime || Date.now() - Number(lastVisitTime) > 600000) {
        saveCustomerVisit({
          email: profile.email,
          name: profile.name,
          phone: profile.phone,
          role: profile.role,
        });
        sessionStorage.setItem(sessionKey, String(Date.now()));
      }
    }
  }, [profile, pathname]);

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
