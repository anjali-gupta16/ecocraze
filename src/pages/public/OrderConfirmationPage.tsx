import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ArrowRight, MessageCircle, Truck, Mail, Smartphone, Clock, AlertTriangle } from 'lucide-react';
import { getOrders } from '../../lib/store';
import { getNotificationStatus } from '../../lib/notifications';
import type { Order } from '../../types';
import OrderTimeline from '../../components/order/OrderTimeline';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { createWhatsAppUrl } from '../../lib/whatsapp';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifStatus, setNotifStatus] = useState<{ smsSent: boolean; emailSent: boolean; phone: string; email: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    getOrders().then((all) => {
      const match = all.find((o) => o.id === id);
      setOrder(match || null);
      setLoading(false);
    });
    // Read notification status
    const ns = getNotificationStatus(id);
    if (ns) setNotifStatus(ns);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" label="Confirming order details..." />
      </div>
    );
  }

  const whatsAppTrackingUrl = createWhatsAppUrl(
    `Hello Ecocraze! I am checking the status and dispatch tracking for Order #${id?.slice(0, 8)}.`
  );

  const isVerificationPending = order?.payment_status === 'verification_pending';
  const isPaid = order?.payment_status === 'paid';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Success & Tracking Hero Header */}
      <div className="text-center bg-white rounded-3xl border border-border p-8 sm:p-12 shadow-sm mb-8 relative overflow-hidden">
        {isVerificationPending ? (
          <>
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50">
              <Clock className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Payment Verification Pending</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-3">
              Order Submitted — Awaiting Verification
            </h1>
            <p className="text-sm text-text-muted mt-2 max-w-lg mx-auto">
              Your UTR <strong className="text-slate-800 font-mono">{order?.utr_number || 'N/A'}</strong> has been recorded. Our admin team will verify the payment and confirm your order. You will see the status update in your account.
            </p>

            {/* Verification Pending Notice */}
            <div className="mt-6 max-w-md mx-auto p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-800">
                  <p className="font-bold text-sm">What happens next?</p>
                  <ul className="mt-2 space-y-1.5 text-amber-700">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5">1</span>
                      <span>Admin reviews and verifies your UTR against bank records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5">2</span>
                      <span>Once verified, order status changes to <strong>"Confirmed"</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5">3</span>
                      <span>Dispatch begins and live tracking activates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Live Tracking Active • Payment Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-3">
              Order Tracking & Dispatch Status
            </h1>
            <p className="text-sm text-text-muted mt-2 max-w-lg mx-auto">
              Your payment to <strong className="text-slate-800">Anshuman Gupta</strong> has been confirmed. Your wholesale shipment order sheet has been generated for factory dispatch.
            </p>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mt-6">
          <div className="px-4 py-2.5 bg-slate-50 border border-border rounded-xl text-left">
            <p className="text-[11px] font-semibold text-text-muted">Waybill / Tracking No.</p>
            <p className="text-sm font-mono font-bold text-primary-700">
              TRK-ECO-{order ? order.id.slice(0, 8).toUpperCase() : id?.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div className="px-4 py-2.5 bg-slate-50 border border-border rounded-xl text-left">
            {isVerificationPending ? (
              <>
                <p className="text-[11px] font-semibold text-text-muted">UTR Number</p>
                <p className="text-sm font-mono font-bold text-amber-700">
                  {order?.utr_number || 'N/A'}
                </p>
              </>
            ) : (
              <>
                <p className="text-[11px] font-semibold text-text-muted">Estimated Delivery</p>
                <p className="text-sm font-bold text-slate-800">
                  24–48 Hours (Bangalore Hub)
                </p>
              </>
            )}
          </div>
        </div>

        {/* SMS & Email Notification Badges */}
        {notifStatus && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
            {notifStatus.smsSent && (
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-xl text-xs font-bold">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>SMS sent to +91 {notifStatus.phone}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            )}
            {notifStatus.emailSent && (
              <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-800 px-4 py-2 rounded-xl text-xs font-bold">
                <Mail className="w-4 h-4 text-violet-600" />
                <span>Email sent to {notifStatus.email}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary-600" />
            <span>Live Shipment Progress</span>
          </h2>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
            isVerificationPending
              ? 'text-amber-700 bg-amber-50 border-amber-200'
              : 'text-emerald-700 bg-emerald-50 border-emerald-200'
          }`}>
            {isVerificationPending ? 'Awaiting Payment Verification' : 'Dispatched via Freight Logistics'}
          </span>
        </div>
        <OrderTimeline
          status={order?.order_status || 'confirmed'}
          createdAt={order?.created_at || new Date().toISOString()}
        />
      </div>

      {/* Order & Delivery Details Grid */}
      {order && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary-600" />
              <span>Consignee Delivery Address</span>
            </h3>
            <div className="text-xs text-text-secondary space-y-1">
              <p className="font-bold text-text-primary">{order.customer_name || 'Customer'}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.state} — {order.pincode}</p>
              <p className="pt-2 text-text-muted">Contact: +91 {order.phone}</p>
            </div>
          </div>

          {/* Payment & Invoice Summary */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-primary-600" />
              <span>Payment & Settlement</span>
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Payment Method:</span>
                <span className="font-bold text-text-primary">
                  {order.payment_method === 'upi_qr'
                    ? 'UPI QR Scanner (Anshuman Gupta)'
                    : order.payment_method.toUpperCase()}
                </span>
              </div>
              {order.utr_number && (
                <div className="flex justify-between">
                  <span className="text-text-muted">UTR Number:</span>
                  <span className="font-mono font-bold text-text-primary">{order.utr_number}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Payment Status:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  order.payment_status === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.payment_status === 'verification_pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.payment_status === 'verification_pending' ? 'VERIFICATION PENDING' : order.payment_status}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-bold text-text-primary">Total Amount:</span>
                <span className="font-extrabold text-base text-primary-700">
                  ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/account" className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full font-bold">
            Track Order in My Account
          </Button>
        </Link>

        <a
          href={whatsAppTrackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-[#128C7E] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
          <span>Ask Dispatch Team on WhatsApp</span>
        </a>

        <Link to="/products" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full font-bold" icon={<ArrowRight className="w-4 h-4" />}>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
