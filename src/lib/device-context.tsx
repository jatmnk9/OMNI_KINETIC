
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type DeviceType = 'none' | 'ApexEssence' | 'Synapse' | 'Kinetic';
export type FragranceType = 'none' | 'Apex' | 'Synapse' | 'Flow';
export type ControlMode = 'smart' | 'habit' | 'manual';
export type SubscriptionPlan = 'none' | 'signature' | 'dual' | 'continuum';
export type SensorType = 'none' | 'smartwatch' | 'ring' | 'strap';

export interface LocationTrigger {
  id: string;
  name: string;
  active: boolean;
  fragranceId: FragranceType;
}

export type MusicService = 'spotify' | 'apple' | 'youtube';

export interface MusicState {
  track: string;
  artist: string;
  bpm: number;
  isPlaying: boolean;
  service: MusicService;
  progress: number;
  coverColor: string;
  duration: string;
  trackIndex: number;
}

export interface ScheduledDose {
  time: string;
  type: 'activation' | 'recovery' | 'focus';
  label: string;
  accepted: boolean;
}

export interface BurstRecord {
  timestamp: Date;
  mode: ControlMode;
  variant: string;
}

// === FRAGRANCE DATA ===
export interface Fragrance {
  id: FragranceType;
  name: string;
  tagline: string;
  claim: string;
  desc: string;
  img: string;
  refillImg: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  moments: string[];
  themeClass: string;
}

export const FRAGRANCES: Fragrance[] = [
  {
    id: 'Apex',
    name: 'Apex Essence',
    tagline: 'Intense Movement',
    claim: 'The scent of momentum. For every moment that demands the best of you.',
    desc: 'When your body is at its peak — a critical meeting, a workout, a journey, an important decision.',
    img: '/apex-removebg-preview.png',
    refillImg: '/apex_refill-removebg-preview.png',
    topNotes: 'Lemon · Bergamot · Pink Pepper',
    heartNotes: 'Peppermint · Cardamom · Neroli',
    baseNotes: 'Cedarwood · White Musk · Ginger',
    moments: ['7:00am — Start the day', '9:30am — Key meeting', '6:00pm — Gym / Training', 'Anytime — Travel / High performance'],
    themeClass: 'theme-apex',
  },
  {
    id: 'Synapse',
    name: 'Synapse',
    tagline: 'Social Movement',
    claim: 'The scent of connection. For every moment you move toward others.',
    desc: 'When you move towards others — a lunch, a date, cinema, a soirée. The movement that brings people closer.',
    img: '/synapse-removebg-preview.png',
    refillImg: '/synapse_refill-removebg-preview.png',
    topNotes: 'Peach · Neroli · Pink Pepper',
    heartNotes: 'Jasmine Absolute · Ylang-Ylang · Rose',
    baseNotes: 'Sandalwood · Amber · Vanilla Musk',
    moments: ['12:00pm — Social lunch', '7:00pm — Date night', '9:00pm — Evening out', 'Anytime — Social gatherings'],
    themeClass: 'theme-synapse',
  },
  {
    id: 'Flow',
    name: 'Flow',
    tagline: 'Everyday Movement',
    claim: 'The scent of ease. For every moment you simply move through life.',
    desc: 'The constant, gentle movement of daily life — morning coffee, commute, work, a quiet Sunday.',
    img: '/flow-removebg-preview.png',
    refillImg: '/flow_refill-removebg-preview.png',
    topNotes: 'White Tea · Citrus Zest · Eucalyptus',
    heartNotes: 'Rosemary · Iris · Green Fig',
    baseNotes: 'Vetiver · Musk Blanc · Cedarwood',
    moments: ['8:00am — Morning ritual', '10:00am — Work / Focus', 'Anytime — Commute', 'Evening — Wind-down / Reading'],
    themeClass: 'theme-flow',
  },
];

// === CART ===
export interface CartItem {
  fragranceId: FragranceType;
  quantity: number;
  type: 'single' | 'pack2' | 'pack3' | 'pack4';
  unitPrice: number;
}

