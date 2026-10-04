/**
 * BALAJI MUTTON SHOP - Centralized Business Configuration & Settings
 * ==================================================================
 * 
 * Update your real business information and photo paths here.
 * These centralized values are used across the entire website.
 */

export interface GoatOrSheepItem {
  id: string;
  title: string;
  breedOrType: string;
  availability: string;
  approximateWeight: string;
  age: string;
  gender: string;
  priceNotice: string;
  description: string;
  imagePlaceholderTitle: string;
  imagePlaceholderNote: string;
  imageKey: string;
}

export interface GalleryItem {
  id: string;
  number: number;
  title: string;
  category: 'Heritage' | 'Shop' | 'Craft' | 'Livestock' | 'Events';
  description: string;
  placeholderLabel: string;
  imageKey: string;
  altText: string;
}

export interface CustomerReviewItem {
  id: string;
  customerNamePlaceholder: string;
  occasion: string;
  reviewPlaceholder: string;
  datePlaceholder: string;
}

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

// ==================================================================
// 1. PRIMARY BUSINESS SETTINGS (Requested Exact Variables)
// ==================================================================
export const BUSINESS_CONFIG = {
  // Exact required configuration variables
  BUSINESS_NAME: 'Balaji Mutton Shop',
  PHONE_NUMBER: '+91 9XXXXXXXXX', // [INSERT REAL PHONE NUMBER] e.g. '+91 9876543210'
  WHATSAPP_NUMBER: '+91 9XXXXXXXXX', // [INSERT WHATSAPP NUMBER] e.g. '+91 9876543210'
  SHOP_ADDRESS: '[Shop Address, Landmark, City, State - PIN Code]', // [INSERT FULL SHOP ADDRESS]
  GOOGLE_MAPS_URL: 'https://maps.google.com/?q=Balaji+Mutton+Shop', // [PASTE GOOGLE MAPS LINK]
  OPENING_HOURS: 'Tuesday to Sunday: 7:00 AM – 1:30 PM & 5:00 PM – 8:30 PM | Monday: Limited / Call in advance', // [INSERT OPENING HOURS]

  // ==================================================================
  // SHOP STATUS & ANNOUNCEMENT SYSTEM (Temporary Closures & Special Timings)
  // ==================================================================
  SHOP_STATUS: 'OPEN' as 'OPEN' | 'CLOSED' | 'SPECIAL HOURS',
  ANNOUNCEMENT_ENABLED: false, // Set to true to display announcement banner
  ANNOUNCEMENT_MESSAGE:
    'Shop will be closed today due to a family function. We will reopen tomorrow with fresh morning cuts.',
  REOPENING_DATE: 'Tomorrow', // e.g. "Tomorrow" or "Monday, 6 Oct"
  REOPENING_TIME: '7:00 AM', // e.g. "7:00 AM"
  SPECIAL_HOURS: 'Open today: 8:00 AM – 2:00 PM', // For "SPECIAL HOURS" status

  // Backward compatibility alias for SHOP_ADDRESS
  BUSINESS_ADDRESS: '[Shop Address, Landmark, City, State - PIN Code]',
  CITY: 'Local Market',
  STATE: '',
  POSTAL_CODE: '',

  // Generational Lineage & Story
  FOUNDER: 'Kamtekar Eshwar Ji',
  PROPRIETORS: 'Kamtekar Badrinath & Shyam',
  EXPERIENCE_YEARS: '40+',
  BRAND_MESSAGE: '40+ Years of Trust & Tradition',
  TAGLINE: 'From Our Family Legacy to Your Family Table.',
  BADGE_TEXT: 'Serving Our Community for 40+ Years',
  HERO_SUBTITLE: 'A family legacy built on quality, freshness and the trust of our local community.',
  LEGACY_STORY:
    'Balaji Mutton Shop carries a legacy that began with our grandfather, Kamtekar Eshwar Ji. Over four decades, his name became known and respected in the local community through quality, freshness and honest service. Today, Proprietors Kamtekar Badrinath & Shyam continue that family legacy, carrying forward the values and trust built over generations.',

  // Product Rates & Currency
  MUTTON_PRICE_PER_KG: 1000,
  CURRENCY_SYMBOL: '₹',
  PRICE_DISCLAIMER:
    'Prices and availability may change. Please confirm the final price before placing your order.',
  GOAT_SHEEP_PRICE_DISCLAIMER:
    'Final pricing for goats and sheep depends on current availability, size/weight and market conditions. Please contact us for confirmation.',
};

