import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Eye,
  Filter,
  IndianRupee,
} from 'lucide-react';
import { getOrders, updateOrder } from '../../lib/store';
import type { Order, OrderStatus, PaymentStatus } from '../../types';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrderList = () => {
    setLoading(true);
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrder(orderId, { order_status: newStatus });
    fetchOrderList();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: newStatus });
    }
  };

  const handlePaymentConfirm = async (orderId: string) => {
    await updateOrder(orderId, { payment_status: 'paid', order_status: 'confirmed' });
    fetchOrderList();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, payment_status: 'paid', order_status: 'confirmed' });
    }
  };

  const handlePaymentReject = async (orderId: string) => {
    if (!window.confirm('Reject this UTR? The payment will be marked as failed and the order will be cancelled.')) return;
    await updateOrder(orderId, { payment_status: 'failed', order_status: 'cancelled' });
    fetchOrderList();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, payment_status: 'failed', order_status: 'cancelled' });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order and process a refund?')) return;
    await updateOrder(orderId, { order_status: 'cancelled', payment_status: 'refunded' });
    fetchOrderList();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: 'cancelled', payment_status: 'refunded' });
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(q) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      o.phone.includes(q) ||
      o.city.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || o.order_status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || o.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Wholesale Orders & Dispatch Desk
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Search, update shipment stages, confirm payment settlements, and process cancellations.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Bar */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-text-light absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by order ID, consignee, phone or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-border bg-slate-50 font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Dispatch Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="sm:col-span-3">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-border bg-slate-50 font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="verification_pending">UTR Verification Pending</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20">
            <Spinner label="Loading order dispatch registry..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-text-muted">
            No matching orders found. Try adjusting your search query or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-text-muted font-semibold bg-slate-50/70">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Consignee</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Order Value</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Dispatch Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-text-primary">
                        #{o.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-text-light mt-0.5">
                        {new Date(o.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-text-primary">
                        {o.customer_name || 'Commercial Client'}
                      </p>
                      <p className="text-[11px] text-text-muted">+91 {o.phone}</p>
                    </td>

                    <td className="py-3 px-4 text-text-secondary">
                      {o.city}, {o.state}
                    </td>

                    <td className="py-3 px-4 font-bold text-primary-700">
                      ₹{o.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            o.payment_status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.payment_status === 'refunded'
                              ? 'bg-purple-100 text-purple-800'
                              : o.payment_status === 'verification_pending'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : o.payment_status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.payment_status === 'verification_pending' ? 'UTR PENDING' : o.payment_status}
                        </span>
                        <span className="text-[10px] font-medium text-text-light uppercase">
                          {o.payment_method}
                        </span>
                        {o.utr_number && (
                          <span className="text-[10px] font-mono text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded">
                            UTR: {o.utr_number}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={o.order_status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className="py-1 px-2 rounded-lg border border-border bg-slate-50 font-semibold text-text-primary text-xs focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        onClick={() => setSelectedOrder(o)}
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px]"
                      >
                        Inspect
                      </Button>

                      {o.payment_status === 'verification_pending' && (
                        <>
                          <Button
                            onClick={() => handlePaymentConfirm(o.id)}
                            variant="secondary"
                            size="sm"
                            className="h-7 text-[11px] text-emerald-700 border-emerald-600 hover:bg-emerald-50"
                          >
                            ✓ Verify UTR
                          </Button>
                          <Button
                            onClick={() => handlePaymentReject(o.id)}
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] text-red-600 hover:bg-red-50"
                          >
                            ✗ Reject
                          </Button>
                        </>
                      )}

                      {o.payment_status !== 'paid' && o.payment_status !== 'verification_pending' && o.order_status !== 'cancelled' && (
                        <Button
                          onClick={() => handlePaymentConfirm(o.id)}
                          variant="secondary"
                          size="sm"
                          className="h-7 text-[11px] text-emerald-700 border-emerald-600 hover:bg-emerald-50"
                        >
                          Confirm Paid
                        </Button>
                      )}

                      {o.order_status !== 'cancelled' && (
                        <Button
                          onClick={() => handleCancelOrder(o.id)}
                          variant="outline"
                          size="sm"
                          className="h-7 text-[11px] text-red-600 hover:bg-red-50"
                        >
                          Cancel/Refund
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.id.slice(0, 10).toUpperCase()}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-text-muted">Consignee</p>
                <p className="font-bold text-text-primary">{selectedOrder.customer_name || 'Client'}</p>
                <p className="text-text-secondary mt-0.5">{selectedOrder.address}</p>
                <p className="text-text-secondary">{selectedOrder.city}, {selectedOrder.state} — {selectedOrder.pincode}</p>
                <p className="text-text-muted mt-1">Ph: +91 {selectedOrder.phone}</p>
              </div>

              <div>
                <p className="text-text-muted">Financial Settlement</p>
                <p className="text-base font-extrabold text-primary-700">
                  ₹{selectedOrder.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-text-secondary mt-1">Method: {selectedOrder.payment_method.toUpperCase()}</p>
                {selectedOrder.utr_number && (
                  <p className="mt-1">
                    UTR:{' '}
                    <span className="font-mono font-bold text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded">
                      {selectedOrder.utr_number}
                    </span>
                  </p>
                )}
                <p className="mt-0.5">
                  Payment Status:{' '}
                  <span className={`font-bold uppercase ${
                    selectedOrder.payment_status === 'verification_pending'
                      ? 'text-amber-700'
                      : selectedOrder.payment_status === 'paid'
                      ? 'text-emerald-700'
                      : selectedOrder.payment_status === 'failed'
                      ? 'text-red-700'
                      : 'text-emerald-700'
                  }`}>
                    {selectedOrder.payment_status === 'verification_pending' ? 'VERIFICATION PENDING' : selectedOrder.payment_status}
                  </span>
                </p>
                <p className="mt-0.5">
                  Dispatch Stage:{' '}
                  <span className="font-bold uppercase text-primary-800">
                    {selectedOrder.order_status}
                  </span>
                </p>
              </div>
            </div>

            {/* Items inside order */}
            <div>
              <p className="font-bold text-text-primary mb-2">Order Consignment Items:</p>
              <div className="divide-y divide-border border rounded-xl overflow-hidden">
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  selectedOrder.order_items.map((i) => (
                    <div key={i.id} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-text-primary">{i.product?.name || `Item #${i.product_id.slice(0, 6)}`}</p>
                        <p className="text-text-muted text-[11px]">{i.qty} packets × ₹{i.unit_price.toFixed(2)}</p>
                      </div>
                      <span className="font-bold text-text-primary">
                        ₹{(i.qty * i.unit_price).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p-3 text-text-muted">Consignment items recorded in manifest.</p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              {selectedOrder.payment_status === 'verification_pending' && (
                <>
                  <Button
                    onClick={() => { handlePaymentConfirm(selectedOrder.id); setSelectedOrder(null); }}
                    variant="primary"
                    size="sm"
                    className="text-emerald-50 bg-emerald-600 hover:bg-emerald-700"
                  >
                    ✓ Verify & Confirm Payment
                  </Button>
                  <Button
                    onClick={() => { handlePaymentReject(selectedOrder.id); setSelectedOrder(null); }}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                  >
                    ✗ Reject UTR
                  </Button>
                </>
              )}
              <Button onClick={() => setSelectedOrder(null)} variant="primary" size="sm">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
