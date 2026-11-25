import React, { useMemo, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Map as MapIcon,
  LayoutGrid,
  Navigation,
  RotateCcw,
} from 'lucide-react';
import { Equipment, EquipmentCategory, PriceUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useLocationContext } from '../context/LocationContext';
import { EquipmentCard } from './EquipmentCard';
import { MaharashtraMapExplorer } from './MaharashtraMapExplorer';
import { CascadingMaharashtraPicker, LocationAutocompleteInput } from './LocationSearchSelect';

export interface MarketplaceFilters {
  q: string;
  category: EquipmentCategory | 'all';
  district: string;
  taluka: string;
  village: string;
  maxDistance: string;
  maxPrice: string;
  priceUnit: PriceUnit | 'all';
  date: string;
  minRating: string;
  onlyAvailable: boolean;
  operatorOnly: boolean;
  sort: 'nearest' | 'lowest_price' | 'highest_rated' | 'recent';
}

interface MarketplacePageProps {
  equipment: Equipment[];
  loading: boolean;
  filters: MarketplaceFilters;
  onChangeFilters: (next: MarketplaceFilters) => void;
  onSelectEquipment: (eq: Equipment) => void;
  onOpenLocationModal: () => void;
}

const ALL_CATEGORIES: EquipmentCategory[] = [
  'tractor',
  'rotavator',
  'harvester',
  'cultivator',
  'seed_drill',
  'sprayer',
  'thresher',
  'trailer',
  'plough',
  'jcb',
  'transport',
  'other',
];

function districtMatches(eqDistrict: string, filterDistrict: string): boolean {
  const ed = eqDistrict.toLowerCase();
  const fd = filterDistrict.toLowerCase();
  const fdBase = fd.split('(')[0].trim();
  if (ed.includes(fd) || ed.includes(fdBase)) return true;
  if (fd.includes('ahilyanagar') && ed.includes('ahmednagar')) return true;
  if (fd.includes('ahmednagar') && ed.includes('ahilyanagar')) return true;
  if (fd.includes('dharashiv') && ed.includes('osmanabad')) return true;
  if (fd.includes('osmanabad') && ed.includes('dharashiv')) return true;
  return false;
}

