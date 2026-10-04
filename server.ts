import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'shop_data.json');

// Session configuration
const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_IDLE_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours idle timeout

export interface MuttonItem {
  id: string;
  name: string;
  pricePerKg: number | null;
  available: boolean;
  description: string;
  imageUrl?: string | null;
}

export const DEFAULT_MUTTON_ITEMS: MuttonItem[] = [
  {
    id: 'item-fresh-mutton',
    name: 'Fresh Mutton',
    pricePerKg: 1000,
    available: true,
    description: 'Prime daily fresh bone-in tender mutton, cleanly trimmed and weighed fresh upon order.',
    imageUrl: '/images/mutton.jpg',
  },
  {
    id: 'item-boti',
    name: 'Boti',
    pricePerKg: null,
    available: true,
    description: 'Fresh, cleaned and thoroughly washed boti prepared traditionally.',
    imageUrl: null,
  },
  {
    id: 'item-kallu',
    name: 'Kallu (Trotters)',
    pricePerKg: null,
    available: true,
    description: 'Fresh mutton trotters (paya), roasted and cleaned for traditional paya soup and rich gravy.',
    imageUrl: null,
  },
  {
    id: 'item-talakaya',
    name: 'Talakaya (Mutton Head)',
    pricePerKg: null,
    available: true,
    description: 'Fresh mutton head meat cleanly prepared, charred and cut per customer recipe.',
    imageUrl: null,
  },
  {
    id: 'item-liver',
    name: 'Liver',
    pricePerKg: null,
    available: true,
    description: 'Fresh, nutrient-rich tender mutton liver cut cleanly without excess moisture.',
    imageUrl: null,
  },
  {
    id: 'item-mutton-pieces',
    name: 'Mutton pieces',
    pricePerKg: null,
    available: true,
    description: 'Special choice cut mutton pieces selected for curry, fry, or biryani preparations.',
    imageUrl: null,
  },
  {
    id: 'item-custom-request',
    name: 'Other / Custom Request',
    pricePerKg: null,
    available: true,
    description: 'Special butcher requests, specific organs, ribs, or custom celebration orders.',
    imageUrl: null,
  },
];

interface Session {
  token: string;
  username: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  lastActive: number;
}

const activeSessions = new Map<string, Session>();

// Cryptographic Password Hashing Utilities
function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const candidateHash = hashPassword(password, salt);
    const candidateBuf = Buffer.from(candidateHash, 'hex');
    const expectedBuf = Buffer.from(expectedHash, 'hex');
    if (candidateBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(candidateBuf, expectedBuf);
  } catch {
    return false;
  }
}

