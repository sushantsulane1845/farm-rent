import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  HeadphonesIcon,
  CalendarClock,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { AppView, Booking, Equipment, EquipmentCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import { CATEGORY_IMAGES } from '../data/locations';
import { EquipmentCard } from './EquipmentCard';
import { LocationAutocompleteInput } from './LocationSearchSelect';

interface FarmerDashboardProps {
  equipment: Equipment[];
  bookings: Booking[];
  loading: boolean;
  onSelectEquipment: (eq: Equipment) => void;
  onSearchMarketplace: (filters: {
    q?: string;
    district?: string;
    taluka?: string;
    village?: string;
    category?: EquipmentCategory | 'all';
    sort?: string;
  }) => void;
  onNavigate: (view: AppView) => void;
  onOpenLocationModal: () => void;
  onOpenSupport: () => void;
}

const QUICK_CATEGORIES: EquipmentCategory[] = [
  'tractor',
  'rotavator',
  'harvester',
  'sprayer',
  'seed_drill',
  'jcb',
  'cultivator',
  'thresher',
];

export function FarmerDashboard({
  equipment,
  bookings,
  loading,
  onSelectEquipment,
  onSearchMarketplace,
  onNavigate,
  onOpenLocationModal,
  onOpenSupport,
}: FarmerDashboardProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { location, setCustomLocation } = useLocationContext();
  const [query, setQuery] = useState('');
  const [locLabel, setLocLabel] = useState('');

  const nearby = [...equipment]
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
    .slice(0, 3);

  const recommended = [...equipment]
    .sort((a, b) => b.ratingAvg - a.ratingAvg)
    .slice(0, 3);

  const recent = [...equipment]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  const myUpcoming = bookings
    .filter((b) => b.renterId === user?.id && ['pending', 'accepted'].includes(b.status))
    .slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchMarketplace({ q: query });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12 space-y-8">
      {/* Greeting & Location Header */}
      <div className="bg-white border border-[#E2E8DF] rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C241E]">
            {t.dashboard.welcome}, {user?.name || 'शेतकरी बंधू'}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#4B554D]">
            <MapPin className="w-4 h-4 text-[#14532D]" />
            <span>{t.dashboard.selectedLocation}:</span>
            <span className="font-semibold text-[#14532D]">
              {location.village ? `${location.village}, ` : ''}
              {location.taluka}, {location.district}
            </span>
            <button
              type="button"
              onClick={onOpenLocationModal}
              className="ml-2 text-xs font-semibold text-[#14532D] underline hover:text-[#166534] cursor-pointer flex items-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              {t.dashboard.changeLocation} / {t.dashboard.useGps}
            </button>
          </div>
        </div>

        {/* Quick Search Bar (Equipment + Any Maharashtra Village/Taluka/District) */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-[560px]">
          <div className="sm:w-56">
            <LocationAutocompleteInput
              valueLabel={locLabel}
              placeholder={t.hero.locationPlaceholder}
              onSelectLocation={(loc) => {
                const display = [loc.village, loc.taluka, loc.district].filter(Boolean).join(', ');
                setLocLabel(display);
                setCustomLocation({
                  village: loc.village || loc.taluka || loc.district,
                  taluka: loc.taluka || loc.district,
                  district: loc.district,
                  state: 'Maharashtra',
                  lat: loc.lat,
                  lng: loc.lng,
                  isGps: false,
                });
                onSearchMarketplace({
                  q: query,
                  district: loc.district,
                  taluka: loc.taluka || 'all',
                  village: loc.village || 'all',
                });
              }}
              onClear={() => setLocLabel('')}
            />
          </div>
          <div className="flex-1 flex items-center gap-2 px-3.5 min-h-[46px] rounded-xl bg-[#F8FAF5] border border-[#D4DDD0]">
            <Search className="w-4 h-4 text-[#14532D] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.marketplace.searchPlaceholder}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="min-h-[46px] px-5 rounded-xl bg-[#14532D] text-white text-sm font-semibold hover:bg-[#166534] transition-colors shrink-0 cursor-pointer"
          >
            {t.hero.searchBtn}
          </button>
        </form>
      </div>

      {/* Upcoming Bookings + Customer Support Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-white border border-[#E2E8DF] rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-[#14532D]" />
              <h2 className="text-lg font-bold text-[#1C241E]">{t.dashboard.upcomingBookings}</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('bookings')}
              className="text-xs font-semibold text-[#14532D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t.booking.myBookings}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myUpcoming.length === 0 ? (
            <div className="py-6 text-sm text-[#5A655C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#EDF2EA]">
              <span>{t.dashboard.noBookings}</span>
              <button
                type="button"
                onClick={() => onNavigate('marketplace')}
                className="px-4 py-2 rounded-lg bg-[#14532D] text-white text-xs font-semibold cursor-pointer"
              >
                {t.hero.rentCta}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#EDF2EA]">
              {myUpcoming.map((bk) => (
                <div
                  key={bk.id}
                  onClick={() => onNavigate('bookings')}
                  className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAF5] px-2 -mx-2 rounded-lg transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#1C241E] truncate">
                      {bk.equipmentTitle}
                    </div>
                    <div className="text-xs text-[#5A655C] mt-0.5 tabular-nums">
                      {bk.date} · {bk.startTime} · {bk.farmLocation}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-[#14532D] tabular-nums">
                      ₹{bk.totalCost.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-0.5 flex items-center justify-end gap-1 text-xs font-semibold">
                      {bk.status === 'accepted' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span className="text-[#16A34A]">{t.statuses.accepted}</span>
                        </>
                      ) : bk.status === 'pending' ? (
                        <>
                          <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                          <span className="text-[#D97706]">{t.statuses.pending}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                          <span className="text-[#DC2626]">{t.statuses[bk.status]}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Customer Support Card */}
        <div className="lg:col-span-4 bg-[#14532D] text-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#FBBF24] font-semibold text-sm">
              <HeadphonesIcon className="w-5 h-5" />
              <span>{t.dashboard.quickSupport}</span>
            </div>
            <p className="mt-2.5 text-sm text-white/90 leading-relaxed">
              {t.dashboard.supportDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenSupport}
            className="mt-4 w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FBBF24] text-[#1C241E] font-bold text-sm hover:bg-[#F59E0B] transition-colors cursor-pointer"
          >
            {t.dashboard.callHelpline}
          </button>
        </div>
      </div>

      {/* Quick Categories */}
      <div>
        <h2 className="text-lg font-bold text-[#1C241E] mb-4">{t.sections.popularCategories}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {QUICK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSearchMarketplace({ category: cat })}
              className="group bg-white border border-[#E2E8DF] rounded-xl p-2.5 hover:border-[#14532D] hover:ring-2 hover:ring-[#FBBF24]/70 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:ring-2 active:ring-[#FBBF24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:border-[#14532D] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 text-left cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#EFF4EC] mb-2">
                <img
                  src={CATEGORY_IMAGES[cat]}
                  alt={t.categories[cat]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.06] group-hover:brightness-[1.03] group-hover:saturate-[1.08] group-active:scale-[1.04] transition-[transform,filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#14532D]/35 via-[#22C55E]/15 to-[#FBBF24]/25 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-[#FBBF24] opacity-0 group-hover:opacity-90 group-focus-visible:opacity-100 group-active:opacity-100 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                />
              </div>
              <div className="text-xs font-semibold text-[#1C241E] group-hover:text-[#14532D] truncate">
                {t.categories[cat]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Machines */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#1C241E]">
            {t.dashboard.nearbyMachines}
          </h2>
          <button
            type="button"
            onClick={() => onSearchMarketplace({ sort: 'nearest' })}
            className="text-xs font-semibold text-[#14532D] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t.sections.viewAllMarketplace}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 bg-white border border-[#E2E8DF] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearby.map((eq) => (
              <EquipmentCard key={eq.id} equipment={eq} onSelect={onSelectEquipment} />
            ))}
          </div>
        )}
      </div>

      {/* Recommended & Recent */}
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1C241E] mb-4">
            {t.dashboard.recommended}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((eq) => (
              <EquipmentCard key={`rec-${eq.id}`} equipment={eq} onSelect={onSelectEquipment} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1C241E] mb-4">
            {t.dashboard.recentListings}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((eq) => (
              <EquipmentCard key={`new-${eq.id}`} equipment={eq} onSelect={onSelectEquipment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