// ==================================================================
// 2. REAL PHOTO REGISTRY & FILE PATH MAPPINGS
// ==================================================================
// When real photos are uploaded into /public/images/ (or pasted as URLs),
// they automatically appear in these sections.
export const PHOTO_REGISTRY: Record<string, string | null> = {
  // 1. Homepage Hero Photo
  hero: '/images/hero.jpg',

  // 2. Our Legacy Section Photos
  legacy_grandfather: '/images/grandfather.jpg',
  legacy_old_shop: '/images/old_shop.jpg',
  legacy_current_shop: '/images/current_shop.jpg',
  legacy_family: '/images/family.jpg',

  // 3. Fresh Mutton Section
  fresh_mutton: '/images/mutton.jpg',

  // 4. Live Goats Section
  live_goat_standard: '/images/goat_1.jpg',
  live_goat_festival: '/images/goat_2.jpg',

  // 5. Live Sheep Section
  live_sheep_standard: '/images/sheep_1.jpg',
  live_sheep_bulk: '/images/sheep_2.jpg',

  // 6. Gallery Section (11 slots)
  gallery_1: '/images/gallery_1.jpg',
  gallery_2: '/images/gallery_2.jpg',
  gallery_3: '/images/gallery_3.jpg',
  gallery_4: '/images/gallery_4.jpg',
  gallery_5: '/images/gallery_5.jpg',
  gallery_6: '/images/gallery_6.jpg',
  gallery_7: '/images/gallery_7.jpg',
  gallery_8: '/images/gallery_8.jpg',
  gallery_9: '/images/gallery_9.jpg',
  gallery_10: '/images/gallery_10.jpg',
  gallery_11: '/images/gallery_11.jpg',
};

// Cutting Preferences for Fresh Mutton
export const CUTTING_PREFERENCES = [
  { id: 'curry-cut', label: 'Curry Cut (Standard medium bone-in pieces)' },
  { id: 'biryani-cut', label: 'Biryani Cut (Large tender bone-in cuts)' },
  { id: 'boneless', label: 'Boneless (Cleanly trimmed premium pieces)' },
  { id: 'keema', label: 'Keema / Fresh Minced' },
  { id: 'chops-ribs', label: 'Ribs & Chops (Special selection)' },
  { id: 'soup-bones', label: 'Soup Bone / Paya & Marrow Cuts' },
  { id: 'custom', label: 'Custom Specification (Mention in requirements)' },
];

// Occasions for Bulk Orders
export const OCCASIONS = [
  { id: 'birthdays', title: 'Birthdays', icon: '🎂', note: 'Family feast & get-together orders' },
  { id: 'weddings', title: 'Weddings', icon: '💍', note: 'Large volume banquet supply' },
  { id: 'family-functions', title: 'Family Functions', icon: '🎉', note: 'Engagements, anniversaries & poojas' },
  { id: 'festivals', title: 'Festivals', icon: '🪔', note: 'Dussehra, Diwali, Sankranti & Eid batches' },
  { id: 'parties', title: 'Parties', icon: '🥳', note: 'Weekend gatherings & celebrations' },
  { id: 'large-gatherings', title: 'Large Gatherings', icon: '🍽️', note: 'Community lunches & caterers' },
];

// Why Choose Us
export const WHY_CHOOSE_US = [
  {
    title: '40+ Years of Legacy',
    description:
      'Founded by Kamtekar Eshwar Ji, four decades of generational experience in selecting and preparing healthy livestock.',
    iconName: 'Award',
  },
  {
    title: 'Fresh Quality',
    description:
      'Prepared daily in hygienic surroundings. Strictly fresh meat with zero frozen or stale stock.',
    iconName: 'Sparkles',
  },
  {
    title: 'Trusted Local Name',
    description:
      'Built entirely on the word-of-mouth trust of our local neighborhood families and long-standing patrons.',
    iconName: 'Users',
  },
  {
    title: 'Family-Owned Business',
    description:
      'Directly supervised and managed by proprietors Kamtekar Badrinath & Shyam with personal accountability.',
    iconName: 'ShieldCheck',
  },
  {
    title: 'Custom Orders',
    description:
      'Custom cut to your exact preference—curry pieces, biryani cuts, boneless, keema, or traditional preparations.',
    iconName: 'Scissors',
  },
  {
    title: 'Special & Bulk Orders',
    description:
      'Equipped to fulfill large advance requirements for weddings, family celebrations, and religious festivals with timely coordination.',
    iconName: 'ShoppingBag',
  },
];

