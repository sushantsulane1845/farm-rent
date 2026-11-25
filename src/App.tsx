import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { AppView, Booking, Equipment, EquipmentCategory } from './types';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider, useLocationContext } from './context/LocationContext';
import { ImageSelectionProvider } from './context/ImageSelectionContext';
import { apiFetch } from './lib/api';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { FarmerDashboard } from './components/FarmerDashboard';
import { MarketplaceFilters, MarketplacePage } from './components/MarketplacePage';
import { EquipmentDetailPage } from './components/EquipmentDetailPage';
import { BookingsPage } from './components/BookingsPage';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AddEquipmentPage } from './components/AddEquipmentPage';
import { ProfilePage } from './components/ProfilePage';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { GpsPermissionModal } from './components/GpsPermissionModal';
import { SupportInfoModal } from './components/SupportInfoModal';

function FarmRentShell() {
  const { user } = useAuth();
  const { location } = useLocationContext();

  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loadingEquipment, setLoadingEquipment] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const [filters, setFilters] = useState<MarketplaceFilters>({
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

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [supportTopic, setSupportTopic] = useState<
    'about' | 'contact' | 'terms' | 'privacy' | 'help' | null
  >(null);

  const fetchEquipment = useCallback(async () => {
    setLoadingEquipment(true);
    try {
      const res = await apiFetch<{ equipment: Equipment[] }>(
        `/api/equipment?lat=${location.lat}&lng=${location.lng}`
      );
      setEquipment(res.equipment || []);
    } catch {
      setEquipment([]);
    } finally {
      setLoadingEquipment(false);
    }
  }, [location.lat, location.lng]);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      return;
    }
    try {
      const res = await apiFetch<{ bookings: Booking[] }>('/api/bookings');
      setBookings(res.bookings || []);
    } catch {
      setBookings([]);
    }
  }, [user]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Automatically navigate to Farmer Dashboard upon sign-in if sitting on landing
  useEffect(() => {
    if (user && currentView === 'landing') {
      setCurrentView('dashboard');
    }
  }, [user, currentView]);

  const navigate = (view: AppView) => {
    if (view !== 'add_equipment') {
      setEditingEquipment(null);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEquipment = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchMarketplace = (partial: {
    q?: string;
    district?: string;
    taluka?: string;
    village?: string;
    category?: EquipmentCategory | 'all';
    date?: string;
    sort?: string;
  }) => {
    setFilters((prev) => ({
      ...prev,
      q: partial.q !== undefined ? partial.q : prev.q,
      district: partial.district !== undefined ? partial.district : prev.district,
      taluka: partial.taluka !== undefined ? partial.taluka : prev.taluka,
      village: partial.village !== undefined ? partial.village : prev.village,
      category: partial.category !== undefined ? partial.category : prev.category,
      date: partial.date !== undefined ? partial.date : prev.date,
      sort: (partial.sort as MarketplaceFilters['sort']) || prev.sort,
    }));
    navigate('marketplace');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF5] text-[#1C241E]">
      <Header
        currentView={currentView}
        onNavigate={navigate}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (selectedEquipment?.id || '')}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentView === 'landing' && (
              <LandingPage
                equipment={equipment}
                loading={loadingEquipment}
                onSearchMarketplace={handleSearchMarketplace}
                onSelectEquipment={handleSelectEquipment}
                onNavigate={navigate}
                onOpenSupport={(topic) => setSupportTopic(topic)}
              />
            )}

            {currentView === 'dashboard' && (
              <FarmerDashboard
                equipment={equipment}
                bookings={bookings}
                loading={loadingEquipment}
                onSelectEquipment={handleSelectEquipment}
                onSearchMarketplace={handleSearchMarketplace}
                onNavigate={navigate}
                onOpenLocationModal={() => setLocationModalOpen(true)}
                onOpenSupport={() => setSupportTopic('help')}
              />
            )}

            {currentView === 'marketplace' && (
              <MarketplacePage
                equipment={equipment}
                loading={loadingEquipment}
                filters={filters}
                onChangeFilters={setFilters}
                onSelectEquipment={handleSelectEquipment}
                onOpenLocationModal={() => setLocationModalOpen(true)}
              />
            )}

            {currentView === 'details' && selectedEquipment && (
              <EquipmentDetailPage
                equipment={
                  equipment.find((e) => e.id === selectedEquipment.id) || selectedEquipment
                }
                allEquipment={equipment}
                onBack={() => navigate('marketplace')}
                onSelectEquipment={handleSelectEquipment}
                onBookNow={(eq) => setBookingEquipment(eq)}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {currentView === 'bookings' && (
              <BookingsPage
                bookings={bookings}
                onRefreshBookings={fetchBookings}
                onRefreshEquipment={fetchEquipment}
                onOpenMarketplace={() => navigate('marketplace')}
              />
            )}

            {currentView === 'owner' && (
              <OwnerDashboard
                equipment={equipment}
                bookings={bookings}
                onRefreshEquipment={fetchEquipment}
                onRefreshBookings={fetchBookings}
                onAddEquipment={() => {
                  setEditingEquipment(null);
                  navigate('add_equipment');
                }}
                onEditEquipment={(eq) => {
                  setEditingEquipment(eq);
                  navigate('add_equipment');
                }}
                onOpenAuth={() => setAuthModalOpen(true)}
                onNavigateProfile={() => navigate('profile')}
              />
            )}

            {currentView === 'add_equipment' && (
              <AddEquipmentPage
                editingEquipment={editingEquipment}
                onBack={() => navigate('owner')}
                onSuccess={async () => {
                  await fetchEquipment();
                }}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {currentView === 'profile' && (
              <ProfilePage
                onOpenAuth={() => setAuthModalOpen(true)}
                onLoggedOut={() => navigate('landing')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <BookingModal
        equipment={bookingEquipment}
        onClose={() => setBookingEquipment(null)}
        onBooked={async () => {
          await fetchBookings();
        }}
      />

      <GpsPermissionModal
        open={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />

      <SupportInfoModal
        topic={supportTopic}
        onClose={() => setSupportTopic(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <LocationProvider>
          <AuthProvider>
            <ImageSelectionProvider>
              <FarmRentShell />
            </ImageSelectionProvider>
          </AuthProvider>
        </LocationProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}
