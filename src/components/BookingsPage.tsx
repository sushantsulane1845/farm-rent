import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Booking } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { SelectableImageFrame } from './SelectableImageFrame';

interface BookingsPageProps {
  bookings: Booking[];
  onRefreshBookings: () => Promise<void>;
  onRefreshEquipment: () => Promise<void>;
  onOpenMarketplace: () => void;
}

export function BookingsPage({
  bookings,
  onRefreshBookings,
  onRefreshEquipment,
  onOpenMarketplace,
}: BookingsPageProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Review Modal state
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const myBookings = bookings.filter((b) => b.renterId === user?.id);
  const upcomingList = myBookings.filter((b) => ['pending', 'accepted'].includes(b.status));
  const historyList = myBookings.filter((b) => ['completed', 'rejected', 'cancelled'].includes(b.status));

  const visibleList = tab === 'upcoming' ? upcomingList : historyList;

  const handleCancel = async (bookingId: string) => {
    setErrorMsg('');
    setBusyId(bookingId);
    try {
      await apiFetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled' }),
      });
      await onRefreshBookings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not cancel booking.');
    } finally {
      setBusyId(null);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setReviewSubmitting(true);
    setErrorMsg('');
    try {
      await apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: reviewBooking.id,
          rating,
          comment,
        }),
      });
      setReviewBooking(null);
      setComment('');
      setRating(5);
      await onRefreshBookings();
      await onRefreshEquipment();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const renderStatusBadge = (status: Booking['status']) => {
    if (status === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16A34A]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t.statuses.accepted}
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D97706]">
          <Clock className="w-3.5 h-3.5" />
          {t.statuses.pending}
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#14532D]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t.statuses.completed}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#DC2626]">
        <XCircle className="w-3.5 h-3.5" />
        {t.statuses[status]}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C241E]">{t.booking.myBookings}</h1>

        <div className="flex items-center p-1 bg-[#E8EFE4] rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setTab('upcoming')}
            className={`min-h-[38px] px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'upcoming' ? 'bg-white text-[#14532D] shadow-xs' : 'text-[#4B554D]'
            }`}
          >
            {t.booking.upcoming} ({upcomingList.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`min-h-[38px] px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'history' ? 'bg-white text-[#14532D] shadow-xs' : 'text-[#4B554D]'
            }`}
          >
            {t.booking.history} ({historyList.length})
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {visibleList.length === 0 ? (
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-10 text-center space-y-4">
          <p className="text-sm text-[#5A655C]">{t.dashboard.noBookings}</p>
          <button
            type="button"
            onClick={onOpenMarketplace}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-sm font-semibold cursor-pointer"
          >
            {t.hero.rentCta}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleList.map((bk) => (
            <div
              key={bk.id}
              className="bg-white border border-[#E2E8DF] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between"
            >
              <div className="flex gap-4">
                <SelectableImageFrame
                  selectionId={`booking-img-${bk.id}`}
                  src={bk.equipmentImage}
                  alt={bk.equipmentTitle}
                  compact
                  className="w-24 h-20 rounded-xl bg-[#EFF4EC] shrink-0"
                />
                <div className="space-y-1">
                  <div>{renderStatusBadge(bk.status)}</div>
                  <h3 className="font-bold text-base text-[#1C241E]">{bk.equipmentTitle}</h3>
                  <div className="text-xs text-[#4B554D] flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1 tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-[#14532D]" />
                      {bk.date} · {bk.startTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#14532D]" />
                      {bk.farmLocation}
                    </span>
                  </div>
                  <div className="text-xs text-[#5A655C]">
                    {t.details.ownerInfo}: <span className="font-medium">{bk.ownerName}</span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#EDF2EA] shrink-0">
                <div className="text-left sm:text-right">
                  <div className="text-lg font-bold text-[#14532D] tabular-nums">
                    ₹{bk.totalCost.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-[#5A655C] tabular-nums">
                    {bk.priceUnit === 'acre'
                      ? `${bk.acres} ${t.units.acre}`
                      : `${bk.duration} ${t.units[bk.priceUnit]}`}
                  </div>
                </div>

                {['pending', 'accepted'].includes(bk.status) && (
                  <button
                    type="button"
                    disabled={busyId === bk.id}
                    onClick={() => handleCancel(bk.id)}
                    className="min-h-[40px] px-3.5 py-2 rounded-lg border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                  >
                    {t.booking.cancelBooking}
                  </button>
                )}

                {bk.status === 'completed' && !bk.hasReview && (
                  <button
                    type="button"
                    onClick={() => {
                      setReviewBooking(bk);
                      setRating(5);
                      setComment('');
                    }}
                    className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#FBBF24] text-[#1C241E] text-xs font-bold hover:bg-[#F59E0B] cursor-pointer flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>{t.booking.writeReview}</span>
                  </button>
                )}

                {bk.status === 'completed' && bk.hasReview && (
                  <span className="text-xs font-semibold text-[#16A34A]">
                    ✓ {t.booking.reviewSubmitted}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post-Completion Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitReview}
            className="bg-white border border-[#E2E8DF] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <h3 className="text-lg font-bold text-[#1C241E]">{t.booking.writeReview}</h3>
            <p className="text-xs text-[#5A655C]">{reviewBooking.equipmentTitle}</p>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-2">
                {t.booking.yourRating}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-[#E2E8DF] hover:border-[#FBBF24] cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-[#FBBF24] text-[#FBBF24]' : 'text-[#D4DDD0]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.booking.yourReview}
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewBooking(null)}
                className="flex-1 min-h-[44px] rounded-xl border border-[#D4DDD0] text-sm font-semibold cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="flex-1 min-h-[44px] rounded-xl bg-[#14532D] text-white text-sm font-semibold cursor-pointer"
              >
                {reviewSubmitting ? t.common.loading : t.booking.submitReview}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