// === REFILL PRICING ===
export const REFILL_PRICE = 109; // $109 per 30ml refill
export const SUBSCRIPTION_PLANS = {
  signature: {
    name: 'Kinetic Essence',
    subtitle: 'Signature',
    desc: '1 refill 30ml delivered to your door every 3 months.',
    price: 102,
    frequency: 'Every 3 months',
    refills: 1,
    badge: 'ESSENTIAL',
  },
  dual: {
    name: 'Kinetic Duality',
    subtitle: 'Dual',
    desc: '2 refills 30ml — same or different fragrance — every 3 months.',
    price: 194,
    frequency: 'Every 3 months',
    refills: 2,
    badge: 'POPULAR',
  },
  continuum: {
    name: 'Kinetic Infinity',
    subtitle: 'Continuum',
    desc: '4 refills 30ml — your full year supply, delivered once.',
    price: 370,
    frequency: 'Once a year',
    refills: 4,
    badge: 'BEST VALUE',
  },
};

// === BIOMETRIC HISTORY ===
export interface BiometricHistoryEntry {
  time: string;
  hrv: number;
  stress: number;
  temp: number;
  steps: number;
  sleep: number;
  mood: number;
  movement: number;
  heartRate: number;
  humidity: number;
  inclination: number;
}

export const BIOMETRIC_HISTORY: BiometricHistoryEntry[] = [
  { time: '06:00', hrv: 92, stress: 15, temp: 36.4, steps: 120, sleep: 7.2, mood: 4, movement: 12, heartRate: 58, humidity: 45, inclination: 0 },
  { time: '07:00', hrv: 88, stress: 22, temp: 36.5, steps: 1240, sleep: 7.2, mood: 4, movement: 65, heartRate: 72, humidity: 48, inclination: 5 },
  { time: '08:00', hrv: 75, stress: 45, temp: 36.8, steps: 3200, sleep: 7.2, mood: 3, movement: 88, heartRate: 128, humidity: 62, inclination: 15 },
  { time: '09:00', hrv: 78, stress: 40, temp: 36.7, steps: 4100, sleep: 7.2, mood: 3, movement: 72, heartRate: 115, humidity: 55, inclination: 8 },
  { time: '10:00', hrv: 85, stress: 28, temp: 36.6, steps: 5400, sleep: 7.2, mood: 4, movement: 45, heartRate: 82, humidity: 50, inclination: 3 },
  { time: '11:00', hrv: 82, stress: 32, temp: 36.6, steps: 6200, sleep: 7.2, mood: 4, movement: 38, heartRate: 78, humidity: 48, inclination: 2 },
  { time: '12:00', hrv: 80, stress: 35, temp: 36.7, steps: 7100, sleep: 7.2, mood: 3, movement: 30, heartRate: 75, humidity: 46, inclination: 1 },
  { time: '13:00', hrv: 76, stress: 42, temp: 36.8, steps: 7800, sleep: 7.2, mood: 3, movement: 25, heartRate: 80, humidity: 44, inclination: 0 },
  { time: '14:00', hrv: 72, stress: 50, temp: 36.9, steps: 8200, sleep: 7.2, mood: 2, movement: 20, heartRate: 85, humidity: 42, inclination: 0 },
  { time: '15:00', hrv: 74, stress: 48, temp: 36.8, steps: 9100, sleep: 7.2, mood: 3, movement: 35, heartRate: 82, humidity: 45, inclination: 4 },
  { time: '16:00', hrv: 78, stress: 38, temp: 36.7, steps: 10500, sleep: 7.2, mood: 4, movement: 55, heartRate: 90, humidity: 50, inclination: 10 },
  { time: '17:00', hrv: 82, stress: 30, temp: 36.6, steps: 11800, sleep: 7.2, mood: 4, movement: 60, heartRate: 95, humidity: 52, inclination: 12 },
  { time: '18:00', hrv: 86, stress: 25, temp: 36.5, steps: 12400, sleep: 7.2, mood: 5, movement: 42, heartRate: 78, humidity: 48, inclination: 5 },
  { time: '19:00', hrv: 90, stress: 18, temp: 36.5, steps: 12800, sleep: 7.2, mood: 5, movement: 28, heartRate: 68, humidity: 46, inclination: 2 },
  { time: '20:00', hrv: 94, stress: 12, temp: 36.4, steps: 13100, sleep: 7.2, mood: 5, movement: 15, heartRate: 62, humidity: 44, inclination: 0 },
];

