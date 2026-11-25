import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { createServer as createViteServer } from 'vite';
import { db, hashPassword, seedDemoData, verifyPassword } from './src/server/db.ts';
import { haversineDistanceKm } from './src/data/locations.ts';

seedDemoData();

const app = express();
const PORT = 3000;

app.set('trust proxy', 1);
app.use(express.json({ limit: '6mb' }));

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  village: string;
  taluka: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  isVerified: boolean;
  preferredLang: string;
  isDemo: boolean;
  createdAt: string;
}

interface AuthenticatedRequest extends Request {
  user?: AuthUser;
  authToken?: string;
}

function parseUserRow(row: any): AuthUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email || '',
    phone: row.phone || '',
    roles: JSON.parse(row.roles || '["farmer"]'),
    village: row.village || '',
    taluka: row.taluka || '',
    district: row.district || 'Pune',
    state: row.state || 'Maharashtra',
    lat: Number(row.lat) || 18.1517,
    lng: Number(row.lng) || 74.5768,
    isVerified: Boolean(row.isVerified),
    preferredLang: row.preferredLang || 'mr',
    isDemo: Boolean(row.isDemo),
    createdAt: row.createdAt,
  };
}

function parseEquipmentRow(row: any) {
  return {
    id: row.id,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    ownerVerified: Boolean(row.ownerVerified),
    category: row.category,
    title: row.title,
    brand: row.brand,
    model: row.model,
    description: row.description,
    images: JSON.parse(row.images || '[]'),
    price: Number(row.price),
    priceUnit: row.priceUnit,
    deliveryCharge: Number(row.deliveryCharge || 0),
    operatorIncluded: Boolean(row.operatorIncluded),
    operatorCharge: Number(row.operatorCharge || 0),
    village: row.village,
    taluka: row.taluka,
    district: row.district,
    state: row.state,
    lat: Number(row.lat),
    lng: Number(row.lng),
    available: Boolean(row.available),
    availableDates: JSON.parse(row.availableDates || '[]'),
    specs: JSON.parse(row.specs || '{}'),
    rentalConditions: row.rentalConditions || '',
    contactPhone: row.contactPhone || '',
    ratingAvg: Number(row.ratingAvg || 0),
    reviewCount: Number(row.reviewCount || 0),
    isDemo: Boolean(row.isDemo),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function parseBookingRow(row: any) {
  return {
    id: row.id,
    equipmentId: row.equipmentId,
    equipmentTitle: row.equipmentTitle,
    equipmentImage: row.equipmentImage,
    equipmentCategory: row.equipmentCategory,
    renterId: row.renterId,
    renterName: row.renterName,
    renterPhone: row.renterPhone || '',
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    ownerPhone: row.ownerPhone || '',
    date: row.date,
    startTime: row.startTime,
    duration: Number(row.duration),
    priceUnit: row.priceUnit,
    acres: Number(row.acres || 1),
    farmLocation: row.farmLocation,
    deliveryRequired: Boolean(row.deliveryRequired),
    notes: row.notes || '',
    estimatedCost: Number(row.estimatedCost),
    additionalCharges: Number(row.additionalCharges || 0),
    totalCost: Number(row.totalCost),
    status: row.status,
    hasReview: Boolean(row.hasReview),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function extractCookies(cookieHeader?: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const k = part.slice(0, idx).trim();
      const v = decodeURIComponent(part.slice(idx + 1).trim());
      out[k] = v;
    }
  }
  return out;
}

function setSessionCookie(res: Response, req: Request, token: string) {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const attrs = [
    `farmrent_session=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    `Max-Age=${60 * 60 * 24 * 7}`,
  ];
  if (isHttps) {
    attrs.push('Secure', 'SameSite=None', 'Partitioned');
  } else {
    attrs.push('SameSite=Lax');
  }
  res.setHeader('Set-Cookie', attrs.join('; '));
}

function clearSessionCookie(res: Response, req: Request) {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const attrs = ['farmrent_session=', 'Path=/', 'HttpOnly', 'Max-Age=0'];
  if (isHttps) {
    attrs.push('Secure', 'SameSite=None', 'Partitioned');
  } else {
    attrs.push('SameSite=Lax');
  }
  res.setHeader('Set-Cookie', attrs.join('; '));
}

function createSession(userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare('INSERT INTO sessions (token, userId, expiresAt) VALUES (?, ?, ?)').run(
    token,
    userId,
    expiresAt
  );
  return token;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token = '';
  let fromCookie = false;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    const cookies = extractCookies(req.headers.cookie);
    if (cookies.farmrent_session) {
      token = cookies.farmrent_session;
      fromCookie = true;
    }
  }

  if (!token) {
    next();
    return;
  }

  if (fromCookie && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const xrw = req.headers['x-requested-with'];
    if (xrw !== 'FarmRent') {
      res.status(403).json({ error: 'Missing request header validation.' });
      return;
    }
  }

  const sessionRow = db
    .prepare('SELECT userId, expiresAt FROM sessions WHERE token = ?')
    .get(token) as { userId: string; expiresAt: string } | undefined;

  if (!sessionRow || new Date(sessionRow.expiresAt).getTime() < Date.now()) {
    if (sessionRow) {
      db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    }
    next();
    return;
  }

  const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(sessionRow.userId);
  if (userRow) {
    req.user = parseUserRow(userRow);
    req.authToken = token;
  }
  next();
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  next();
}

app.use('/api', authMiddleware);

// In-memory demo OTP challenge store (strictly labeled demo preview only)
const demoOtpStore = new Map<string, { code: string; expiresAt: number }>();

// --- AUTH ROUTES ---
app.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.json({ user: null });
    return;
  }
  res.json({ user: req.user });
});

app.post('/api/auth/demo', (req: Request, res: Response) => {
  const { demoUserId } = req.body as { demoUserId?: string };
  const allowedIds = ['demo-farmer-1', 'demo-owner-1'];
  if (!demoUserId || !allowedIds.includes(demoUserId)) {
    res.status(400).json({ error: 'Invalid demo account selection.' });
    return;
  }
  const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(demoUserId);
  if (!userRow) {
    res.status(404).json({ error: 'Demo user not found.' });
    return;
  }
  const token = createSession(demoUserId);
  setSessionCookie(res, req, token);
  res.json({ user: parseUserRow(userRow), token });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone, roles, village, taluka, district, preferredLang } =
    req.body as Record<string, any>;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Valid full name is required.' });
    return;
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email address is required.' });
    return;
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists.' });
    return;
  }

  const validRoles: string[] = Array.isArray(roles)
    ? roles.filter((r) => r === 'farmer' || r === 'owner')
    : ['farmer'];
  if (validRoles.length === 0) validRoles.push('farmer');

  const id = `usr-${crypto.randomUUID().slice(0, 12)}`;
  const now = new Date().toISOString();
  const pwHash = hashPassword(password);

  db.prepare(`
    INSERT INTO users (id, name, email, phone, passwordHash, roles, village, taluka, district, state, lat, lng, isVerified, preferredLang, isDemo, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 0, ?)
  `).run(
    id,
    name.trim().slice(0, 80),
    normalizedEmail,
    typeof phone === 'string' ? phone.trim().slice(0, 20) : '',
    pwHash,
    JSON.stringify(validRoles),
    typeof village === 'string' ? village.trim().slice(0, 80) : '',
    typeof taluka === 'string' ? taluka.trim().slice(0, 80) : 'Baramati',
    typeof district === 'string' ? district.trim().slice(0, 80) : 'Pune',
    'Maharashtra',
    18.1517,
    74.5768,
    preferredLang === 'hi' || preferredLang === 'en' ? preferredLang : 'mr',
    now
  );

  const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  const token = createSession(id);
  setSessionCookie(res, req, token);
  res.status(201).json({ user: parseUserRow(userRow), token });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }
  const userRow = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email.trim().toLowerCase()) as any;
  if (!userRow || !userRow.passwordHash || !verifyPassword(password, userRow.passwordHash)) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }
  const token = createSession(userRow.id);
  setSessionCookie(res, req, token);
  res.json({ user: parseUserRow(userRow), token });
});

app.post('/api/auth/demo-otp/request', (req: Request, res: Response) => {
  const { phone } = req.body as { phone?: string };
  const cleaned = (phone || '').replace(/\s+/g, '');
  if (!/^\+?\d{10,13}$/.test(cleaned)) {
    res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number.' });
    return;
  }
  const code = String(crypto.randomInt(100000, 999999));
  demoOtpStore.set(cleaned, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
  // Clearly labeled preview-only OTP response
  res.json({
    demoPreviewOnly: true,
    previewOtpCode: code,
    message: 'Demo preview OTP generated (no real SMS sent).',
  });
});

app.post('/api/auth/demo-otp/verify', (req: Request, res: Response) => {
  const { phone, otp, name } = req.body as { phone?: string; otp?: string; name?: string };
  const cleaned = (phone || '').replace(/\s+/g, '');
  const entry = demoOtpStore.get(cleaned);
  if (!entry || entry.expiresAt < Date.now() || entry.code !== String(otp || '').trim()) {
    res.status(401).json({ error: 'Invalid or expired demo OTP code.' });
    return;
  }
  demoOtpStore.delete(cleaned);

  let userRow = db.prepare('SELECT * FROM users WHERE phone = ?').get(cleaned) as any;
  if (!userRow) {
    const id = `usr-${crypto.randomUUID().slice(0, 12)}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (id, name, email, phone, passwordHash, roles, village, taluka, district, state, lat, lng, isVerified, preferredLang, isDemo, createdAt)
      VALUES (?, ?, null, ?, null, '["farmer"]', '', 'Baramati', 'Pune', 'Maharashtra', 18.1517, 74.5768, 0, 'mr', 1, ?)
    `).run(id, (name || '').trim() || `शेतकरी ${cleaned.slice(-4)}`, cleaned, now);
    userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }
  const token = createSession(userRow.id);
  setSessionCookie(res, req, token);
  res.json({ user: parseUserRow(userRow), token });
});

app.post('/api/auth/demo-reset-password', (req: Request, res: Response) => {
  const { email, newPassword } = req.body as { email?: string; newPassword?: string };
  if (!email || !newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'Valid email and new password (min 6 chars) required.' });
    return;
  }
  const userRow = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email.trim().toLowerCase()) as any;
  if (!userRow) {
    res.status(404).json({ error: 'No account found with this email address.' });
    return;
  }
  if (userRow.isDemo && !userRow.passwordHash) {
    res.status(400).json({ error: 'Built-in sample accounts cannot change passwords.' });
    return;
  }
  const pwHash = hashPassword(newPassword);
  db.prepare('UPDATE users SET passwordHash = ? WHERE id = ?').run(pwHash, userRow.id);
  res.json({ success: true });
});

app.post('/api/auth/logout', (req: AuthenticatedRequest, res: Response) => {
  if (req.authToken) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(req.authToken);
  }
  clearSessionCookie(res, req);
  res.json({ success: true });
});

// --- PROFILE ---
app.patch('/api/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { name, phone, roles, village, taluka, district, lat, lng, preferredLang } =
    req.body as Record<string, any>;

  const nextName = typeof name === 'string' && name.trim().length >= 2 ? name.trim().slice(0, 80) : user.name;
  const nextPhone = typeof phone === 'string' ? phone.trim().slice(0, 20) : user.phone;
  const nextRoles = Array.isArray(roles)
    ? Array.from(new Set(roles.filter((r) => r === 'farmer' || r === 'owner')))
    : user.roles;
  if (nextRoles.length === 0) nextRoles.push('farmer');

  const nextVillage = typeof village === 'string' ? village.trim().slice(0, 80) : user.village;
  const nextTaluka = typeof taluka === 'string' ? taluka.trim().slice(0, 80) : user.taluka;
  const nextDistrict = typeof district === 'string' ? district.trim().slice(0, 80) : user.district;
  const nextLat = typeof lat === 'number' && Number.isFinite(lat) ? lat : user.lat;
  const nextLng = typeof lng === 'number' && Number.isFinite(lng) ? lng : user.lng;
  const nextLang =
    preferredLang === 'mr' || preferredLang === 'hi' || preferredLang === 'en'
      ? preferredLang
      : user.preferredLang;

  db.prepare(`
    UPDATE users
    SET name = ?, phone = ?, roles = ?, village = ?, taluka = ?, district = ?, lat = ?, lng = ?, preferredLang = ?
    WHERE id = ?
  `).run(
    nextName,
    nextPhone,
    JSON.stringify(nextRoles),
    nextVillage,
    nextTaluka,
    nextDistrict,
    nextLat,
    nextLng,
    nextLang,
    user.id
  );

  // Sync owner name/phone on equipment if owner updated profile
  db.prepare('UPDATE equipment SET ownerName = ? WHERE ownerId = ?').run(nextName, user.id);

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  res.json({ user: parseUserRow(updated) });
});

// --- EQUIPMENT ROUTES ---
app.get('/api/equipment', (req: Request, res: Response) => {
  const {
    q,
    category,
    district,
    taluka,
    village,
    onlyAvailable,
    operatorOnly,
    deliveryOnly,
    maxDistance,
    maxPrice,
    priceUnit,
    minRating,
    date,
    sort,
    lat,
    lng,
    ownerId,
  } = req.query as Record<string, string | undefined>;

  const rows = db.prepare('SELECT * FROM equipment ORDER BY createdAt DESC').all() as any[];
  const refLat = lat ? Number(lat) : 18.1517;
  const refLng = lng ? Number(lng) : 74.5768;

  let items = rows.map((row) => {
    const parsed = parseEquipmentRow(row);
    return {
      ...parsed,
      distanceKm: haversineDistanceKm(refLat, refLng, parsed.lat, parsed.lng),
    };
  });

  if (ownerId) {
    items = items.filter((e) => e.ownerId === ownerId);
  }
  if (category && category !== 'all') {
    items = items.filter((e) => e.category === category);
  }
  if (district && district !== 'all') {
    const dLower = district.toLowerCase();
    const dBase = dLower.split('(')[0].trim();
    items = items.filter((e) => {
      const ed = e.district.toLowerCase();
      return (
        ed.includes(dLower) ||
        ed.includes(dBase) ||
        (dLower.includes('ahmednagar') && ed.includes('ahilyanagar')) ||
        (dLower.includes('ahilyanagar') && ed.includes('ahmednagar')) ||
        (dLower.includes('osmanabad') && ed.includes('dharashiv')) ||
        (dLower.includes('dharashiv') && ed.includes('osmanabad')) ||
        e.taluka.toLowerCase().includes(dBase) ||
        e.village.toLowerCase().includes(dBase)
      );
    });
  }
  if (taluka && taluka !== 'all') {
    const tLower = taluka.toLowerCase().split('(')[0].trim();
    items = items.filter((e) => e.taluka.toLowerCase().includes(tLower));
  }
  if (village && village !== 'all') {
    const vLower = village.toLowerCase();
    items = items.filter((e) => e.village.toLowerCase().includes(vLower));
  }
  if (onlyAvailable === 'true') {
    items = items.filter((e) => e.available);
  }
  if (operatorOnly === 'true') {
    items = items.filter((e) => e.operatorIncluded);
  }
  if (deliveryOnly === 'true') {
    items = items.filter((e) => e.deliveryCharge === 0 || e.deliveryCharge > 0);
  }
  if (q && q.trim()) {
    const qLower = q.trim().toLowerCase();
    items = items.filter(
      (e) =>
        e.title.toLowerCase().includes(qLower) ||
        e.brand.toLowerCase().includes(qLower) ||
        e.model.toLowerCase().includes(qLower) ||
        e.village.toLowerCase().includes(qLower) ||
        e.taluka.toLowerCase().includes(qLower) ||
        e.district.toLowerCase().includes(qLower) ||
        e.description.toLowerCase().includes(qLower) ||
        (e.specs.horsepower || '').toLowerCase().includes(qLower)
    );
  }
  if (maxDistance && Number(maxDistance) > 0) {
    items = items.filter((e) => (e.distanceKm ?? 0) <= Number(maxDistance));
  }
  if (maxPrice && Number(maxPrice) > 0) {
    items = items.filter((e) => e.price <= Number(maxPrice));
  }
  if (priceUnit && priceUnit !== 'all') {
    items = items.filter((e) => e.priceUnit === priceUnit);
  }
  if (minRating && Number(minRating) > 0) {
    items = items.filter((e) => e.ratingAvg >= Number(minRating));
  }
  if (date && date.trim()) {
    items = items.filter(
      (e) => e.available && (e.availableDates.length === 0 || e.availableDates.includes(date.trim()))
    );
  }

  if (sort === 'nearest') {
    items.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  } else if (sort === 'lowest_price') {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === 'highest_rated') {
    items.sort((a, b) => b.ratingAvg - a.ratingAvg);
  } else {
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  res.json({ equipment: items });
});

app.get('/api/equipment/:id', (req: Request, res: Response) => {
  const row = db.prepare('SELECT * FROM equipment WHERE id = ?').get(req.params.id);
  if (!row) {
    res.status(404).json({ error: 'Equipment not found.' });
    return;
  }
  const refLat = req.query.lat ? Number(req.query.lat) : 18.1517;
  const refLng = req.query.lng ? Number(req.query.lng) : 74.5768;
  const item = parseEquipmentRow(row);
  const reviews = db
    .prepare('SELECT * FROM reviews WHERE equipmentId = ? ORDER BY createdAt DESC')
    .all(req.params.id);
  res.json({
    equipment: { ...item, distanceKm: haversineDistanceKm(refLat, refLng, item.lat, item.lng) },
    reviews,
  });
});

app.post('/api/equipment', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const body = req.body as Record<string, any>;

  if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
    res.status(400).json({ error: 'Equipment name is required (min 3 characters).' });
    return;
  }
  const price = Number(body.price);
  if (!Number.isFinite(price) || price <= 0) {
    res.status(400).json({ error: 'Rental price must be greater than 0.' });
    return;
  }
  if (!['hour', 'day', 'acre', 'trip'].includes(body.priceUnit)) {
    res.status(400).json({ error: 'Invalid pricing unit.' });
    return;
  }
  if (!body.village || !body.taluka || !body.district) {
    res.status(400).json({ error: 'Village, taluka, and district are required.' });
    return;
  }

  const images = Array.isArray(body.images)
    ? body.images.filter((s: unknown) => typeof s === 'string' && s.trim().length > 0).slice(0, 6)
    : [];
  if (images.length === 0) {
    res.status(400).json({ error: 'Please include at least one equipment photo.' });
    return;
  }

  // Ensure owner role is activated on user profile
  if (!user.roles.includes('owner')) {
    const nextRoles = [...user.roles, 'owner'];
    db.prepare('UPDATE users SET roles = ? WHERE id = ?').run(JSON.stringify(nextRoles), user.id);
  }

  const id = `eq-${crypto.randomUUID().slice(0, 10)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO equipment (
      id, ownerId, ownerName, ownerVerified, category, title, brand, model, description,
      images, price, priceUnit, deliveryCharge, operatorIncluded, operatorCharge,
      village, taluka, district, state, lat, lng, available, availableDates,
      specs, rentalConditions, contactPhone, ratingAvg, reviewCount, isDemo, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, 0, 0, 0, ?, ?)
  `).run(
    id,
    user.id,
    user.name,
    user.isVerified ? 1 : 0,
    String(body.category || 'other'),
    body.title.trim().slice(0, 120),
    String(body.brand || '').trim().slice(0, 60),
    String(body.model || '').trim().slice(0, 60),
    String(body.description || '').trim().slice(0, 1500),
    JSON.stringify(images),
    price,
    body.priceUnit,
    Math.max(0, Number(body.deliveryCharge || 0)),
    body.operatorIncluded ? 1 : 0,
    Math.max(0, Number(body.operatorCharge || 0)),
    String(body.village).trim().slice(0, 80),
    String(body.taluka).trim().slice(0, 80),
    String(body.district).trim().slice(0, 80),
    String(body.state || 'Maharashtra').trim().slice(0, 60),
    Number(body.lat) || user.lat,
    Number(body.lng) || user.lng,
    JSON.stringify(Array.isArray(body.availableDates) ? body.availableDates.slice(0, 30) : []),
    JSON.stringify(typeof body.specs === 'object' && body.specs ? body.specs : {}),
    String(body.rentalConditions || '').trim().slice(0, 600),
    String(body.contactPhone || user.phone || '').trim().slice(0, 20),
    now,
    now
  );

  const created = db.prepare('SELECT * FROM equipment WHERE id = ?').get(id);
  res.status(201).json({ equipment: parseEquipmentRow(created) });
});

app.patch('/api/equipment/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM equipment WHERE id = ?').get(req.params.id) as any;
  if (!existing) {
    res.status(404).json({ error: 'Equipment not found.' });
    return;
  }
  if (existing.ownerId !== req.user!.id) {
    res.status(403).json({ error: 'Only the equipment owner can update this listing.' });
    return;
  }

  const body = req.body as Record<string, any>;
  const now = new Date().toISOString();

  const nextPrice = body.price !== undefined ? Number(body.price) : Number(existing.price);
  if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
    res.status(400).json({ error: 'Price must be positive.' });
    return;
  }

  db.prepare(`
    UPDATE equipment SET
      category = ?, title = ?, brand = ?, model = ?, description = ?,
      images = ?, price = ?, priceUnit = ?, deliveryCharge = ?,
      operatorIncluded = ?, operatorCharge = ?, village = ?, taluka = ?,
      district = ?, state = ?, lat = ?, lng = ?, available = ?,
      availableDates = ?, specs = ?, rentalConditions = ?, contactPhone = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    body.category ?? existing.category,
    typeof body.title === 'string' && body.title.trim() ? body.title.trim().slice(0, 120) : existing.title,
    typeof body.brand === 'string' ? body.brand.trim().slice(0, 60) : existing.brand,
    typeof body.model === 'string' ? body.model.trim().slice(0, 60) : existing.model,
    typeof body.description === 'string' ? body.description.trim().slice(0, 1500) : existing.description,
    Array.isArray(body.images) && body.images.length > 0 ? JSON.stringify(body.images.slice(0, 6)) : existing.images,
    nextPrice,
    ['hour', 'day', 'acre', 'trip'].includes(body.priceUnit) ? body.priceUnit : existing.priceUnit,
    body.deliveryCharge !== undefined ? Math.max(0, Number(body.deliveryCharge)) : existing.deliveryCharge,
    body.operatorIncluded !== undefined ? (body.operatorIncluded ? 1 : 0) : existing.operatorIncluded,
    body.operatorCharge !== undefined ? Math.max(0, Number(body.operatorCharge)) : existing.operatorCharge,
    typeof body.village === 'string' && body.village.trim() ? body.village.trim() : existing.village,
    typeof body.taluka === 'string' && body.taluka.trim() ? body.taluka.trim() : existing.taluka,
    typeof body.district === 'string' && body.district.trim() ? body.district.trim() : existing.district,
    typeof body.state === 'string' && body.state.trim() ? body.state.trim() : existing.state,
    body.lat !== undefined ? Number(body.lat) : existing.lat,
    body.lng !== undefined ? Number(body.lng) : existing.lng,
    body.available !== undefined ? (body.available ? 1 : 0) : existing.available,
    Array.isArray(body.availableDates) ? JSON.stringify(body.availableDates.slice(0, 30)) : existing.availableDates,
    body.specs && typeof body.specs === 'object' ? JSON.stringify(body.specs) : existing.specs,
    typeof body.rentalConditions === 'string' ? body.rentalConditions.trim() : existing.rentalConditions,
    typeof body.contactPhone === 'string' ? body.contactPhone.trim().slice(0, 20) : existing.contactPhone,
    now,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM equipment WHERE id = ?').get(req.params.id);
  res.json({ equipment: parseEquipmentRow(updated) });
});

app.delete('/api/equipment/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.prepare('SELECT ownerId FROM equipment WHERE id = ?').get(req.params.id) as any;
  if (!existing) {
    res.status(404).json({ error: 'Equipment not found.' });
    return;
  }
  if (existing.ownerId !== req.user!.id) {
    res.status(403).json({ error: 'Only the equipment owner can delete this listing.' });
    return;
  }
  db.prepare('DELETE FROM equipment WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- OVERLAP HELPER ---
function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function hasOverlappingAcceptedBooking(
  equipmentId: string,
  date: string,
  startTime: string,
  duration: number,
  priceUnit: string,
  excludeBookingId?: string
): boolean {
  const accepted = db
    .prepare(
      `SELECT id, startTime, duration, priceUnit FROM bookings
       WHERE equipmentId = ? AND date = ? AND status = 'accepted'`
    )
    .all(equipmentId, date) as any[];

  if (accepted.length === 0) return false;
  if (priceUnit === 'day' || accepted.some((b) => b.priceUnit === 'day')) {
    return accepted.some((b) => b.id !== excludeBookingId);
  }

  const reqStart = timeToMinutes(startTime);
  const reqHours = priceUnit === 'hour' ? Math.max(1, duration) : 3;
  const reqEnd = reqStart + reqHours * 60;

  for (const b of accepted) {
    if (b.id === excludeBookingId) continue;
    const bStart = timeToMinutes(b.startTime);
    const bHours = b.priceUnit === 'hour' ? Math.max(1, Number(b.duration)) : 3;
    const bEnd = bStart + bHours * 60;
    if (reqStart < bEnd && reqEnd > bStart) {
      return true;
    }
  }
  return false;
}

// --- BOOKINGS ROUTES ---
app.get('/api/bookings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.id;
  const role = req.query.role;

  let query = `
    SELECT b.*, CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as hasReview
    FROM bookings b
    LEFT JOIN reviews r ON r.bookingId = b.id
    WHERE b.renterId = ? OR b.ownerId = ?
    ORDER BY b.createdAt DESC
  `;
  let params: any[] = [uid, uid];

  if (role === 'owner') {
    query = `
      SELECT b.*, CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as hasReview
      FROM bookings b
      LEFT JOIN reviews r ON r.bookingId = b.id
      WHERE b.ownerId = ?
      ORDER BY b.createdAt DESC
    `;
    params = [uid];
  } else if (role === 'farmer') {
    query = `
      SELECT b.*, CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as hasReview
      FROM bookings b
      LEFT JOIN reviews r ON r.bookingId = b.id
      WHERE b.renterId = ?
      ORDER BY b.createdAt DESC
    `;
    params = [uid];
  }

  const rows = db.prepare(query).all(...params);
  res.json({ bookings: rows.map(parseBookingRow) });
});

app.post('/api/bookings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const body = req.body as Record<string, any>;

  const eqRow = db.prepare('SELECT * FROM equipment WHERE id = ?').get(body.equipmentId) as any;
  if (!eqRow) {
    res.status(404).json({ error: 'Selected equipment was not found.' });
    return;
  }
  const eq = parseEquipmentRow(eqRow);
  if (!eq.available) {
    res.status(400).json({ error: 'This equipment is currently unavailable for booking.' });
    return;
  }
  if (eq.ownerId === user.id) {
    res.status(400).json({ error: 'You cannot book your own equipment.' });
    return;
  }

  const date = String(body.date || '').trim();
  const startTime = String(body.startTime || '08:00').trim();
  const duration = Math.max(1, Number(body.duration || 1));
  const acres = Math.max(0.5, Number(body.acres || 1));
  const farmLocation = String(body.farmLocation || '').trim();
  const deliveryRequired = Boolean(body.deliveryRequired);
  const notes = String(body.notes || '').trim().slice(0, 500);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: 'Please select a valid booking date.' });
    return;
  }
  if (farmLocation.length < 3) {
    res.status(400).json({ error: 'Please enter your farm location or village.' });
    return;
  }

  if (hasOverlappingAcceptedBooking(eq.id, date, startTime, duration, eq.priceUnit)) {
    res.status(409).json({
      error: 'This machine already has a confirmed booking during that date and time window.',
    });
    return;
  }

  const quantity = eq.priceUnit === 'acre' ? acres : duration;
  const estimatedCost = Math.round(eq.price * quantity);
  const deliveryFee = deliveryRequired ? eq.deliveryCharge : 0;
  const operatorFee = eq.operatorIncluded ? eq.operatorCharge : 0;
  const additionalCharges = Math.round(deliveryFee + operatorFee);
  const totalCost = estimatedCost + additionalCharges;

  const id = `bk-${crypto.randomUUID().slice(0, 10)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO bookings (
      id, equipmentId, equipmentTitle, equipmentImage, equipmentCategory,
      renterId, renterName, renterPhone, ownerId, ownerName, ownerPhone,
      date, startTime, duration, priceUnit, acres, farmLocation, deliveryRequired,
      notes, estimatedCost, additionalCharges, totalCost, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
  `).run(
    id,
    eq.id,
    eq.title,
    eq.images[0] || '',
    eq.category,
    user.id,
    user.name,
    String(body.renterPhone || user.phone || '').trim().slice(0, 20),
    eq.ownerId,
    eq.ownerName,
    eq.contactPhone || '',
    date,
    startTime,
    duration,
    eq.priceUnit,
    acres,
    farmLocation.slice(0, 200),
    deliveryRequired ? 1 : 0,
    notes,
    estimatedCost,
    additionalCharges,
    totalCost,
    now,
    now
  );

  // Notify equipment owner
  db.prepare(`
    INSERT INTO notifications (id, userId, bookingId, title, message, type, isRead, createdAt)
    VALUES (?, ?, ?, ?, ?, 'booking_request', 0, ?)
  `).run(
    `ntf-${crypto.randomUUID().slice(0, 10)}`,
    eq.ownerId,
    id,
    'नवीन बुकिंग विनंती / New Booking Request',
    `${user.name} requested ${eq.title} on ${date} at ${farmLocation}.`,
    now
  );

  const created = db.prepare('SELECT *, 0 as hasReview FROM bookings WHERE id = ?').get(id);
  res.status(201).json({ booking: parseBookingRow(created) });
});

