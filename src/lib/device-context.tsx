
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
  
  // Real-time biometric simulation with more dynamic jitter
  const [biometrics, setBiometrics] = useState({
    hrv: 82,
    stress: 'Low',
    temp: 36.6
  });

  useEffect(() => {
    if (activeDevice === 'none') return;
    
    const interval = setInterval(() => {
      setBiometrics(prev => {
        const nextHrv = Math.max(60, Math.min(110, prev.hrv + (Math.random() > 0.5 ? Math.floor(Math.random() * 3) : -Math.floor(Math.random() * 3))));
        const stressLevels = ['Low', 'Medium', 'High'];
        let nextStress = prev.stress;
        
        // Correlate stress with HRV jitter for realism
        if (nextHrv < 70) nextStress = 'High';
        else if (nextHrv < 85) nextStress = 'Medium';
        else nextStress = 'Low';

        return {
          hrv: nextHrv,
          stress: nextStress,
          temp: parseFloat((36.5 + (Math.random() * 0.4)).toFixed(1))
        };
      });
    }, 2000); // Faster updates for "real-time" feel

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

  // Map device to tailwind theme class
  const themeMap: Record<DeviceType, string> = {
    none: '',
    ApexEssence: 'theme-apexessence',
    Synapse: 'theme-synapse',
    Kinetic: 'theme-kinetic',
  };
  const themeClass = themeMap[activeDevice] || '';

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
      <div className={['min-h-screen', 'transition-colors', 'duration-1000', 'bg-background', 'text-foreground', themeClass].filter(Boolean).join(' ')}>
        
        {/* Animated luxury ambient background */}
        {activeDevice !== 'none' && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[15%] -left-[10%] w-[70vw] h-[70vh] rounded-full bg-brand/30 blur-[120px] mix-blend-screen animate-slow-drift" />
            <div className="absolute top-[25%] -right-[15%] w-[60vw] h-[60vh] rounded-full bg-brand-accent/20 blur-[130px] mix-blend-screen animate-slow-drift-reverse" />
          </div>
        )}

        <div className="relative z-10">
          {children}
        </div>
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
