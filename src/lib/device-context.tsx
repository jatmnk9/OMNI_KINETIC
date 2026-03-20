"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type DeviceType = 'none' | 'ApexEssence' | 'Synapse' | 'Kinetic';
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
  setUserProfile: (profile: { name: string; email: string } | null) => void;
  biometrics: {
    hrv: number;
    stress: string;
    temp: number;
  };
  logout: () => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('none');
  const [cartridgeLevel, setCartridgeLevel] = useState(85);
  const [points, setPoints] = useState(450);
  const [currentPlan, setCurrentPlan] = useState<PlanType>('Base');
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  
  // Real-time biometric simulation
  const [biometrics, setBiometrics] = useState({
    hrv: 82,
    stress: 'Low',
    temp: 36.6
  });

  useEffect(() => {
    if (activeDevice === 'none') return;
    
    const interval = setInterval(() => {
      setBiometrics(prev => ({
        hrv: Math.max(60, Math.min(110, prev.hrv + (Math.random() > 0.5 ? 1 : -1))),
        stress: Math.random() > 0.9 ? (Math.random() > 0.5 ? 'Medium' : 'Low') : prev.stress,
        temp: parseFloat((prev.temp + (Math.random() > 0.5 ? 0.05 : -0.05)).toFixed(1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [activeDevice]);

  const triggerScent = () => {
    const consumption = currentPlan === 'Premium' ? 0.3 : 0.5;
    setCartridgeLevel(prev => Math.max(0, prev - (consumption / 10))); 
    setPoints(prev => prev + 5);
  };

  const logout = () => {
    setActiveDevice('none');
    setUserProfile(null);
    setCurrentPlan('Base');
    setCartridgeLevel(85);
    setPoints(450);
  };

  const themeClass = activeDevice === 'none' ? '' : `theme-${activeDevice.toLowerCase()}`;

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
      setUserProfile,
      biometrics,
      logout
    }}>
      <div className={`min-h-screen transition-all duration-1000 ${themeClass}`}>
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
