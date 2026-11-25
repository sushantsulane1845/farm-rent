import React from 'react';
import {
  Tractor,
  Store,
  CalendarCheck,
  LayoutDashboard,
  UserCircle2,
  Home,
  Globe,
} from 'lucide-react';
import { AppView, Language } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenAuth: () => void;
}

export function Header({ currentView, onNavigate, onOpenAuth }: HeaderProps) {
  const { lang, setLang, t } = useLanguage();
  const { user, unreadCount } = useAuth();

  const homeTarget: AppView = user ? 'dashboard' : 'landing';

  const navItems: { id: AppView; label: string }[] = [
    { id: homeTarget, label: user ? t.nav.dashboard : t.nav.home },
    { id: 'marketplace', label: t.nav.marketplace },
    { id: 'bookings', label: t.nav.bookings },
    { id: 'owner', label: t.nav.ownerHub },
    { id: 'profile', label: t.nav.profile },
  ];

  const isNavActive = (id: AppView) => {
    if (id === 'landing' || id === 'dashboard') {
      return currentView === 'landing' || currentView === 'dashboard';
    }
    if (id === 'marketplace') {
      return currentView === 'marketplace' || currentView === 'details';
    }
    if (id === 'owner') {
      return currentView === 'owner' || currentView === 'add_equipment';
    }
    return currentView === id;
  };

  return (
    <>
      {/* Desktop 3-Zone Top Bar */}
      <header className="hidden md:block sticky top-0 z-40 bg-[#F8FAF5]/95 backdrop-blur-md border-b border-[#E2E8DF]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate(homeTarget)}
            className="flex items-center gap-2.5 text-[#14532D] font-bold text-xl tracking-tight whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
          >
            <Tractor className="w-6 h-6 text-[#14532D]" aria-hidden="true" />
            <span>{t.brand}</span>
          </button>

          {/* Zone 2: 5 Concise Single-Line Nav Links */}
          <nav className="flex items-center gap-6" aria-label="Primary Navigation">
            {navItems.map((item) => {
              const active = isNavActive(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if ((item.id === 'bookings' || item.id === 'profile') && !user) {
                      onOpenAuth();
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={`relative py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'text-[#14532D] font-semibold'
                      : 'text-[#4B554D] hover:text-[#14532D]'
                  }`}
                >
                  {item.label}
                  {item.id === 'profile' && unreadCount > 0 && (
                    <span className="ml-1.5 text-xs font-mono font-semibold text-[#14532D]">
                      ({unreadCount})
                    </span>
                  )}
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-[#14532D]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher + Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#4B554D] border border-[#D4DDD0] bg-white rounded-lg px-2.5 py-1.5">
              <Globe className="w-3.5 h-3.5 text-[#14532D]" aria-hidden="true" />
              <select
                aria-label={t.footer.language}
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-xs font-semibold text-[#1C241E] focus:outline-none cursor-pointer"
              >
                <option value="mr">मराठी</option>
                <option value="hi">हिंदी</option>
                <option value="en">English</option>
              </select>
            </label>

            {user ? (
              <button
                type="button"
                onClick={() => onNavigate('add_equipment')}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#14532D] text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.owner.addEquipment}
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#14532D] text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.nav.signIn}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Compact Sticky Header (52px) */}
      <header className="md:hidden sticky top-0 z-40 bg-[#F8FAF5]/95 backdrop-blur-md border-b border-[#E2E8DF] h-13 px-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate(homeTarget)}
          className="flex items-center gap-2 text-[#14532D] font-bold text-lg whitespace-nowrap shrink-0 min-h-[44px]"
        >
          <Tractor className="w-5 h-5" aria-hidden="true" />
          <span>{t.brand}</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <select
            aria-label={t.footer.language}
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            className="h-9 px-2 rounded-lg border border-[#D4DDD0] bg-white text-xs font-semibold text-[#1C241E]"
          >
            <option value="mr">मराठी</option>
            <option value="hi">हिंदी</option>
            <option value="en">EN</option>
          </select>

          {!user && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="h-9 px-3 rounded-lg bg-[#14532D] text-white text-xs font-semibold whitespace-nowrap shrink-0"
            >
              {t.nav.signIn}
            </button>
          )}
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (56px, total sticky <= 15% viewport height) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8DF] pb-safe"
      >
        <div className="grid grid-cols-5 h-14 items-center">
          {[
            { id: homeTarget as AppView, icon: Home, label: t.nav.home },
            { id: 'marketplace' as AppView, icon: Store, label: t.nav.marketplace },
            { id: 'bookings' as AppView, icon: CalendarCheck, label: t.nav.bookings },
            { id: 'owner' as AppView, icon: LayoutDashboard, label: t.nav.ownerHub },
            { id: 'profile' as AppView, icon: UserCircle2, label: t.nav.profile },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = isNavActive(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if ((tab.id === 'bookings' || tab.id === 'profile') && !user) {
                    onOpenAuth();
                  } else {
                    onNavigate(tab.id);
                  }
                }}
                className={`relative flex flex-col items-center justify-center min-h-[44px] px-1 transition-colors ${
                  active ? 'text-[#14532D]' : 'text-[#5A655C]'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[10px] font-semibold mt-0.5 truncate max-w-full">
                  {tab.label}
                </span>
                {tab.id === 'profile' && unreadCount > 0 && (
                  <span className="absolute top-1.5 right-3 text-[9px] font-mono font-bold text-white bg-[#14532D] rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
