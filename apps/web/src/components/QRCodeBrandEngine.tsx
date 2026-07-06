'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeBrandEngineProps {
  value: string;
  size?: number;
}

export default function QRCodeBrandEngine({ value, size = 180 }: QRCodeBrandEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    try {
      // Create QR matrix with Low error correction (same as Flutter) for larger modules
      const qr = QRCode.create(value, { errorCorrectionLevel: 'L' });
      const moduleCount = qr.modules.size;
      const padding = size * 0.06;
      const drawSize = size - padding * 2;
      const moduleSize = drawSize / moduleCount;

      // Reset and clear canvas
      ctx.clearRect(0, 0, size, size);

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Helper for corner eyes
      const isFinderPattern = (row: number, col: number) => {
        if (row < 7 && col < 7) return true; // Top-left
        if (row < 7 && col >= moduleCount - 7) return true; // Top-right
        if (row >= moduleCount - 7 && col < 7) return true; // Bottom-left
        return false;
      };

      // Helper for center logo region to clear dots
      const isInCenterArea = (row: number, col: number) => {
        const centerStart = Math.floor(moduleCount * 0.35);
        const centerEnd = Math.ceil(moduleCount * 0.65);
        return row >= centerStart && row < centerEnd && col >= centerStart && col < centerEnd;
      };

      // Draw modules
      ctx.fillStyle = '#000000';
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          // If module is dark
          if (qr.modules.get(row, col)) {
            if (isFinderPattern(row, col)) {
              continue; // Skip eye modules, we draw circular eyes below
            }
            if (isInCenterArea(row, col)) {
              continue; // Skip central logo area
            }

            const centerX = padding + col * moduleSize + moduleSize / 2;
            const centerY = padding + row * moduleSize + moduleSize / 2;

            ctx.beginPath();
            // 55% radius (110% diameter) to match Flutter's thicker dots
            ctx.arc(centerX, centerY, moduleSize * 0.55, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }

      // Draw circular eyes at the three corners (matching Flutter circular eye patterns)
      const eyeOffset = 3.5 * moduleSize;
      const eyeCenters = [
        { x: padding + eyeOffset, y: padding + eyeOffset }, // Top-Left
        { x: size - padding - eyeOffset, y: padding + eyeOffset }, // Top-Right
        { x: padding + eyeOffset, y: size - padding - eyeOffset }, // Bottom-Left
      ];

      eyeCenters.forEach(center => {
        // Outer circular ring
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = moduleSize;
        ctx.beginPath();
        ctx.arc(center.x, center.y, moduleSize * 3.0, 0, 2 * Math.PI);
        ctx.stroke();

        // Inner circular dot
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(center.x, center.y, moduleSize * 1.5, 0, 2 * Math.PI);
        ctx.fill();
      });

    } catch (err) {
      console.error('Failed to render QR Code', err);
    }
  }, [value, size]);

  const logoSize = size * 0.22;

  return (
    <div 
      className="relative flex items-center justify-center bg-white rounded-3xl shadow-xl border-4 border-orange-500/10 overflow-hidden"
      style={{ width: size, height: size }}
    >
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size} 
        style={{ width: size, height: size }}
      />
      
      {/* Central AG Logo (matching Flutter design) */}
      <div 
        className="absolute bg-orange-600 rounded-md border-2 border-white flex items-center justify-center shadow-md"
        style={{ 
          width: logoSize, 
          height: logoSize,
          borderRadius: logoSize * 0.15
        }}
      >
        <span 
          className="text-white font-extrabold select-none text-center"
          style={{ fontSize: logoSize * 0.45, letterSpacing: '0.5px' }}
        >
          AG
        </span>
      </div>
    </div>
  );
}