export interface DoseHistoryEntry {
  time: string;
  variant: string;
  intensity: number;
}

export const DOSE_HISTORY: DoseHistoryEntry[] = [
  { time: '07:05', variant: 'Apex Essence', intensity: 0.8 },
  { time: '08:32', variant: 'Apex Essence', intensity: 0.6 },
  { time: '12:15', variant: 'Flow', intensity: 0.7 },
  { time: '14:05', variant: 'Synapse', intensity: 0.9 },
  { time: '18:10', variant: 'Flow', intensity: 0.5 },
  { time: '21:05', variant: 'Synapse', intensity: 0.6 },
];

// === MUSIC TRACKS ===
export const SPOTIFY_TRACKS: Omit<MusicState, 'isPlaying' | 'progress' | 'trackIndex'>[] = [
  { track: 'Midnight Pulse', artist: 'KLANGFORM', bpm: 128, service: 'spotify', coverColor: '#1DB954', duration: '3:42' },
  { track: 'Deep Recovery', artist: 'Somnium Lab', bpm: 72, service: 'spotify', coverColor: '#1DB954', duration: '4:18' },
  { track: 'Neural Drift', artist: 'Cortex Wave', bpm: 110, service: 'spotify', coverColor: '#1DB954', duration: '3:05' },
  { track: 'Obsidian Flow', artist: 'Darkroom Audio', bpm: 98, service: 'spotify', coverColor: '#1DB954', duration: '5:12' },
  { track: 'Kinetic Rush', artist: 'Pulse Theory', bpm: 140, service: 'spotify', coverColor: '#1DB954', duration: '2:58' },
];
export const APPLE_TRACKS: Omit<MusicState, 'isPlaying' | 'progress' | 'trackIndex'>[] = [
  { track: 'Aurora Borealis', artist: 'Synth.Aether', bpm: 95, service: 'apple', coverColor: '#FC3C44', duration: '4:01' },
  { track: 'Neon Cortisol', artist: 'BioBeats', bpm: 118, service: 'apple', coverColor: '#FC3C44', duration: '3:33' },
  { track: 'Velvet Circuit', artist: 'Lumino', bpm: 86, service: 'apple', coverColor: '#FC3C44', duration: '4:45' },
  { track: 'Soma Phase', artist: 'Rêverie Lab', bpm: 76, service: 'apple', coverColor: '#FC3C44', duration: '5:30' },
  { track: 'Chromatic Pulse', artist: 'Spectra', bpm: 132, service: 'apple', coverColor: '#FC3C44', duration: '3:15' },
];
export const YOUTUBE_TRACKS: Omit<MusicState, 'isPlaying' | 'progress' | 'trackIndex'>[] = [
  { track: 'Veloce', artist: 'Driftmode', bpm: 142, service: 'youtube', coverColor: '#FF0000', duration: '3:28' },
  { track: 'Aqua Flow', artist: 'TidalWave', bpm: 88, service: 'youtube', coverColor: '#FF0000', duration: '4:10' },
  { track: 'Volcanic Calm', artist: 'Magma Sound', bpm: 65, service: 'youtube', coverColor: '#FF0000', duration: '6:02' },
  { track: 'Hyper Focus', artist: 'Neurocode', bpm: 155, service: 'youtube', coverColor: '#FF0000', duration: '2:44' },
  { track: 'Afterglow', artist: 'Dusk Protocol', bpm: 92, service: 'youtube', coverColor: '#FF0000', duration: '4:55' },
];
export const ALL_TRACKS_BY_SERVICE: Record<MusicService, Omit<MusicState, 'isPlaying' | 'progress' | 'trackIndex'>[]> = {
  spotify: SPOTIFY_TRACKS, apple: APPLE_TRACKS, youtube: YOUTUBE_TRACKS,
};

