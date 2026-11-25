export type Language = 'mr' | 'hi' | 'en';

export type UserRole = 'farmer' | 'owner';

export type EquipmentCategory =
  | 'tractor'
  | 'rotavator'
  | 'harvester'
  | 'cultivator'
  | 'seed_drill'
  | 'sprayer'
  | 'thresher'
  | 'trailer'
  | 'plough'
  | 'jcb'
  | 'transport'
  | 'other';

export type PriceUnit = 'hour' | 'day' | 'acre' | 'trip';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled'
  | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
  village: string;
  taluka: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  isVerified: boolean;
  preferredLang: Language;
  isDemo: boolean;
  createdAt: string;
}

export interface EquipmentSpecs {
  horsepower?: string;
  fuelType?: string;
  workingWidth?: string;
  capacity?: string;
  year?: string;
  condition?: string;
}

export interface Equipment {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerVerified: boolean;
  category: EquipmentCategory;
  title: string;
  brand: string;
  model: string;
  description: string;
  images: string[];
  price: number;
  priceUnit: PriceUnit;
  deliveryCharge: number;
  operatorIncluded: boolean;
  operatorCharge: number;
  village: string;
  taluka: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  available: boolean;
  availableDates: string[];
  specs: EquipmentSpecs;
  rentalConditions: string;
  contactPhone: string;
  ratingAvg: number;
  reviewCount: number;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
  distanceKm?: number;
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentTitle: string;
  equipmentImage: string;
  equipmentCategory: EquipmentCategory;
  renterId: string;
  renterName: string;
  renterPhone: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  date: string;
  startTime: string;
  duration: number;
  priceUnit: PriceUnit;
  acres: number;
  farmLocation: string;
  deliveryRequired: boolean;
  notes: string;
  estimatedCost: number;
  additionalCharges: number;
  totalCost: number;
  status: BookingStatus;
  hasReview?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  equipmentId: string;
  bookingId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  bookingId: string;
  title: string;
  message: string;
  type: 'booking_request' | 'booking_accepted' | 'booking_rejected' | 'booking_cancelled' | 'booking_completed' | 'review';
  isRead: boolean;
  createdAt: string;
}

export interface MaharashtraHub {
  id: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  labelMr: string;
  labelHi: string;
  labelEn: string;
}

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'marketplace'
  | 'details'
  | 'bookings'
  | 'owner'
  | 'add_equipment'
  | 'profile';
