
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type DeviceType = 'none' | 'ApexEssence' | 'Synapse' | 'Kinetic';
export type PlanType = 'Base' | 'Essential' | 'Premium';
export type ControlMode = 'smart' | 'habit' | 'manual';

export interface RefillVariant {
  id: string;
  name: string;
  baseLine: DeviceType;
  notes: string;
  iconName: 'citrus' | 'trees' | 'snowflake' | 'moon' | 'leaf' | 'zap' | 'waves' | 'wind' | 'sprout';
}

export type MusicService = 'spotify' | 'apple' | 'youtube';

export interface MusicState {
  track: string;
  artist: string;
  bpm: number;
  isPlaying: boolean;
  service: MusicService;
  progress: number; // 0-100
  coverColor: string; // hex for ambient glow
  duration: string; // e.g. "3:24"
  trackIndex: number;
}

export interface NearbyUser {
  name: string;
  device: DeviceType;
  distance: string;
  variant: string;
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

// === VARIANT DATA ===
export const ALL_VARIANTS: RefillVariant[] = [
  // Apex
  { id: 'apex-citrus', name: 'Extreme Citrus', baseLine: 'ApexEssence', notes: 'Lemon, Grapefruit, Bergamot', iconName: 'citrus' },
  { id: 'apex-wood', name: 'Recovery Wood', baseLine: 'ApexEssence', notes: 'Sandalwood, Cedar, Vetiver', iconName: 'trees' },
  { id: 'apex-frost', name: 'Glacial Frost', baseLine: 'ApexEssence', notes: 'Peppermint, Eucalyptus, Ice', iconName: 'snowflake' },
  // Synapse
  { id: 'syn-amber', name: 'Amber Night', baseLine: 'Synapse', notes: 'Amber, Musk, Dark Vanilla', iconName: 'moon' },
  { id: 'syn-vetiver', name: 'Deep Vetiver', baseLine: 'Synapse', notes: 'Vetiver, Patchouli, Smoke', iconName: 'leaf' },
  { id: 'syn-rose', name: 'Electric Rose', baseLine: 'Synapse', notes: 'Rose, Ozone, Electric Musk', iconName: 'zap' },
  // Kinetic
  { id: 'kin-seaweed', name: 'Marine Kelp', baseLine: 'Kinetic', notes: 'Seaweed, Sea Salt, Driftwood', iconName: 'waves' },
  { id: 'kin-eucalyptus', name: 'Vital Eucalyptus', baseLine: 'Kinetic', notes: 'Eucalyptus, Pine, Green Tea', iconName: 'wind' },
  { id: 'kin-bamboo', name: 'Fresh Bamboo', baseLine: 'Kinetic', notes: 'Bamboo, White Lotus, Rain', iconName: 'sprout' },
];

// === BIOMETRIC HISTORY (simulated) ===
export interface BiometricHistoryEntry {
  time: string;
  hrv: number;
  stress: number; // 0-100
  temp: number;
  steps: number;
  sleep: number; // hours
  mood: number; // 1-5
  movement: number; // 0-100 activity %
  heartRate: number;
  humidity: number; // %
  inclination: number; // degrees
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

// === MUSIC TRACKS PER SERVICE ===
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
  spotify: SPOTIFY_TRACKS,
  apple: APPLE_TRACKS,
  youtube: YOUTUBE_TRACKS,
};

const DEFAULT_MUSIC: MusicState = { ...SPOTIFY_TRACKS[0], isPlaying: false, progress: 0, trackIndex: 0 };

// === DEFAULT SCHEDULED DOSES ===
const DEFAULT_SCHEDULED_DOSES: ScheduledDose[] = [
  { time: '06:55', type: 'activation', label: 'Pre-swim activation dose', accepted: true },
  { time: '08:30', type: 'recovery', label: 'Post-workout recovery', accepted: true },
  { time: '14:00', type: 'focus', label: 'Afternoon focus burst', accepted: false },
  { time: '21:00', type: 'recovery', label: 'Evening wind-down', accepted: false },
];

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
  // New state for 5 modules
  controlMode: ControlMode;
  setControlMode: (mode: ControlMode) => void;
  selectedVariant: RefillVariant | null;
  setSelectedVariant: (variant: RefillVariant) => void;
  cartridgeDaysLeft: number;
  dailyUsageMl: number;
  musicState: MusicState;
  auraConnected: boolean;
  nearbyUser: NearbyUser | null;
  scheduledDoses: ScheduledDose[];
  setScheduledDoses: (doses: ScheduledDose[]) => void;
  burstHistory: BurstRecord[];
  getVariantsForDevice: (device: DeviceType) => RefillVariant[];
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

