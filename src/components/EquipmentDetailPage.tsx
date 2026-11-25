import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Star,
  Tractor,
  Truck,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { Equipment, Review } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import { apiFetch } from '../lib/api';
import { EquipmentCard } from './EquipmentCard';
import { SelectableImageFrame } from './SelectableImageFrame';

interface EquipmentDetailPageProps {
  equipment: Equipment;
  allEquipment: Equipment[];
  onBack: () => void;
  onSelectEquipment: (eq: Equipment) => void;
  onBookNow: (eq: Equipment) => void;
  onOpenAuth: () => void;
}

export function EquipmentDetailPage({
  equipment,
  allEquipment,
  onBack,
  onSelectEquipment,
  onBookNow,
  onOpenAuth,
}: EquipmentDetailPageProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { location } = useLocationContext();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [contactHint, setContactHint] = useState('');

  useEffect(() => {
    setActiveImageIdx(0);
    setContactHint('');
    setLoadingReviews(true);
    apiFetch<{ equipment: Equipment; reviews: Review[] }>(
      `/api/equipment/${equipment.id}?lat=${location.lat}&lng=${location.lng}`
    )
      .then((res) => setReviews(res.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, [equipment.id, location.lat, location.lng]);

  const related = allEquipment
    .filter((e) => e.id !== equipment.id && (e.category === equipment.category || e.district === equipment.district))
    .slice(0, 3);

  const cleanPhone = (equipment.contactPhone || '').replace(/[^\d+]/g, '');
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.replace(/^\+/, '')}?text=${encodeURIComponent(
        `नमस्कार ${equipment.ownerName}, मला FarmRent वर तुमचे "${equipment.title}" भाड्याने हवे आहे.`
      )}`
    : '';

  const handleBookClick = () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    onBookNow(equipment);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12 space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#14532D] hover:underline min-h-[40px] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.common.back}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Large Image Gallery & Detailed Specs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E2E8DF] rounded-2xl overflow-hidden">
            <div className="p-2.5 bg-[#F8FAF5]">
              <SelectableImageFrame
                selectionId={`detail-main-${equipment.id}-${activeImageIdx}`}
                src={equipment.images[activeImageIdx]}
                alt={equipment.title}
                className="aspect-[16/10] bg-[#EFF4EC] rounded-xl"
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-[#14532D]/50">
                    <Tractor className="w-16 h-16" />
                  </div>
                }
              />
            </div>

            {equipment.images.length > 1 && (
              <div className="p-3 border-t border-[#EDF2EA] flex items-center gap-3 overflow-x-auto">
                {equipment.images.map((img, i) => (
                  <SelectableImageFrame
                    key={i}
                    selectionId={`detail-thumb-${equipment.id}-${i}`}
                    src={img}
                    alt={`${equipment.title} ${i + 1}`}
                    compact
                    onAfterClick={() => setActiveImageIdx(i)}
                    className={`w-20 h-14 rounded-lg shrink-0 border-2 ${
                      activeImageIdx === i ? 'border-[#14532D]' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 space-y-4">
            <div className="text-xs font-semibold text-[#14532D]">
              {t.categories[equipment.category]}
              {equipment.brand ? ` · ${equipment.brand}` : ''}
              {equipment.model ? ` ${equipment.model}` : ''}
              {equipment.isDemo ? ` · ${t.common.demoTag}` : ''}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C241E]">{equipment.title}</h1>
            <p className="text-sm sm:text-base text-[#374139] leading-relaxed">
              {equipment.description}
            </p>

            {/* Specifications Table */}
            <div className="pt-4 border-t border-[#EDF2EA]">
              <h2 className="text-base font-bold text-[#1C241E] mb-3">
                {t.details.specifications}
              </h2>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {equipment.specs.horsepower && (
                  <div>
                    <dt className="text-xs text-[#5A655C]">{t.form.horsepower}</dt>
                    <dd className="font-semibold text-[#1C241E]">{equipment.specs.horsepower}</dd>
                  </div>
                )}
                {equipment.specs.fuelType && (
                  <div>
                    <dt className="text-xs text-[#5A655C]">{t.form.fuelType}</dt>
                    <dd className="font-semibold text-[#1C241E]">{equipment.specs.fuelType}</dd>
                  </div>
                )}
                {equipment.specs.workingWidth && (
                  <div>
                    <dt className="text-xs text-[#5A655C]">{t.form.workingWidth}</dt>
                    <dd className="font-semibold text-[#1C241E]">{equipment.specs.workingWidth}</dd>
                  </div>
                )}
                {equipment.specs.year && (
                  <div>
                    <dt className="text-xs text-[#5A655C]">{t.form.year}</dt>
                    <dd className="font-semibold text-[#1C241E] tabular-nums">{equipment.specs.year}</dd>
                  </div>
                )}
                {equipment.specs.condition && (
                  <div>
                    <dt className="text-xs text-[#5A655C]">Condition</dt>
                    <dd className="font-semibold text-[#1C241E]">{equipment.specs.condition}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Rental Conditions */}
            {equipment.rentalConditions && (
              <div className="pt-4 border-t border-[#EDF2EA]">
                <h2 className="text-base font-bold text-[#1C241E] mb-1.5">
                  {t.details.rentalConditions}
                </h2>
                <p className="text-sm text-[#4B554D]">{equipment.rentalConditions}</p>
              </div>
            )}

            {/* Available Dates */}
            {equipment.availableDates.length > 0 && (
              <div className="pt-4 border-t border-[#EDF2EA]">
                <h2 className="text-base font-bold text-[#1C241E] mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#14532D]" />
                  <span>{t.details.availableDates}</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {equipment.availableDates.map((d) => (
                    <span
                      key={d}
                      className="text-xs font-mono tabular-nums px-2.5 py-1 rounded-md bg-[#F8FAF5] border border-[#E2E8DF] text-[#1C241E]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#1C241E]">{t.details.customerReviews}</h2>
              <div className="flex items-center gap-1.5 text-sm font-bold tabular-nums">
                <Star className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                <span>{equipment.ratingAvg > 0 ? equipment.ratingAvg.toFixed(1) : '—'}</span>
                <span className="text-xs font-normal text-[#5A655C]">
                  ({equipment.reviewCount} {t.common.reviews})
                </span>
              </div>
            </div>

            {loadingReviews ? (
              <div className="h-16 bg-[#F8FAF5] rounded-lg animate-pulse" />
            ) : reviews.length === 0 ? (
              <p className="text-sm text-[#5A655C]">{t.common.noReviews}</p>
            ) : (
              <div className="divide-y divide-[#EDF2EA]">
                {reviews.map((rev) => (
                  <div key={rev.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#1C241E]">
                        {rev.reviewerName}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating
                                ? 'fill-[#FBBF24] text-[#FBBF24]'
                                : 'text-[#D4DDD0]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#374139]">{rev.comment}</p>
                    <div className="text-[11px] text-[#6B776D] tabular-nums">
                      {rev.createdAt.slice(0, 10)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Contiguous Purchase / Booking Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-22 space-y-5">
          <div className="bg-white border border-[#E2E8DF] rounded-2xl p-6 space-y-5">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <span className="text-3xl font-extrabold text-[#14532D] tabular-nums">
                  ₹{equipment.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-[#5A655C]">
                  {' '}
                  / {t.units[equipment.priceUnit]}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold">
                {equipment.available ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span className="text-[#16A34A]">{t.common.available}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-[#DC2626]" />
                    <span className="text-[#DC2626]">{t.common.unavailable}</span>
                  </>
                )}
              </div>
            </div>

            {/* Extra service details */}
            <div className="space-y-2 text-xs text-[#374139] pt-3 border-t border-[#EDF2EA]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#14532D]" />
                  {t.common.deliveryAvailable}
                </span>
                <span className="font-semibold tabular-nums">
                  {equipment.deliveryCharge > 0
                    ? `₹${equipment.deliveryCharge}`
                    : '₹0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#14532D]" />
                  {t.common.operatorIncluded}
                </span>
                <span className="font-semibold tabular-nums">
                  {equipment.operatorIncluded
                    ? equipment.operatorCharge > 0
                      ? `₹${equipment.operatorCharge}`
                      : 'Included'
                    : 'No'}
                </span>
              </div>
            </div>

            {/* Book Now Primary CTA */}
            <button
              type="button"
              disabled={!equipment.available}
              onClick={handleBookClick}
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#FBBF24] text-[#1C241E] font-bold text-base hover:bg-[#F59E0B] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {user ? t.common.bookNow : t.booking.signInToBook}
            </button>

            {/* Owner Card */}
            <div className="pt-4 border-t border-[#EDF2EA] space-y-3">
              <div className="text-xs font-semibold text-[#5A655C]">{t.details.ownerInfo}</div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-sm text-[#1C241E] flex items-center gap-1.5">
                    <span>{equipment.ownerName}</span>
                    {equipment.ownerVerified && (
                      <ShieldCheck className="w-4 h-4 text-[#14532D]" />
                    )}
                  </div>
                  <div className="text-xs text-[#5A655C] mt-0.5">
                    {equipment.ownerVerified ? t.common.verifiedOwner : t.common.unverifiedOwner}
                  </div>
                </div>
              </div>

              {/* Direct Call & WhatsApp Buttons (Real Contact Only) */}
              <div className="grid grid-cols-2 gap-2.5">
                {cleanPhone ? (
                  <>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-[#14532D] text-[#14532D] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#EFF4EC] transition-colors"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{t.common.callOwner}</span>
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-3 py-2 rounded-xl bg-[#16A34A] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#15803D] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.common.whatsappOwner}</span>
                    </a>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setContactHint(
                          'Demo listing does not store a personal phone number. Use Book Now or list your own equipment with your contact number to test live Call/WhatsApp links.'
                        )
                      }
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-[#D4DDD0] text-[#4B554D] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#F8FAF5] cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{t.common.callOwner}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setContactHint(
                          'Demo listing does not store a personal phone number. Use Book Now or list your own equipment with your contact number to test live Call/WhatsApp links.'
                        )
                      }
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-[#D4DDD0] text-[#4B554D] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#F8FAF5] cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.common.whatsappOwner}</span>
                    </button>
                  </>
                )}
              </div>

              {contactHint && (
                <p className="text-xs text-[#4B554D] bg-[#F8FAF5] border border-[#E2E8DF] rounded-lg p-2.5">
                  {contactHint}
                </p>
              )}
            </div>

            {/* Location & Distance Card */}
            <div className="pt-4 border-t border-[#EDF2EA] space-y-2">
              <div className="text-xs font-semibold text-[#5A655C]">{t.details.locationMap}</div>
              <div className="flex items-start justify-between gap-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#1C241E]">
                      {equipment.village}, {equipment.taluka}
                    </div>
                    <div className="text-xs text-[#5A655C]">
                      {equipment.district}, {equipment.state}
                    </div>
                  </div>
                </div>
                {typeof equipment.distanceKm === 'number' && (
                  <span className="text-xs font-mono font-bold text-[#14532D] tabular-nums shrink-0">
                    {equipment.distanceKm} {t.common.kmAway}
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-[#5A655C] bg-[#F8FAF5] rounded-lg px-3 py-2 border border-[#EDF2EA]">
                GPS: {equipment.lat.toFixed(4)}° N, {equipment.lng.toFixed(4)}° E
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Equipment */}
      {related.length > 0 && (
        <section className="pt-6 border-t border-[#E2E8DF]">
          <h2 className="text-xl font-bold text-[#1C241E] mb-5">{t.details.relatedEquipment}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((item) => (
              <EquipmentCard key={item.id} equipment={item} onSelect={onSelectEquipment} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