// Live Goats Catalog
export const LIVE_GOATS: GoatOrSheepItem[] = [
  {
    id: 'goat-standard',
    title: 'Selected Country Goats (Desi Bakra)',
    breedOrType: 'Country / Local Reared',
    availability: 'Available on Enquiry',
    approximateWeight: 'Contact us for current weight range',
    age: 'Contact us for age details',
    gender: 'Male / Female on request',
    priceNotice: 'Contact us for current availability and pricing.',
    description:
      'Naturally grazed, healthy live goats suited for regular household consumption, private functions, and special religious occasions.',
    imagePlaceholderTitle: 'Live Goat Selection',
    imagePlaceholderNote: 'Real photograph of available live goats',
    imageKey: 'live_goat_standard',
  },
  {
    id: 'goat-function',
    title: 'Event & Festival Goats',
    breedOrType: 'Selected Festive Livestock',
    availability: 'Advance Enquiry Recommended',
    approximateWeight: 'Various sizes available upon inspection',
    age: 'Contact us for age verification',
    gender: 'Selected Males',
    priceNotice: 'Contact us for current availability and pricing.',
    description:
      'Specially examined, well-fed livestock ideal for wedding banquets, family ceremonies, and festive community gatherings.',
    imagePlaceholderTitle: 'Special Festive Livestock',
    imagePlaceholderNote: 'Real photograph of festive livestock',
    imageKey: 'live_goat_festival',
  },
];

// Live Sheep Catalog
export const LIVE_SHEEP: GoatOrSheepItem[] = [
  {
    id: 'sheep-standard',
    title: 'Selected Healthy Sheep (Menda)',
    breedOrType: 'Traditional Farm Reared',
    availability: 'Available on Enquiry',
    approximateWeight: 'Contact us for current weight range',
    age: 'Contact us for age details',
    gender: 'Male / Female on request',
    priceNotice: 'Contact us for current availability and pricing.',
    description:
      'Prime condition live sheep sourced from trustworthy local breeders. Handpicked for quality meat yield and vitality.',
    imagePlaceholderTitle: 'Live Sheep Selection',
    imagePlaceholderNote: 'Real photograph of available live sheep',
    imageKey: 'live_sheep_standard',
  },
  {
    id: 'sheep-bulk',
    title: 'Celebration & Catering Sheep Batches',
    breedOrType: 'Selected Livestock Batches',
    availability: 'Advance Booking Required',
    approximateWeight: 'Assorted weight categories on request',
    age: 'Inspected upon arrival',
    gender: 'Specified per order',
    priceNotice: 'Contact us for current availability and pricing.',
    description:
      'Available for bulk festival procurement, catering contractors, and large-scale domestic family banquets.',
    imagePlaceholderTitle: 'Bulk Sheep Supply',
    imagePlaceholderNote: 'Real photograph of livestock batch',
    imageKey: 'live_sheep_bulk',
  },
];

// 11 Gallery Items
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-founder',
    number: 1,
    title: 'Kamtekar Eshwar Ji',
    category: 'Heritage',
    description: 'Founder of Balaji Mutton Shop. Over 40 years ago, his standard of honesty and quality established our family name.',
    placeholderLabel: 'Kamtekar Eshwar Ji (Founder Portrait)',
    imageKey: 'gallery_1',
    altText: 'Kamtekar Eshwar Ji - Founder of Balaji Mutton Shop with 40+ years legacy',
  },
  {
    id: 'gal-old-shop',
    number: 2,
    title: 'Original / Old Shop',
    category: 'Heritage',
    description: 'Our original premises where the Balaji Mutton Shop tradition first began with our grandfather.',
    placeholderLabel: 'Original Shopfront & Archives',
    imageKey: 'gallery_2',
    altText: 'Original Balaji Mutton Shop historical premises',
  },
  {
    id: 'gal-current-shop',
    number: 3,
    title: 'Current Shop',
    category: 'Shop',
    description: 'Our well-maintained, hygienic modern storefront serving regular and festive orders daily.',
    placeholderLabel: 'Current Shopfront & Counter',
    imageKey: 'gallery_3',
    altText: 'Balaji Mutton Shop current storefront and hygienic butcher counter',
  },
  {
    id: 'gal-fresh-mutton',
    number: 4,
    title: 'Fresh Mutton',
    category: 'Craft',
    description: 'Daily fresh cut meat prepared with hygiene, correct temperature and clean trimming.',
    placeholderLabel: 'Fresh Mutton Cuts Display',
    imageKey: 'gallery_4',
    altText: 'Fresh daily mutton cuts display at Balaji Mutton Shop',
  },
  {
    id: 'gal-interior',
    number: 5,
    title: 'Shop Interior',
    category: 'Shop',
    description: 'Clean stainless preparation stations and hygienic environment maintained to strict family standards.',
    placeholderLabel: 'Clean Shop Interior & Workstation',
    imageKey: 'gallery_5',
    altText: 'Balaji Mutton Shop interior and stainless steel preparation area',
  },
  {
    id: 'gal-cutting',
    number: 6,
    title: 'Expert Cutting',
    category: 'Craft',
    description: 'Generational butcher skill ensuring clean cuts, consistent portion sizes, and bone-to-meat balance.',
    placeholderLabel: 'Master Butcher Cutting Technique',
    imageKey: 'gallery_6',
    altText: 'Master butcher traditional cutting technique at Balaji Mutton Shop',
  },
  {
    id: 'gal-packing',
    number: 7,
    title: 'Hygienic Packing',
    category: 'Craft',
    description: 'Careful food-grade packaging that keeps meat fresh and clean during travel to your home kitchen.',
    placeholderLabel: 'Fresh Packing & Weighing Counter',
    imageKey: 'gallery_7',
    altText: 'Hygienic packaging and honest weighing counter',
  },
  {
    id: 'gal-goats',
    number: 8,
    title: 'Live Goats',
    category: 'Livestock',
    description: 'Healthy, actively grazing live goats inspected before being brought to our holding sheds.',
    placeholderLabel: 'Live Goats in Holding Care',
    imageKey: 'gallery_8',
    altText: 'Healthy live goats available at Balaji Mutton Shop',
  },
  {
    id: 'gal-sheep',
    number: 9,
    title: 'Live Sheep',
    category: 'Livestock',
    description: 'Carefully chosen sheep available for private customers, events, and festival requirements.',
    placeholderLabel: 'Live Sheep Livestock',
    imageKey: 'gallery_9',
    altText: 'Live sheep livestock for functions and celebrations',
  },
  {
    id: 'gal-family',
    number: 10,
    title: 'Family & Proprietors',
    category: 'Heritage',
    description: 'Kamtekar Badrinath & Shyam continuing the 40+ year legacy with the same dedication to community trust.',
    placeholderLabel: 'Kamtekar Family & Proprietors',
    imageKey: 'gallery_10',
    altText: 'Proprietors Kamtekar Badrinath and Shyam of Balaji Mutton Shop',
  },
  {
    id: 'gal-bulk',
    number: 11,
    title: 'Special & Bulk Orders',
    category: 'Events',
    description: 'Large scale orders prepared with prompt delivery and consistent quality for weddings and celebrations.',
    placeholderLabel: 'Bulk Event Preparation & Delivery',
    imageKey: 'gallery_11',
    altText: 'Bulk mutton preparation for wedding and celebration catering',
  },
];

