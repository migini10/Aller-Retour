'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type QRStyle = 'squares' | 'dots';

export interface BrandingConfig {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  qrStyle: QRStyle;
  qrEyeRadius: number;
  qrPadding: number;
}

const defaultBranding: BrandingConfig = {
  logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AG&backgroundColor=EA580C&textColor=ffffff',
  primaryColor: '#EA580C', // Orange 600
  secondaryColor: '#000000', // Noir pour bon contraste QR
  qrStyle: 'dots',
  qrEyeRadius: 8,
  qrPadding: 16,
};

interface BrandingContextProps {
  branding: BrandingConfig;
  setBranding: React.Dispatch<React.SetStateAction<BrandingConfig>>;
}

const BrandingContext = createContext<BrandingContextProps>({
  branding: defaultBranding,
  setBranding: () => {},
});

export const BrandingProvider = ({ children }: { children: React.ReactNode }) => {
  const [branding, setBranding] = useState<BrandingConfig>(defaultBranding);

  // Hydration from LocalStorage for persistence across reloads in BackOffice
  useEffect(() => {
    const saved = localStorage.getItem('allerRetourBranding');
    if (saved) {
      try {
        setBranding(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse branding config', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('allerRetourBranding', JSON.stringify(branding));
  }, [branding]);

  return (
    <BrandingContext.Provider value={{ branding, setBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
