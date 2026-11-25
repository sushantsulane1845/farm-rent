import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Wallet,
  Clock,
  ShieldCheck,
  Tractor,
  Sparkles,
  Globe,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { AppView, Equipment, EquipmentCategory, Language } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_IMAGES } from '../data/locations';
import { EquipmentCard } from './EquipmentCard';
import { LocationAutocompleteInput } from './LocationSearchSelect';
import { SelectableImageFrame } from './SelectableImageFrame';

interface LandingPageProps {
  equipment: Equipment[];
  loading: boolean;
  onSearchMarketplace: (filters: {
    q?: string;
    district?: string;
    taluka?: string;
    village?: string;
    category?: EquipmentCategory | 'all';
    date?: string;
  }) => void;
  onSelectEquipment: (eq: Equipment) => void;
  onNavigate: (view: AppView) => void;
  onOpenSupport: (topic: 'about' | 'contact' | 'terms' | 'privacy' | 'help') => void;
}

const POPULAR_CATEGORIES: EquipmentCategory[] = [
  'tractor',
  'rotavator',
  'harvester',
  'cultivator',
  'sprayer',
  'seed_drill',
  'thresher',
  'trailer',
  'jcb',
  'other',
];

export function LandingPage({
  equipment,
  loading,
  onSearchMarketplace,
  onSelectEquipment,
  onNavigate,
  onOpenSupport,
}: LandingPageProps) {
  const { lang, setLang, t } = useLanguage();
  const [searchDistrict, setSearchDistrict] = useState('all');
  const [searchTaluka, setSearchTaluka] = useState('all');
  const [searchVillage, setSearchVillage] = useState('all');
  const [locationLabel, setLocationLabel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [showcaseIdx, setShowcaseIdx] = useState(0);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchMarketplace({
      q: searchQuery,
      district: searchDistrict,
      taluka: searchTaluka,
      village: searchVillage,
      date: searchDate,
    });
  };

  const featured = equipment.slice(0, 6);
  const activeShowcase = featured.length > 0 ? featured[showcaseIdx % featured.length] : null;

  const demoTestimonials = [
    {
      name: 'शिवाजी जाधव',
      place: 'बारामती, जि. पुणे',
      role: lang === 'mr' ? 'ऊस शेतकरी' : lang === 'hi' ? 'गन्ना किसान' : 'Sugarcane Farmer',
      quote:
        lang === 'mr'
          ? 'हंगामात वेळेवर ट्रॅक्टर आणि रोटाव्हेटर मिळाला. गावातीलच मालकाशी थेट बोलणे झाल्यामुळे काम वेळेत आणि कमी खर्चात पूर्ण झाले.'
          : lang === 'hi'
            ? 'सीजन के समय गांव के पास से ही ट्रैक्टर और रोटावेटर मिल गया। मालिक से सीधी बात होने से काम समय पर पूरा हुआ।'
            : 'Found a 57 HP tractor and rotavator right in Baramati during peak planting week. Direct owner coordination saved two full days.',
    },
    {
      name: 'प्रदीप मोरे',
      place: 'निफाड, जि. नाशिक',
      role: lang === 'mr' ? 'द्राक्ष उत्पादक आणि यंत्र मालक' : lang === 'hi' ? 'अंगूर किसान और मशीन मालिक' : 'Grape Grower & Owner',
      quote:
        lang === 'mr'
          ? 'माझा स्प्रेअर रिकामा असताना आजूबाजूच्या शेतकऱ्यांकडून भाड्याच्या विनंत्या मिळू लागल्या. महिन्याचे अतिरिक्त उत्पन्न सुरू झाले.'
          : lang === 'hi'
            ? 'खाली समय में मेरे स्प्रेयर और ट्रैक्टर को आस-पास के किसानों से बुकिंग मिलने लगी और अतिरिक्त कमाई हुई।'
            : 'Listing our idle boom sprayer and tractor helped local farmers nearby while generating steady extra monthly income.',
    },
    {
      name: 'सुनीता कांबळे',
      place: 'कराड, जि. सातारा',
      role: lang === 'mr' ? 'सोयाबीन व गहू शेतकरी' : lang === 'hi' ? 'सोयाबीन और गेहूं किसान' : 'Soybean & Wheat Farmer',
      quote:
        lang === 'mr'
          ? 'मराठीमध्ये सर्व माहिती, एकरनुसार स्पष्ट दर आणि वेळेवर हार्वेस्टरची सोय यामुळे कापणी सोपी झाली.'
          : lang === 'hi'
            ? 'सरल भाषा में पूरी जानकारी, प्रति एकड़ साफ किराया और समय पर हार्वेस्टर मिलने से कटाई आसान हो गई।'
            : 'Clear Marathi pricing per acre and fast confirmation from the harvester owner made our soybean harvest stress-free.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF5]">
      {/* A. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0E3F21] via-[#14532D] to-[#1A6337] text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Copy & CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="text-xs font-semibold text-[#FBBF24] tracking-wide mb-2">
                {t.marketplace.coverageBanner}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-balance">
                {t.hero.headline}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-xl">
                {t.hero.subheading}
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace')}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-[#FBBF24] text-[#1C241E] font-bold text-sm sm:text-base hover:bg-[#F59E0B] transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>{t.hero.rentCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('add_equipment')}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-white/15 border border-white/35 text-white font-semibold text-sm sm:text-base hover:bg-white/25 transition-colors cursor-pointer"
                >
                  {t.hero.listCta}
                </button>
              </div>

              {/* Trust Markers */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-white/90">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  {t.hero.trust1}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  {t.hero.trust2}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  {t.hero.trust3}
                </span>
              </div>
            </div>

            {/* Right Featured Machinery Photo Showcase Card */}
            <div className="lg:col-span-6 flex">
              <div className="w-full bg-white text-[#1C241E] rounded-2xl p-3 sm:p-4 shadow-xl border border-[#E2E8DF]/80 flex flex-col justify-between gap-3.5">
                <SelectableImageFrame
                  selectionId={
                    activeShowcase ? `hero-showcase-${activeShowcase.id}` : 'hero-showcase-default'
                  }
                  src={
                    activeShowcase?.images[0] ||
                    '/src/assets/images/hero_maharashtra_tractor_1795601714978.jpg'
                  }
                  alt={activeShowcase?.title || t.hero.headline}
                  className="aspect-[16/10] rounded-xl bg-[#EFF4EC]"
                />

                {activeShowcase ? (
                  <div className="px-1 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#5A655C]">
                      <span className="truncate font-medium">
                        <span className="font-semibold text-[#14532D]">
                          {t.categories[activeShowcase.category]}
                        </span>
                        {' · '}
                        {activeShowcase.village}, {activeShowcase.taluka}, {activeShowcase.district}
                      </span>
                      <span className="inline-flex items-center gap-1 shrink-0 font-semibold text-[#1C241E] tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" aria-hidden="true" />
                        {activeShowcase.ratingAvg > 0 ? activeShowcase.ratingAvg.toFixed(1) : '—'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-base sm:text-lg font-bold text-[#1C241E] truncate">
                          {activeShowcase.title}
                        </h2>
                        <div className="text-sm font-bold text-[#14532D] tabular-nums">
                          ₹{activeShowcase.price.toLocaleString('en-IN')}{' '}
                          <span className="text-xs font-normal text-[#5A655C]">
                            / {t.units[activeShowcase.priceUnit]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {featured.length > 1 && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setShowcaseIdx((prev) => (prev - 1 + featured.length) % featured.length)
                              }
                              aria-label={t.common.back}
                              className="w-10 h-10 rounded-lg border border-[#E2E8DF] bg-[#F8FAF5] text-[#14532D] hover:border-[#14532D] flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowcaseIdx((prev) => (prev + 1) % featured.length)}
                              aria-label={t.sections.viewAllMarketplace}
                              className="w-10 h-10 rounded-lg border border-[#E2E8DF] bg-[#F8FAF5] text-[#14532D] hover:border-[#14532D] flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => onSelectEquipment(activeShowcase)}
                          className="min-h-[40px] px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs sm:text-sm font-semibold hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{t.common.viewDetails}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-1 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#14532D]">
                        {t.sections.featuredEquipment}
                      </div>
                      <div className="text-sm font-bold text-[#1C241E] truncate">
                        {t.hero.trust1} · {t.hero.trust2}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('marketplace')}
                      className="min-h-[40px] px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs sm:text-sm font-semibold hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{t.hero.rentCta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar across all 36 Districts, 358 Talukas & Villages */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-8 bg-white text-[#1C241E] rounded-2xl p-3 sm:p-4 shadow-lg border border-[#E2E8DF] grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
          >
            <div className="md:col-span-4">
              <LocationAutocompleteInput
                valueLabel={locationLabel}
                placeholder={t.hero.locationPlaceholder}
                onSelectLocation={(loc) => {
                  const display = loc.village
                    ? `${loc.village}, ${loc.taluka}, ${loc.district}`
                    : loc.taluka
                      ? `${loc.taluka}, ${loc.district}`
                      : loc.district;
                  setLocationLabel(display);
                  setSearchDistrict(loc.district || 'all');
                  setSearchTaluka(loc.taluka || 'all');
                  setSearchVillage(loc.village || 'all');
                }}
                onClear={() => {
                  setLocationLabel('');
                  setSearchDistrict('all');
                  setSearchTaluka('all');
                  setSearchVillage('all');
                }}
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#F8FAF5] border border-[#E2E8DF] min-h-[46px]">
              <Search className="w-4 h-4 text-[#14532D] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.hero.equipmentPlaceholder}
                className="w-full bg-transparent text-sm text-[#1C241E] placeholder:text-[#6B776D] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F8FAF5] border border-[#E2E8DF] min-h-[46px]">
              <Calendar className="w-4 h-4 text-[#14532D] shrink-0" />
              <input
                type="date"
                aria-label={t.hero.dateLabel}
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full bg-transparent text-sm text-[#1C241E] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#14532D] text-white font-semibold text-sm hover:bg-[#166534] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{t.hero.searchBtn}</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* B. Popular Equipment Categories */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C241E]">
            {t.sections.popularCategories}
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('marketplace')}
            className="text-sm font-semibold text-[#14532D] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{t.sections.viewAllMarketplace}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {POPULAR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSearchMarketplace({ category: cat })}
              className="group bg-white border border-[#E2E8DF] rounded-xl p-3 text-left hover:border-[#14532D] hover:ring-2 hover:ring-[#FBBF24]/70 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:ring-2 active:ring-[#FBBF24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:border-[#14532D] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 cursor-pointer flex flex-col gap-2.5"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#EFF4EC]">
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
              <div className="text-sm font-semibold text-[#1C241E] group-hover:text-[#14532D] truncate">
                {t.categories[cat]}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* C. Featured Equipment */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C241E]">
            {t.sections.featuredEquipment}
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('marketplace')}
            className="text-sm font-semibold text-[#14532D] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{t.sections.viewAllMarketplace}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-[#E2E8DF] rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-[#E8EFE4]" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-[#E8EFE4] rounded w-1/3" />
                  <div className="h-5 bg-[#E8EFE4] rounded w-3/4" />
                  <div className="h-4 bg-[#E8EFE4] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item) => (
              <EquipmentCard key={item.id} equipment={item} onSelect={onSelectEquipment} />
            ))}
          </div>
        )}
      </section>

      {/* D. How It Works */}
      <section className="bg-white border-y border-[#E2E8DF] py-14 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C241E] mb-8">
            {t.sections.howItWorks}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t.steps.s1Title, desc: t.steps.s1Desc, icon: Search },
              { title: t.steps.s2Title, desc: t.steps.s2Desc, icon: Calendar },
              { title: t.steps.s3Title, desc: t.steps.s3Desc, icon: Clock },
              { title: t.steps.s4Title, desc: t.steps.s4Desc, icon: CheckCircle2 },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="p-5 rounded-xl bg-[#F8FAF5] border border-[#E2E8DF]">
                  <div className="w-10 h-10 rounded-lg bg-[#14532D] text-white flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1C241E]">{step.title}</h3>
                  <p className="mt-2 text-sm text-[#4B554D] leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* E & F. Farmer Benefits + For Equipment Owners */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-white border border-[#E2E8DF] rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C241E] mb-6">
            {t.sections.benefitsTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: t.benefits.b1Title, desc: t.benefits.b1Desc, icon: Wallet },
              { title: t.benefits.b2Title, desc: t.benefits.b2Desc, icon: MapPin },
              { title: t.benefits.b3Title, desc: t.benefits.b3Desc, icon: PhoneCall },
              { title: t.benefits.b4Title, desc: t.benefits.b4Desc, icon: ShieldCheck },
            ].map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-[#14532D] font-bold text-base">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{b.title}</span>
                  </div>
                  <p className="text-sm text-[#4B554D] leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#14532D] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#FBBF24] text-sm font-semibold mb-2">
              <Tractor className="w-5 h-5" />
              <span>{t.nav.ownerHub}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
              {t.sections.forOwnersTitle}
            </h2>
            <p className="mt-3 text-sm text-white/85 leading-relaxed">
              {t.sections.forOwnersSub}
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-white/95">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>{t.sections.forOwnersList1}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>{t.sections.forOwnersList2}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>{t.sections.forOwnersList3}</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('add_equipment')}
            className="mt-6 w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#FBBF24] text-[#1C241E] font-bold text-sm hover:bg-[#F59E0B] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.hero.listCta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* G. Sample Demo Testimonials */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C241E]">
            {t.sections.testimonialsTitle}
          </h2>
          <span className="text-xs font-medium text-[#5A655C]">{t.sections.demoLabel}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoTestimonials.map((item, idx) => (
            <blockquote
              key={idx}
              className="bg-white border border-[#E2E8DF] rounded-xl p-6 flex flex-col justify-between gap-4"
            >
              <p className="text-sm text-[#2E3A30] leading-relaxed">“{item.quote}”</p>
              <footer className="pt-3 border-t border-[#EDF2EA] text-xs">
                <div className="font-bold text-[#1C241E]">{item.name}</div>
                <div className="text-[#5A655C] mt-0.5">
                  {item.role} · {item.place}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* H. Footer */}
      <footer className="mt-auto bg-[#14532D] text-white/90 py-10 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/15">
            <div className="md:col-span-4 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xl">
                <Tractor className="w-5 h-5 text-[#FBBF24]" />
                <span>{t.brand}</span>
              </div>
              <p className="text-sm text-white/80 max-w-xs">{t.tagline}</p>
            </div>

            <div className="md:col-span-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <button type="button" onClick={() => onOpenSupport('about')} className="hover:text-white hover:underline cursor-pointer">
                {t.footer.about}
              </button>
              <button type="button" onClick={() => onOpenSupport('contact')} className="hover:text-white hover:underline cursor-pointer">
                {t.footer.contact}
              </button>
              <button type="button" onClick={() => onOpenSupport('terms')} className="hover:text-white hover:underline cursor-pointer">
                {t.footer.terms}
              </button>
              <button type="button" onClick={() => onOpenSupport('privacy')} className="hover:text-white hover:underline cursor-pointer">
                {t.footer.privacy}
              </button>
              <button type="button" onClick={() => onOpenSupport('help')} className="hover:text-white hover:underline cursor-pointer">
                {t.footer.help}
              </button>
            </div>

            <div className="md:col-span-3 flex flex-col items-start md:items-end gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Globe className="w-4 h-4 text-[#FBBF24]" />
                <span>{t.footer.language}:</span>
                <select
                  aria-label={t.footer.language}
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-white/10 border border-white/25 rounded px-2 py-1 text-white text-xs"
                >
                  <option value="mr" className="text-black">मराठी</option>
                  <option value="hi" className="text-black">हिंदी</option>
                  <option value="en" className="text-black">English</option>
                </select>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/75">
                <span>YouTube</span>
                <span>·</span>
                <span>WhatsApp</span>
                <span>·</span>
                <span>Facebook</span>
              </div>
            </div>
          </div>

          <div className="pt-6 text-xs text-white/70 flex flex-col sm:flex-row justify-between gap-2">
            <span>{t.footer.copyright}</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
              {t.sections.demoLabel}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