  // === NEW STATE ===
  const [controlMode, setControlMode] = useState<ControlMode>('smart');
  const [selectedVariant, setSelectedVariant] = useState<RefillVariant | null>(null);
  const dailyUsageMl = 1.2;
  const totalCartridgeMl = 15; // 15ml cartridge
  const cartridgeDaysLeft = Math.round((cartridgeLevel / 100) * totalCartridgeMl / dailyUsageMl);
  const [musicState, setMusicState] = useState<MusicState>(DEFAULT_MUSIC);
  const [musicConnected, setMusicConnected] = useState(false);
  const [musicAIMode, setMusicAIMode] = useState(true);
  const [selectedService, setSelectedServiceState] = useState<MusicService>('spotify');
  const [auraConnected, setAuraConnected] = useState(false);
  const [nearbyUser, setNearbyUser] = useState<NearbyUser | null>(null);
  const [scheduledDoses, setScheduledDoses] = useState<ScheduledDose[]>(DEFAULT_SCHEDULED_DOSES);
  const [burstHistory, setBurstHistory] = useState<BurstRecord[]>([]);

  // Auto-select variant when device changes
  useEffect(() => {
    if (activeDevice !== 'none') {
      const variants = ALL_VARIANTS.filter(v => v.baseLine === activeDevice);
      if (variants.length > 0 && !selectedVariant) {
        setSelectedVariant(variants[0]);
      }
    }
  }, [activeDevice, selectedVariant]);

