import React, { useState } from 'react';
import { Bell, CheckCircle2, LogOut, ShieldCheck, User } from 'lucide-react';
import { Language, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  onOpenAuth: () => void;
  onLoggedOut: () => void;
}

export function ProfilePage({ onOpenAuth, onLoggedOut }: ProfilePageProps) {
  const { lang, setLang, t } = useLanguage();
  const {
    user,
    notifications,
    markAllNotificationsRead,
    updateProfile,
    logout,
  } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [village, setVillage] = useState(user?.village || '');
  const [taluka, setTaluka] = useState(user?.taluka || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [roles, setRoles] = useState<UserRole[]>(user?.roles || ['farmer']);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <User className="w-10 h-10 text-[#14532D] mx-auto" />
        <h1 className="text-2xl font-bold text-[#1C241E]">{t.auth.profileTitle}</h1>
        <button
          type="button"
          onClick={onOpenAuth}
          className="min-h-[46px] px-6 py-3 rounded-xl bg-[#14532D] text-white text-sm font-semibold cursor-pointer"
        >
          {t.nav.signIn}
        </button>
      </div>
    );
  }

  const toggleRole = (r: UserRole) => {
    setRoles((prev) => {
      if (prev.includes(r)) {
        const next = prev.filter((item) => item !== r);
        return next.length > 0 ? next : prev;
      }
      return [...prev, r];
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');
    try {
      await updateProfile({
        name,
        phone,
        village,
        taluka,
        district,
        roles,
        preferredLang: lang,
      });
      setSavedMsg('Profile saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Profile & Role Settings */}
      <form
        onSubmit={handleSave}
        className="lg:col-span-7 bg-white border border-[#E2E8DF] rounded-2xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#EDF2EA]">
          <div>
            <h1 className="text-xl font-bold text-[#1C241E]">{t.auth.profileTitle}</h1>
            <div className="text-xs text-[#5A655C] mt-0.5 flex items-center gap-1.5">
              <span>{user.email || user.phone}</span>
              {user.isVerified && (
                <span className="inline-flex items-center gap-1 text-[#14532D] font-semibold">
                  · <ShieldCheck className="w-3.5 h-3.5" /> {t.common.verifiedOwner}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await logout();
              onLoggedOut();
            }}
            className="min-h-[40px] px-3.5 rounded-lg border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.auth.logout}</span>
          </button>
        </div>

        {savedMsg && (
          <div className="p-3 rounded-xl bg-[#22C55E]/15 text-xs font-semibold text-[#14532D] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374139] mb-1">
              {t.auth.nameLabel}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374139] mb-1">
              {t.auth.phoneLabel}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91..."
              className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374139] mb-1">
              {t.form.village}
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374139] mb-1">
              {t.form.taluka}
            </label>
            <input
              type="text"
              value={taluka}
              onChange={(e) => setTaluka(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374139] mb-1">
              {t.form.district}
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374139] mb-1">
              {t.auth.languagePref}
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="w-full min-h-[42px] px-3 rounded-lg border border-[#D4DDD0] bg-[#F8FAF5] text-sm"
            >
              <option value="mr">मराठी (Marathi)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <div className="text-xs font-semibold text-[#374139]">Roles</div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={roles.includes('farmer')}
                onChange={() => toggleRole('farmer')}
                className="accent-[#14532D]"
              />
              <span>{t.auth.roleFarmer}</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={roles.includes('owner')}
                onChange={() => toggleRole('owner')}
                className="accent-[#14532D]"
              />
              <span>{t.auth.roleOwner}</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full min-h-[46px] rounded-xl bg-[#14532D] text-white text-sm font-bold hover:bg-[#166534] cursor-pointer"
        >
          {saving ? t.common.loading : t.common.save}
        </button>
      </form>

      {/* Right: In-App Notifications */}
      <div className="lg:col-span-5 bg-white border border-[#E2E8DF] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EDF2EA]">
          <div className="flex items-center gap-2 text-[#14532D] font-bold text-base">
            <Bell className="w-4 h-4" />
            <span>{t.auth.notifications}</span>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="text-xs font-semibold text-[#14532D] hover:underline cursor-pointer"
            >
              {t.auth.markAllRead}
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-sm text-[#5A655C]">No notifications yet.</p>
        ) : (
          <div className="divide-y divide-[#EDF2EA] max-h-[420px] overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`py-3 space-y-1 ${n.isRead ? 'opacity-70' : 'font-medium'}`}
              >
                <div className="text-xs font-bold text-[#1C241E]">{n.title}</div>
                <div className="text-xs text-[#4B554D]">{n.message}</div>
                <div className="text-[10px] text-[#6B776D] tabular-nums">
                  {n.createdAt.slice(0, 16).replace('T', ' ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
