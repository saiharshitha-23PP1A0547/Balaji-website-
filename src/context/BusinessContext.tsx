import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
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
  updateField: (key: keyof typeof BUSINESS_CONFIG, value: any) => Promise<void>;
  updatePhoto: (key: string, url: string | null) => Promise<void>;
  updateMuttonItems: (items: MuttonItem[]) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  getWhatsAppLink: (message: string) => { url: string; isPlaceholder: boolean; encodedText: string };
  getPhoneCallLink: () => { url: string; isPlaceholder: boolean };
  getDirectionsLink: () => string;
  isOwnerHelperOpen: boolean;
  setIsOwnerHelperOpen: (open: boolean) => void;
  refreshFromFirestore: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<typeof BUSINESS_CONFIG>(BUSINESS_CONFIG);
  const [photos, setPhotos] = useState<Record<string, string | null>>(PHOTO_REGISTRY);
  const [muttonItems, setMuttonItems] = useState<MuttonItem[]>(DEFAULT_MUTTON_ITEMS);
  const [isOwnerHelperOpen, setIsOwnerHelperOpen] = useState(false);

  // Initialize Firestore seeding if empty
  const seedFirestoreIfNeeded = useCallback(async () => {
    try {
      const settingsRef = doc(db, 'shop', 'settings');
      const settingsSnap = await getDoc(settingsRef);
      if (!settingsSnap.exists()) {
        await setDoc(settingsRef, {
          ...BUSINESS_CONFIG,
          updatedAt: new Date().toISOString(),
        });
      }

      const productsRef = collection(db, 'products');
      const productsSnap = await getDocs(productsRef);
      if (productsSnap.empty) {
        for (const item of DEFAULT_MUTTON_ITEMS) {
          const itemRef = doc(db, 'products', item.id);
          await setDoc(itemRef, {
            ...item,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error('Error seeding initial Firestore data:', error);
    }
  }, []);

  const refreshFromFirestore = useCallback(async () => {
    try {
      await seedFirestoreIfNeeded();
      const settingsSnap = await getDoc(doc(db, 'shop', 'settings'));
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        setConfig((prev) => ({
          ...prev,
          ...data,
          SHOP_ADDRESS: data.SHOP_ADDRESS || data.address || prev.SHOP_ADDRESS,
          BUSINESS_ADDRESS: data.SHOP_ADDRESS || data.address || prev.SHOP_ADDRESS,
        }));
      }

      const productsSnap = await getDocs(collection(db, 'products'));
      if (!productsSnap.empty) {
        const items: MuttonItem[] = [];
        productsSnap.forEach((d) => {
          items.push(d.data() as MuttonItem);
        });
        if (items.length > 0) {
          setMuttonItems(items);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'shop/settings');
    }
  }, [seedFirestoreIfNeeded]);

  // Real-time onSnapshot synchronization across devices & PWA
  useEffect(() => {
    seedFirestoreIfNeeded();

    const unsubSettings = onSnapshot(
      doc(db, 'shop', 'settings'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setConfig((prev) => ({
            ...prev,
            ...data,
            SHOP_ADDRESS: data.SHOP_ADDRESS || data.address || prev.SHOP_ADDRESS,
            BUSINESS_ADDRESS: data.SHOP_ADDRESS || data.address || prev.SHOP_ADDRESS,
          }));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'shop/settings');
      }
    );

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const items: MuttonItem[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as MuttonItem);
        });
        if (items.length > 0) {
          setMuttonItems(items);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );

    return () => {
      unsubSettings();
      unsubProducts();
    };
  }, [seedFirestoreIfNeeded]);

  const updateField = async (key: keyof typeof BUSINESS_CONFIG, value: any) => {
    const next = { ...config, [key]: value };
    if (key === 'SHOP_ADDRESS') {
      next.BUSINESS_ADDRESS = value;
    } else if (key === 'BUSINESS_ADDRESS') {
      next.SHOP_ADDRESS = value;
    }
    setConfig(next);

    try {
      const settingsRef = doc(db, 'shop', 'settings');
      await updateDoc(settingsRef, {
        [key]: value,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      // If doc doesn't exist yet, setDoc
      try {
        const settingsRef = doc(db, 'shop', 'settings');
        await setDoc(settingsRef, { ...next, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'shop/settings');
      }
    }
  };

  const updatePhoto = async (key: string, url: string | null) => {
    setPhotos((prev) => ({
      ...prev,
      [key]: url,
    }));
    try {
      const settingsRef = doc(db, 'shop', 'settings');
      await setDoc(
        settingsRef,
        {
          photos: { ...photos, [key]: url },
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'shop/settings');
    }
  };

  const updateMuttonItems = async (newItems: MuttonItem[]) => {
    setMuttonItems(newItems);
    try {
      for (const item of newItems) {
        const itemRef = doc(db, 'products', item.id);
        await setDoc(
          itemRef,
          {
            ...item,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const resetToDefaults = async () => {
    setConfig(BUSINESS_CONFIG);
    setPhotos(PHOTO_REGISTRY);
    setMuttonItems(DEFAULT_MUTTON_ITEMS);
    try {
      const settingsRef = doc(db, 'shop', 'settings');
      await setDoc(settingsRef, {
        ...BUSINESS_CONFIG,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'shop/settings');
    }
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
        updateMuttonItems,
        resetToDefaults,
        getWhatsAppLink,
        getPhoneCallLink,
        getDirectionsLink,
        isOwnerHelperOpen,
        setIsOwnerHelperOpen,
        refreshFromFirestore,
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