// Customer Reviews - Authentic Placeholders
export const REVIEWS_PLACEHOLDERS: CustomerReviewItem[] = [
  {
    id: 'rev-1',
    customerNamePlaceholder: '[Customer Name Placeholder]',
    occasion: 'Regular Household Requirement',
    reviewPlaceholder:
      'Add genuine customer review here. Space reserved for long-standing family customer feedback regarding mutton tenderness, freshness, and clean cutting.',
    datePlaceholder: 'Verified Patron',
  },
  {
    id: 'rev-2',
    customerNamePlaceholder: '[Customer Name Placeholder]',
    occasion: 'Wedding Celebration Order',
    reviewPlaceholder:
      'Add genuine customer review here. Space reserved for wedding / banquet organizer review regarding on-time bulk order fulfillment and mutton quality.',
    datePlaceholder: 'Event Host',
  },
  {
    id: 'rev-3',
    customerNamePlaceholder: '[Customer Name Placeholder]',
    occasion: 'Festival / Special Function',
    reviewPlaceholder:
      'Add genuine customer review here. Space reserved for community member feedback regarding honest weighing, live goat/sheep selection, and courteous service.',
    datePlaceholder: 'Community Member',
  },
];

/**
 * Utility functions for Phone, WhatsApp and Maps links
 */
export function sanitizePhoneForLink(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function isConfigPlaceholder(value: string): boolean {
  return (
    !value ||
    value.includes('XXXXXXXXXX') ||
    value.includes('[INSERT') ||
    value.includes('[PASTE') ||
    value.includes('placeholder')
  );
}

export function createWhatsAppUrl(
  phone: string,
  message: string
): { url: string; isPlaceholder: boolean; encodedText: string } {
  const isPlaceholder = isConfigPlaceholder(phone);
  const cleanNumber = sanitizePhoneForLink(phone);
  const encodedText = encodeURIComponent(message);
  
  const url = cleanNumber.length >= 8
    ? `https://wa.me/${cleanNumber}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  return { url, isPlaceholder, encodedText };
}

export function createPhoneCallUrl(phone: string): { url: string; isPlaceholder: boolean } {
  const isPlaceholder = isConfigPlaceholder(phone);
  const clean = phone.replace(/[^0-9+]/g, '');
  return {
    url: isPlaceholder ? 'tel:+919000000000' : `tel:${clean}`,
    isPlaceholder,
  };
}

export function getDirectionsUrl(mapsUrl?: string): string {
  if (mapsUrl && !mapsUrl.includes('[PASTE')) {
    return mapsUrl;
  }
  return 'https://maps.google.com/?q=Balaji+Mutton+Shop';
}
