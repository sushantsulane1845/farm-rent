import React, { useState } from 'react';
import { CheckCircle2, X, AlertCircle } from 'lucide-react';
import { Booking, Equipment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

interface BookingModalProps {
  equipment: Equipment | null;
  onClose: () => void;
  onBooked: (booking: Booking) => void;
}

export function BookingModal({ equipment, onClose, onBooked }: BookingModalProps) {
  const { t } = useLanguage();
  const { user, refreshNotifications } = useAuth();

  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [date, setDate] = useState(equipment?.availableDates[0] || tomorrow);
  const [startTime, setStartTime] = useState('08:00');
  const [duration, setDuration] = useState(equipment?.priceUnit === 'hour' ? 3 : 1);
  const [acres, setAcres] = useState(2);
  const [farmLocation, setFarmLocation] = useState(
    user ? `${user.village ? user.village + ', ' : ''}${user.taluka}, ${user.district}` : ''
  );
  const [renterPhone, setRenterPhone] = useState(user?.phone || '');
  const [deliveryRequired, setDeliveryRequired] = useState(true);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!equipment) return null;

  const qty = equipment.priceUnit === 'acre' ? Math.max(0.5, acres) : Math.max(1, duration);
  const baseCost = Math.round(equipment.price * qty);
  const deliveryCost = deliveryRequired ? equipment.deliveryCharge : 0;
  const operatorCost = equipment.operatorIncluded ? equipment.operatorCharge : 0;
  const totalCost = baseCost + deliveryCost + operatorCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!farmLocation.trim() || farmLocation.trim().length < 3) {
      setError('Please enter your farm location.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch<{ booking: Booking }>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          equipmentId: equipment.id,
          date,
          startTime,
          duration,
          acres,
          farmLocation,
          renterPhone,
          deliveryRequired,
          notes,
        }),
      });
      setConfirmedBooking(res.booking);
      await refreshNotifications();
      onBooked(res.booking);
    } catch (err: any) {
      setError(err.message || 'Booking request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E2E8DF] rounded-2xl max-w-lg w-full p-6 shadow-xl my-8">
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#EDF2EA]">
          <div>
            <h2 className="text-lg font-bold text-[#1C241E]">{t.booking.requestBooking}</h2>
            <p className="text-xs text-[#5A655C] mt-0.5">{equipment.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#5A655C] hover:bg-[#EFF4EC] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#22C55E]/15 text-[#16A34A] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1C241E]">{t.booking.confirmedTitle}</h3>
            <p className="text-sm text-[#4B554D]">{t.booking.confirmedBody}</p>

            <div className="bg-[#F8FAF5] border border-[#E2E8DF] rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#5A655C]">Booking ID</span>
                <span className="font-mono font-semibold">{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A655C]">{t.booking.selectDate}</span>
                <span className="font-semibold tabular-nums">
                  {confirmedBooking.date} · {confirmedBooking.startTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A655C]">{t.booking.totalEstimate}</span>
                <span className="font-bold text-[#14532D] tabular-nums">
                  ₹{confirmedBooking.totalCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A655C]">Status</span>
                <span className="font-semibold text-[#D97706]">{t.statuses.pending}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[46px] rounded-xl bg-[#14532D] text-white font-semibold text-sm cursor-pointer"
            >
              {t.common.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#374139] mb-1">
                  {t.booking.selectDate}
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().slice(0, 10)}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374139] mb-1">
                  {t.booking.startTime}
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {equipment.priceUnit === 'acre' ? (
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#374139] mb-1">
                    {t.booking.acresLabel}
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    required
                    value={acres}
                    onChange={(e) => setAcres(Number(e.target.value))}
                    className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm tabular-nums"
                  />
                </div>
              ) : (
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#374139] mb-1">
                    {t.booking.duration} ({t.units[equipment.priceUnit]})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm tabular-nums"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.booking.farmLocation}
              </label>
              <input
                type="text"
                required
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                placeholder={t.booking.farmLocationPlaceholder}
                className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.auth.phoneLabel}
              </label>
              <input
                type="tel"
                value={renterPhone}
                onChange={(e) => setRenterPhone(e.target.value)}
                placeholder="+91..."
                className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1.5">
                {t.booking.deliveryRequired}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryRequired(true)}
                  className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold border cursor-pointer ${
                    deliveryRequired
                      ? 'bg-[#14532D] text-white border-[#14532D]'
                      : 'bg-[#F8FAF5] text-[#1C241E] border-[#D4DDD0]'
                  }`}
                >
                  {t.booking.deliveryYes}
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryRequired(false)}
                  className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold border cursor-pointer ${
                    !deliveryRequired
                      ? 'bg-[#14532D] text-white border-[#14532D]'
                      : 'bg-[#F8FAF5] text-[#1C241E] border-[#D4DDD0]'
                  }`}
                >
                  {t.booking.deliveryNo}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374139] mb-1">
                {t.booking.notes}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.booking.notesPlaceholder}
                className="w-full p-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
              />
            </div>

            {/* Cost Summary */}
            <div className="bg-[#F8FAF5] border border-[#E2E8DF] rounded-xl p-4 space-y-2 text-xs">
              <div className="font-bold text-[#1C241E]">{t.booking.costSummary}</div>
              <div className="flex justify-between text-[#4B554D]">
                <span>
                  {t.booking.baseRental} ({qty} {t.units[equipment.priceUnit]} × ₹{equipment.price})
                </span>
                <span className="font-semibold tabular-nums">₹{baseCost.toLocaleString('en-IN')}</span>
              </div>
              {deliveryCost > 0 && (
                <div className="flex justify-between text-[#4B554D]">
                  <span>{t.booking.deliveryCharge}</span>
                  <span className="font-semibold tabular-nums">₹{deliveryCost.toLocaleString('en-IN')}</span>
                </div>
              )}
              {operatorCost > 0 && (
                <div className="flex justify-between text-[#4B554D]">
                  <span>{t.booking.operatorCharge}</span>
                  <span className="font-semibold tabular-nums">₹{operatorCost.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#E2E8DF] flex justify-between text-sm font-bold text-[#14532D]">
                <span>{t.booking.totalEstimate}</span>
                <span className="tabular-nums">₹{totalCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#5A655C]">{t.booking.pendingNote}</p>

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[48px] rounded-xl bg-[#FBBF24] text-[#1C241E] font-bold text-sm hover:bg-[#F59E0B] disabled:opacity-60 cursor-pointer"
            >
              {submitting ? t.common.loading : t.booking.submitRequest}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
