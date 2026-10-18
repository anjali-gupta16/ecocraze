import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  RotateCcw,
  Calendar,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
  Shield,
  LogOut,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { getOrders } from '../../lib/store';
import type { Order } from '../../types';
import OrderTimeline from '../../components/order/OrderTimeline';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  useEffect(() => {
    getOrders(user?.id).then((data) => {
      setOrders(data);
      setLoading(false);
      if (data.length > 0) {
        setExpandedOrder(data[0].id); // expand most recent by default
      }
    });
  }, [user?.id]);

  const handleReorder = (order: Order) => {
    if (!order.order_items || order.order_items.length === 0) return;
    for (const item of order.order_items) {
      if (item.product) {
        addToCart(item.product, item.qty);
      }
    }
    setReorderedId(order.id);
    setTimeout(() => {
      navigate('/cart');
    }, 600);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Loading your account profile and order records..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Account Header */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-700 font-extrabold text-xl flex items-center justify-center border border-primary-200">
            {(profile?.name || user?.email || 'C')[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                {profile?.name || 'Valued Wholesaler'}
              </h1>
              {isAdmin && (
                <span className="text-[11px] font-bold uppercase bg-primary-600 text-white px-2.5 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">{user?.email || 'Guest Account'}</p>
            {profile?.phone && <p className="text-xs text-text-muted">Ph: +91 {profile.phone}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isAdmin && (
            <Link to="/admin" className="flex-1 sm:flex-none">
              <Button variant="secondary" size="md" className="w-full gap-2 font-bold" icon={<Shield className="w-4 h-4 text-primary-600" />}>
                Admin Panel
              </Button>
            </Link>
          )}
          {user && (
            <Button
              onClick={signOut}
              variant="outline"
              size="md"
              className="text-red-600 hover:bg-red-50 hover:border-red-200"
              icon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>

      {/* Orders List Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
            <span>Order History & Dispatch Timelines</span>
          </h2>
          <span className="text-xs font-semibold text-text-muted">
            Total Orders: {orders.length}
          </span>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={<Package className="w-12 h-12 text-primary-400 stroke-1" />}
            title="No orders yet"
            description="You haven't placed any orders yet. Browse our wholesale catalog to discover great prices on paper plates, dona bowls, and napkins."
            actionLabel="Start Shopping"
            onAction={() => navigate('/products')}
          />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm transition-all"
                >
                  {/* Order Card Header */}
                  <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/60 border-b border-border/70">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className="text-text-light font-medium">Order Number</p>
                        <p className="font-mono font-bold text-text-primary mt-0.5">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>

                      <div>
                        <p className="text-text-light font-medium">Date Placed</p>
                        <p className="font-semibold text-text-primary mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="text-text-light font-medium">Total Amount</p>
                        <p className="font-bold text-primary-700 text-sm mt-0.5">
                          ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div>
                        <p className="text-text-light font-medium">Status</p>
                        <span
                          className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            order.order_status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.order_status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-primary-50 text-primary-800 border border-primary-200'
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </div>
                    </div>

                    {/* Actions: Reorder + Toggle Details */}
                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <Button
                        onClick={() => handleReorder(order)}
                        variant="secondary"
                        size="sm"
                        className="font-bold text-xs"
                        icon={<RotateCcw className="w-3.5 h-3.5" />}
                      >
                        {reorderedId === order.id ? 'Items Added!' : 'Reorder'}
                      </Button>

                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="p-1.5 rounded-lg border border-border bg-white text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Order Details */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-6 animate-fade-in">
                      {/* Timeline */}
                      <div>
                        <h4 className="text-xs font-bold uppercase text-text-muted tracking-wider mb-2">
                          Live Dispatch Timeline
                        </h4>
                        <OrderTimeline
                          status={order.order_status}
                          createdAt={order.created_at}
                        />
                      </div>

                      {/* Items Table */}
                      <div>
                        <h4 className="text-xs font-bold uppercase text-text-muted tracking-wider mb-3">
                          Items in this shipment
                        </h4>
                        <div className="divide-y divide-border/60 border border-border rounded-xl overflow-hidden bg-white">
                          {order.order_items && order.order_items.length > 0 ? (
                            order.order_items.map((item) => (
                              <div
                                key={item.id}
                                className="p-3.5 flex items-center justify-between text-xs gap-3"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {item.product?.image_url && (
                                    <img
                                      src={item.product.image_url}
                                      alt={item.product.name}
                                      className="w-10 h-10 rounded-lg object-cover bg-slate-50 shrink-0"
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        if (!target.src.includes('plate-selection-sheet.png')) {
                                          target.src = '/products/plate-selection-sheet.png';
                                        }
                                      }}
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-semibold text-text-primary truncate">
                                      {item.product?.name || `Product #${item.product_id.slice(0, 6)}`}
                                    </p>
                                    <p className="text-text-muted text-[11px]">
                                      {item.qty} packets × ₹{item.unit_price.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-bold text-text-primary shrink-0">
                                  ₹{(item.qty * item.unit_price).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="p-4 text-xs text-text-muted">Standard wholesale consignment</p>
                          )}
                        </div>
                      </div>

                      {/* Address & Payment Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <p className="font-bold text-text-primary flex items-center gap-1.5 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-primary-600" />
                            <span>Destination Address</span>
                          </p>
                          <p className="text-text-secondary">{order.address}, {order.city}, {order.state} - {order.pincode}</p>
                          <p className="text-text-muted mt-1">Phone: +91 {order.phone}</p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl">
                          <p className="font-bold text-text-primary flex items-center gap-1.5 mb-1">
                            <CreditCard className="w-3.5 h-3.5 text-primary-600" />
                            <span>Settlement Method</span>
                          </p>
                          <p className="text-text-secondary uppercase">{order.payment_method}</p>
                          <p className="text-text-muted mt-1">
                            Payment status: <span className="font-bold capitalize">{order.payment_status}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
