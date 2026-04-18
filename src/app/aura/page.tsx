"use client";

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Bluetooth,
  Music,
  Users,
  Wifi,
  WifiOff,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { MusicSyncWidget } from '@/components/MusicSyncWidget';
import { cn } from '@/lib/utils';

const ENCOUNTER_HISTORY = [
  { name: 'Alejandro M.', device: 'Synapse', time: 'Today, 09:32', note: 'Amber Night', playlist: 'Deep Electronic Mix' },
  { name: 'Sofia R.', device: 'ApexEssence', time: 'Yesterday, 18:15', note: 'Extreme Citrus', playlist: 'High Energy Run' },
  { name: 'Marco T.', device: 'Kinetic', time: 'Apr 16, 07:45', note: 'Marine Kelp', playlist: 'Morning Flow' },
];

export default function AuraPage() {
  const { auraConnected, nearbyUser, musicState, activeDevice, biometrics } = useDevice();
  const [scanPulse, setScanPulse] = useState(0);

  useEffect(() => {
    if (auraConnected) return;
    const interval = setInterval(() => {
      setScanPulse(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, [auraConnected]);

  const deviceLabel = activeDevice === 'ApexEssence' ? 'Apex Essence' : activeDevice;

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground">
      <Header />

      <div className="max-w-lg mx-auto p-6 space-y-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-headline font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-accent">
            Aura Connect
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Olfactory-Musical Synchronization</p>
        </header>

        {/* === CONNECTION STATUS === */}
        <section className="flex flex-col items-center space-y-6 py-6">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {[1, 2, 3].map((ring) => (
              <div
                key={ring}
                className={cn(
                  "absolute rounded-full border transition-all duration-1000",
                  auraConnected 
                    ? "border-brand-accent/30" 
                    : "border-white/5"
                )}
                style={{
                  width: `${ring * 33}%`,
                  height: `${ring * 33}%`,
                  opacity: auraConnected ? 0.6 : (scanPulse >= ring ? 0.3 : 0.08),
                  transform: auraConnected ? 'scale(1)' : `scale(${scanPulse >= ring ? 1.1 : 1})`,
                }}
              />
            ))}

            {!auraConnected && (
              <>
                <div className="absolute inset-0 rounded-full border border-white/10 animate-wave-expand" />
                <div className="absolute inset-0 rounded-full border border-white/5 animate-wave-expand" style={{ animationDelay: '1s' }} />
              </>
            )}

            <div className={cn(
              "relative w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-700 z-10",
              auraConnected 
                ? "bg-brand-accent text-background shadow-[0_0_40px_hsl(var(--brand-accent)/0.4)] scale-110" 
                : "bg-white/5 text-white/40 border border-white/10"
            )}>
              {auraConnected ? (
                <Users className="w-8 h-8 animate-in zoom-in duration-500" />
              ) : (
                <Bluetooth className="w-8 h-8 animate-pulse" />
              )}
            </div>

            {auraConnected && nearbyUser && (
              <div className="absolute -top-2 -right-2 glass-premium px-3 py-2 rounded-xl animate-in slide-in-from-right-4 zoom-in duration-500 z-20">
                <p className="text-[10px] font-bold text-brand-accent">{nearbyUser.name}</p>
                <p className="text-[8px] opacity-40">{nearbyUser.distance}</p>
              </div>
            )}
          </div>

          <div className="text-center space-y-1">
            {auraConnected ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--brand-accent))]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-accent">Connected</span>
                </div>
                <p className="text-[10px] text-white/40">
                  BLE 5.2 — {nearbyUser?.name} ({nearbyUser?.device})
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <Wifi className="w-3 h-3 text-white/30 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">Scanning via BLE 5.2</span>
                </div>
                <p className="text-[10px] text-white/20">Searching for nearby Omni-Kinetic devices...</p>
              </>
            )}
          </div>
        </section>

        {/* === SHARED SENSORIAL ROOM === */}
        {auraConnected && nearbyUser && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-brand-accent animate-pulse" /> Shared Sensorial Room
            </h2>

            <Card className="p-6 glass-premium rounded-[2.5rem] space-y-5 border border-brand-accent/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-2xl bg-brand/20 flex items-center justify-center border border-brand/20">
                      <span className="text-[10px] font-black text-white">YOU</span>
                    </div>
                    <span className="text-[8px] font-bold opacity-40">{deviceLabel}</span>
                  </div>

                  <div className="flex items-center gap-1 px-2">
                    <div className="w-6 h-px bg-gradient-to-r from-brand to-transparent" />
                    <Radio className="w-4 h-4 text-brand-accent animate-pulse" />
                    <div className="w-6 h-px bg-gradient-to-l from-brand to-transparent" />
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/20">
                      <span className="text-[10px] font-bold text-purple-300">{nearbyUser.name.charAt(0)}</span>
                    </div>
                    <span className="text-[8px] font-bold opacity-40">{nearbyUser.device}</span>
                  </div>
                </div>

                <Badge className="bg-brand-accent/10 text-brand-accent border-none text-[7px] uppercase tracking-widest font-black">
                  {nearbyUser.distance}
                </Badge>
              </div>

              <div className="bg-white/5 rounded-xl p-4 space-y-1">
                <p className="text-[8px] uppercase tracking-[0.3em] opacity-40 font-bold">Synchronized Proximity Note</p>
                <p className="text-sm font-bold text-brand-accent">{nearbyUser.variant}</p>
                <p className="text-[10px] text-white/30 italic">Both devices releasing the same fragrance</p>
              </div>
            </Card>

            <Card className="p-6 glass-premium rounded-[2.5rem] space-y-4 border border-brand-accent/10">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-brand-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Active Jam Session</span>
              </div>
              <p className="text-[10px] text-white/40 italic">
                AI-generated playlist blending both users musical preferences
              </p>
              <MusicSyncWidget music={musicState} bpm={biometrics.hrv} />
            </Card>
          </section>
        )}

        {!auraConnected && (
          <Card className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-center space-y-4">
            <WifiOff className="w-10 h-10 mx-auto text-white/10" />
            <div className="space-y-1">
              <h3 className="font-bold text-base opacity-40">No nearby devices</h3>
              <p className="text-[10px] text-white/20 max-w-[220px] mx-auto leading-relaxed">
                When another Omni-Kinetic user is nearby, the Shared Sensorial Room will activate automatically
              </p>
            </div>
          </Card>
        )}

        {/* === ENCOUNTER HISTORY === */}
        <section className="space-y-4 pb-4">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
            <Clock className="w-3 h-3" /> Recent Encounters
          </h2>
          <div className="space-y-3">
            {ENCOUNTER_HISTORY.map((encounter, idx) => (
              <Card 
                key={idx} 
                className="p-4 bg-white/[0.03] border-none rounded-[1.5rem] flex items-center gap-4 hover:bg-white/[0.06] transition-colors"
              >
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/5">
                  <span className="text-sm font-bold opacity-40">{encounter.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{encounter.name}</span>
                    <span className="text-[8px] opacity-20">•</span>
                    <span className="text-[9px] opacity-30">{encounter.device}</span>
                  </div>
                  <p className="text-[9px] text-white/30 truncate">{encounter.note} — {encounter.playlist}</p>
                </div>
                <span className="text-[8px] text-white/20 shrink-0 font-medium">{encounter.time}</span>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <Navigation />
    </main>
  );
}
