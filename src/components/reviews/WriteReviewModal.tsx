import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { submitCustomerReview } from '../../lib/store';
import type { CustomerReview } from '../../types';
import Button from '../ui/Button';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (review: CustomerReview) => void;
  defaultVerified?: boolean;
  orderId?: string;
}

const RATING_LABELS = ['Select a rating', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

export default function WriteReviewModal({
  isOpen,
  onClose,
  onReviewSubmitted,
  defaultVerified = false,
  orderId,
}: WriteReviewModalProps) {
  const { user, profile } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [verifiedBuyer, setVerifiedBuyer] = useState<boolean>(defaultVerified);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Pre-fill user information if authenticated
      if (profile?.name) {
        setName(profile.name);
      } else if (user?.email) {
        setName(user.email.split('@')[0]);
      }
      if (defaultVerified || !!orderId) {
        setVerifiedBuyer(true);
      }
      setSuccess(false);
      setError('');
    }
  }, [isOpen, profile, user, defaultVerified, orderId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a few words about your experience with Ecocraze.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }

    setSubmitting(true);
    try {
      const combinedLocation = [businessName.trim(), city.trim()].filter(Boolean).join(', ');
      const newReview = await submitCustomerReview({
        name: name.trim(),
        business_name: businessName.trim() || undefined,
        city: city.trim() || undefined,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        verified_buyer: verifiedBuyer,
        order_id: orderId || undefined,
      });

      setSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }

      setTimeout(() => {
        onClose();
        // Reset form
        setComment('');
        setTitle('');
        setSuccess(false);
      }, 1400);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeStar = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-5 right-5 p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-extrabold text-text-primary">
              Thank You for Your Genuine Review!
            </h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto">
              Your real customer review has been published. It helps genuine buyers choose sustainable, reliable packaging with confidence.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Genuine Customer Feedback</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                Share Your Real Experience
              </h2>
              <p className="text-xs text-text-muted mt-1">
                We believe in honest, authentic customer reviews. Tell us how our products, pricing, and service worked for you.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1 rounded-md hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= activeStar
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-100 text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-text-secondary ml-2">
                  {RATING_LABELS[activeStar]} ({activeStar} / 5)
                </span>
              </div>
            </div>

            {/* Name & Business */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Business / Firm Name <span className="text-text-muted font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Green Leaf Caterers"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>

            {/* City & Review Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  City / Location <span className="text-text-muted font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bangalore, Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Headline <span className="text-text-muted font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Heavy plates, zero sogginess"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Your Review & Experience <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience: quality of paper plates or napkins, packaging strength, delivery speed, or bulk pricing value..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Verified Buyer Checkbox */}
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="verified_buyer_chk"
                checked={verifiedBuyer}
                onChange={(e) => setVerifiedBuyer(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-border cursor-pointer"
              />
              <label htmlFor="verified_buyer_chk" className="text-xs text-text-secondary cursor-pointer select-none">
                I am a verified buyer of Ecocraze products
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-xs font-bold"
              >
                {submitting ? 'Submitting...' : 'Post Genuine Review'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
