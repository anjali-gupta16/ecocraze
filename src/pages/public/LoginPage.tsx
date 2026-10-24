import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTracking } from '../../hooks/useTracking';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const location = useLocation();
  const { signIn } = useAuth();
  const { logLogin } = useTracking();

  const from = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeSignIn = async (targetEmail: string, targetPass: string) => {
    setLoading(true);
    setError('');

    const { error: signInErr } = await signIn(targetEmail, targetPass);
    if (signInErr) {
      setError(signInErr.message || 'Invalid email or password.');
      setLoading(false);
      return;
    }

    logLogin(targetEmail);
    const dest = !from || from === '/login' || from.startsWith('/admin') ? '/' : from;
    window.location.href = dest;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both business email and password.');
      return;
    }
    executeSignIn(email, password);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-xs">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-text-primary">
              Eco<span className="text-primary-600">craze</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-text-primary">Wholesale Customer Login</h1>
          <p className="text-xs text-text-muted mt-1.5">
            Access your B2B order history, reorders, and tax invoices
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 animate-in fade-in">
              <div className="flex items-start gap-2.5 text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Business Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="name@business.com"
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
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
                placeholder="Enter your password"
                leftIcon={<Lock className="w-4 h-4" />}
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-bold shadow-md cursor-pointer mt-2"
              icon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Sign In to Wholesale Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-text-muted">
            Don't have a wholesale partner account?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
