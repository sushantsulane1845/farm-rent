import React, { useId } from 'react';
import { MapPin, Star, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { Equipment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useImageSelection } from '../context/ImageSelectionContext';
import { SelectableImageFrame } from './SelectableImageFrame';

interface EquipmentCardProps {
  equipment: Equipment;
  onSelect: (equipment: Equipment) => void;
}

export function EquipmentCard({ equipment, onSelect }: EquipmentCardProps) {
  const { t } = useLanguage();
  const { selectedImageId } = useImageSelection();
  const instanceId = useId();
  const selectionId = `equip-card-${equipment.id}-${instanceId}`;
  const isImageSelected = selectedImageId === selectionId;

  const primaryImage = equipment.images[0];

  return (
    <article
      onClick={() => onSelect(equipment)}
      className={`group bg-white rounded-xl overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none cursor-pointer flex flex-col border ${
        isImageSelected
          ? 'border-[#14532D] ring-2 ring-[#FBBF24]/80 -translate-y-1 shadow-lg'
          : 'border-[#E2E8DF] hover:-translate-y-1 hover:shadow-lg hover:border-[#14532D]/40'
      }`}
    >
      {/* 4:3 Interactive Selectable Machinery Image */}
      <div className="p-2 pb-0">
        <SelectableImageFrame
          selectionId={selectionId}
          src={primaryImage}
          alt={equipment.title}
          className="aspect-[4/3] rounded-lg bg-[#EFF4EC]"
        />
      </div>

      {/* Clean Zero-Pill Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Quiet unboxed metadata line */}
          <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-xs text-[#5A655C]">
            <span className="font-semibold text-[#14532D]">
              {t.categories[equipment.category]}
            </span>
            {equipment.brand && (
              <>
                <span aria-hidden="true">·</span>
                <span>{equipment.brand}</span>
              </>
            )}
            {equipment.isDemo && (
              <>
                <span aria-hidden="true">·</span>
                <span>{t.common.demoTag}</span>
              </>
            )}
          </div>

          <h3 className="mt-1.5 text-base font-bold text-[#1C241E] leading-snug line-clamp-2">
            {equipment.title}
          </h3>

          {/* Location & Distance */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#4B554D]">
            <MapPin className="w-3.5 h-3.5 text-[#14532D] shrink-0" aria-hidden="true" />
            <span className="truncate">
              {equipment.village}, {equipment.taluka}, {equipment.district}
            </span>
            {typeof equipment.distanceKm === 'number' && (
              <span className="shrink-0 font-mono tabular-nums text-[#14532D] font-semibold">
                · {equipment.distanceKm} km
              </span>
            )}
          </div>

          {/* Owner & Genuine Verification Status */}
          <div className="mt-2 flex items-center justify-between gap-2 text-xs text-[#5A655C]">
            <div className="flex items-center gap-1 min-w-0">
              <span className="truncate">{equipment.ownerName}</span>
              {equipment.ownerVerified && (
                <ShieldCheck
                  className="w-3.5 h-3.5 text-[#14532D] shrink-0"
                  aria-label={t.common.verifiedOwner}
                />
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 tabular-nums font-semibold text-[#1C241E]">
              <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" aria-hidden="true" />
              <span>{equipment.ratingAvg > 0 ? equipment.ratingAvg.toFixed(1) : '—'}</span>
              <span className="text-[#5A655C] font-normal">({equipment.reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#EDF2EA] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-[#14532D] tabular-nums">
                ₹{equipment.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#5A655C]">
                / {t.units[equipment.priceUnit]}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs font-medium">
              {equipment.available ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" aria-hidden="true" />
                  <span className="text-[#16A34A]">{t.common.available}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-[#DC2626]" aria-hidden="true" />
                  <span className="text-[#DC2626]">{t.common.unavailable}</span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(equipment);
            }}
            className="px-3.5 py-2 min-h-[40px] rounded-lg bg-[#14532D] text-white text-xs font-semibold hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.common.viewDetails}
          </button>
        </div>
      </div>
    </article>
  );
}
