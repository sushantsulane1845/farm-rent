import React, { createContext, useContext, useState } from 'react';
import { MaharashtraHub } from '../types';
import { findNearestHub, MAHARASHTRA_HUBS } from '../data/locations';

interface ActiveLocation {
  village: string;
  taluka: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  isGps: boolean;
}

interface LocationContextValue {
  location: ActiveLocation;
  selectHub: (hub: MaharashtraHub) => void;
  setCustomLocation: (loc: ActiveLocation) => void;
  requestGpsLocation: () => Promise<{ ok: boolean; error?: string }>;
  gpsLoading: boolean;
}

const LocationContext = createContext<LocationContextValue | null>(null);

const DEFAULT_HUB = MAHARASHTRA_HUBS[0]; // Baramati, Pune

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<ActiveLocation>({
    village: DEFAULT_HUB.village,
    taluka: DEFAULT_HUB.taluka,
    district: DEFAULT_HUB.district,
    state: DEFAULT_HUB.state,
    lat: DEFAULT_HUB.lat,
    lng: DEFAULT_HUB.lng,
    isGps: false,
  });
  const [gpsLoading, setGpsLoading] = useState(false);

  const selectHub = (hub: MaharashtraHub) => {
    setLocation({
      village: hub.village,
      taluka: hub.taluka,
      district: hub.district,
      state: hub.state,
      lat: hub.lat,
      lng: hub.lng,
      isGps: false,
    });
  };

  const setCustomLocation = (loc: ActiveLocation) => {
    setLocation(loc);
  };

  const requestGpsLocation = (): Promise<{ ok: boolean; error?: string }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ ok: false, error: 'Geolocation is not supported by your browser.' });
        return;
      }
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const nearest = findNearestHub(latitude, longitude);
          setLocation({
            village: nearest.village,
            taluka: nearest.taluka,
            district: nearest.district,
            state: nearest.state,
            lat: latitude,
            lng: longitude,
            isGps: true,
          });
          setGpsLoading(false);
          resolve({ ok: true });
        },
        (err) => {
          setGpsLoading(false);
          resolve({ ok: false, error: err.message || 'Location permission denied.' });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{ location, selectHub, setCustomLocation, requestGpsLocation, gpsLoading }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationContext must be used within LocationProvider');
  return ctx;
}
