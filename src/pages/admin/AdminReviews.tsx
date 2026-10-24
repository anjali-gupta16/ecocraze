import React, { useState, useEffect } from 'react';
import {
  Star,
  Trash2,
  Search,
  MessageSquareQuote,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Plus,
  Filter,
} from 'lucide-react';
import { getCustomerReviews, deleteCustomerReview } from '../../lib/store';
import type { CustomerReview } from '../../types';
import KPICard from '../../components/admin/KPICard';
import WriteReviewModal from '../../components/reviews/WriteReviewModal';
import Button from '../../components/ui/Button';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the review by "${name}"?`)) {
      return;
    }
    setDeletingId(id);
    await deleteCustomerReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setDeletingId(null);
  };

  // KPIs
  const totalReviews = reviews.length;
  const verifiedCount = reviews.filter((r) => r.verified_buyer).length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews).toFixed(1)
      : '0.0';

  // Filtered reviews
  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.business_name && r.business_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.city && r.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === 'all' ? true : r.rating === parseInt(ratingFilter, 10);

    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Genuine Customer Reviews Moderation
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Real feedback submitted by your customers. Zero fake reviews — monitor, verify, and moderate genuine buyer experiences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Test Customer Review</span>
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          label="Total Customer Reviews"
          value={totalReviews}
          icon={<MessageSquareQuote className="w-5 h-5 text-primary-600" />}
        />
        <KPICard
          label="Average Customer Rating"
          value={totalReviews > 0 ? `${avgRating} / 5.0` : 'No reviews yet'}
          icon={<Star className="w-5 h-5 text-amber-500 fill-amber-400" />}
        />
        <KPICard
          label="Verified Buyer Reviews"
          value={`${verifiedCount} (${totalReviews > 0 ? Math.round((verifiedCount / totalReviews) * 100) : 0}%)`}
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
          <input
            type="text"
            placeholder="Search by customer, city, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-text-muted" />
          <span className="text-xs font-medium text-text-muted">Filter by rating:</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-xl text-xs bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table / List */}
      <div className="bg-white rounded-3xl border border-border shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading reviews...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-text-muted">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-text-primary">
              {reviews.length === 0 ? 'No customer reviews yet' : 'No reviews match your search'}
            </p>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              {reviews.length === 0
                ? 'When customers leave reviews on your website or order confirmation, they will appear here in real time.'
                : 'Try adjusting your search keywords or rating filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50/60 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="py-3.5 px-6">Customer & Business</th>
                  <th className="py-3.5 px-6">Rating</th>
                  <th className="py-3.5 px-6">Review Content</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filtered.map((r) => {
                  const formattedDate = r.created_at
                    ? new Date(r.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A';

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Customer Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-xs font-bold shrink-0">
                            {r.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-text-primary">{r.name}</p>
                            {(r.business_name || r.city) && (
                              <p className="text-[11px] text-text-muted">
                                {[r.business_name, r.city].filter(Boolean).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < r.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-slate-100 text-slate-200'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-[11px] font-bold text-text-secondary">
                            {r.rating}.0
                          </span>
                        </div>
                      </td>

                      {/* Content */}
                      <td className="py-4 px-6 max-w-md">
                        {r.title && (
                          <p className="font-bold text-text-primary text-xs mb-0.5">{r.title}</p>
                        )}
                        <p className="text-text-secondary leading-relaxed line-clamp-2">
                          "{r.comment}"
                        </p>
                      </td>

                      {/* Verified Badge */}
                      <td className="py-4 px-6">
                        {r.verified_buyer ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified Buyer</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            <span>Public Review</span>
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-text-muted whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(r.id, r.name)}
                          disabled={deletingId === r.id}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete spam/inappropriate review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for adding manual / verified review */}
      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={() => {
          fetchReviews();
        }}
        defaultVerified={true}
      />
    </div>
  );
}