app.patch('/api/bookings/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.id;
  const { status } = req.body as { status?: string };
  const bookingRow = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id) as any;

  if (!bookingRow) {
    res.status(404).json({ error: 'Booking not found.' });
    return;
  }

  const current = bookingRow.status;
  if (!status || !['accepted', 'rejected', 'cancelled', 'completed'].includes(status)) {
    res.status(400).json({ error: 'Invalid booking status transition.' });
    return;
  }

  if (['rejected', 'cancelled', 'completed'].includes(current)) {
    res.status(400).json({ error: `Cannot change booking once it is ${current}.` });
    return;
  }

  if (status === 'accepted' || status === 'rejected') {
    if (bookingRow.ownerId !== uid) {
      res.status(403).json({ error: 'Only the equipment owner can accept or reject requests.' });
      return;
    }
    if (current !== 'pending') {
      res.status(400).json({ error: 'Only pending requests can be accepted or rejected.' });
      return;
    }
    if (
      status === 'accepted' &&
      hasOverlappingAcceptedBooking(
        bookingRow.equipmentId,
        bookingRow.date,
        bookingRow.startTime,
        Number(bookingRow.duration),
        bookingRow.priceUnit,
        bookingRow.id
      )
    ) {
      res.status(409).json({
        error: 'Cannot accept: another confirmed booking overlaps on this date and time.',
      });
      return;
    }
  } else if (status === 'completed') {
    if (bookingRow.ownerId !== uid) {
      res.status(403).json({ error: 'Only the equipment owner can mark a booking completed.' });
      return;
    }
    if (current !== 'accepted') {
      res.status(400).json({ error: 'Only accepted bookings can be marked completed.' });
      return;
    }
  } else if (status === 'cancelled') {
    if (bookingRow.renterId !== uid && bookingRow.ownerId !== uid) {
      res.status(403).json({ error: 'Unauthorized to cancel this booking.' });
      return;
    }
  }

  const now = new Date().toISOString();
  db.prepare('UPDATE bookings SET status = ?, updatedAt = ? WHERE id = ?').run(
    status,
    now,
    req.params.id
  );

  // Notify counterparty
  const targetUserId = uid === bookingRow.ownerId ? bookingRow.renterId : bookingRow.ownerId;
  const notifType = `booking_${status}`;
  const notifTitleMap: Record<string, string> = {
    accepted: 'बुकिंग मंजूर / Booking Accepted',
    rejected: 'बुकिंग नाकारले / Booking Rejected',
    cancelled: 'बुकिंग रद्द / Booking Cancelled',
    completed: 'काम पूर्ण / Booking Completed',
  };

  db.prepare(`
    INSERT INTO notifications (id, userId, bookingId, title, message, type, isRead, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?)
  `).run(
    `ntf-${crypto.randomUUID().slice(0, 10)}`,
    targetUserId,
    bookingRow.id,
    notifTitleMap[status] || 'Booking Update',
    `${bookingRow.equipmentTitle} (${bookingRow.date}) status updated to ${status}.`,
    notifType,
    now
  );

  const updated = db
    .prepare(
      `SELECT b.*, CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as hasReview
       FROM bookings b LEFT JOIN reviews r ON r.bookingId = b.id WHERE b.id = ?`
    )
    .get(req.params.id);
  res.json({ booking: parseBookingRow(updated) });
});

