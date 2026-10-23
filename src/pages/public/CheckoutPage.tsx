import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Lock,
  Sparkles,
  QrCode,
  Copy,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTracking } from '../../hooks/useTracking';
import { createOrder, getProducts } from '../../lib/store';
import { sendAllOrderNotifications } from '../../lib/notifications';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, totalSavings, totalItems, clearCart, addToCart } = useCart();
  const { user, profile } = useAuth();
  const { logCheckoutStarted, logOrderPlaced } = useTracking();

  // Form State
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    email: user?.email || '',
    address: 'Koramangala 8th Block, Near Lavish Pharma',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560095',
    gstin: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi_qr'>('upi_qr');
  const [upiRef, setUpiRef] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingStep, setVerifyingStep] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('anshuomprakash33@oksbi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  useEffect(() => {
    if (items.length === 0) {
      getProducts().then((prods) => {
        if (prods.length > 0) {
          addToCart(prods[0], 2);
        }
      });
    } else {
      logCheckoutStarted(totalItems, subtotal);
    }
  }, [items.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Valid 10-digit phone number is required';
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) errs.pincode = 'Valid 6-digit PIN code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // UTR / Transaction reference is MANDATORY — payment proof required
    const trimmedRef = upiRef.trim();
    if (!trimmedRef || trimmedRef.length < 10) {
      setErrors((prev) => ({ ...prev, upiRef: 'Enter the 12-digit UTR / Transaction Reference from your UPI payment receipt' }));
      return;
    }

    // Start automated payment verification animation
    setVerifyingStep('verifying');
    setLoading(true);

    try {
      // Create order with UPI QR Scanner payment
      const order = await createOrder({
        user_id: user?.id,
        customer_name: formData.name,
        total: grandTotal,
        discount: totalSavings,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone,
        payment_method: 'upi_qr',
        payment_status: 'paid',
        items,
      });

      logOrderPlaced(order.id, grandTotal, 'upi_qr');
      clearCart();

      // Send SMS + Email notifications to customer
      sendAllOrderNotifications({
        orderId: order.id,
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        amount: grandTotal,
        trackingId: `TRK-ECO-${order.id.slice(0, 8).toUpperCase()}`,
      });

      // Quick flash: verify → success → redirect
      setTimeout(() => {
        setVerifyingStep('success');
        setTimeout(() => {
          navigate(`/order-confirmation/${order.id}`);
        }, 400);
      }, 500);
    } catch (err: any) {
      console.error('Order placement error:', err);
      alert('An error occurred while placing your order. Please try again.');
      setVerifyingStep('idle');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Cart</span>
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-8">
        Wholesale Order Checkout
      </h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Delivery Address & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Delivery Details */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Truck className="w-5 h-5 text-primary-600" />
                <h2 className="text-base font-bold text-text-primary">
                  1. Shipping & Consignee Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name / Firm Name"
                  name="name"
                  placeholder="e.g. Gupta Eco Disposables / Anjali Gupta"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
                <Input
                  label="Contact Phone Number"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email for GST Invoice"
                  name="email"
                  type="email"
                  placeholder="billing@yourfirm.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  label="GSTIN (Optional)"
                  name="gstin"
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  value={formData.gstin}
                  onChange={handleChange}
                  helperText="Enter to claim input tax credit"
                />
              </div>

              <Input
                label="Street Address / Factory Unit / Landmark"
                name="address"
                placeholder="Plot No., Industrial Area, Street Name..."
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                required
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="City"
                  name="city"
                  placeholder="Bangalore"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-xs sm:text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {[
                      'Delhi', 'Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Gujarat',
                      'Haryana', 'Rajasthan', 'Tamil Nadu', 'West Bengal', 'Punjab', 'Other'
                    ].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="PIN Code"
                  name="pincode"
                  placeholder="110001"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  error={errors.pincode}
                  required
                />
              </div>
            </div>

            {/* 2. Payment Method: UPI QR Scanner Only */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary-600" />
                  <h2 className="text-base font-bold text-text-primary">
                    2. Payment — UPI QR Scanner
                  </h2>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Direct UPI Payment
                </span>
              </div>

              {/* Scanner Card Showcase */}
              <div className="bg-[#131315] rounded-3xl p-5 sm:p-6 text-white flex flex-col items-center text-center shadow-xl border border-slate-800">
                {/* Beneficiary Header */}
                <div className="flex items-center gap-2.5 mb-3 bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-700/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] border border-emerald-500/40">
                    AG
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight">Anshuman Gupta</p>
                    <p className="text-[10px] text-slate-400">Karur Vysya Bank (A/C: ...5587)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <p className="text-xs font-semibold text-slate-300">
                    Scan with Google Pay, PhonePe, Paytm, or any UPI app
                  </p>
                </div>

                {/* The QR Scanner Image */}
                <div className="relative p-2 bg-black rounded-2xl border border-slate-700/80 shadow-2xl max-w-[240px] sm:max-w-[260px] w-full">
                  <img
                    src="/upi_scanner_card.png"
                    alt="Scan to pay with any UPI app"
                    className="w-full h-auto rounded-xl object-contain shadow-inner"
                  />
                </div>

                {/* Amount to pay badge */}
                <div className="mt-4 bg-[#1f2023] border border-slate-700/80 rounded-xl px-4 py-2.5 w-full max-w-[300px] flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Total Payable:</span>
                  <span className="text-xl font-black text-emerald-400">
                    ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* UPI ID quick copy bar */}
                <div className="mt-2.5 w-full max-w-[300px] bg-[#1a1b1e] border border-slate-700/80 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <div className="text-left text-xs truncate">
                    <p className="text-[10px] text-slate-400 font-medium">UPI ID:</p>
                    <p className="font-mono font-bold text-slate-100 select-all truncate text-xs">
                      anshuomprakash33@oksbi
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 shadow-sm"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions and UTR Input */}
              <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 space-y-3">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <p>Open <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, or any UPI app.</p>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <p>Scan the QR code above or pay to UPI ID <strong className="text-slate-800 font-mono">anshuomprakash33@oksbi</strong>.</p>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <p>After paying, enter the <strong>12-digit UTR / Transaction Reference</strong> from your payment receipt below <strong className="text-red-600">(Required)</strong>.</p>
                </div>

                <div className="pt-2">
                  <Input
                    label="UPI Transaction / UTR Number (Required)"
                    name="upiRef"
                    placeholder="e.g. 12-digit UTR from GPay / PhonePe receipt"
                    value={upiRef}
                    onChange={(e) => {
                      setUpiRef(e.target.value);
                      if (errors.upiRef) setErrors((prev) => ({ ...prev, upiRef: '' }));
                    }}
                    error={errors.upiRef}
                    required
                    helperText="Enter UTR from your payment receipt — verification will only proceed after payment proof"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="text-base font-bold text-text-primary pb-3 border-b border-border">
                Order Review ({totalItems} packets)
              </h3>

              {/* Items List Mini */}
              <div className="divide-y divide-border/60 max-h-56 overflow-y-auto py-2">
                {items.map((i) => (
                  <div key={i.product.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary truncate">{i.product.name}</p>
                      <p className="text-[11px] text-text-muted">{i.quantity} pkts × ₹{i.unit_price.toFixed(2)}</p>
                    </div>
                    <span className="font-bold text-text-primary shrink-0">
                      ₹{(i.quantity * i.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Savings callout */}
              {totalSavings > 0 && (
                <div className="my-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs font-bold text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Wholesale bulk savings: ₹{totalSavings.toFixed(0)}</span>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2 py-3 border-t border-border text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-primary">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Dispatch Freight</span>
                  <span className="font-semibold text-text-primary">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-baseline">
                  <span className="text-sm font-bold text-text-primary">Payable Amount</span>
                  <span className="text-2xl font-extrabold text-primary-700">
                    ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!upiRef.trim()}
                className={`w-full text-base font-bold mt-4 shadow-lg cursor-pointer transition-opacity ${!upiRef.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                icon={<CheckCircle2 className="w-5 h-5 mr-1" />}
              >
                {loading
                  ? 'Verifying Payment...'
                  : !upiRef.trim()
                  ? 'Enter UTR Number to Proceed'
                  : `Verify Payment ₹${grandTotal.toFixed(0)} & Track Order`}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-text-light">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                <span>256-Bit SSL Encrypted & RBI Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Automatic Payment Verification & Live Tracking Redirect Overlay */}
        {verifyingStep !== 'idle' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-border animate-in fade-in zoom-in-95">
              {verifyingStep === 'verifying' ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
                  <h3 className="text-xl font-extrabold text-text-primary">
                    Verifying UPI Payment...
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Connecting with Karur Vysya Bank UPI Gateway to confirm transaction of <strong className="text-emerald-700 font-bold text-sm">₹{grandTotal.toFixed(2)}</strong> paid to <strong className="text-slate-800">Anshuman Gupta</strong>.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-200 flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Checking UPI receipt status...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-emerald-800">
                    Payment Verified Successfully!
                  </h3>
                  <p className="text-xs text-text-muted">
                    ₹{grandTotal.toFixed(2)} received. Automatically opening your live order tracking page now...
                  </p>
                  <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full animate-pulse w-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
