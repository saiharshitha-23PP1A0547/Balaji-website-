import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BUSINESS_CONFIG,
  PHOTO_REGISTRY,
  MuttonItem,
  DEFAULT_MUTTON_ITEMS,
  createWhatsAppUrl,
  createPhoneCallUrl,
  getDirectionsUrl,
} from '../config/businessConfig';

interface BusinessContextType {
  config: typeof BUSINESS_CONFIG;
  photos: Record<string, string | null>;
  muttonItems: MuttonItem[];
  updateField: (key: keyof typeof BUSINESS_CONFIG, value: any) => void;
  updatePhoto: (key: string, url: string | null) => void;
  resetToDefaults: () => void;
  getWhatsAppLink: (message: string) => { url: string; isPlaceholder: boolean; encodedText: string };
  getPhoneCallLink: () => { url: string; isPlaceholder: boolean };
  getDirectionsLink: () => string;
  isOwnerHelperOpen: boolean;
  setIsOwnerHelperOpen: (open: boolean) => void;
  refreshFromBackend: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<typeof BUSINESS_CONFIG>(BUSINESS_CONFIG);
  const [photos, setPhotos] = useState<Record<string, string | null>>(PHOTO_REGISTRY);
  const [muttonItems, setMuttonItems] = useState<MuttonItem[]>(DEFAULT_MUTTON_ITEMS);
  const [isOwnerHelperOpen, setIsOwnerHelperOpen] = useState(false);

  // Fetch live public configuration from backend server
  const refreshFromBackend = useCallback(async () => {
    try {
      const res = await fetch('/api/public/config');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig((prev) => ({
            ...prev,
            ...data.config,
            SHOP_ADDRESS: data.config.SHOP_ADDRESS || prev.SHOP_ADDRESS,
            BUSINESS_ADDRESS: data.config.SHOP_ADDRESS || prev.SHOP_ADDRESS,
          }));
        }
        if (Array.isArray(data.photos)) {
          const photoMap: Record<string, string | null> = { ...PHOTO_REGISTRY };
          data.photos.forEach((item: any) => {
            if (item.imageKey && item.customUrl) {
              photoMap[item.imageKey] = item.customUrl;
            }
          });
          setPhotos(photoMap);
        }
        if (Array.isArray(data.muttonItems) && data.muttonItems.length > 0) {
          setMuttonItems(data.muttonItems);
        }
      }
    } catch {
      // Offline fallback: keep static config
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();

    // Sync on window focus
    const handleFocus = () => refreshFromBackend();
    window.addEventListener('focus', handleFocus);

    // Periodic sync every 25 seconds
    const interval = setInterval(refreshFromBackend, 25000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [refreshFromBackend]);

  const updateField = (key: keyof typeof BUSINESS_CONFIG, value: any) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'SHOP_ADDRESS') {
        next.BUSINESS_ADDRESS = value;
      } else if (key === 'BUSINESS_ADDRESS') {
        next.SHOP_ADDRESS = value;
      }
      return next;
    });
  };

  const updatePhoto = (key: string, url: string | null) => {
    setPhotos((prev) => ({
      ...prev,
      [key]: url,
    }));
  };

  const resetToDefaults = () => {
    setConfig(BUSINESS_CONFIG);
    setPhotos(PHOTO_REGISTRY);
  };

  const getWhatsAppLink = (message: string) => {
    return createWhatsAppUrl(config.WHATSAPP_NUMBER, message);
  };

  const getPhoneCallLink = () => {
    return createPhoneCallUrl(config.PHONE_NUMBER);
  };

  const getDirectionsLink = () => {
    return getDirectionsUrl(config.GOOGLE_MAPS_URL);
  };

  return (
    <BusinessContext.Provider
      value={{
        config,
        photos,
        muttonItems,
        updateField,
        updatePhoto,
        resetToDefaults,
        getWhatsAppLink,
        getPhoneCallLink,
        getDirectionsLink,
        isOwnerHelperOpen,
        setIsOwnerHelperOpen,
        refreshFromBackend,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