// --- REVIEWS ---
app.post('/api/reviews', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { bookingId, rating, comment } = req.body as {
    bookingId?: string;
    rating?: number;
    comment?: string;
  };

  if (!bookingId || typeof bookingId !== 'string') {
    res.status(400).json({ error: 'Booking ID is required.' });
    return;
  }

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId) as any;
  if (!booking) {
    res.status(404).json({ error: 'Booking not found.' });
    return;
  }
  if (booking.renterId !== user.id) {
    res.status(403).json({ error: 'Only the renter can review this booking.' });
    return;
  }
  if (booking.status !== 'completed') {
    res.status(400).json({ error: 'Reviews can only be submitted after booking completion.' });
    return;
  }
  const existingRev = db.prepare('SELECT id FROM reviews WHERE bookingId = ?').get(bookingId);
  if (existingRev) {
    res.status(409).json({ error: 'You have already reviewed this booking.' });
    return;
  }

  const numRating = Math.round(Number(rating));
  if (!Number.isFinite(numRating) || numRating < 1 || numRating > 5) {
    res.status(400).json({ error: 'Rating must be between 1 and 5 stars.' });
    return;
  }
  if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
    res.status(400).json({ error: 'Please write a short review comment.' });
    return;
  }

  const id = `rev-${crypto.randomUUID().slice(0, 10)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO reviews (id, equipmentId, bookingId, reviewerId, reviewerName, rating, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    booking.equipmentId,
    booking.id,
    user.id,
    user.name,
    numRating,
    comment.trim().slice(0, 1000),
    now
  );

  // Recalculate ratingAvg & reviewCount on equipment
  const stats = db
    .prepare('SELECT AVG(rating) as avgRating, COUNT(*) as total FROM reviews WHERE equipmentId = ?')
    .get(booking.equipmentId) as { avgRating: number; total: number };

  db.prepare('UPDATE equipment SET ratingAvg = ?, reviewCount = ? WHERE id = ?').run(
    Math.round((stats.avgRating || 0) * 10) / 10,
    stats.total || 0,
    booking.equipmentId
  );

  const created = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  res.status(201).json({ review: created });
});

// --- NOTIFICATIONS ---
app.get('/api/notifications', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const rows = db
    .prepare('SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 30')
    .all(req.user!.id) as any[];
  res.json({
    notifications: rows.map((n) => ({
      ...n,
      isRead: Boolean(n.isRead),
    })),
  });
});

app.post('/api/notifications/read-all', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  db.prepare('UPDATE notifications SET isRead = 1 WHERE userId = ?').run(req.user!.id);
  res.json({ success: true });
});

// --- START SERVER WITH VITE MIDDLEWARE ---
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FarmRent server running on http://localhost:${PORT}`);
  });
}

startServer();
