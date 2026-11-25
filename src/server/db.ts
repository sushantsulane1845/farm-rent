import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { CATEGORY_IMAGES } from '../data/locations.ts';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'farmrent.db');
export const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    passwordHash TEXT,
    roles TEXT NOT NULL DEFAULT '["farmer"]',
    village TEXT NOT NULL DEFAULT '',
    taluka TEXT NOT NULL DEFAULT '',
    district TEXT NOT NULL DEFAULT 'Pune',
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    lat REAL NOT NULL DEFAULT 18.1517,
    lng REAL NOT NULL DEFAULT 74.5768,
    isVerified INTEGER NOT NULL DEFAULT 0,
    preferredLang TEXT NOT NULL DEFAULT 'mr',
    isDemo INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS equipment (
    id TEXT PRIMARY KEY,
    ownerId TEXT NOT NULL,
    ownerName TEXT NOT NULL,
    ownerVerified INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT '',
    model TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    images TEXT NOT NULL DEFAULT '[]',
    price REAL NOT NULL,
    priceUnit TEXT NOT NULL,
    deliveryCharge REAL NOT NULL DEFAULT 0,
    operatorIncluded INTEGER NOT NULL DEFAULT 0,
    operatorCharge REAL NOT NULL DEFAULT 0,
    village TEXT NOT NULL,
    taluka TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    available INTEGER NOT NULL DEFAULT 1,
    availableDates TEXT NOT NULL DEFAULT '[]',
    specs TEXT NOT NULL DEFAULT '{}',
    rentalConditions TEXT NOT NULL DEFAULT '',
    contactPhone TEXT NOT NULL DEFAULT '',
    ratingAvg REAL NOT NULL DEFAULT 0,
    reviewCount INTEGER NOT NULL DEFAULT 0,
    isDemo INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    equipmentId TEXT NOT NULL,
    equipmentTitle TEXT NOT NULL,
    equipmentImage TEXT NOT NULL,
    equipmentCategory TEXT NOT NULL,
    renterId TEXT NOT NULL,
    renterName TEXT NOT NULL,
    renterPhone TEXT NOT NULL DEFAULT '',
    ownerId TEXT NOT NULL,
    ownerName TEXT NOT NULL,
    ownerPhone TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL,
    startTime TEXT NOT NULL,
    duration INTEGER NOT NULL,
    priceUnit TEXT NOT NULL,
    acres REAL NOT NULL DEFAULT 1,
    farmLocation TEXT NOT NULL,
    deliveryRequired INTEGER NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT '',
    estimatedCost REAL NOT NULL,
    additionalCharges REAL NOT NULL DEFAULT 0,
    totalCost REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (equipmentId) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (renterId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    equipmentId TEXT NOT NULL,
    bookingId TEXT NOT NULL UNIQUE,
    reviewerId TEXT NOT NULL,
    reviewerName TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (equipmentId) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewerId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    bookingId TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    isRead INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  const keyBuf = Buffer.from(keyHex, 'hex');
  const derived = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derived.length) return false;
  return crypto.timingSafeEqual(keyBuf, derived);
}

