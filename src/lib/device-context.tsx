
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type DeviceType = 'none' | 'Prada' | 'YSL' | 'Biotherm';

interface DeviceContextType {
  activeDevice: DeviceType;
  setActiveDevice: (device: DeviceType) => void;
  cartridgeLevel: number;
  triggerScent: () => void;
  points: number;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('none');
  const [cartridgeLevel, setCartridgeLevel] = useState(85);
  const [points, setPoints] = useState(450);

  const triggerScent = () => {
    setCartridgeLevel(prev => Math.max(0, prev - 0.2));
    setPoints(prev => prev + 5);
  };

  return (
    <DeviceContext.Provider value={{ activeDevice, setActiveDevice, cartridgeLevel, triggerScent, points }}>
      <div className={activeDevice !== 'none' ? `theme-${activeDevice.toLowerCase()}` : ''}>
        {children}
      </div>
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
}
