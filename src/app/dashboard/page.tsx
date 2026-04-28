
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Droplets,
  ChevronRight,
  Settings,
  ChevronDown,
  ChevronUp,
  Heart,
  Gauge,
  Thermometer,
  BrainCircuit,
  Clock,
  Hand,
  Beaker,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { DigitalTwin } from '@/components/DigitalTwin';
import { MusicSyncWidget } from '@/components/MusicSyncWidget';
import { CartridgeGauge } from '@/components/CartridgeGauge';
import { ControlPanel } from '@/components/ControlPanel';
import { BurstButton } from '@/components/BurstButton';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    activeDevice, 
    activeFragrance,
    getFragrance,
    devicePerfumeMl,
    estimatedDeviceSprays,
    triggerScent, 
    biometrics,
    controlMode,
    setControlMode,
    musicState,
    musicConnected,
    musicTogglePlayPause,
    scheduledDoses,
    setScheduledDoses,
    locationTriggers,
    setLocationTriggers,
    calendarSync,
    setCalendarSync,
  } = useDevice();

  const [showControlPanel, setShowControlPanel] = useState(false);

  useEffect(() => {
    if (activeDevice === 'none') {
      router.push('/');
    }
  }, [activeDevice, router]);

  const fragrance = getFragrance();
  const deviceLabel = activeDevice === 'ApexEssence' ? 'Necklace' : activeDevice === 'Synapse' ? 'Bracelet' : 'Ring';
  const stressColor = biometrics.stress === 'High' ? 'text-orange-400' : biometrics.stress === 'Medium' ? 'text-yellow-400' : 'text-green-400';
  const stressBg = biometrics.stress === 'High' ? 'bg-orange-500/10' : biometrics.stress === 'Medium' ? 'bg-yellow-500/10' : 'bg-green-500/10';

  return (
    <main className="min-h-screen pb-24 relative overflow-hidden transition-colors duration-1000">
      <Header />

      <div className="relative z-10 p-6 space-y-6 max-w-lg mx-auto">
        {/* === DEVICE + FRAGRANCE BADGES === */}
        <section className="flex items-center justify-center gap-2">
          {fragrance && (
            <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-brand-accent/40 text-brand-accent font-bold">
              {fragrance.name}
            </Badge>
          )}
          <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-white/10 font-bold">
            {deviceLabel}
          </Badge>
          {controlMode === 'smart' && (
            <Badge className="bg-blue-500/20 text-blue-400 text-[8px] uppercase tracking-widest animate-pulse font-bold border-none">
              Autopilot
            </Badge>
          )}
        </section>

        {/* === BIOMETRIC CARDS === */}
        <section className="grid grid-cols-3 gap-3">
          <Card className="p-5 bg-brand/10 border-none rounded-[1.8rem] flex flex-col items-center gap-2 relative overflow-hidden">
            <div className="w-10 h-10 bg-brand/15 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400 animate-heartbeat-sync" />
            </div>
            <span className="text-[8px] uppercase font-black tracking-[0.2em] opacity-50">HRV</span>
            <p className="text-2xl font-black tabular-nums">{biometrics.hrv}<span className="text-[10px] opacity-30 ml-0.5">ms</span></p>
          </Card>
          <Card className={cn("p-5 border-none rounded-[1.8rem] flex flex-col items-center gap-2 relative overflow-hidden", stressBg)}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stressBg)}>
              <Gauge className={cn("w-5 h-5", stressColor)} />
            </div>
            <span className="text-[8px] uppercase font-black tracking-[0.2em] opacity-50">Stress</span>
            <p className={cn("text-2xl font-black", stressColor)}>{biometrics.stress}</p>
          </Card>
          <Card className="p-5 bg-blue-500/10 border-none rounded-[1.8rem] flex flex-col items-center gap-2 relative overflow-hidden">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[8px] uppercase font-black tracking-[0.2em] opacity-50">Temp</span>
            <p className="text-2xl font-black tabular-nums">{biometrics.temp}<span className="text-[10px] opacity-30 ml-0.5">°C</span></p>
          </Card>
        </section>

        {/* === MUSIC SYNC WIDGET === */}
        <MusicSyncWidget music={musicState} bpm={biometrics.hrv} connected={musicConnected} onPlayPause={musicTogglePlayPause} clickable />

        {/* === DIGITAL TWIN === */}
        <section className="relative">
          <DigitalTwin hrv={biometrics.hrv} stress={biometrics.stress} temp={biometrics.temp} bpm={musicState.bpm} controlMode={controlMode} isPlaying={musicState.isPlaying} coverColor={musicState.coverColor} />
        </section>

        {/* === PERIPHERAL WIDGETS === */}
        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-white/[0.03] border-none rounded-[1.8rem] flex items-center gap-3 cursor-pointer group hover:bg-white/[0.06] transition-all relative overflow-hidden" onClick={() => router.push('/refill')}>
            <CartridgeGauge level={Math.round((devicePerfumeMl / 1.2) * 100)} daysLeft={estimatedDeviceSprays} mini />
            <div className="flex-1 space-y-0.5 min-w-0">
              <p className="text-[8px] uppercase font-bold tracking-widest opacity-30">Device</p>
              <p className="text-xs font-black tabular-nums">{estimatedDeviceSprays} sprays</p>
            </div>
            <ChevronRight className="w-4 h-4 opacity-10 group-hover:opacity-40 transition-opacity shrink-0" />
          </Card>
          <Card className="p-4 bg-white/[0.03] border-none rounded-[1.8rem] flex items-center gap-3 cursor-pointer group hover:bg-white/[0.06] transition-all relative overflow-hidden" onClick={() => router.push('/refill')}>
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
              {fragrance ? (
                <div className="relative w-8 h-8">
                  <Image src={fragrance.img} alt={fragrance.name} fill className="object-contain" />
                </div>
              ) : (
                <Beaker className="w-5 h-5 text-brand-accent" />
              )}
            </div>
            <div className="flex-1 space-y-0.5 min-w-0">
              <p className="text-[8px] uppercase font-bold tracking-widest opacity-30">Fragrance</p>
              <p className="text-xs font-bold truncate">{fragrance?.name || 'None'}</p>
            </div>
            <ChevronRight className="w-4 h-4 opacity-10 group-hover:opacity-40 transition-opacity shrink-0" />
          </Card>
        </section>

        {/* === QUICK ACTION BAR === */}
        <section className="flex items-center gap-3">
          {controlMode === 'manual' && <BurstButton onBurst={triggerScent} compact />}
          <div className="flex-1 flex bg-white/[0.03] rounded-2xl p-1 gap-0.5">
            {(['smart', 'habit', 'manual'] as const).map((mode) => {
              const ModeIcon = mode === 'smart' ? BrainCircuit : mode === 'habit' ? Clock : Hand;
              return (
                <button key={mode} onClick={() => setControlMode(mode)} className={cn(
                  "flex-1 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all duration-500 flex items-center justify-center gap-1.5",
                  controlMode === mode
                    ? cn("bg-white/10 shadow-md", mode === 'smart' && "text-blue-400", mode === 'habit' && "text-yellow-400", mode === 'manual' && "text-omni-orange")
                    : "opacity-30 hover:opacity-60"
                )}>
                  <ModeIcon className="w-3 h-3" />
                  {mode === 'smart' ? 'Smart' : mode === 'habit' ? 'Habit' : 'Manual'}
                </button>
              );
            })}
          </div>
        </section>

        {/* === CONTROL PANEL EXPANDABLE === */}
        <section>
          <button onClick={() => setShowControlPanel(!showControlPanel)} className="w-full flex items-center justify-between py-3 group">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
              <Settings className="w-3 h-3" /> Control Panel
            </span>
            {showControlPanel ? <ChevronUp className="w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity" /> : <ChevronDown className="w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity" />}
          </button>
          {showControlPanel && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-500 pb-4">
              <ControlPanel 
                controlMode={controlMode} 
                setControlMode={setControlMode} 
                scheduledDoses={scheduledDoses} 
                setScheduledDoses={setScheduledDoses} 
                onBurst={triggerScent} 
                biometrics={biometrics}
                locationTriggers={locationTriggers}
                setLocationTriggers={setLocationTriggers}
                calendarSync={calendarSync}
                setCalendarSync={setCalendarSync}
              />
            </div>
          )}
        </section>

        {/* === REFILL CTA === */}
        <Card className="relative overflow-hidden group border-none bg-card shadow-2xl rounded-[2.5rem] cursor-pointer hover:bg-white/5 transition-all duration-700 mb-4" onClick={() => router.push('/refill')}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20 pointer-events-none" />
          <div className="p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-omni-orange/10 rounded-2xl flex items-center justify-center shrink-0">
              <Droplets className="w-6 h-6 text-omni-orange" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-bold text-sm tracking-tight">Smart Refill & Store</h3>
              <p className="text-[10px] text-muted-foreground truncate">Order refills, manage subscriptions & track levels</p>
            </div>
            <ChevronRight className="w-5 h-5 opacity-20 group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        </Card>
      </div>
      <Navigation />
    </main>
  );
}
