
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type DeviceType = 'none' | 'Prada' | 'YSL' | 'Biotherm';
export type PlanType = 'Base' | 'Essential' | 'Premium';

interface DeviceContextType {
  activeDevice: DeviceType;
  setActiveDevice: (device: DeviceType) => void;
  cartridgeLevel: number;
  triggerScent: () => void;
  points: number;
  currentPlan: PlanType;
  setCurrentPlan: (plan: PlanType) => void;
  userProfile: { name: string; email: string } | null;
  setUserProfile: (profile: { name: string; email: string }) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('none');
  const [cartridgeLevel, setCartridgeLevel] = useState(85);
  const [points, setPoints] = useState(450);
  const [currentPlan, setCurrentPlan] = useState<PlanType>('Base');
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);

  const triggerScent = () => {
    const consumption = currentPlan === 'Premium' ? 0.3 : 0.5; // Premium is more precise
    setCartridgeLevel(prev => Math.max(0, prev - (consumption / 10))); 
    setPoints(prev => prev + 5);
  };

  return (
    <DeviceContext.Provider value={{ 
      activeDevice, 
      setActiveDevice, 
      cartridgeLevel, 
      triggerScent, 
      points, 
      currentPlan, 
      setCurrentPlan,
      userProfile,
      setUserProfile
    }}>
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
