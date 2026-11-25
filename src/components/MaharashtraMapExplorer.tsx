import React, { useState } from 'react';
import { MapPin, Navigation, Info, ArrowRight } from 'lucide-react';
import { Equipment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useLocationContext } from '../context/LocationContext';
import { SelectableImageFrame } from './SelectableImageFrame';

interface MaharashtraMapExplorerProps {
  items: Equipment[];
  onSelectEquipment: (eq: Equipment) => void;
}

// Bounding box roughly covering Maharashtra (lat 15.6..22.0, lng 72.6..80.9)
const MIN_LAT = 15.8;
const MAX_LAT = 21.8;
const MIN_LNG = 73.0;
const MAX_LNG = 80.2;

function projectToPercent(lat: number, lng: number) {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 84 + 8;
  const y = (1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 80 + 10;
  return {
    x: Math.max(6, Math.min(94, x)),
    y: Math.max(8, Math.min(92, y)),
  };
}

export function MaharashtraMapExplorer({ items, onSelectEquipment }: MaharashtraMapExplorerProps) {
  const { t } = useLanguage();
  const { location } = useLocationContext();
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);

  const selected = items.find((i) => i.id === selectedId) || items[0] || null;
  const userPos = projectToPercent(location.lat, location.lng);

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-xl overflow-hidden">
      {/* Setup & Coordinate Notice */}
      <div className="px-4 py-3 bg-[#EFF4EC] border-b border-[#E2E8DF] flex items-start gap-2.5 text-xs text-[#2E3A30]">
        <Info className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" aria-hidden="true" />
        <span>{t.marketplace.mapNotice}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Interactive Regional Coordinate Map */}
        <div className="lg:col-span-8 relative min-h-[380px] md:min-h-[440px] bg-gradient-to-br from-[#EEF5E9] via-[#E5EFE0] to-[#DCE8D5] overflow-hidden">
          {/* Subtle topographic grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="#9CB398"
                  strokeWidth="0.7"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Maharashtra Stylized Outline Accent */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
            aria-hidden="true"
          >
            <path
              d="M 10,72 Q 8,45 14,22 L 45,14 L 88,16 L 92,40 L 62,55 L 48,78 L 22,88 Z"
              fill="#FFFFFF"
              fillOpacity="0.45"
              stroke="#14532D"
              strokeOpacity="0.25"
              strokeWidth="0.6"
            />
          </svg>

          {/* User Location Pin */}
          <div
            style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full border border-[#14532D]/25 bg-[#22C55E]/10 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#14532D] border-2 border-white shadow" />
            </div>
            <div className="mt-0.5 text-[10px] font-bold text-[#14532D] bg-white/90 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap text-center">
              {location.taluka}
            </div>
          </div>

          {/* Equipment Pins */}
          {items.map((item) => {
            const pos = projectToPercent(item.lat, item.lng);
            const isSelected = selected?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-full z-20 transition-transform duration-150 cursor-pointer focus:outline-none ${
                  isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                }`}
              >
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-bold tabular-nums shadow-md border flex items-center gap-1 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#FBBF24] text-[#1C241E] border-[#14532D]'
                      : 'bg-[#14532D] text-white border-white'
                  }`}
                >
                  <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span>₹{item.price}</span>
                </div>
              </button>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-white/95 border border-[#E2E8DF] rounded-lg px-3 py-2 text-xs text-[#1C241E] flex items-center gap-3 shadow-sm">
            <span className="flex items-center gap-1.5 font-medium">
              <Navigation className="w-3.5 h-3.5 text-[#14532D]" />
              {location.taluka}, {location.district}
            </span>
            <span className="text-[#5A655C] tabular-nums">
              {items.length} {t.marketplace.resultsCount}
            </span>
          </div>
        </div>

        {/* Selected Machine Inspector Panel */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#E2E8DF] p-5 flex flex-col justify-between bg-white">
          {selected ? (
            <div className="space-y-4">
              <SelectableImageFrame
                selectionId={`map-preview-${selected.id}`}
                src={selected.images[0]}
                alt={selected.title}
                className="aspect-[16/10] rounded-lg bg-[#EFF4EC]"
              />

              <div>
                <div className="text-xs font-semibold text-[#14532D]">
                  {t.categories[selected.category]} · {selected.taluka}, {selected.district}
                </div>
                <h4 className="mt-1 text-lg font-bold text-[#1C241E]">{selected.title}</h4>
                <p className="mt-1 text-xs text-[#5A655C] line-clamp-2">{selected.description}</p>
              </div>

              <div className="pt-3 border-t border-[#EDF2EA] flex items-center justify-between text-sm">
                <div>
                  <span className="text-xl font-bold text-[#14532D] tabular-nums">
                    ₹{selected.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#5A655C]"> / {t.units[selected.priceUnit]}</span>
                </div>
                {typeof selected.distanceKm === 'number' && (
                  <span className="text-xs font-mono font-semibold text-[#14532D] tabular-nums">
                    {selected.distanceKm} {t.common.kmAway}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => onSelectEquipment(selected)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#14532D] text-white text-sm font-semibold hover:bg-[#166534] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.common.viewDetails}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-[#5A655C]">
              {t.marketplace.noResults}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
