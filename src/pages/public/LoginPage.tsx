import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTracking } from '../../hooks/useTracking';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { logLogin } = useTracking();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    const errParam = params.get('error');

    if (errParam === 'admin_required') {
      setError('Admin access required. Please sign in with an Admin account to enter the Admin Dashboard.');
    }

    // Prefill form for convenience, but NEVER auto-submit or bypass the login screen
    if (roleParam === 'admin') {
      setEmail('anshumangupta2501@gmail.com');
      setPassword('Admin@123456');
    } else if (roleParam === 'customer') {
      setEmail('anjali.gupta.ashok16@gmail.com');
      setPassword('Anjali@123456');
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both business email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password is too short. It must contain at least 6 characters (e.g., Anjali@123456 or Anjali@123).');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message || 'Invalid email or password.');
      setLoading(false);
    } else {
      logLogin(email);
      const isTargetAdmin =
        email.trim().toLowerCase() === 'anshumangupta2501@gmail.com' ||
        email.trim().toLowerCase().includes('admin');

      if (isTargetAdmin) {
        navigate('/admin', { replace: true });
      } else {
        const dest = !from || from === '/login' || from === '/admin' ? '/' : from;
        navigate(dest, { replace: true });
      }
    }
  };

  const isShortPassword = password.length > 0 && password.length < 6;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-text-primary">
              Eco<span className="text-primary-600">craze</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-text-primary">Wholesale Account Login</h1>
          <p className="text-xs text-text-muted mt-1">
            Access your B2B order history, reorders, and tax invoices
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
          {/* Alert / Notice Banner */}
          {error && (
            <div className={`mb-5 p-4 rounded-2xl animate-in fade-in border ${
              error.includes('Admin access required')
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {error.includes('Admin access required') ? (
                  <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-xs flex-1">
                  <p className={`font-bold text-sm ${
                    error.includes('Admin access required') ? 'text-amber-900' : 'text-red-800'
                  }`}>
                    {error.includes('Admin access required') ? 'Admin Authentication Required' : 'Warning: Login Failed'}
                  </p>
                  <p className={`font-medium mt-1 ${
                    error.includes('Admin access required') ? 'text-amber-800' : 'text-red-700'
                  }`}>{error}</p>

                  {!error.includes('Admin access required') && (
                    <div className="mt-3 pt-2.5 border-t border-red-200/80">
                      <p className="font-bold text-[11px] text-red-900 uppercase tracking-wider mb-1">
                        How to enter your password:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                        <li>Must be at least <strong>6 characters</strong> long</li>
                        <li>
                          Example formats: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-red-200 text-red-800 font-bold">Anjali@123456</span> or <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-red-200 text-red-800 font-bold">Anjali@123</span>
                        </li>
                        <li>Click the eye icon (<span className="text-slate-900">👁️</span>) inside the field to view what you typed</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Business Email"
              type="email"
              placeholder="e.g. anjali.gupta.ashok16@gmail.com"
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
                placeholder="e.g. Anjali@123456"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              {/* Real-time warning if password is too short */}
              {isShortPassword && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Password is too short (min 6 characters required).</span>
                </div>
              )}

              {/* Password format guide and examples */}
              <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1 text-slate-700 font-semibold">
                  <Info className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                  <span>How to enter password:</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Example: <strong className="text-slate-800 font-mono">Anjali@123456</strong> or <strong className="text-slate-800 font-mono">Anjali@123</strong></span>
                  <span className="text-primary-700 font-medium">Min 6 chars</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-bold shadow-md cursor-pointer mt-2"
              icon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Sign In to Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-text-muted">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">
              Register as Wholesaler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
