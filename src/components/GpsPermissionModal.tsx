import React, { useState } from 'react';
import { Check, MapPin, Navigation, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLocationContext } from '../context/LocationContext';
import { MAHARASHTRA_HUBS } from '../data/locations';
import { CascadingMaharashtraPicker, LocationAutocompleteInput } from './LocationSearchSelect';

interface GpsPermissionModalProps {
  open: boolean;
  onClose: () => void;
}

export function GpsPermissionModal({ open, onClose }: GpsPermissionModalProps) {
  const { lang, t } = useLanguage();
  const { location, selectHub, setCustomLocation, requestGpsLocation, gpsLoading } = useLocationContext();
  const [gpsError, setGpsError] = useState('');

  const [draftDistrict, setDraftDistrict] = useState(location.district || 'Pune');
  const [draftTaluka, setDraftTaluka] = useState(location.taluka || 'Baramati');
  const [draftVillage, setDraftVillage] = useState(location.village || 'Malegaon Bk');
  const [draftLat, setDraftLat] = useState(location.lat);
  const [draftLng, setDraftLng] = useState(location.lng);
  const [searchLabel, setSearchLabel] = useState('');

  if (!open) return null;

  const handleAllowGps = async () => {
    setGpsError('');
    const res = await requestGpsLocation();
    if (res.ok) {
      onClose();
    } else {
      setGpsError(res.error || 'Could not access GPS.');
    }
  };

  const applyCustomSelection = () => {
    setCustomLocation({
      village: draftVillage || draftTaluka || draftDistrict,
      taluka: draftTaluka || draftDistrict,
      district: draftDistrict,
      state: 'Maharashtra',
      lat: draftLat,
      lng: draftLng,
      isGps: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E2E8DF] rounded-2xl max-w-xl w-full p-6 shadow-xl my-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[#14532D]">
            <Navigation className="w-5 h-5 shrink-0" />
            <h3 className="text-lg font-bold">{t.dashboard.gpsExplainTitle}</h3>
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

        <p className="mt-2.5 text-sm text-[#4B554D] leading-relaxed">{t.dashboard.gpsExplainBody}</p>

        {gpsError && (
          <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
            {gpsError}
          </div>
        )}

        <button
          type="button"
          disabled={gpsLoading}
          onClick={handleAllowGps}
          className="mt-4 w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#14532D] text-white text-sm font-semibold hover:bg-[#166534] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>{gpsLoading ? t.common.loading : t.dashboard.allowGps}</span>
        </button>

        {/* Instant Search across all 36 districts, 358 talukas & villages */}
        <div className="mt-5 pt-4 border-t border-[#EDF2EA] space-y-3">
          <div className="text-xs font-bold text-[#14532D]">{t.marketplace.coverageBanner}</div>

          <LocationAutocompleteInput
            valueLabel={searchLabel}
            placeholder={t.marketplace.searchLocationPlaceholder}
            onSelectLocation={(loc) => {
              const display = [loc.village, loc.taluka, loc.district].filter(Boolean).join(', ');
              setSearchLabel(display);
              setCustomLocation({
                village: loc.village || loc.taluka || loc.district,
                taluka: loc.taluka || loc.district,
                district: loc.district,
                state: 'Maharashtra',
                lat: loc.lat,
                lng: loc.lng,
                isGps: false,
              });
              onClose();
            }}
            onClear={() => setSearchLabel('')}
          />

          {/* Cascading District -> Taluka -> Village */}
          <CascadingMaharashtraPicker
            compact
            allowAll={false}
            allowCustomVillage
            district={draftDistrict}
            taluka={draftTaluka}
            village={draftVillage}
            onChange={(next) => {
              setDraftDistrict(next.district);
              setDraftTaluka(next.taluka);
              setDraftVillage(next.village);
              setDraftLat(next.lat);
              setDraftLng(next.lng);
            }}
          />

          <button
            type="button"
            onClick={applyCustomSelection}
            className="w-full min-h-[42px] px-4 py-2 rounded-lg bg-[#FBBF24] text-[#1C241E] text-sm font-bold hover:bg-[#F59E0B] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t.common.confirm}</span>
          </button>
        </div>

        {/* Popular Hubs Quick Shortcuts */}
        <div className="mt-4 pt-3 border-t border-[#EDF2EA]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
            {MAHARASHTRA_HUBS.slice(0, 6).map((hub) => {
              const active = !location.isGps && location.taluka === hub.taluka;
              const label = lang === 'mr' ? hub.labelMr : lang === 'hi' ? hub.labelHi : hub.labelEn;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => {
                    selectHub(hub);
                    onClose();
                  }}
                  className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-left text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-[#14532D] text-white border-[#14532D]'
                      : 'bg-[#F8FAF5] text-[#1C241E] border-[#E2E8DF] hover:border-[#14532D]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
