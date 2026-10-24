import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, PenSquare, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { getCustomerReviews } from '../../lib/store';
import type { CustomerReview } from '../../types';
import WriteReviewModal from './WriteReviewModal';
import Button from '../ui/Button';

export default function CustomerReviewsSection() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchReviews = () => {
    getCustomerReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchReviews();

    const handleUpdate = () => {
      fetchReviews();
    };

    window.addEventListener('reviews-updated', handleUpdate);
    return () => {
      window.removeEventListener('reviews-updated', handleUpdate);
    };
  }, []);

  // Calculate average rating
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
      : '5.0';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
            <span>100% Genuine Customer Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Verified Feedback from Real Buyers
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1.5 max-w-xl">
            Real experiences from restaurants, caterers, and food service businesses. No fake or sponsored testimonials.
          </p>
        </div>

        {/* Action Button & Overall Score */}
        <div className="flex items-center gap-4 shrink-0">
          {totalReviews > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-border rounded-2xl">
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-sm font-extrabold text-text-primary">{averageRating}</span>
              <span className="text-xs text-text-muted">({totalReviews} genuine {totalReviews === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}

          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 shadow-sm"
          >
            <PenSquare className="w-4 h-4" />
            <span>Write a Review</span>
          </Button>
        </div>
      </div>

      {/* Reviews Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-6 shadow-xs animate-pulse h-48" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        /* Genuine Transparent Empty State */
        <div className="bg-linear-to-b from-slate-50 to-white rounded-3xl border border-dashed border-border p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100">
            <MessageSquareQuote className="w-8 h-8 stroke-[1.75]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-text-primary">
            No fake reviews here — Be the first customer to review!
          </h3>
          <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed max-w-md mx-auto">
            We value genuine authenticity. We never manufacture fake testimonials. If you have purchased paper plates, dona bowls, or napkins from Ecocraze, share your honest experience!
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-xs font-bold px-5 py-2.5"
            >
              <PenSquare className="w-4 h-4" />
              <span>Share Your Genuine Review</span>
            </Button>
          </div>
        </div>
      ) : (
        /* Real Reviews Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => {
            const formattedDate = r.created_at
              ? new Date(r.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recent';

            const locationSubtitle = [r.business_name, r.city].filter(Boolean).join(' • ');

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-border p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Stars + Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < r.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-100 text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-text-muted">{formattedDate}</span>
                  </div>

                  {/* Title if present */}
                  {r.title && (
                    <h4 className="text-sm font-bold text-text-primary mb-1.5 leading-snug">
                      {r.title}
                    </h4>
                  )}

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6 italic">
                    "{r.comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-xs font-bold">
                      {r.name ? r.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">{r.name}</p>
                      {locationSubtitle && (
                        <p className="text-[11px] text-text-muted truncate max-w-[170px]">
                          {locationSubtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {r.verified_buyer && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Submission Modal */}
      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={() => {
          fetchReviews();
        }}
      />
    </section>
  );
}
