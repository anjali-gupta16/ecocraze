import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, ShieldCheck, AlertTriangle, Shield, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTracking } from '../../hooks/useTracking';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const location = useLocation();
  const { signIn, isAdmin } = useAuth();
  const { logLogin } = useTracking();

  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get('role');
  const errParam = searchParams.get('error');
  const from = (location.state as any)?.from?.pathname || '';

  const initialTab =
    roleParam === 'admin' ||
    errParam === 'admin_required' ||
    from.startsWith('/admin')
      ? 'admin'
      : 'customer';

  const [activeTab, setActiveTab] = useState<'admin' | 'customer'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto redirect if already an authenticated admin
  useEffect(() => {
    if (isAdmin && (activeTab === 'admin' || from.startsWith('/admin'))) {
      window.location.href = '/admin';
    }
  }, [isAdmin, activeTab, from]);

  // Set credentials based on active tab and query params
  useEffect(() => {
    if (errParam === 'admin_required') {
      setError('Admin privileges required. Please sign in with an Admin account.');
      setActiveTab('admin');
      setEmail('anshumangupta2501@gmail.com');
      setPassword('Admin@123456');
    } else if (activeTab === 'admin') {
      setEmail('anshumangupta2501@gmail.com');
      setPassword('Admin@123456');
    } else {
      setEmail('wholesale@ecocraze.com');
      setPassword('Anjali@123456');
    }
  }, [activeTab, errParam]);

  const handleSwitchTab = (tab: 'admin' | 'customer') => {
    setActiveTab(tab);
    setError('');
    if (tab === 'admin') {
      setEmail('anshumangupta2501@gmail.com');
      setPassword('Admin@123456');
    } else {
      setEmail('wholesale@ecocraze.com');
      setPassword('Anjali@123456');
    }
  };

  const executeSignIn = async (targetEmail: string, targetPass: string, forceAdmin = false) => {
    setLoading(true);
    setError('');

    const { error: signInErr } = await signIn(targetEmail, targetPass);
    if (signInErr) {
      setError(signInErr.message || 'Invalid email or password.');
      setLoading(false);
      return;
    }

    logLogin(targetEmail);

    const norm = targetEmail.trim().toLowerCase();
    const shouldGoToAdmin =
      forceAdmin ||
      activeTab === 'admin' ||
      from.startsWith('/admin') ||
      norm === 'anshumangupta2501@gmail.com' ||
      norm === 'anjali.gupta.ashok16@gmail.com' ||
      norm === 'admin@ecocraze.com' ||
      norm.includes('admin');

    if (shouldGoToAdmin) {
      window.location.href = '/admin';
    } else {
      const dest = !from || from === '/login' || from === '/admin' ? '/' : from;
      window.location.href = dest;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both business email and password.');
      return;
    }
    executeSignIn(email, password, activeTab === 'admin');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-text-primary">
              Eco<span className="text-primary-600">craze</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-text-primary">
            {activeTab === 'admin' ? '🛡️ Admin Command Center' : 'Wholesale Account Login'}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            {activeTab === 'admin'
              ? 'Private administrative portal for inventory, orders & sales analytics'
              : 'Access your B2B order history, reorders, and tax invoices'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-4 border border-border">
          <button
            type="button"
            onClick={() => handleSwitchTab('admin')}
            className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Admin Portal</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchTab('customer')}
            className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'customer'
                ? 'bg-white text-primary-800 shadow-xs border border-primary-200'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-primary-600" />
            <span>Wholesale Customer</span>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
          {/* Error Banner */}
          {error && (
            <div
              className={`mb-5 p-4 rounded-2xl animate-in fade-in border ${
                error.includes('Admin')
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-start gap-2.5 text-xs font-medium">
                {error.includes('Admin') ? (
                  <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={activeTab === 'admin' ? 'Admin Email' : 'Business Email'}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600">
                {activeTab === 'admin' ? (
                  <p className="text-emerald-800 font-semibold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Admin Mode Active: Redirects directly to Operations Command Center</span>
                  </p>
                ) : (
                  <p className="text-slate-600 flex items-center justify-between">
                    <span>Default Password: <strong className="font-mono text-slate-800">Anjali@123456</strong></span>
                    <span className="text-primary-700 font-medium">Customer Mode</span>
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant={activeTab === 'admin' ? 'primary' : 'primary'}
              size="lg"
              loading={loading}
              className={`w-full font-bold shadow-md cursor-pointer mt-2 ${
                activeTab === 'admin' ? '!bg-emerald-600 hover:!bg-emerald-700 !border-emerald-700' : ''
              }`}
              icon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              {activeTab === 'admin' ? 'Sign In as Administrator →' : 'Sign In to Wholesale Account →'}
            </Button>
          </form>

          {/* Quick 1-Click Access Buttons */}
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5 text-center">
              1-Click Instant Evaluation Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => executeSignIn('anshumangupta2501@gmail.com', 'Admin@123456', true)}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1-Click Admin</span>
                </div>
                <p className="text-[10px] text-emerald-700 mt-0.5 truncate">→ Go to /admin</p>
              </button>

              <button
                type="button"
                onClick={() => executeSignIn('wholesale@ecocraze.com', 'Anjali@123456', false)}
                className="p-2.5 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-xl text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary-900">
                  <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                  <span>1-Click Customer</span>
                </div>
                <p className="text-[10px] text-primary-700 mt-0.5 truncate">→ Go to catalog</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