export function seedDemoData() {
  const existingUsers = db.prepare('SELECT COUNT(*) as cnt FROM users').get() as { cnt: number };
  if (existingUsers.cnt > 0) return;

  const now = new Date().toISOString();
  const futureDates = [1, 2, 3, 4, 5, 7, 10].map((d) => {
    const dt = new Date();
    dt.setDate(dt.getDate() + d);
    return dt.toISOString().slice(0, 10);
  });

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, phone, passwordHash, roles, village, taluka, district, state, lat, lng, isVerified, preferredLang, isDemo, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'demo-farmer-1',
    'रमेश पाटील (Ramesh Patil)',
    'ramesh.demo@farmrent.example',
    '',
    null,
    JSON.stringify(['farmer']),
    'Malegaon Bk',
    'Baramati',
    'Pune',
    'Maharashtra',
    18.1517,
    74.5768,
    0,
    'mr',
    1,
    now
  );

  insertUser.run(
    'demo-owner-1',
    'सुरेश देशमुख (Suresh Deshmukh)',
    'suresh.demo@farmrent.example',
    '',
    null,
    JSON.stringify(['farmer', 'owner']),
    'Pimpalgaon Baswant',
    'Niphad',
    'Nashik',
    'Maharashtra',
    20.0757,
    74.1046,
    1,
    'mr',
    1,
    now
  );

  insertUser.run(
    'demo-owner-2',
    'राजेंद्र शिंदे (Rajendra Shinde)',
    'rajendra.demo@farmrent.example',
    '',
    null,
    JSON.stringify(['owner']),
    'Umbraj',
    'Karad',
    'Satara',
    'Maharashtra',
    17.2891,
    74.1817,
    0,
    'mr',
    1,
    now
  );

  const insertEquip = db.prepare(`
    INSERT INTO equipment (
      id, ownerId, ownerName, ownerVerified, category, title, brand, model, description,
      images, price, priceUnit, deliveryCharge, operatorIncluded, operatorCharge,
      village, taluka, district, state, lat, lng, available, availableDates,
      specs, rentalConditions, contactPhone, ratingAvg, reviewCount, isDemo, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const demoEquipment = [
    {
      id: 'eq-tractor-baramati',
      ownerId: 'demo-owner-1',
      ownerName: 'सुरेश देशमुख (Suresh Deshmukh)',
      ownerVerified: 1,
      category: 'tractor',
      title: 'Mahindra Arjun Novo 605 DI-i (57 HP)',
      brand: 'Mahindra',
      model: 'Arjun Novo 605 DI-i',
      description:
        'ऊस लागवड, खोल नांगरणी आणि जड अवजारांसाठी दमदार 57 HP ट्रॅक्टर. सर्व्हिसिंग पूर्ण असून वेळेवर शेतात उपलब्ध.',
      images: [CATEGORY_IMAGES.tractor, '/src/assets/images/hero_maharashtra_tractor_1795601714978.jpg'],
      price: 750,
      priceUnit: 'hour',
      deliveryCharge: 200,
      operatorIncluded: 1,
      operatorCharge: 150,
      village: 'Malegaon Bk',
      taluka: 'Baramati',
      district: 'Pune',
      lat: 18.1517,
      lng: 74.5768,
      specs: { horsepower: '57 HP', fuelType: 'Diesel', workingWidth: '4WD / Heavy Hydraulics', year: '2023', condition: 'Excellent' },
      rentalConditions: 'किमान 3 तास बुकिंग. डिझेल दरात समाविष्ट (ऑपरेटरसह).',
      ratingAvg: 4.8,
      reviewCount: 2,
    },
    {
      id: 'eq-rotavator-niphad',
      ownerId: 'demo-owner-1',
      ownerName: 'सुरेश देशमुख (Suresh Deshmukh)',
      ownerVerified: 1,
      category: 'rotavator',
      title: 'Sonalika 6-Feet Heavy Duty Rotavator',
      brand: 'Sonalika',
      model: 'Challenger 6ft (42 Blades)',
      description:
        'कांदा, द्राक्ष आणि भाजीपाला शेतीसाठी माती भुसभुशीत करणारा ६ फुटी रोटाव्हेटर. नवीन L-टाईप ब्लेड्स.',
      images: [CATEGORY_IMAGES.rotavator],
      price: 950,
      priceUnit: 'acre',
      deliveryCharge: 150,
      operatorIncluded: 1,
      operatorCharge: 0,
      village: 'Pimpalgaon Baswant',
      taluka: 'Niphad',
      district: 'Nashik',
      lat: 20.0757,
      lng: 74.1046,
      specs: { horsepower: '45+ HP Required', fuelType: 'Tractor PTO', workingWidth: '6 Feet (1.8m)', year: '2024', condition: 'Like New' },
      rentalConditions: 'एकरनुसार दर. ओली जमीन असल्यास आधी कळवावे.',
      ratingAvg: 4.9,
      reviewCount: 1,
    },
    {
      id: 'eq-harvester-karad',
      ownerId: 'demo-owner-2',
      ownerName: 'राजेंद्र शिंदे (Rajendra Shinde)',
      ownerVerified: 0,
      category: 'harvester',
      title: 'Claas Crop Tiger 40 Combine Harvester',
      brand: 'Claas',
      model: 'Crop Tiger 40 Terra Trac',
      description:
        'सोयाबीन, गहू, हरभरा आणि भात कापणी व मळणी एकाच वेळी करणारे आधुनिक हार्वेस्टर. कमी दाणा नुकसान.',
      images: [CATEGORY_IMAGES.harvester],
      price: 2400,
      priceUnit: 'acre',
      deliveryCharge: 400,
      operatorIncluded: 1,
      operatorCharge: 0,
      village: 'Umbraj',
      taluka: 'Karad',
      district: 'Satara',
      lat: 17.2891,
      lng: 74.1817,
      specs: { horsepower: '76 HP', fuelType: 'Diesel', workingWidth: '10 Feet Cutter Bar', year: '2022', condition: 'Well Maintained' },
      rentalConditions: 'किमान २ एकर क्षेत्रासाठी उपलब्ध. रात्रीचे काम शक्य.',
      ratingAvg: 4.7,
      reviewCount: 1,
    },
    {
      id: 'eq-sprayer-shirol',
      ownerId: 'demo-owner-2',
      ownerName: 'राजेंद्र शिंदे (Rajendra Shinde)',
      ownerVerified: 0,
      category: 'sprayer',
      title: 'Aspee 500L Tractor Boom Sprayer',
      brand: 'Aspee',
      model: 'HTP Tractor Mounted 500L',
      description:
        'ऊस, केळी आणि सोयाबीन पिकांवर जलद आणि एकसमान फवारणीसाठी 500 लिटर बूम स्प्रेअर.',
      images: [CATEGORY_IMAGES.sprayer],
      price: 450,
      priceUnit: 'acre',
      deliveryCharge: 100,
      operatorIncluded: 1,
      operatorCharge: 100,
      village: 'Jaysingpur',
      taluka: 'Shirol',
      district: 'Kolhapur',
      lat: 16.7376,
      lng: 74.6033,
      specs: { horsepower: '35+ HP Tractor', fuelType: 'PTO Driven', workingWidth: '24 Feet Boom', year: '2024', condition: 'Excellent' },
      rentalConditions: 'औषध व पाणी शेतकऱ्याने शेतावर उपलब्ध ठेवावे.',
      ratingAvg: 4.6,
      reviewCount: 1,
    },
    {
      id: 'eq-seeddrill-pandharpur',
      ownerId: 'demo-owner-1',
      ownerName: 'सुरेश देशमुख (Suresh Deshmukh)',
      ownerVerified: 1,
      category: 'seed_drill',
      title: 'Mahindra 9-Row Multi-Crop Seed Drill',
      brand: 'Mahindra',
      model: 'SeedMaster 9-Tyne',
      description:
        'ज्वारी, बाजरी, सोयाबीन, तूर आणि हरभरा अचूक पेरणीसाठी ९ दाती मल्टी-क्रॉप सीड ड्रिल.',
      images: [CATEGORY_IMAGES.seed_drill],
      price: 700,
      priceUnit: 'acre',
      deliveryCharge: 150,
      operatorIncluded: 1,
      operatorCharge: 0,
      village: 'Karkamb',
      taluka: 'Pandharpur',
      district: 'Solapur',
      lat: 17.6746,
      lng: 75.3237,
      specs: { horsepower: '40+ HP', fuelType: 'Tractor Hitch', workingWidth: '9 Rows Adjustable', year: '2023', condition: 'Good' },
      rentalConditions: 'खत व बियाणे स्वतंत्र डब्यात अचूक पेरणी.',
      ratingAvg: 4.5,
      reviewCount: 0,
    },
    {
      id: 'eq-jcb-miraj',
      ownerId: 'demo-owner-2',
      ownerName: 'राजेंद्र शिंदे (Rajendra Shinde)',
      ownerVerified: 0,
      category: 'jcb',
      title: 'JCB 3DX Backhoe Loader (Farm Bunding)',
      brand: 'JCB',
      model: '3DX EcoXcellence',
      description:
        'शेततळे खोदकाम, बांधबंदिस्ती, विहीर काम आणि मुरूम सपाटीकरणासाठी अनुभवी ऑपरेटरसह JCB 3DX.',
      images: [CATEGORY_IMAGES.jcb],
      price: 1350,
      priceUnit: 'hour',
      deliveryCharge: 300,
      operatorIncluded: 1,
      operatorCharge: 0,
      village: 'Tasgaon Road',
      taluka: 'Miraj',
      district: 'Sangli',
      lat: 16.8222,
      lng: 74.6509,
      specs: { horsepower: '76 HP', fuelType: 'Diesel', workingWidth: '1.1 cu.m Bucket', year: '2022', condition: 'Heavy Duty' },
      rentalConditions: 'किमान 4 तास बुकिंग. डिझेल व ऑपरेटर दरात समाविष्ट.',
      ratingAvg: 4.8,
      reviewCount: 0,
    },
    {
      id: 'eq-cultivator-rahuri',
      ownerId: 'demo-owner-1',
      ownerName: 'सुरेश देशमुख (Suresh Deshmukh)',
      ownerVerified: 1,
      category: 'cultivator',
      title: 'Shaktiman 9-Tyne Spring Cultivator',
      brand: 'Shaktiman',
      model: '9-Tyne Heavy Spring',
      description:
        'खरीप व रब्बी हंगामापूर्वी मशागत आणि तण काढणीसाठी मजबूत स्प्रिंग कल्टिव्हेटर.',
      images: [CATEGORY_IMAGES.cultivator],
      price: 550,
      priceUnit: 'hour',
      deliveryCharge: 100,
      operatorIncluded: 1,
      operatorCharge: 0,
      village: 'Rahuri Factory',
      taluka: 'Rahuri',
      district: 'Ahmednagar',
      lat: 19.3924,
      lng: 74.6488,
      specs: { horsepower: '45 HP', fuelType: 'Implement', workingWidth: '9 Tynes', year: '2023', condition: 'Excellent' },
      rentalConditions: 'फक्त अवजार किंवा ट्रॅक्टरसह दोन्ही पर्याय उपलब्ध.',
      ratingAvg: 4.4,
      reviewCount: 0,
    },
    {
      id: 'eq-trailer-hingna',
      ownerId: 'demo-owner-2',
      ownerName: 'राजेंद्र शिंदे (Rajendra Shinde)',
      ownerVerified: 0,
      category: 'trailer',
      title: 'Hydraulic 5-Ton Farm Trolley Trailer',
      brand: 'Desi Agritech',
      model: '5T Hydraulic Tipper',
      description:
        'शेतीमाल बाजार समितीपर्यंत नेण्यासाठी आणि शेतात खत/माती वाहतुकीसाठी हायड्रॉलिक ट्रॉली.',
      images: [CATEGORY_IMAGES.trailer],
      price: 1200,
      priceUnit: 'trip',
      deliveryCharge: 0,
      operatorIncluded: 1,
      operatorCharge: 0,
      village: 'Wanadongri',
      taluka: 'Hingna',
      district: 'Nagpur',
      lat: 21.0870,
      lng: 78.9722,
      specs: { horsepower: '5 Ton Capacity', fuelType: 'Hydraulic Tipping', workingWidth: '10x6 Feet Bed', year: '2021', condition: 'Good' },
      rentalConditions: '20 किमी मर्यादेपर्यंत प्रति फेरी दर.',
      ratingAvg: 4.5,
      reviewCount: 0,
    },
    {
      id: 'eq-thresher-paithan',
      ownerId: 'demo-owner-1',
      ownerName: 'सुरेश देशमुख (Suresh Deshmukh)',
      ownerVerified: 1,
      category: 'thresher',
      title: 'Multi-Crop Paddy & Maize Thresher',
      brand: 'Vishwakarma',
      model: 'Tokri Model 2024',
      description:
        'तूर, मका, गहू, ज्वारी आणि हरभरा मळणीसाठी उच्च क्षमतेचे थ्रेशर मशीन.',
      images: [CATEGORY_IMAGES.thresher],
      price: 1100,
      priceUnit: 'hour',
      deliveryCharge: 200,
      operatorIncluded: 1,
      operatorCharge: 100,
      village: 'Bidkin',
      taluka: 'Paithan',
      district: 'Chh. Sambhajinagar',
      lat: 19.4793,
      lng: 75.3834,
      specs: { horsepower: '45+ HP PTO', fuelType: 'Tractor PTO', workingWidth: '25 Quintal/hr', year: '2024', condition: 'Excellent' },
      rentalConditions: 'मळणीसाठी कामगार शेतकऱ्याने ठेवावेत.',
      ratingAvg: 4.7,
      reviewCount: 0,
    },
    {
      id: 'eq-plough-phaltan',
      ownerId: 'demo-owner-2',
      ownerName: 'राजेंद्र शिंदे (Rajendra Shinde)',
      ownerVerified: 0,
      category: 'plough',
      title: 'Lemken 2-Bottom Reversible MB Plough',
      brand: 'Lemken',
      model: 'Opal 090 2-Bottom',
      description:
        'ऊस व डाळिंब बागांसाठी १२ ते १४ इंच खोल नांगरणी करणारा रिव्हर्सिबल नांगर.',
      images: [CATEGORY_IMAGES.plough],
      price: 3200,
      priceUnit: 'day',
      deliveryCharge: 250,
      operatorIncluded: 1,
      operatorCharge: 0,
      village: 'Sakharwadi',
      taluka: 'Phaltan',
      district: 'Satara',
      lat: 17.9912,
      lng: 74.4316,
      specs: { horsepower: '50+ HP Tractor', fuelType: 'Hydraulic Flip', workingWidth: '2 Bottom Reversible', year: '2023', condition: 'Excellent' },
      rentalConditions: 'पूर्ण दिवस (८ तास) भाडे.',
      ratingAvg: 4.6,
      reviewCount: 0,
    },
  ];

  for (const eq of demoEquipment) {
    insertEquip.run(
      eq.id,
      eq.ownerId,
      eq.ownerName,
      eq.ownerVerified,
      eq.category,
      eq.title,
      eq.brand,
      eq.model,
      eq.description,
      JSON.stringify(eq.images),
      eq.price,
      eq.priceUnit,
      eq.deliveryCharge,
      eq.operatorIncluded,
      eq.operatorCharge,
      eq.village,
      eq.taluka,
      eq.district,
      'Maharashtra',
      eq.lat,
      eq.lng,
      1,
      JSON.stringify(futureDates),
      JSON.stringify(eq.specs),
      eq.rentalConditions,
      '',
      eq.ratingAvg,
      eq.reviewCount,
      1,
      now,
      now
    );
  }

  const insertBooking = db.prepare(`
    INSERT INTO bookings (
      id, equipmentId, equipmentTitle, equipmentImage, equipmentCategory,
      renterId, renterName, renterPhone, ownerId, ownerName, ownerPhone,
      date, startTime, duration, priceUnit, acres, farmLocation, deliveryRequired,
      notes, estimatedCost, additionalCharges, totalCost, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBooking.run(
    'bk-demo-upcoming',
    'eq-tractor-baramati',
    'Mahindra Arjun Novo 605 DI-i (57 HP)',
    CATEGORY_IMAGES.tractor,
    'tractor',
    'demo-farmer-1',
    'रमेश पाटील (Ramesh Patil)',
    '',
    'demo-owner-1',
    'सुरेश देशमुख (Suresh Deshmukh)',
    '',
    futureDates[2],
    '08:00',
    4,
    'hour',
    2,
    'माळेगाव बु. शिवार, कालवा गेट ४ जवळ',
    1,
    'ऊस सरी पाडण्यासाठी ट्रॅक्टर हवा आहे',
    3000,
    350,
    3350,
    'accepted',
    now,
    now
  );

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 4);
  insertBooking.run(
    'bk-demo-completed',
    'eq-rotavator-niphad',
    'Sonalika 6-Feet Heavy Duty Rotavator',
    CATEGORY_IMAGES.rotavator,
    'rotavator',
    'demo-farmer-1',
    'रमेश पाटील (Ramesh Patil)',
    '',
    'demo-owner-1',
    'सुरेश देशमुख (Suresh Deshmukh)',
    '',
    pastDate.toISOString().slice(0, 10),
    '09:00',
    3,
    'acre',
    3,
    'माळेगाव बु., पश्चिम मळा',
    1,
    'कांदा लागवड पूर्व मशागत',
    2850,
    150,
    3000,
    'completed',
    now,
    now
  );

  insertBooking.run(
    'bk-demo-pending',
    'eq-harvester-karad',
    'Claas Crop Tiger 40 Combine Harvester',
    CATEGORY_IMAGES.harvester,
    'harvester',
    'demo-farmer-1',
    'रमेश पाटील (Ramesh Patil)',
    '',
    'demo-owner-2',
    'राजेंद्र शिंदे (Rajendra Shinde)',
    '',
    futureDates[4],
    '07:00',
    3,
    'acre',
    3,
    'बारामती रोड प्लॉट क्र. १२',
    0,
    'सोयाबीन कापणीसाठी',
    7200,
    0,
    7200,
    'pending',
    now,
    now
  );

  const insertReview = db.prepare(`
    INSERT INTO reviews (id, equipmentId, bookingId, reviewerId, reviewerName, rating, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertReview.run(
    'rev-demo-1',
    'eq-tractor-baramati',
    'bk-demo-upcoming',
    'demo-farmer-1',
    'रमेश पाटील',
    5,
    'ट्रॅक्टर वेळेवर शेतात आला आणि काम अत्यंत वेगाने पूर्ण झाले. मालकांचे सहकार्य चांगले होते. (Demo Review)',
    now
  );

  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, userId, bookingId, title, message, type, isRead, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertNotif.run(
    'notif-demo-1',
    'demo-farmer-1',
    'bk-demo-upcoming',
    'बुकिंग मंजूर झाले / Booking Accepted',
    'Mahindra Arjun Novo 605 DI-i चे तुमचे बुकिंग मालकांनी स्वीकारले आहे.',
    'booking_accepted',
    0,
    now
  );

  insertNotif.run(
    'notif-demo-2',
    'demo-owner-1',
    'bk-demo-upcoming',
    'आगामी बुकिंग / Upcoming Booking',
    'रमेश पाटील यांचे Baramati येथील ट्रॅक्टर काम निश्चित आहे.',
    'booking_request',
    0,
    now
  );
}
