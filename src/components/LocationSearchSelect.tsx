import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import {
  FlattenedLocationOption,
  MAHARASHTRA_DISTRICTS,
  findDistrictByName,
  findTalukaInDistrict,
  resolveCoordinatesForLocation,
  searchMaharashtraLocations,
} from '../data/maharashtraGeography';
import { useLanguage } from '../context/LanguageContext';

interface LocationAutocompleteProps {
  valueLabel: string;
  placeholder?: string;
  onSelectLocation: (loc: {
    district: string;
    taluka: string;
    village: string;
    lat: number;
    lng: number;
  }) => void;
  onClear?: () => void;
  className?: string;
}

export function LocationAutocompleteInput({
  valueLabel,
  placeholder,
  onSelectLocation,
  onClear,
  className = '',
}: LocationAutocompleteProps) {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState(valueLabel);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(valueLabel);
  }, [valueLabel]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const matches = useMemo(() => searchMaharashtraLocations(query, 20), [query]);

  const formatOptionLabel = (item: FlattenedLocationOption) => {
    const distName = lang === 'en' ? item.districtEn : item.districtMr;
    const talName = lang === 'en' ? item.talukaEn : item.talukaMr;
    const vilName = lang === 'en' ? item.villageEn : item.villageMr;
    if (item.type === 'village') {
      return `${vilName}, ${talName}, ${distName}`;
    }
    if (item.type === 'taluka') {
      return `${talName} (${distName})`;
    }
    return distName;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F8FAF5] border border-[#E2E8DF] min-h-[46px] focus-within:border-[#14532D]">
        <MapPin className="w-4 h-4 text-[#14532D] shrink-0" />
        <input
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder || t.marketplace.searchLocationPlaceholder}
          className="w-full bg-transparent text-sm font-medium text-[#1C241E] placeholder:text-[#6B776D] focus:outline-none"
        />
        {query && (
          <button
            type="button"
            aria-label={t.common.close}
            onClick={() => {
              setQuery('');
              onClear?.();
              setOpen(true);
            }}
            className="text-[#5A655C] hover:text-[#1C241E] p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border border-[#D4DDD0] rounded-xl shadow-xl max-h-72 overflow-y-auto">
          <div className="px-3 py-1.5 bg-[#F8FAF5] border-b border-[#EDF2EA] text-[11px] font-semibold text-[#14532D] flex items-center gap-1.5">
            <Search className="w-3 h-3" />
            <span>{t.marketplace.coverageBanner}</span>
          </div>
          {matches.length === 0 ? (
            <div className="px-3.5 py-4 text-xs text-[#5A655C]">{t.marketplace.noResults}</div>
          ) : (
            <div className="divide-y divide-[#F1F5EE]">
              {matches.map((item, idx) => (
                <button
                  key={`${item.type}-${item.districtEn}-${item.talukaEn}-${item.villageEn}-${idx}`}
                  type="button"
                  onClick={() => {
                    const label = formatOptionLabel(item);
                    setQuery(label);
                    setOpen(false);
                    onSelectLocation({
                      district: item.districtEn,
                      taluka: item.type === 'district' ? '' : item.talukaEn,
                      village: item.type === 'village' ? item.villageEn : '',
                      lat: item.lat,
                      lng: item.lng,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-[#F3F8F0] transition-colors flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-[#1C241E] truncate">
                      {formatOptionLabel(item)}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#14532D] bg-[#EFF4EC] px-2 py-0.5 rounded shrink-0">
                    {item.type === 'district'
                      ? t.marketplace.districtLabel
                      : item.type === 'taluka'
                        ? t.marketplace.talukaLabel
                        : t.marketplace.villageLabel}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CascadingMaharashtraPickerProps {
  district: string;
  taluka: string;
  village: string;
  allowAll?: boolean;
  allowCustomVillage?: boolean;
  onChange: (next: {
    district: string;
    taluka: string;
    village: string;
    lat: number;
    lng: number;
  }) => void;
  compact?: boolean;
}

export function CascadingMaharashtraPicker({
  district,
  taluka,
  village,
  allowAll = true,
  allowCustomVillage = false,
  onChange,
  compact = false,
}: CascadingMaharashtraPickerProps) {
  const { lang, t } = useLanguage();

  const selectedDistObj = useMemo(
    () => (district && district !== 'all' ? findDistrictByName(district) : undefined),
    [district]
  );

  const talukas = useMemo(() => selectedDistObj?.talukas || [], [selectedDistObj]);

  const selectedTalukaObj = useMemo(
    () =>
      selectedDistObj && taluka && taluka !== 'all'
        ? findTalukaInDistrict(selectedDistObj.nameEn, taluka)
        : undefined,
    [selectedDistObj, taluka]
  );

  const villages = useMemo(() => selectedTalukaObj?.villages || [], [selectedTalukaObj]);

  const inputClass = compact
    ? 'w-full min-h-[40px] px-2.5 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-xs font-medium text-[#1C241E]'
    : 'w-full min-h-[44px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm font-medium text-[#1C241E]';

  const labelClass = compact
    ? 'block text-[11px] font-semibold text-[#5A655C] mb-1'
    : 'block text-xs font-semibold text-[#374139] mb-1';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* District (All 36) */}
      <div>
        <label className={labelClass}>{t.marketplace.districtLabel}</label>
        <select
          aria-label={t.marketplace.districtLabel}
          value={selectedDistObj?.nameEn || (allowAll ? 'all' : MAHARASHTRA_DISTRICTS[0].nameEn)}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'all') {
              onChange({
                district: 'all',
                taluka: 'all',
                village: 'all',
                lat: 18.1517,
                lng: 74.5768,
              });
              return;
            }
            const distObj = findDistrictByName(val);
            const firstTal = distObj?.talukas[0];
            const coords = resolveCoordinatesForLocation(val, allowAll ? undefined : firstTal?.nameEn);
            onChange({
              district: val,
              taluka: allowAll ? 'all' : firstTal?.nameEn || '',
              village: allowAll ? 'all' : firstTal?.villages[0]?.nameEn || '',
              lat: coords.lat,
              lng: coords.lng,
            });
          }}
          className={inputClass}
        >
          {allowAll && <option value="all">{t.marketplace.allDistricts}</option>}
          {MAHARASHTRA_DISTRICTS.map((d) => (
            <option key={d.id} value={d.nameEn}>
              {lang === 'en' ? d.nameEn : lang === 'hi' ? d.nameHi : d.nameMr}
            </option>
          ))}
        </select>
      </div>

      {/* Taluka (All 358 filtered by District) */}
      <div>
        <label className={labelClass}>{t.marketplace.talukaLabel}</label>
        <select
          aria-label={t.marketplace.talukaLabel}
          disabled={!selectedDistObj}
          value={selectedTalukaObj?.nameEn || (allowAll ? 'all' : talukas[0]?.nameEn || '')}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'all') {
              const coords = resolveCoordinatesForLocation(selectedDistObj?.nameEn);
              onChange({
                district: selectedDistObj?.nameEn || district,
                taluka: 'all',
                village: 'all',
                lat: coords.lat,
                lng: coords.lng,
              });
              return;
            }
            const talObj = talukas.find((tk) => tk.nameEn === val);
            const coords = resolveCoordinatesForLocation(selectedDistObj?.nameEn, val);
            onChange({
              district: selectedDistObj?.nameEn || district,
              taluka: val,
              village: allowAll ? 'all' : talObj?.villages[0]?.nameEn || '',
              lat: coords.lat,
              lng: coords.lng,
            });
          }}
          className={`${inputClass} disabled:opacity-60`}
        >
          {allowAll && <option value="all">{t.marketplace.allTalukas}</option>}
          {talukas.map((tk) => (
            <option key={tk.id} value={tk.nameEn}>
              {lang === 'en' ? tk.nameEn : tk.nameMr}
            </option>
          ))}
        </select>
      </div>

      {/* Village (Listed villages + optional custom village input) */}
      <div>
        <label className={labelClass}>{t.marketplace.villageLabel}</label>
        {allowCustomVillage ? (
          <div className="space-y-1.5">
            <select
              aria-label={t.marketplace.villageLabel}
              disabled={!selectedTalukaObj}
              value={
                villages.some((v) => v.nameEn.toLowerCase() === village.toLowerCase())
                  ? villages.find((v) => v.nameEn.toLowerCase() === village.toLowerCase())?.nameEn
                  : '__custom__'
              }
              onChange={(e) => {
                const val = e.target.value;
                const coords = resolveCoordinatesForLocation(
                  selectedDistObj?.nameEn,
                  selectedTalukaObj?.nameEn
                );
                onChange({
                  district: selectedDistObj?.nameEn || district,
                  taluka: selectedTalukaObj?.nameEn || taluka,
                  village: val === '__custom__' ? '' : val,
                  lat: coords.lat,
                  lng: coords.lng,
                });
              }}
              className={`${inputClass} disabled:opacity-60`}
            >
              {villages.map((v) => (
                <option key={v.nameEn} value={v.nameEn}>
                  {lang === 'en' ? v.nameEn : v.nameMr}
                </option>
              ))}
              <option value="__custom__">
                {lang === 'mr' ? '+ इतर गावाचे नाव लिहा' : lang === 'hi' ? '+ अन्य गांव लिखें' : '+ Type other village'}
              </option>
            </select>
            {(!villages.some((v) => v.nameEn.toLowerCase() === village.toLowerCase()) || village === '') && (
              <input
                type="text"
                value={village}
                placeholder={t.form.village}
                onChange={(e) => {
                  const coords = resolveCoordinatesForLocation(
                    selectedDistObj?.nameEn,
                    selectedTalukaObj?.nameEn
                  );
                  onChange({
                    district: selectedDistObj?.nameEn || district,
                    taluka: selectedTalukaObj?.nameEn || taluka,
                    village: e.target.value,
                    lat: coords.lat,
                    lng: coords.lng,
                  });
                }}
                className={inputClass}
              />
            )}
          </div>
        ) : (
          <select
            aria-label={t.marketplace.villageLabel}
            disabled={!selectedTalukaObj}
            value={village || 'all'}
            onChange={(e) => {
              const val = e.target.value;
              const coords = resolveCoordinatesForLocation(
                selectedDistObj?.nameEn,
                selectedTalukaObj?.nameEn
              );
              onChange({
                district: selectedDistObj?.nameEn || district,
                taluka: selectedTalukaObj?.nameEn || taluka,
                village: val,
                lat: coords.lat,
                lng: coords.lng,
              });
            }}
            className={`${inputClass} disabled:opacity-60`}
          >
            <option value="all">{t.marketplace.allVillages}</option>
            {villages.map((v) => (
              <option key={v.nameEn} value={v.nameEn}>
                {lang === 'en' ? v.nameEn : v.nameMr}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
