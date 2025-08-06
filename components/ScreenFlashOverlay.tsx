'use client';

import { useEffect, useState } from 'react';

interface ScreenFlashOverlayProps {
  isFlashing: boolean;
  flashColor?: string;
  duration?: number;
  intensity?: number;
  onFlashComplete?: () => void;
}

export function ScreenFlashOverlay({ 
  isFlashing, 
  flashColor = '#FF0000', 
  duration = 3000,
  intensity = 0.8,
  onFlashComplete 
}: ScreenFlashOverlayProps) {
  const [showFlash, setShowFlash] = useState(false);
  const [flashCount, setFlashCount] = useState(0);

  useEffect(() => {
    if (isFlashing) {
      setShowFlash(true);
      setFlashCount(0);
      
      // Create rapid flashing effect
      const flashInterval = setInterval(() => {
        setFlashCount(prev => {
          const newCount = prev + 1;
          
          // Flash pattern: on for 200ms, off for 100ms, repeat 10 times
          if (newCount >= 20) { // 10 flashes (on/off cycles)
            clearInterval(flashInterval);
            setShowFlash(false);
            onFlashComplete?.();
            return 0;
          }
          
          return newCount;
        });
      }, 150); // Flash every 150ms

      // Ensure flash stops after duration
      const timeoutId = setTimeout(() => {
        clearInterval(flashInterval);
        setShowFlash(false);
        setFlashCount(0);
        onFlashComplete?.();
      }, duration);

      return () => {
        clearInterval(flashInterval);
        clearTimeout(timeoutId);
        setShowFlash(false);
        setFlashCount(0);
      };
    }
  }, [isFlashing, duration, onFlashComplete]);

  if (!showFlash) return null;

  const isFlashOn = flashCount % 2 === 0;

  return (
    <div
      className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-75 ${
        isFlashOn ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundColor: flashColor,
        opacity: isFlashOn ? intensity : 0,
        mixBlendMode: 'overlay',
      }}
    >
      {/* Emergency alert text overlay */}
      {isFlashOn && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-60 p-8 rounded-lg text-center animate-pulse">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              🚨 BOUNDARY ALERT 🚨
            </h1>
            <p className="text-white text-xl md:text-2xl font-semibold drop-shadow-lg">
              YOU HAVE CROSSED INTO RESTRICTED WATERS
            </p>
            <p className="text-yellow-300 text-lg md:text-xl mt-2 drop-shadow-lg">
              RETURN TO SAFE ZONE IMMEDIATELY
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
