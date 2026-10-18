import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { createWhatsAppUrl } from '../../lib/whatsapp';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMessage = `Hello Ecocraze! I am looking for wholesale rates and bulk orders for disposable plates, bowls, and tissue paper.`;
  const whatsappUrl = createWhatsAppUrl(defaultMessage);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip / Bubble */}
      {showTooltip && (
        <div
          className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-border shadow-md animate-fade-in"
          style={{ boxShadow: 'var(--shadow-card-hover)' }}
        >
          <span className="text-xs font-semibold text-text-primary">
            Wholesale Inquiry / Custom Branding?
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-text-light hover:text-text-primary p-0.5"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="relative group w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 duration-200"
        style={{ boxShadow: '0 8px 24px -2px rgba(37, 211, 102, 0.4)' }}
      >
        {/* Soft pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:opacity-40" />
        <MessageCircle className="w-7 h-7 fill-white stroke-none relative z-10" />
      </a>
    </div>
  );
}