const DEFAULT_MUSIC: MusicState = { ...SPOTIFY_TRACKS[0], isPlaying: false, progress: 0, trackIndex: 0 };

const DEFAULT_SCHEDULED_DOSES: ScheduledDose[] = [
  { time: '06:55', type: 'activation', label: 'Pre-workout activation dose', accepted: true },
  { time: '08:30', type: 'recovery', label: 'Post-workout recovery', accepted: true },
  { time: '14:00', type: 'focus', label: 'Afternoon focus burst', accepted: false },
  { time: '21:00', type: 'recovery', label: 'Evening wind-down', accepted: false },
];

// === PERFUME CONSTANTS ===
const BOTTLE_CAPACITY_ML = 30;
const DEVICE_CAPACITY_ML = 1.2;
const SPRAY_ML = 0.08;
const DAILY_SPRAYS = 6;

interface DeviceContextType {
  activeDevice: DeviceType;
  setActiveDevice: (device: DeviceType) => void;
  activeFragrance: FragranceType;
  setActiveFragrance: (f: FragranceType) => void;
  getFragrance: () => Fragrance | undefined;
  // Perfume levels
  devicePerfumeMl: number;
  bottlePerfumeMl: number;
  deviceBattery: number;
  dailySprayCount: number;
  estimatedBottleDays: number;
  estimatedDeviceSprays: number;
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotal: number;
  // Subscription
  subscriptionPlan: SubscriptionPlan;
  setSubscriptionPlan: (p: SubscriptionPlan) => void;
  // Core
  triggerScent: () => void;
  points: number;
  userProfile: { name: string; email: string } | null;
  setUserProfile: (profile: { name: string; email: string } | null) => void;
  biometrics: { hrv: number; stress: string; temp: number };
  logout: () => void;
  controlMode: ControlMode;
  setControlMode: (mode: ControlMode) => void;
  musicState: MusicState;
  scheduledDoses: ScheduledDose[];
  setScheduledDoses: (doses: ScheduledDose[]) => void;
  burstHistory: BurstRecord[];
  // Music controls
  musicConnected: boolean;
  musicAIMode: boolean;
  selectedService: MusicService;
  setSelectedService: (s: MusicService) => void;
  toggleMusicConnection: () => void;
  toggleMusicAIMode: () => void;
  musicPlay: () => void;
  musicPause: () => void;
  musicTogglePlayPause: () => void;
  musicNext: () => void;
  musicPrev: () => void;
  // Sensor
  linkedSensor: SensorType;
  setLinkedSensor: (s: SensorType) => void;
  // Smart Mode Expansion
  locationTriggers: LocationTrigger[];
  setLocationTriggers: (triggers: LocationTrigger[]) => void;
  calendarSync: boolean;
  setCalendarSync: (sync: boolean) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('none');
  const [activeFragrance, setActiveFragrance] = useState<FragranceType>('none');
  const [points, setPoints] = useState(450);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);

  // Perfume levels
  const [devicePerfumeMl, setDevicePerfumeMl] = useState(1.05);
  const [bottlePerfumeMl, setBottlePerfumeMl] = useState(24.6);
  const [deviceBattery, setDeviceBattery] = useState(78);
  const [dailySprayCount, setDailySprayCount] = useState(3);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('none');
  const [linkedSensor, setLinkedSensor] = useState<SensorType>('smartwatch');

  // Smart Mode Expansion
  const [locationTriggers, setLocationTriggers] = useState<LocationTrigger[]>([
    { id: '1', name: 'Work / Office', active: true, fragranceId: 'Flow' },
    { id: '2', name: 'Elite Gym', active: true, fragranceId: 'Synapse' },
    { id: '3', name: 'Home / Zen', active: false, fragranceId: 'Apex' },
  ]);
  const [calendarSync, setCalendarSync] = useState(true);

  // Biometrics
  const [biometrics, setBiometrics] = useState({ hrv: 82, stress: 'Low', temp: 36.6 });

  // Controls
  const [controlMode, setControlMode] = useState<ControlMode>('smart');
  const [musicState, setMusicState] = useState<MusicState>(DEFAULT_MUSIC);
  const [musicConnected, setMusicConnected] = useState(false);
  const [musicAIMode, setMusicAIMode] = useState(true);
  const [selectedService, setSelectedServiceState] = useState<MusicService>('spotify');
  const [scheduledDoses, setScheduledDoses] = useState<ScheduledDose[]>(DEFAULT_SCHEDULED_DOSES);
  const [burstHistory, setBurstHistory] = useState<BurstRecord[]>([]);

  const getFragrance = useCallback(() => FRAGRANCES.find(f => f.id === activeFragrance), [activeFragrance]);

  // Computed
  const estimatedDeviceSprays = Math.floor(devicePerfumeMl / SPRAY_ML);
  const dailyUsageMl = DAILY_SPRAYS * SPRAY_ML; // 0.48ml/day
  const estimatedBottleDays = Math.round(bottlePerfumeMl / dailyUsageMl);

  // Cart helpers
  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.findIndex(c => c.fragranceId === item.fragranceId && c.type === item.type);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + item.quantity };
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Biometric simulation
  useEffect(() => {
    if (activeDevice === 'none') return;
    let cycleIndex = 0;
    const STRESS_CYCLE: { stress: string; hrvRange: [number, number] }[] = [
      { stress: 'Low', hrvRange: [88, 105] },
      { stress: 'Medium', hrvRange: [72, 85] },
      { stress: 'High', hrvRange: [60, 70] },
    ];
    const interval = setInterval(() => {
      cycleIndex = (cycleIndex + 1) % STRESS_CYCLE.length;
      const phase = STRESS_CYCLE[cycleIndex];
      setBiometrics(() => {
        const [min, max] = phase.hrvRange;
        return {
          hrv: min + Math.floor(Math.random() * (max - min)),
          stress: phase.stress,
          temp: parseFloat((36.5 + (Math.random() * 0.4)).toFixed(1)),
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [activeDevice]);

  // Music simulation
  useEffect(() => {
    if (activeDevice === 'none' || !musicConnected) return;
    const progressInterval = setInterval(() => {
      setMusicState(prev => {
        if (!prev.isPlaying) return prev;
        const next = Math.min(100, prev.progress + 0.8);
        if (next >= 100 && musicAIMode) {
          const tracks = ALL_TRACKS_BY_SERVICE[selectedService];
          const nextIdx = (prev.trackIndex + 1) % tracks.length;
          return { ...tracks[nextIdx], isPlaying: true, progress: 0, trackIndex: nextIdx };
        }
        return { ...prev, progress: next };
      });
    }, 1000);
    let trackInterval: ReturnType<typeof setInterval> | null = null;
    if (musicAIMode) {
      trackInterval = setInterval(() => {
        setMusicState(prev => {
          if (!prev.isPlaying) return prev;
          const tracks = ALL_TRACKS_BY_SERVICE[selectedService];
          const nextIdx = (prev.trackIndex + 1) % tracks.length;
          return { ...tracks[nextIdx], isPlaying: true, progress: 0, trackIndex: nextIdx };
        });
      }, 25000);
    }
    return () => { clearInterval(progressInterval); if (trackInterval) clearInterval(trackInterval); };
  }, [activeDevice, musicConnected, musicAIMode, selectedService]);

  const triggerScent = useCallback(() => {
    setDevicePerfumeMl(prev => Math.max(0, prev - SPRAY_ML));
    setDailySprayCount(prev => prev + 1);
    setPoints(prev => prev + 5);
    const frag = FRAGRANCES.find(f => f.id === activeFragrance);
    setBurstHistory(prev => [
      { timestamp: new Date(), mode: controlMode, variant: frag?.name || 'Unknown' },
      ...prev.slice(0, 19),
    ]);
  }, [controlMode, activeFragrance]);

  // Music controls
  const toggleMusicConnection = useCallback(() => {
    setMusicConnected(prev => {
      if (!prev) {
        const tracks = ALL_TRACKS_BY_SERVICE[selectedService];
        setMusicState({ ...tracks[0], isPlaying: true, progress: 0, trackIndex: 0 });
      } else {
        setMusicState(prev2 => ({ ...prev2, isPlaying: false }));
      }
      return !prev;
    });
  }, [selectedService]);

  const toggleMusicAIMode = useCallback(() => setMusicAIMode(prev => !prev), []);

  const setSelectedService = useCallback((s: MusicService) => {
    setSelectedServiceState(s);
    if (musicConnected) {
      const tracks = ALL_TRACKS_BY_SERVICE[s];
      setMusicState({ ...tracks[0], isPlaying: true, progress: 0, trackIndex: 0 });
    }
  }, [musicConnected]);

  const musicPlay = useCallback(() => { if (musicConnected) setMusicState(prev => ({ ...prev, isPlaying: true })); }, [musicConnected]);
  const musicPause = useCallback(() => setMusicState(prev => ({ ...prev, isPlaying: false })), []);
  const musicTogglePlayPause = useCallback(() => { if (musicConnected) setMusicState(prev => ({ ...prev, isPlaying: !prev.isPlaying })); }, [musicConnected]);
  const musicNext = useCallback(() => {
    if (!musicConnected) return;
    const tracks = ALL_TRACKS_BY_SERVICE[selectedService];
    setMusicState(prev => { const nextIdx = (prev.trackIndex + 1) % tracks.length; return { ...tracks[nextIdx], isPlaying: true, progress: 0, trackIndex: nextIdx }; });
  }, [musicConnected, selectedService]);
  const musicPrev = useCallback(() => {
    if (!musicConnected) return;
    const tracks = ALL_TRACKS_BY_SERVICE[selectedService];
    setMusicState(prev => { const prevIdx = prev.trackIndex <= 0 ? tracks.length - 1 : prev.trackIndex - 1; return { ...tracks[prevIdx], isPlaying: true, progress: 0, trackIndex: prevIdx }; });
  }, [musicConnected, selectedService]);

  const logout = () => {
    setActiveDevice('none');
    setActiveFragrance('none');
    setUserProfile(null);
    setPoints(450);
    setControlMode('smart');
    setBurstHistory([]);
    setMusicConnected(false);
    setMusicAIMode(true);
    setMusicState(DEFAULT_MUSIC);
    setCart([]);
    setSubscriptionPlan('none');
    setDevicePerfumeMl(1.05);
    setBottlePerfumeMl(24.6);
    setDeviceBattery(78);
    setDailySprayCount(3);
    setLinkedSensor('none');
  };

  // Theme class based on fragrance
  const themeMap: Record<FragranceType, string> = {
    none: '',
    Apex: 'theme-apex',
    Synapse: 'theme-synapse',
    Flow: 'theme-flow',
  };
  const themeClass = themeMap[activeFragrance] || '';

  return (
    <DeviceContext.Provider value={{
      activeDevice, setActiveDevice,
      activeFragrance, setActiveFragrance, getFragrance,
      devicePerfumeMl, bottlePerfumeMl, deviceBattery, dailySprayCount,
      estimatedBottleDays, estimatedDeviceSprays,
      cart, addToCart, removeFromCart, clearCart, cartTotal,
      subscriptionPlan, setSubscriptionPlan,
      triggerScent, points,
      userProfile, setUserProfile,
      biometrics, logout,
      controlMode, setControlMode,
      musicState,
      scheduledDoses, setScheduledDoses,
      burstHistory,
      musicConnected, musicAIMode, selectedService, setSelectedService,
      toggleMusicConnection, toggleMusicAIMode,
      musicPlay, musicPause, musicTogglePlayPause, musicNext, musicPrev,
      linkedSensor, setLinkedSensor,
      locationTriggers, setLocationTriggers,
      calendarSync, setCalendarSync
    }}>
      <div className={['min-h-screen', 'transition-colors', 'duration-1000', 'bg-background', 'text-foreground', themeClass].filter(Boolean).join(' ')}>
        {activeFragrance !== 'none' && (
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
