import React, { useState, useEffect } from 'react';
import { Users, UserPlus, KeyRound, ShieldAlert, CheckCircle2, Search } from 'lucide-react';
import KPICard from '../../components/admin/KPICard';
import { getOrders } from '../../lib/store';

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  // Customers roster
  const sampleCustomers = [
    { id: '1', name: 'Anjali Gupta', firm: 'Gupta Eco Disposables', email: 'anjali.gupta.ashok16@gmail.com', phone: '7676349773', role: 'customer', joined: '2026-08-12', ordersCount: 8, totalSpend: 54000 },
    { id: '2', name: 'Ananya Deshmukh', firm: 'Desi Bowls Cafe', email: 'procurement@desibowls.in', phone: '6306784568', role: 'customer', joined: '2026-09-01', ordersCount: 5, totalSpend: 28500 },
    { id: '3', name: 'Mohd. Imran', firm: 'Royal Biryani Banquet', email: 'imran.banquets@yahoo.com', phone: '7892280294', role: 'customer', joined: '2026-09-18', ordersCount: 12, totalSpend: 118000 },
    { id: '4', name: 'Vikram Mehta', firm: 'Spice Hub Kitchens', email: 'yashaswinim8002@gmail.com', phone: '9811223344', role: 'customer', joined: '2026-10-04', ordersCount: 3, totalSpend: 14200 },
    { id: '5', name: 'Anjali Gupta (Admin)', firm: 'Ecocraze Operations', email: 'anshumangupta2501@gmail.com', phone: '7676349773', role: 'admin', joined: '2026-07-01', ordersCount: 0, totalSpend: 0 },
  ];

  const filtered = sampleCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
          Customer Accounts & Authentication Telemetry
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Wholesale accounts, business profiles, and aggregate login security audits.
        </p>
      </div>

      {/* Aggregate KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Registered Wholesalers"
          value="184"
          change={12.5}
          changePeriod="vs last month"
          icon={<Users className="w-5 h-5 text-primary-600" />}
        />
        <KPICard
          label="New Registrations (This Month)"
          value="38"
          change={28.0}
          changePeriod="verified B2B clients"
          icon={<UserPlus className="w-5 h-5 text-emerald-600" />}
        />
        <KPICard
          label="Successful Logins (Aggregated)"
          value="1,420"
          subtitle="98.6% login success rate"
          icon={<CheckCircle2 className="w-5 h-5 text-teal-600" />}
        />
        <KPICard
          label="Failed Login Attempts (Audit)"
          value="18"
          subtitle="All flagged & rate-limited"
          icon={<ShieldAlert className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Customers List Table */}
      <div className="bg-white rounded-3xl border border-border p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-text-primary">Wholesaler Client Directory</h2>
            <p className="text-xs text-text-muted mt-0.5">Verified catering firms and institutional buyers</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-text-light absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, firm, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-text-muted font-semibold bg-slate-50/50">
                <th className="py-2.5 px-3">Client & Firm</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Joined Date</th>
                <th className="py-2.5 px-3 text-right">Orders</th>
                <th className="py-2.5 px-3 text-right">Total GMV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-bold text-text-primary">{client.name}</p>
                    <p className="text-[11px] text-text-muted">{client.firm}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-text-primary font-medium">{client.email}</p>
                    <p className="text-[11px] text-text-muted">+91 {client.phone}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        client.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {client.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-text-secondary">
                    {new Date(client.joined).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-text-primary">
                    {client.ordersCount}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-primary-700">
                    ₹{client.totalSpend.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