// Initial Shop Data Structure
function getInitialShopData() {
  const initialSalt = generateSalt();
  const initialPassword = process.env.ADMIN_PASSWORD || 'Balaji@1980';
  const initialUsername = process.env.ADMIN_USERNAME || 'admin';

  return {
    adminUser: {
      username: initialUsername,
      email: 'admin@balajimuttonshop.com',
      salt: initialSalt,
      passwordHash: hashPassword(initialPassword, initialSalt),
      updatedAt: new Date().toISOString(),
    },
    config: {
      BUSINESS_NAME: 'Balaji Mutton Shop',
      PHONE_NUMBER: '+91 9XXXXXXXXX',
      WHATSAPP_NUMBER: '+91 9XXXXXXXXX',
      SHOP_ADDRESS: '[Shop Address, Landmark, City, State - PIN Code]',
      GOOGLE_MAPS_URL: 'https://maps.google.com/?q=Balaji+Mutton+Shop',
      OPENING_HOURS: 'Tuesday to Sunday: 7:00 AM – 1:30 PM & 5:00 PM – 8:30 PM | Monday: Limited / Call in advance',
      SHOP_STATUS: 'OPEN' as 'OPEN' | 'CLOSED' | 'SPECIAL HOURS',
      ANNOUNCEMENT_ENABLED: false,
      ANNOUNCEMENT_MESSAGE: 'Shop will be closed today due to a family function. We will reopen tomorrow at 7:00 AM.',
      REOPENING_DATE: '',
      REOPENING_TIME: '',
      SPECIAL_HOURS_MESSAGE: 'Open today: 7:00 AM – 1:30 PM only',
      MUTTON_PRICE_PER_KG: 1000,
      MUTTON_AVAILABLE: true,
      MUTTON_NOTICE: 'Daily Fresh Cut · Weighed and prepared fresh upon order',
    },
    orderSettings: {
      muttonTemplate: 'Hello Balaji Mutton Shop, I would like to order {quantity} of fresh mutton ({cut}). Estimated price: {price}. Customer: {customer}.',
      bulkTemplate: 'Hello Balaji Mutton Shop, I would like to place a bulk order for {occasion} on {date}. Requirement: {quantity}. Name: {name}, Phone: {phone}.',
      generalTemplate: 'Hello Balaji Mutton Shop, I would like to place an order.',
    },
    photos: [
      {
        id: 'legacy-founder',
        number: 1,
        title: 'Founder Kamtekar Eshwar Ji',
        category: 'Heritage',
        description: 'Our founder Kamtekar Eshwar Ji who established our family shop over 40 years ago.',
        placeholderLabel: 'Kamtekar Eshwar Ji (Founder Photo)',
        imageKey: 'founder',
        altText: 'Kamtekar Eshwar Ji founder of Balaji Mutton Shop',
        customUrl: null,
      },
      {
        id: 'shop-old',
        number: 2,
        title: 'Original Shop Front (1980s)',
        category: 'Heritage',
        description: 'Early days archival photo of our original shop premises and traditional weighing scale.',
        placeholderLabel: 'Old Shop Photo (1980s Archival)',
        imageKey: 'old-shop',
        altText: 'Historical photo of Balaji Mutton Shop in 1980s',
        customUrl: null,
      },
      {
        id: 'shop-current',
        number: 3,
        title: 'Current Shop Exterior',
        category: 'Shop',
        description: 'Our modern shop storefront welcoming customers with pristine cleanliness.',
        placeholderLabel: 'Current Balaji Mutton Shop Storefront',
        imageKey: 'current-shop',
        altText: 'Current exterior of Balaji Mutton Shop',
        customUrl: null,
      },
      {
        id: 'mutton-fresh',
        number: 4,
        title: 'Fresh Daily Cuts',
        category: 'Craft',
        description: 'Tender, fresh, healthy daily mutton cuts prepared according to traditional methods.',
        placeholderLabel: 'Fresh Mutton Daily Cut Display',
        imageKey: 'fresh-mutton',
        altText: 'Fresh healthy mutton cuts at Balaji Mutton Shop',
        customUrl: null,
      },
      {
        id: 'shop-interior',
        number: 5,
        title: 'Hygienic Interior & Cutting Area',
        category: 'Shop',
        description: 'Stainless steel sanitized preparation surfaces adhering to high cleanliness standards.',
        placeholderLabel: 'Clean Shop Interior & Sanitized Counters',
        imageKey: 'interior',
        altText: 'Clean preparation area inside Balaji Mutton Shop',
        customUrl: null,
      },
      {
        id: 'cutting-craft',
        number: 6,
        title: 'Traditional Cleaver Cutting',
        category: 'Craft',
        description: 'Decades of knife and cleaver precision cutting tailored to culinary dishes.',
        placeholderLabel: 'Traditional Cleaver Butchering Craft',
        imageKey: 'butchering',
        altText: 'Traditional butchering knife craft at Balaji Mutton Shop',
        customUrl: null,
      },
      {
        id: 'packing-hygiene',
        number: 7,
        title: 'Clean Food-Grade Packing',
        category: 'Craft',
        description: 'Careful food-grade packaging preserving freshness from counter to kitchen.',
        placeholderLabel: 'Clean Packaging & Careful Handling',
        imageKey: 'packaging',
        altText: 'Hygienic packaging for mutton orders at Balaji Mutton Shop',
        customUrl: null,
      },
      {
        id: 'livestock-goats',
        number: 8,
        title: 'Healthy Grazing Goats',
        category: 'Livestock',
        description: 'Active, healthy country goats directly sourced from trusted regional farms.',
        placeholderLabel: 'Healthy Live Goats on Farm / Pen',
        imageKey: 'live-goats',
        altText: 'Healthy live goats at Balaji Mutton Shop',
        customUrl: null,
      },
      {
        id: 'livestock-sheep',
        number: 9,
        title: 'Carefully Sourced Live Sheep',
        category: 'Livestock',
        description: 'Prime condition sheep selected specifically for major events, feasts, and rituals.',
        placeholderLabel: 'Prime Live Sheep Selection',
        imageKey: 'live-sheep',
        altText: 'Prime condition live sheep selection at Balaji Mutton Shop',
        customUrl: null,
      },
      {
        id: 'family-craftsmen',
        number: 10,
        title: 'Proprietors Badrinath & Shyam',
        category: 'Heritage',
        description: 'Current proprietors continuing our grandfather Kamtekar Eshwar Ji’s legacy.',
        placeholderLabel: 'Proprietors Kamtekar Badrinath & Shyam',
        imageKey: 'proprietors',
        altText: 'Proprietors Kamtekar Badrinath and Shyam at Balaji Mutton Shop',
        customUrl: null,
      },
      {
        id: 'bulk-functions',
        number: 11,
        title: 'Wedding & Celebration Orders',
        category: 'Events',
        description: 'Large-scale bulk orders prepared on time with consistent tenderness.',
        placeholderLabel: 'Special Occasion & Bulk Order Preparation',
        imageKey: 'bulk-orders',
        altText: 'Bulk mutton preparation for wedding celebrations at Balaji Mutton Shop',
        customUrl: null,
      },
    ],
    muttonItems: DEFAULT_MUTTON_ITEMS,
  };
}

