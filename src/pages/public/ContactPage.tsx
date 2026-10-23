import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { createWhatsAppUrl } from '../../lib/whatsapp';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsAppInquiryUrl = createWhatsAppUrl(
    'Hello Ecocraze! I am looking for custom branding and wholesale pricing for disposable plates and napkins.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3">
          Wholesale Inquiries & Depot Logistics
        </h1>
        <p className="text-sm text-text-muted mt-2">
          Have questions about master cartons, recurring dispatches, or custom restaurant logo printing?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Inquiry Sent Successfully!</h3>
              <p className="text-xs sm:text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                Thank you! Our regional B2B logistics manager will reach out within 2 hours with our wholesale catalog.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Send Another Inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-base font-bold text-text-primary mb-2">Send Wholesale Query</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Person Name"
                  placeholder="Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Catering / Business Name"
                  placeholder="Royal Caterers & Banquet"
                  value={formData.firm}
                  onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone / Mobile Number"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="orders@firm.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                  Your Requirements (Products, Quantity, Destination)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Need 100 cartons of 12-inch silver plates and 50 boxes of 2-ply tissues for wedding season in Delhi..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="block w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-text-primary placeholder:text-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-md cursor-pointer mt-2"
                icon={<Send className="w-4 h-4 ml-1" />}
              >
                Submit Wholesale Inquiry
              </Button>
            </form>
          )}
        </div>

        {/* Contact Info & Direct WhatsApp Hub */}
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Direct Hub */}
          <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-[#25D366] fill-[#25D366]" />
              <h3 className="text-base font-bold text-emerald-950">Instant WhatsApp Support</h3>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Prefer chatting directly? Message our wholesale desk on WhatsApp for instant catalog PDFs, freight quotes, and bulk sample requests.
            </p>
            <a
              href={whatsAppInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20BD5A] transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              <span>Chat with Sales Team (+91 76763 49773)</span>
            </a>
          </div>

          {/* Depot & Office Address */}
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 space-y-4 shadow-sm text-xs text-text-secondary">
            <h3 className="text-sm font-bold text-text-primary">Corporate Office & Central Depot</h3>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-text-primary">Ecocraze Supply Hub</p>
                <p>Koramangala 8th Block, Near Lavish Pharma, Bangalore, Karnataka, India</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-text-primary">Depot Loading Hours</p>
                <p>Monday to Saturday: 8:00 AM – 8:00 PM IST</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-text-primary">Direct Helpline</p>
                <p>+91 76763 49773 (Mon-Sat, 9 AM - 7 PM)</p>
                <p>+91 63067 84568</p>
                <p>+91 78922 80294</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-text-primary">B2B Commercial Desk</p>
                <p className="font-medium text-primary-700">anjali.gupta.ashok16@gmail.com</p>
                <p className="font-medium text-primary-700">anshumangupta2501@gmail.com</p>
                <p className="font-medium text-primary-700">yashaswinim8002@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