  // Biometric simulation — cycles through all stress levels for demo
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
        const nextHrv = min + Math.floor(Math.random() * (max - min));
        return {
          hrv: nextHrv,
          stress: phase.stress,
          temp: parseFloat((36.5 + (Math.random() * 0.4)).toFixed(1))
        };
      });
    }, 5000); // Cycle every 5 seconds

    return () => clearInterval(interval);
  }, [activeDevice]);

  // Music rotation simulation — respects connected, playing, and AI mode
  useEffect(() => {
    if (activeDevice === 'none' || !musicConnected) return;

    // Progress the track only if playing
    const progressInterval = setInterval(() => {
      setMusicState(prev => {
        if (!prev.isPlaying) return prev;
        const next = Math.min(100, prev.progress + 0.8);
        // Auto-advance when track ends
        if (next >= 100 && musicAIMode) {
          const tracks = ALL_TRACKS_BY_SERVICE[selectedService];
          const nextIdx = (prev.trackIndex + 1) % tracks.length;
          return { ...tracks[nextIdx], isPlaying: true, progress: 0, trackIndex: nextIdx };
        }
        return { ...prev, progress: next };
      });
    }, 1000);

    // AI mode: change track every ~25s based on biometrics
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

    return () => {
      clearInterval(progressInterval);
      if (trackInterval) clearInterval(trackInterval);
    };
  }, [activeDevice, musicConnected, musicAIMode, selectedService]);

  // Aura proximity simulation
  useEffect(() => {
    if (activeDevice === 'none') return;

    const nearbyUsers: NearbyUser[] = [
      { name: 'Alejandro M.', device: 'Synapse', distance: '2.4m', variant: 'Amber Night' },
      { name: 'Sofia R.', device: 'ApexEssence', distance: '3.1m', variant: 'Extreme Citrus' },
      { name: 'Marco T.', device: 'Kinetic', distance: '1.8m', variant: 'Alga Marina' },
    ];

    const auraInterval = setInterval(() => {
      const shouldConnect = Math.random() > 0.85; // 15% chance
      if (shouldConnect && !auraConnected) {
        const user = nearbyUsers[Math.floor(Math.random() * nearbyUsers.length)];
        setNearbyUser(user);
        setAuraConnected(true);
        // Disconnect after 15-25s
        setTimeout(() => {
          setAuraConnected(false);
          setNearbyUser(null);
        }, 15000 + Math.random() * 10000);
      }
    }, 8000);

    return () => clearInterval(auraInterval);
  }, [activeDevice, auraConnected]);

  const triggerScent = useCallback(() => {
    const consumption = currentPlan === 'Premium' ? 0.3 : 0.5;
    setCartridgeLevel(prev => Math.max(0, prev - (consumption / 10))); 
    setPoints(prev => prev + 5);
    setBurstHistory(prev => [
      { timestamp: new Date(), mode: controlMode, variant: selectedVariant?.name || 'Base' },
      ...prev.slice(0, 19),
    ]);
  }, [currentPlan, controlMode, selectedVariant]);

  // === MUSIC CONTROL FUNCTIONS ===
  const toggleMusicConnection = useCallback(() => {
    setMusicConnected(prev => {
      if (!prev) {
        // Connecting: start playing first track of selected service
        const tracks = ALL_TRACKS_BY_SERVICE[selectedService];
        setMusicState({ ...tracks[0], isPlaying: true, progress: 0, trackIndex: 0 });
      } else {
        setMusicState(prev2 => ({ ...prev2, isPlaying: false }));
      }
      return !prev;
    });
  }, [selectedService]);

  const toggleMusicAIMode = useCallback(() => {
    setMusicAIMode(prev => !prev);
  }, []);

  const setSelectedService = useCallback((s: MusicService) => {
    setSelectedServiceState(s);
    if (musicConnected) {
      const tracks = ALL_TRACKS_BY_SERVICE[s];
      setMusicState({ ...tracks[0], isPlaying: true, progress: 0, trackIndex: 0 });
    }
  }, [musicConnected]);

  const musicPlay = useCallback(() => {
    if (!musicConnected) return;
    setMusicState(prev => ({ ...prev, isPlaying: true }));
  }, [musicConnected]);

  const musicPause = useCallback(() => {
    setMusicState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const musicTogglePlayPause = useCallback(() => {
    if (!musicConnected) return;
    setMusicState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [musicConnected]);

  const musicNext = useCallback(() => {
    if (!musicConnected) return;
    const tracks = ALL_TRACKS_BY_SERVICE[selectedService];
    setMusicState(prev => {
      const nextIdx = (prev.trackIndex + 1) % tracks.length;
      return { ...tracks[nextIdx], isPlaying: true, progress: 0, trackIndex: nextIdx };
    });
  }, [musicConnected, selectedService]);

  const musicPrev = useCallback(() => {
    if (!musicConnected) return;
    const tracks = ALL_TRACKS_BY_SERVICE[selectedService];
    setMusicState(prev => {
      const prevIdx = prev.trackIndex <= 0 ? tracks.length - 1 : prev.trackIndex - 1;
      return { ...tracks[prevIdx], isPlaying: true, progress: 0, trackIndex: prevIdx };
    });
  }, [musicConnected, selectedService]);

  const logout = () => {
    setActiveDevice('none');
    setUserProfile(null);
    setCurrentPlan('Base');
    setCartridgeLevel(85);
    setPoints(450);
    setControlMode('smart');
    setSelectedVariant(null);
    setBurstHistory([]);
    setAuraConnected(false);
    setNearbyUser(null);
    setMusicConnected(false);
    setMusicAIMode(true);
    setMusicState(DEFAULT_MUSIC);
  };

  const getVariantsForDevice = useCallback((device: DeviceType): RefillVariant[] => {
    return ALL_VARIANTS.filter(v => v.baseLine === device);
  }, []);

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
      logout,
      controlMode,
      setControlMode,
      selectedVariant,
      setSelectedVariant,
      cartridgeDaysLeft,
      dailyUsageMl,
      musicState,
      auraConnected,
      nearbyUser,
      scheduledDoses,
      setScheduledDoses,
      burstHistory,
      getVariantsForDevice,
      musicConnected,
      musicAIMode,
      selectedService,
      setSelectedService,
      toggleMusicConnection,
      toggleMusicAIMode,
      musicPlay,
      musicPause,
      musicTogglePlayPause,
      musicNext,
      musicPrev,
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
