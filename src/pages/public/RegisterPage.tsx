import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, User, Phone, ArrowRight, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTracking } from '../../hooks/useTracking';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const PASSWORD_RULES = [
  { label: 'At least 6 characters', test: (p: string) => p.length >= 6 },
  { label: 'One uppercase letter (A-Z)', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter (a-z)', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number (0-9)', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character (@, #, $, etc.)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { logRegister } = useTracking();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ruleResults = useMemo(
    () => PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(password) })),
    [password]
  );
  const allPassed = ruleResults.every((r) => r.passed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!allPassed) {
      setError('Password does not meet all the requirements below.');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signUp(email, password, name, phone);
    if (error) {
      setError(error.message || 'Registration failed. Please try again.');
      setLoading(false);
    } else {
      logRegister(email);
      navigate('/account');
    }
  };

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
          <h1 className="text-xl font-bold text-text-primary">Create Wholesale Account</h1>
          <p className="text-xs text-text-muted mt-1">
            Unlock instant wholesale volume rates, GST billing, and priority dispatch
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Business or Contact Name"
              type="text"
              placeholder="e.g. Anjali Gupta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />

            <Input
              label="Business Email"
              type="email"
              placeholder="orders@yourbusiness.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="e.g. Anjali@123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              {/* Live password rules checklist */}
              {password.length > 0 && (
                <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-border space-y-1.5">
                  <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Password must have:
                  </p>
                  {ruleResults.map((rule, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {rule.passed ? (
                        <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs ${
                          rule.passed
                            ? 'text-green-700 font-medium'
                            : 'text-red-600 font-medium'
                        }`}
                      >
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-bold shadow-md cursor-pointer mt-2"
              icon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Register & Start Buying
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

