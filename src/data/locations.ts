import { EquipmentCategory, MaharashtraHub } from '../types';
import { MAHARASHTRA_DISTRICTS } from './maharashtraGeography';

export const MAHARASHTRA_HUBS: MaharashtraHub[] = [
  {
    id: 'baramati',
    village: 'Malegaon Bk',
    taluka: 'Baramati',
    district: 'Pune',
    state: 'Maharashtra',
    lat: 18.1517,
    lng: 74.5768,
    labelMr: 'बारामती, जि. पुणे',
    labelHi: 'बारामती, जि. पुणे',
    labelEn: 'Baramati, Pune',
  },
  {
    id: 'niphad',
    village: 'Pimpalgaon Baswant',
    taluka: 'Niphad',
    district: 'Nashik',
    state: 'Maharashtra',
    lat: 20.0757,
    lng: 74.1046,
    labelMr: 'निफाड, जि. नाशिक',
    labelHi: 'निफाड, जि. नासिक',
    labelEn: 'Niphad, Nashik',
  },
  {
    id: 'karad',
    village: 'Umbraj',
    taluka: 'Karad',
    district: 'Satara',
    state: 'Maharashtra',
    lat: 17.2891,
    lng: 74.1817,
    labelMr: 'कराड, जि. सातारा',
    labelHi: 'कराड, जि. सातारा',
    labelEn: 'Karad, Satara',
  },
  {
    id: 'phaltan',
    village: 'Sakharwadi',
    taluka: 'Phaltan',
    district: 'Satara',
    state: 'Maharashtra',
    lat: 17.9912,
    lng: 74.4316,
    labelMr: 'फलटण, जि. सातारा',
    labelHi: 'फलटण, जि. सातारा',
    labelEn: 'Phaltan, Satara',
  },
  {
    id: 'shirol',
    village: 'Jaysingpur',
    taluka: 'Shirol',
    district: 'Kolhapur',
    state: 'Maharashtra',
    lat: 16.7376,
    lng: 74.6033,
    labelMr: 'शिरोळ, जि. कोल्हापूर',
    labelHi: 'शिरोळ, जि. कोल्हापुर',
    labelEn: 'Shirol, Kolhapur',
  },
  {
    id: 'rahuri',
    village: 'Rahuri Factory',
    taluka: 'Rahuri',
    district: 'Ahilyanagar (Ahmednagar)',
    state: 'Maharashtra',
    lat: 19.3924,
    lng: 74.6488,
    labelMr: 'राहुरी, जि. अहिल्यानगर',
    labelHi: 'राहुरी, जि. अहिल्यानगर',
    labelEn: 'Rahuri, Ahilyanagar',
  },
  {
    id: 'pandharpur',
    village: 'Karkamb',
    taluka: 'Pandharpur',
    district: 'Solapur',
    state: 'Maharashtra',
    lat: 17.6746,
    lng: 75.3237,
    labelMr: 'पंढरपूर, जि. सोलापूर',
    labelHi: 'पंढरपुर, जि. सोलापुर',
    labelEn: 'Pandharpur, Solapur',
  },
  {
    id: 'miraj',
    village: 'Tasgaon Road',
    taluka: 'Miraj',
    district: 'Sangli',
    state: 'Maharashtra',
    lat: 16.8222,
    lng: 74.6509,
    labelMr: 'मिरज, जि. सांगली',
    labelHi: 'मिरज, जि. सांगली',
    labelEn: 'Miraj, Sangli',
  },
  {
    id: 'hingna',
    village: 'Wanadongri',
    taluka: 'Hingna',
    district: 'Nagpur',
    state: 'Maharashtra',
    lat: 21.0870,
    lng: 78.9722,
    labelMr: 'हिंगणा, जि. नागपूर',
    labelHi: 'हिंगणा, जि. नागपुर',
    labelEn: 'Hingna, Nagpur',
  },
  {
    id: 'paithan',
    village: 'Bidkin',
    taluka: 'Paithan',
    district: 'Chh. Sambhajinagar',
    state: 'Maharashtra',
    lat: 19.4793,
    lng: 75.3834,
    labelMr: 'पैठण, छ. संभाजीनगर',
    labelHi: 'पैठण, छ. संभाजीनगर',
    labelEn: 'Paithan, Chh. Sambhajinagar',
  },
  {
    id: 'indapur',
    village: 'Bhavaninagar',
    taluka: 'Indapur',
    district: 'Pune',
    state: 'Maharashtra',
    lat: 18.1130,
    lng: 75.0289,
    labelMr: 'इंदापूर, जि. पुणे',
    labelHi: 'इंदापुर, जि. पुणे',
    labelEn: 'Indapur, Pune',
  },
  {
    id: 'latur',
    village: 'Ausa Road',
    taluka: 'Latur',
    district: 'Latur',
    state: 'Maharashtra',
    lat: 18.4088,
    lng: 76.5604,
    labelMr: 'लातूर, जि. लातूर',
    labelHi: 'लातूर, जि. लातूर',
    labelEn: 'Latur, Maharashtra',
  },
];

export const CATEGORY_IMAGES: Record<EquipmentCategory, string> = {
  tractor: '/src/assets/images/equip_tractor_1795601714607.jpg',
  rotavator: '/src/assets/images/equip_rotavator_1795601715440.jpg',
  harvester: '/src/assets/images/equip_harvester_1795601715869.jpg',
  cultivator: '/src/assets/images/equip_rotavator_1795601715440.jpg',
  seed_drill: '/src/assets/images/equip_sprayer_drill_1795601716978.jpg',
  sprayer: '/src/assets/images/equip_sprayer_drill_1795601716978.jpg',
  thresher: '/src/assets/images/equip_harvester_1795601715869.jpg',
  trailer: '/src/assets/images/equip_jcb_trailer_1795601717927.jpg',
  plough: '/src/assets/images/equip_rotavator_1795601715440.jpg',
  jcb: '/src/assets/images/equip_jcb_trailer_1795601717927.jpg',
  transport: '/src/assets/images/equip_jcb_trailer_1795601717927.jpg',
  other: '/src/assets/images/equip_tractor_1795601714607.jpg',
};

export const HERO_BANNER_IMAGE = '/src/assets/images/hero_maharashtra_tractor_1795601714978.jpg';

export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function findNearestHub(lat: number, lng: number): MaharashtraHub {
  let best = MAHARASHTRA_HUBS[0];
  let bestDist = Infinity;
  for (const dist of MAHARASHTRA_DISTRICTS) {
    for (const tal of dist.talukas) {
      const d = haversineDistanceKm(lat, lng, tal.lat, tal.lng);
      if (d < bestDist) {
        bestDist = d;
        const primaryVillage = tal.villages[0]?.nameEn || tal.nameEn;
        best = {
          id: tal.id,
          village: primaryVillage,
          taluka: tal.nameEn,
          district: dist.nameEn,
          state: 'Maharashtra',
          lat: tal.lat,
          lng: tal.lng,
          labelMr: `${tal.nameMr}, जि. ${dist.nameMr}`,
          labelHi: `${tal.nameMr}, जि. ${dist.nameHi}`,
          labelEn: `${tal.nameEn}, ${dist.nameEn}`,
        };
      }
    }
  }
  return best;
}
