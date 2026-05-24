'use client';

import React, { useState, useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { useBranding } from './BrandingContext';

interface QRCodeBrandEngineProps {
  value: string;
  size?: number;
}

export default function QRCodeBrandEngine({ value, size = 180 }: QRCodeBrandEngineProps) {
  const { branding } = useBranding();

  // Round corners configuration (TopLeft, TopRight, BottomRight) 
  // Wait, react-qrcode-logo expects single number or array [top-left, top-right, bottom-right] or [outer, inner] depending on version, single number is safest.
  const eyeRadius = branding.qrEyeRadius;

  const [safeLogo, setSafeLogo] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (branding.logoUrl) {
      if (branding.logoUrl.startsWith('data:')) {
        setSafeLogo(branding.logoUrl);
      } else {
        fetch(branding.logoUrl)
          .then(r => r.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => setSafeLogo(reader.result as string);
            reader.readAsDataURL(blob);
          })
          .catch(() => setSafeLogo(undefined));
      }
    }
  }, [branding.logoUrl]);

  return (
    <div 
      className="relative flex items-center justify-center bg-white rounded-3xl shadow-xl border-4 border-orange-500/10 overflow-hidden"
      style={{ padding: branding.qrPadding, width: size + branding.qrPadding * 2, height: size + branding.qrPadding * 2 }}
    >
      {/* Subtle background glow mimicking premium branding */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white pointer-events-none" />
      
      <div className="relative z-10 bg-white">
        <QRCode
          value={value}
          size={size}
          fgColor={branding.secondaryColor} // Dark color for high contrast
          bgColor="#ffffff"
          qrStyle={branding.qrStyle} // squares or dots
          eyeRadius={eyeRadius} // Rounded corners for finder patterns
          logoWidth={size * 0.3} // ~30% of QR size to keep it safe
          logoHeight={size * 0.3}
          logoPaddingStyle="circle"
          logoPadding={3} // Safety margin
          logoImage={safeLogo}
          ecLevel="H" // High error correction (30%) is MANDATORY for central logo
          removeQrCodeBehindLogo={true}
        />
      </div>
    </div>
  );
}