// Persistent Storage Helpers
function loadShopData() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initial = getInitialShopData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    let dirty = false;

    if (!Array.isArray(data.muttonItems) || data.muttonItems.length === 0) {
      data.muttonItems = [...DEFAULT_MUTTON_ITEMS];
      dirty = true;
    }

    if (dirty) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
    return data;
  } catch (err) {
    console.error('Failed to parse shop_data.json, creating initial backup', err);
    const initial = getInitialShopData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function saveShopData(data: any) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Ensure database file is initialized at startup
loadShopData();

// Extract Session Token from Request
function extractSessionToken(req: Request): string | null {
  // Check cookie first
  if (req.cookies && req.cookies[SESSION_COOKIE_NAME]) {
    return req.cookies[SESSION_COOKIE_NAME];
  }
  // Check Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

// Authentication Middleware for Protected Admin Routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractSessionToken(req);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Authentication required to access admin resources' });
    return;
  }

  const session = activeSessions.get(token);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
    return;
  }

  const now = Date.now();
  if (now > session.expiresAt || (now - session.lastActive) > SESSION_IDLE_TIMEOUT_MS) {
    activeSessions.delete(token);
    res.clearCookie(SESSION_COOKIE_NAME);
    res.status(401).json({ error: 'Unauthorized: Session timed out due to inactivity' });
    return;
  }

  // Refresh activity
  session.lastActive = now;
  (req as any).adminSession = session;
  next();
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // -------------------------------------------------------------
  // Public APIs (No authentication required, zero secrets returned)
  // -------------------------------------------------------------
  app.get('/api/public/config', (_req: Request, res: Response) => {
    const data = loadShopData();
    res.json({
      config: data.config,
      photos: data.photos,
      orderSettings: data.orderSettings,
      muttonItems: data.muttonItems || DEFAULT_MUTTON_ITEMS,
    });
  });

  // -------------------------------------------------------------
  // Authentication Endpoints
  // -------------------------------------------------------------
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Username/Email and Password are required' });
      return;
    }

    const data = loadShopData();
    const stored = data.adminUser;

    const trimmedUser = username.trim().toLowerCase();
    const matchUser =
      trimmedUser === stored.username.toLowerCase() ||
      trimmedUser === stored.email.toLowerCase();

    if (!matchUser) {
      res.status(401).json({ error: 'Invalid admin credentials' });
      return;
    }

    const isValid = verifyPassword(password, stored.salt, stored.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid admin credentials' });
      return;
    }

    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const session: Session = {
      token,
      username: stored.username,
      email: stored.email,
      createdAt: now,
      expiresAt: now + SESSION_TTL_MS,
      lastActive: now,
    };

    activeSessions.set(token, session);

    // Set secure HTTP-only cookie
    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'strict',
      maxAge: SESSION_TTL_MS,
      path: '/',
    });

    res.json({
      success: true,
      token,
      user: {
        username: stored.username,
        email: stored.email,
      },
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const token = extractSessionToken(req);
    if (token) {
      activeSessions.delete(token);
    }
    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    res.json({ success: true, message: 'Logged out successfully' });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const token = extractSessionToken(req);
    if (!token) {
      res.status(401).json({ authenticated: false });
      return;
    }

    const session = activeSessions.get(token);
    if (!session) {
      res.status(401).json({ authenticated: false });
      return;
    }

    const now = Date.now();
    if (now > session.expiresAt || (now - session.lastActive) > SESSION_IDLE_TIMEOUT_MS) {
      activeSessions.delete(token);
      res.clearCookie(SESSION_COOKIE_NAME);
      res.status(401).json({ authenticated: false, reason: 'Session expired' });
      return;
    }

    session.lastActive = now;
    res.json({
      authenticated: true,
      user: {
        username: session.username,
        email: session.email,
      },
    });
  });

  // -------------------------------------------------------------
  // Protected Admin APIs (All require valid session)
  // -------------------------------------------------------------
  app.get('/api/admin/config', requireAdminAuth, (_req: Request, res: Response) => {
    const data = loadShopData();
    res.json({
      config: data.config,
      photos: data.photos,
      orderSettings: data.orderSettings,
      muttonItems: data.muttonItems || DEFAULT_MUTTON_ITEMS,
    });
  });

  app.put('/api/admin/config', requireAdminAuth, (req: Request, res: Response) => {
    const { config: updatedConfig, orderSettings: updatedOrderSettings, muttonItems: updatedMuttonItems } = req.body;

    const data = loadShopData();
    if (updatedConfig && typeof updatedConfig === 'object') {
      data.config = {
        ...data.config,
        ...updatedConfig,
      };
    }

    if (updatedOrderSettings && typeof updatedOrderSettings === 'object') {
      data.orderSettings = {
        ...data.orderSettings,
        ...updatedOrderSettings,
      };
    }

    if (Array.isArray(updatedMuttonItems)) {
      data.muttonItems = updatedMuttonItems;
      const freshMutton = updatedMuttonItems.find(
        (i: any) => i.id === 'item-fresh-mutton' || (i.name && i.name.toLowerCase() === 'fresh mutton')
      );
      if (freshMutton && typeof freshMutton.pricePerKg === 'number' && freshMutton.pricePerKg > 0) {
        data.config.MUTTON_PRICE_PER_KG = freshMutton.pricePerKg;
      }
    }

    saveShopData(data);

    res.json({
      success: true,
      message: 'Shop settings updated successfully',
      config: data.config,
      orderSettings: data.orderSettings,
      muttonItems: data.muttonItems,
    });
  });

  // Dedicated Mutton Items CRUD APIs
  app.get('/api/admin/mutton-items', requireAdminAuth, (_req: Request, res: Response) => {
    const data = loadShopData();
    res.json({ muttonItems: data.muttonItems || DEFAULT_MUTTON_ITEMS });
  });

  app.put('/api/admin/mutton-items', requireAdminAuth, (req: Request, res: Response) => {
    const { muttonItems } = req.body;
    if (!Array.isArray(muttonItems)) {
      res.status(400).json({ error: 'muttonItems must be an array' });
      return;
    }
    const data = loadShopData();
    data.muttonItems = muttonItems;
    const freshMutton = muttonItems.find(
      (i: any) => i.id === 'item-fresh-mutton' || (i.name && i.name.toLowerCase() === 'fresh mutton')
    );
    if (freshMutton && typeof freshMutton.pricePerKg === 'number' && freshMutton.pricePerKg > 0) {
      data.config.MUTTON_PRICE_PER_KG = freshMutton.pricePerKg;
    }
    saveShopData(data);
    res.json({ success: true, message: 'Mutton items updated successfully', muttonItems: data.muttonItems });
  });

  app.post('/api/admin/mutton-items', requireAdminAuth, (req: Request, res: Response) => {
    const { name, pricePerKg, available, description, imageUrl } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Item name is required' });
      return;
    }
    const data = loadShopData();
    if (!Array.isArray(data.muttonItems)) {
      data.muttonItems = [...DEFAULT_MUTTON_ITEMS];
    }
    const parsedPrice = pricePerKg === null || pricePerKg === '' || pricePerKg === undefined
      ? null
      : (Number(pricePerKg) > 0 ? Number(pricePerKg) : null);

    const newItem: MuttonItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      pricePerKg: parsedPrice,
      available: available !== undefined ? Boolean(available) : true,
      description: (description && typeof description === 'string') ? description.trim() : '',
      imageUrl: (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) ? imageUrl.trim() : null,
    };

    data.muttonItems.push(newItem);
    saveShopData(data);
    res.json({ success: true, message: 'Mutton item added successfully', item: newItem, muttonItems: data.muttonItems });
  });

  app.put('/api/admin/mutton-items/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, pricePerKg, available, description, imageUrl } = req.body;
    const data = loadShopData();
    if (!Array.isArray(data.muttonItems)) {
      data.muttonItems = [...DEFAULT_MUTTON_ITEMS];
    }
    const idx = data.muttonItems.findIndex((i: any) => i.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Mutton item not found' });
      return;
    }
    const current = { ...data.muttonItems[idx] };
    if (name !== undefined && typeof name === 'string' && name.trim()) {
      current.name = name.trim();
    }
    if (pricePerKg !== undefined) {
      current.pricePerKg = pricePerKg === null || pricePerKg === ''
        ? null
        : (Number(pricePerKg) > 0 ? Number(pricePerKg) : null);
    }
    if (available !== undefined) {
      current.available = Boolean(available);
    }
    if (description !== undefined) {
      current.description = String(description).trim();
    }
    if (imageUrl !== undefined) {
      current.imageUrl = imageUrl && String(imageUrl).trim() ? String(imageUrl).trim() : null;
    }

    if (current.id === 'item-fresh-mutton' || (current.name && current.name.toLowerCase() === 'fresh mutton')) {
      if (typeof current.pricePerKg === 'number' && current.pricePerKg > 0) {
        data.config.MUTTON_PRICE_PER_KG = current.pricePerKg;
      }
    }

    data.muttonItems[idx] = current;
    saveShopData(data);
    res.json({ success: true, message: 'Mutton item updated successfully', item: current, muttonItems: data.muttonItems });
  });

  app.delete('/api/admin/mutton-items/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const data = loadShopData();
    if (!Array.isArray(data.muttonItems)) {
      data.muttonItems = [...DEFAULT_MUTTON_ITEMS];
    }
    const idx = data.muttonItems.findIndex((i: any) => i.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Mutton item not found' });
      return;
    }
    const deleted = data.muttonItems.splice(idx, 1)[0];
    saveShopData(data);
    res.json({ success: true, message: 'Mutton item deleted successfully', deleted, muttonItems: data.muttonItems });
  });

  app.get('/api/admin/photos', requireAdminAuth, (_req: Request, res: Response) => {
    const data = loadShopData();
    res.json({ photos: data.photos || [] });
  });

  app.put('/api/admin/photos', requireAdminAuth, (req: Request, res: Response) => {
    const { photos } = req.body;
    if (!Array.isArray(photos)) {
      res.status(400).json({ error: 'Photos must be an array' });
      return;
    }

    const data = loadShopData();
    data.photos = photos;
    saveShopData(data);

    res.json({ success: true, message: 'Photos updated successfully', photos: data.photos });
  });

  app.put('/api/admin/photos/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const patch = req.body;

    const data = loadShopData();
    const idx = (data.photos || []).findIndex((p: any) => p.id === id);

    if (idx === -1) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }

    data.photos[idx] = { ...data.photos[idx], ...patch };
    saveShopData(data);

    res.json({ success: true, photo: data.photos[idx] });
  });

  app.put('/api/admin/security/credentials', requireAdminAuth, (req: Request, res: Response) => {
    const { currentPassword, newUsername, newEmail, newPassword } = req.body;

    if (!currentPassword || typeof currentPassword !== 'string') {
      res.status(400).json({ error: 'Current password is required to make security changes' });
      return;
    }

    const data = loadShopData();
    const stored = data.adminUser;

    if (!verifyPassword(currentPassword, stored.salt, stored.passwordHash)) {
      res.status(403).json({ error: 'Current password does not match' });
      return;
    }

    if (newUsername && typeof newUsername === 'string' && newUsername.trim().length >= 3) {
      stored.username = newUsername.trim();
    }

    if (newEmail && typeof newEmail === 'string' && newEmail.includes('@')) {
      stored.email = newEmail.trim().toLowerCase();
    }

    if (newPassword && typeof newPassword === 'string') {
      if (newPassword.length < 6) {
        res.status(400).json({ error: 'New password must be at least 6 characters long' });
        return;
      }
      const newSalt = generateSalt();
      stored.salt = newSalt;
      stored.passwordHash = hashPassword(newPassword, newSalt);
    }

    stored.updatedAt = new Date().toISOString();
    saveShopData(data);

    res.json({
      success: true,
      message: 'Admin security credentials updated successfully',
      user: {
        username: stored.username,
        email: stored.email,
      },
    });
  });

  // -------------------------------------------------------------
  // Frontend Serving (Vite in Dev Mode / Static build in Prod)
  // -------------------------------------------------------------
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      try {
        const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Balaji Mutton Shop] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal: Failed to start Balaji Mutton Shop server:', err);
  process.exit(1);
});
