import React, { useState } from 'react';
import {
  Plus,
  Tractor,
  CalendarCheck,
  CheckCircle2,
  Clock,
  IndianRupee,
  Pencil,
  Trash2,
  Power,
  PhoneCall,
  AlertCircle,
  LayoutDashboard,
} from 'lucide-react';
import { Booking, Equipment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { SelectableImageFrame } from './SelectableImageFrame';

interface OwnerDashboardProps {
  equipment: Equipment[];
  bookings: Booking[];
  onRefreshEquipment: () => Promise<void>;
  onRefreshBookings: () => Promise<void>;
  onAddEquipment: () => void;
  onEditEquipment: (eq: Equipment) => void;
  onOpenAuth: () => void;
  onNavigateProfile: () => void;
}

export function OwnerDashboard({
  equipment,
  bookings,
  onRefreshEquipment,
  onRefreshBookings,
  onAddEquipment,
  onEditEquipment,
  onOpenAuth,
  onNavigateProfile,
}: OwnerDashboardProps) {
  const { t } = useLanguage();
  const { user, updateProfile, refreshNotifications } = useAuth();
  const [section, setSection] = useState<'overview' | 'requests' | 'fleet'>('overview');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#14532D]/10 text-[#14532D] flex items-center justify-center">
          <Tractor className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-[#1C241E]">{t.owner.title}</h1>
        <p className="text-sm text-[#4B554D]">{t.owner.enableOwnerDesc}</p>
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

  const isOwner = user.roles.includes('owner');

  if (!isOwner) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white border border-[#E2E8DF] rounded-2xl p-8 text-center space-y-4">
          <Tractor className="w-10 h-10 text-[#14532D] mx-auto" />
          <h1 className="text-2xl font-bold text-[#1C241E]">{t.owner.enableOwnerRole}</h1>
          <p className="text-sm text-[#4B554D] max-w-md mx-auto">{t.owner.enableOwnerDesc}</p>
          <button
            type="button"
            onClick={async () => {
              await updateProfile({ roles: [...user.roles, 'owner'] });
            }}
            className="min-h-[46px] px-6 py-3 rounded-xl bg-[#14532D] text-white text-sm font-bold hover:bg-[#166534] cursor-pointer"
          >
            {t.owner.enableOwnerRole}
          </button>
        </div>
      </div>
    );
  }

  const myEquipment = equipment.filter((e) => e.ownerId === user.id);
  const myRequests = bookings.filter((b) => b.ownerId === user.id);

  const activeCount = myEquipment.filter((e) => e.available).length;
  const pendingCount = myRequests.filter((b) => b.status === 'pending').length;
  const confirmedCount = myRequests.filter((b) => b.status === 'accepted').length;
  const completedCount = myRequests.filter((b) => b.status === 'completed').length;
  const monthlyEarnings = myRequests
    .filter((b) => b.status === 'completed' || b.status === 'accepted')
    .reduce((sum, b) => sum + b.totalCost, 0);

  const handleBookingAction = async (bookingId: string, status: 'accepted' | 'rejected' | 'completed') => {
    setErrorMsg('');
    setBusyId(bookingId);
    try {
      await apiFetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await onRefreshBookings();
      await refreshNotifications();
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not update booking status.');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleAvailability = async (eq: Equipment) => {
    setBusyId(eq.id);
    setErrorMsg('');
    try {
      await apiFetch(`/api/equipment/${eq.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ available: !eq.available }),
      });
      await onRefreshEquipment();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update availability.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteEquipment = async (eq: Equipment) => {
    setBusyId(eq.id);
    setErrorMsg('');
    try {
      await apiFetch(`/api/equipment/${eq.id}`, { method: 'DELETE' });
      await onRefreshEquipment();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete equipment.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Sidebar */}
        <aside className="lg:col-span-3 bg-white border border-[#E2E8DF] rounded-2xl p-4 space-y-2 lg:sticky lg:top-22">
          <div className="px-3 py-2 border-b border-[#EDF2EA] mb-2">
            <div className="text-xs font-semibold text-[#5A655C]">{t.nav.ownerHub}</div>
            <div className="font-bold text-sm text-[#1C241E] truncate mt-0.5">{user.name}</div>
          </div>

          <button
            type="button"
            onClick={() => setSection('overview')}
            className={`w-full min-h-[42px] px-3 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 cursor-pointer ${
              section === 'overview'
                ? 'bg-[#14532D] text-white'
                : 'text-[#374139] hover:bg-[#F8FAF5]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t.owner.recentActivity}</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('requests')}
            className={`w-full min-h-[42px] px-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between cursor-pointer ${
              section === 'requests'
                ? 'bg-[#14532D] text-white'
                : 'text-[#374139] hover:bg-[#F8FAF5]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <CalendarCheck className="w-4 h-4" />
              <span>{t.owner.bookingRequests}</span>
            </span>
            {pendingCount > 0 && (
              <span className="text-xs font-mono font-bold tabular-nums px-1.5 py-0.5 rounded bg-[#FBBF24] text-[#1C241E]">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSection('fleet')}
            className={`w-full min-h-[42px] px-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between cursor-pointer ${
              section === 'fleet'
                ? 'bg-[#14532D] text-white'
                : 'text-[#374139] hover:bg-[#F8FAF5]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Tractor className="w-4 h-4" />
              <span>{t.owner.myEquipment}</span>
            </span>
            <span className="text-xs font-mono tabular-nums">{myEquipment.length}</span>
          </button>

          <div className="pt-2 border-t border-[#EDF2EA] space-y-2">
            <button
              type="button"
              onClick={onAddEquipment}
              className="w-full min-h-[44px] px-3 rounded-xl bg-[#FBBF24] text-[#1C241E] text-sm font-bold hover:bg-[#F59E0B] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.owner.addEquipment}</span>
            </button>
            <button
              type="button"
              onClick={onNavigateProfile}
              className="w-full min-h-[40px] px-3 rounded-xl border border-[#E2E8DF] text-xs font-semibold text-[#4B554D] hover:bg-[#F8FAF5] cursor-pointer"
            >
              {t.nav.profile}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#1C241E]">{t.owner.title}</h1>
              <p className="text-sm text-[#4B554D] mt-0.5">{t.owner.subtitle}</p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: t.owner.totalListings, value: myEquipment.length, icon: Tractor },
              { label: t.owner.activeEquipment, value: activeCount, icon: Power },
              { label: t.owner.pendingRequests, value: pendingCount, icon: Clock },
              { label: t.owner.confirmedBookings, value: confirmedCount, icon: CalendarCheck },
              { label: t.owner.completedBookings, value: completedCount, icon: CheckCircle2 },
              {
                label: t.owner.monthlyEarnings,
                value: `₹${monthlyEarnings.toLocaleString('en-IN')}`,
                icon: IndianRupee,
              },
            ].map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-[#E2E8DF] rounded-xl p-3.5 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between text-[#5A655C]">
                    <span className="text-[11px] font-semibold leading-tight">{kpi.label}</span>
                    <Icon className="w-4 h-4 text-[#14532D] shrink-0" />
                  </div>
                  <div className="text-xl font-extrabold text-[#1C241E] tabular-nums">
                    {kpi.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking Requests Panel */}
          {(section === 'overview' || section === 'requests') && (
            <section className="bg-white border border-[#E2E8DF] rounded-2xl p-5 space-y-4">
              <h2 className="text-lg font-bold text-[#1C241E]">{t.owner.bookingRequests}</h2>

              {myRequests.length === 0 ? (
                <p className="text-sm text-[#5A655C] py-4">{t.owner.noRequests}</p>
              ) : (
                <div className="divide-y divide-[#EDF2EA]">
                  {myRequests.map((bk) => (
                    <div
                      key={bk.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <span className="text-[#14532D]">{t.statuses[bk.status]}</span>
                          <span className="text-[#5A655C] tabular-nums">
                            · {bk.date} ({bk.startTime})
                          </span>
                        </div>
                        <div className="font-bold text-base text-[#1C241E]">{bk.equipmentTitle}</div>
                        <div className="text-xs text-[#4B554D]">
                          {t.owner.customerInfo}: <span className="font-semibold">{bk.renterName}</span> ·{' '}
                          {bk.farmLocation}
                        </div>
                        {bk.notes && (
                          <div className="text-xs text-[#5A655C] italic">“{bk.notes}”</div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <div className="mr-2 text-right">
                          <div className="text-base font-bold text-[#14532D] tabular-nums">
                            ₹{bk.totalCost.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-[#5A655C] tabular-nums">
                            {bk.priceUnit === 'acre'
                              ? `${bk.acres} ${t.units.acre}`
                              : `${bk.duration} ${t.units[bk.priceUnit]}`}
                          </div>
                        </div>

                        {bk.renterPhone && (
                          <a
                            href={`tel:${bk.renterPhone}`}
                            className="min-h-[40px] px-3 rounded-lg border border-[#D4DDD0] text-xs font-semibold flex items-center gap-1 text-[#14532D]"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>{t.common.callOwner}</span>
                          </a>
                        )}

                        {bk.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              disabled={busyId === bk.id}
                              onClick={() => handleBookingAction(bk.id, 'accepted')}
                              className="min-h-[40px] px-3.5 rounded-lg bg-[#14532D] text-white text-xs font-semibold hover:bg-[#166534] disabled:opacity-50 cursor-pointer"
                            >
                              {t.owner.accept}
                            </button>
                            <button
                              type="button"
                              disabled={busyId === bk.id}
                              onClick={() => handleBookingAction(bk.id, 'rejected')}
                              className="min-h-[40px] px-3.5 rounded-lg border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                            >
                              {t.owner.reject}
                            </button>
                          </>
                        )}

                        {bk.status === 'accepted' && (
                          <button
                            type="button"
                            disabled={busyId === bk.id}
                            onClick={() => handleBookingAction(bk.id, 'completed')}
                            className="min-h-[40px] px-3.5 rounded-lg bg-[#FBBF24] text-[#1C241E] text-xs font-bold hover:bg-[#F59E0B] disabled:opacity-50 cursor-pointer"
                          >
                            {t.owner.markCompleted}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Fleet Management Panel */}
          {(section === 'overview' || section === 'fleet') && (
            <section className="bg-white border border-[#E2E8DF] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-[#1C241E]">{t.owner.myEquipment}</h2>
                <button
                  type="button"
                  onClick={onAddEquipment}
                  className="min-h-[40px] px-3.5 rounded-lg bg-[#14532D] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.owner.addEquipment}</span>
                </button>
              </div>

              {myEquipment.length === 0 ? (
                <p className="text-sm text-[#5A655C] py-4">{t.owner.noListings}</p>
              ) : (
                <div className="divide-y divide-[#EDF2EA]">
                  {myEquipment.map((eq) => (
                    <div
                      key={eq.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <SelectableImageFrame
                          selectionId={`owner-img-${eq.id}`}
                          src={eq.images[0]}
                          alt={eq.title}
                          compact
                          className="w-20 h-16 rounded-lg bg-[#EFF4EC] shrink-0"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#14532D]">
                            {t.categories[eq.category]} · {eq.village}, {eq.taluka}
                          </div>
                          <div className="font-bold text-sm text-[#1C241E]">{eq.title}</div>
                          <div className="text-xs text-[#4B554D] mt-0.5 tabular-nums">
                            ₹{eq.price.toLocaleString('en-IN')} / {t.units[eq.priceUnit]} ·{' '}
                            <span className={eq.available ? 'text-[#16A34A] font-semibold' : 'text-[#DC2626] font-semibold'}>
                              {eq.available ? t.common.available : t.common.unavailable}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          disabled={busyId === eq.id}
                          onClick={() => handleToggleAvailability(eq)}
                          className="min-h-[38px] px-3 rounded-lg border border-[#D4DDD0] text-xs font-semibold text-[#1C241E] hover:bg-[#F8FAF5] flex items-center gap-1 cursor-pointer"
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{t.owner.toggleActive}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditEquipment(eq)}
                          className="min-h-[38px] px-3 rounded-lg border border-[#D4DDD0] text-xs font-semibold text-[#14532D] hover:bg-[#F8FAF5] flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>{t.common.edit}</span>
                        </button>
                        <button
                          type="button"
                          disabled={busyId === eq.id}
                          onClick={() => handleDeleteEquipment(eq)}
                          className="min-h-[38px] px-3 rounded-lg border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t.common.delete}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