export function MarketplacePage({
  equipment,
  loading,
  filters,
  onChangeFilters,
  onSelectEquipment,
  onOpenLocationModal,
}: MarketplacePageProps) {
  const { t } = useLanguage();
  const { location } = useLocationContext();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const locationSummary = useMemo(() => {
    if (filters.district === 'all') return '';
    const parts = [
      filters.village !== 'all' ? filters.village : '',
      filters.taluka !== 'all' ? filters.taluka : '',
      filters.district,
    ].filter(Boolean);
    return parts.join(', ');
  }, [filters.district, filters.taluka, filters.village]);

  const filteredEquipment = useMemo(() => {
    let list = [...equipment];
    if (filters.q.trim()) {
      const q = filters.q.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.brand.toLowerCase().includes(q) ||
          e.model.toLowerCase().includes(q) ||
          e.village.toLowerCase().includes(q) ||
          e.taluka.toLowerCase().includes(q) ||
          e.district.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.specs.horsepower || '').toLowerCase().includes(q)
      );
    }
    if (filters.category !== 'all') {
      list = list.filter((e) => e.category === filters.category);
    }
    if (filters.district && filters.district !== 'all') {
      list = list.filter((e) => districtMatches(e.district, filters.district));
    }
    if (filters.taluka && filters.taluka !== 'all') {
      const talLower = filters.taluka.toLowerCase().split('(')[0].trim();
      list = list.filter((e) => e.taluka.toLowerCase().includes(talLower));
    }
    if (filters.village && filters.village !== 'all') {
      const vilLower = filters.village.toLowerCase();
      list = list.filter((e) => e.village.toLowerCase().includes(vilLower));
    }
    if (filters.onlyAvailable) {
      list = list.filter((e) => e.available);
    }
    if (filters.operatorOnly) {
      list = list.filter((e) => e.operatorIncluded);
    }
    if (filters.maxDistance) {
      const maxD = Number(filters.maxDistance);
      if (maxD > 0) {
        list = list.filter((e) => (e.distanceKm ?? 0) <= maxD);
      }
    }
    if (filters.maxPrice) {
      const maxP = Number(filters.maxPrice);
      if (maxP > 0) {
        list = list.filter((e) => e.price <= maxP);
      }
    }
    if (filters.priceUnit !== 'all') {
      list = list.filter((e) => e.priceUnit === filters.priceUnit);
    }
    if (filters.minRating) {
      const minR = Number(filters.minRating);
      if (minR > 0) {
        list = list.filter((e) => e.ratingAvg >= minR);
      }
    }
    if (filters.date) {
      list = list.filter(
        (e) => e.available && (e.availableDates.length === 0 || e.availableDates.includes(filters.date))
      );
    }

    if (filters.sort === 'nearest') {
      list.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    } else if (filters.sort === 'lowest_price') {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'highest_rated') {
      list.sort((a, b) => b.ratingAvg - a.ratingAvg);
    } else {
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    return list;
  }, [equipment, filters]);

  const resetFilters = () => {
    onChangeFilters({
      q: '',
      category: 'all',
      district: 'all',
      taluka: 'all',
      village: 'all',
      maxDistance: '',
      maxPrice: '',
      priceUnit: 'all',
      date: '',
      minRating: '',
      onlyAvailable: false,
      operatorOnly: false,
      sort: 'nearest',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12 space-y-6">
      {/* Header & Active Location */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C241E]">
            {t.marketplace.title}
          </h1>
          <p className="mt-1 text-sm text-[#4B554D]">{t.marketplace.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#D4DDD0] text-xs font-semibold text-[#14532D] hover:border-[#14532D] flex items-center gap-1.5 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>
              {location.village ? `${location.village}, ` : ''}
              {location.taluka}, {location.district}
            </span>
          </button>

          {/* List / Map Segmented Toggle */}
          <div className="flex items-center p-1 bg-[#E8EFE4] rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#14532D] shadow-xs'
                  : 'text-[#4B554D] hover:text-[#1C241E]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t.marketplace.listView}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-[#14532D] shadow-xs'
                  : 'text-[#4B554D] hover:text-[#1C241E]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{t.marketplace.mapView}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Quick Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onChangeFilters({ ...filters, category: 'all' })}
          className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
            filters.category === 'all'
              ? 'bg-[#14532D] text-white border-[#14532D]'
              : 'bg-white text-[#1C241E] border-[#E2E8DF] hover:border-[#14532D]'
          }`}
        >
          {t.common.all}
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onChangeFilters({ ...filters, category: cat })}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
              filters.category === cat
                ? 'bg-[#14532D] text-white border-[#14532D]'
                : 'bg-white text-[#1C241E] border-[#E2E8DF] hover:border-[#14532D]'
            }`}
          >
            {t.categories[cat]}
          </button>
        ))}
      </div>

      {/* Search + Multi-Filter Toolbar */}
      <div className="bg-white border border-[#E2E8DF] rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-5 flex items-center gap-2 px-3.5 min-h-[46px] rounded-xl bg-[#F8FAF5] border border-[#D4DDD0]">
            <Search className="w-4 h-4 text-[#14532D] shrink-0" />
            <input
              type="text"
              value={filters.q}
              onChange={(e) => onChangeFilters({ ...filters, q: e.target.value })}
              placeholder={t.marketplace.searchPlaceholder}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>

          <div className="lg:col-span-4">
            <LocationAutocompleteInput
              valueLabel={locationSummary}
              placeholder={t.marketplace.searchLocationPlaceholder}
              onSelectLocation={(loc) =>
                onChangeFilters({
                  ...filters,
                  district: loc.district || 'all',
                  taluka: loc.taluka || 'all',
                  village: loc.village || 'all',
                })
              }
              onClear={() =>
                onChangeFilters({
                  ...filters,
                  district: 'all',
                  taluka: 'all',
                  village: 'all',
                })
              }
            />
          </div>

          <div className="lg:col-span-3 flex items-center gap-2">
            <select
              aria-label={t.marketplace.sortBy}
              value={filters.sort}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  sort: e.target.value as MarketplaceFilters['sort'],
                })
              }
              className="flex-1 min-h-[46px] px-3 rounded-xl bg-[#F8FAF5] border border-[#D4DDD0] text-sm font-medium text-[#1C241E]"
            >
              <option value="nearest">{t.marketplace.sortNearest}</option>
              <option value="lowest_price">{t.marketplace.sortLowestPrice}</option>
              <option value="highest_rated">{t.marketplace.sortHighestRated}</option>
              <option value="recent">{t.marketplace.sortRecent}</option>
            </select>

            <button
              type="button"
              onClick={() => setShowFiltersMobile((s) => !s)}
              className="md:hidden min-h-[46px] px-3.5 rounded-xl border border-[#D4DDD0] bg-[#F8FAF5] text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#14532D]" />
              <span>{t.marketplace.filters}</span>
            </button>
          </div>
        </div>

        {/* Cascading Maharashtra District (36) -> Taluka (358) -> Village Filters + Specs */}
        <div
          className={`${
            showFiltersMobile ? 'block' : 'hidden md:block'
          } space-y-3 pt-3 border-t border-[#EDF2EA]`}
        >
          <CascadingMaharashtraPicker
            compact
            allowAll
            district={filters.district}
            taluka={filters.taluka}
            village={filters.village}
            onChange={(next) =>
              onChangeFilters({
                ...filters,
                district: next.district,
                taluka: next.taluka,
                village: next.village,
              })
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-[#5A655C] mb-1">
                {t.marketplace.maxDistance}
              </label>
              <select
                value={filters.maxDistance}
                onChange={(e) => onChangeFilters({ ...filters, maxDistance: e.target.value })}
                className="w-full min-h-[40px] px-2.5 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-xs font-medium"
              >
                <option value="">{t.common.all}</option>
                <option value="25">25 km</option>
                <option value="75">75 km</option>
                <option value="150">150 km</option>
                <option value="300">300 km</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5A655C] mb-1">
                {t.marketplace.maxPrice}
              </label>
              <input
                type="number"
                min="0"
                placeholder="₹ 3000"
                value={filters.maxPrice}
                onChange={(e) => onChangeFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full min-h-[40px] px-2.5 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5A655C] mb-1">
                {t.marketplace.priceUnit}
              </label>
              <select
                value={filters.priceUnit}
                onChange={(e) =>
                  onChangeFilters({
                    ...filters,
                    priceUnit: e.target.value as MarketplaceFilters['priceUnit'],
                  })
                }
                className="w-full min-h-[40px] px-2.5 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-xs font-medium"
              >
                <option value="all">{t.common.all}</option>
                <option value="hour">{t.units.hour}</option>
                <option value="day">{t.units.day}</option>
                <option value="acre">{t.units.acre}</option>
                <option value="trip">{t.units.trip}</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5A655C] mb-1">
                {t.marketplace.availableDate}
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => onChangeFilters({ ...filters, date: e.target.value })}
                className="w-full min-h-[40px] px-2.5 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5A655C] mb-1">
                {t.marketplace.minRating}
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => onChangeFilters({ ...filters, minRating: e.target.value })}
                className="w-full min-h-[40px] px-2.5 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-xs font-medium"
              >
                <option value="">{t.common.all}</option>
                <option value="4">4.0+</option>
                <option value="4.5">4.5+</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-1 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#1C241E]">
                  <input
                    type="checkbox"
                    checked={filters.onlyAvailable}
                    onChange={(e) => onChangeFilters({ ...filters, onlyAvailable: e.target.checked })}
                    className="accent-[#14532D]"
                  />
                  <span>{t.marketplace.onlyAvailable}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[#1C241E]">
                  <input
                    type="checkbox"
                    checked={filters.operatorOnly}
                    onChange={(e) => onChangeFilters({ ...filters, operatorOnly: e.target.checked })}
                    className="accent-[#14532D]"
                  />
                  <span>{t.marketplace.withOperator}</span>
                </label>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                title={t.marketplace.resetFilters}
                className="min-h-[40px] px-3 rounded-lg border border-[#D4DDD0] text-xs font-semibold text-[#4B554D] hover:bg-[#EFF4EC] flex items-center gap-1 cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm font-semibold text-[#4B554D] tabular-nums">
        {filteredEquipment.length} {t.marketplace.resultsCount}
      </div>

      {/* Results Area */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-80 bg-white border border-[#E2E8DF] rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : viewMode === 'map' ? (
        <MaharashtraMapExplorer items={filteredEquipment} onSelectEquipment={onSelectEquipment} />
      ) : filteredEquipment.length === 0 ? (
        <div className="bg-white border border-[#E2E8DF] rounded-xl p-12 text-center space-y-3">
          <p className="text-base font-semibold text-[#1C241E]">{t.marketplace.noResults}</p>
          <button
            type="button"
            onClick={resetFilters}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#14532D] text-white text-sm font-semibold cursor-pointer"
          >
            {t.marketplace.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((eq) => (
            <EquipmentCard key={eq.id} equipment={eq} onSelect={onSelectEquipment} />
          ))}
        </div>
      )}
    </div>
  );
}
