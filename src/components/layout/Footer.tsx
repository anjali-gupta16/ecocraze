import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Ecocraze</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              India's trusted platform for eco-friendly disposable tableware.
              Premium paper plates, dona bowls, and tissue papers at wholesale prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-300 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/products?category=paper-plates', label: 'Paper Plates' },
                { to: '/products?category=dona-bowls', label: 'Dona Bowls' },
                { to: '/products?category=tissue-papers', label: 'Tissue Papers' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-200 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-300 mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/account', label: 'My Account' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-200 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-300 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-primary-200 text-sm">Koramangala 8th Block, Near Lavish Pharma, Bangalore, Karnataka</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-primary-200 text-sm">+91 76763 49773</span>
                  <span className="text-primary-200 text-sm">+91 63067 84568</span>
                  <span className="text-primary-200 text-sm">+91 78922 80294</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-primary-200 text-sm font-semibold">orders@ecocraze.in</span>
                  <span className="text-primary-200 text-sm">support@ecocraze.com</span>
                  <span className="text-primary-300 text-xs">wholesale@ecocraze.com</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-primary-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-primary-300 text-xs">
            © {new Date().getFullYear()} Ecocraze. All rights reserved. 100% eco-friendly products.
          </p>
          <div className="flex items-center gap-4 text-primary-300 text-xs">
            <span>🌿 Biodegradable</span>
            <span>🛡️ Secure Payments</span>
            <span>🚚 Pan-India Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
