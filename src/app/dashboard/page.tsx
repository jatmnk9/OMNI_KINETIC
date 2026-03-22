
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Thermometer,
  Zap,
  BrainCircuit,
  Heart,
  Gauge,
  Sparkles,
  ChevronRight,
  Droplets,
  Activity,
  Wind
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
// Removed AI import
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const FIRING_MODES = [
  { id: 'focus', name: 'Focus Mode', icon: BrainCircuit, color: 'text-blue-400', glow: 'bg-blue-500/20', desc: 'Cognitive Sync 0.3µL' },
  { id: 'energy', name: 'Energy Boost', icon: Zap, color: 'text-yellow-400', glow: 'bg-yellow-500/20', desc: 'Physical Stimulation' },
  { id: 'sensual', name: 'Sensual Night', icon: Sparkles, color: 'text-purple-400', glow: 'bg-purple-500/20', desc: 'Deep GSR Relaxation' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { activeDevice, cartridgeLevel, triggerScent, currentPlan, biometrics } = useDevice();
  const [firing, setFiring] = useState(false);
  const [selectedMode, setSelectedMode] = useState('focus');
  const [moodPulse, setMoodPulse] = useState(false);
  const [insights, setInsights] = useState<any | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (activeDevice === 'none') {
      router.push('/');
    } else {
      fetchInsights();
    }
  }, [activeDevice, router]);

  useEffect(() => {
    setMoodPulse(true);
    const timer = setTimeout(() => setMoodPulse(false), 800);
    return () => clearTimeout(timer);
  }, [selectedMode]);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    // Removed AI call, using static insights
    setTimeout(() => {
      setInsights({
        overallSummary: "Your biometric patterns suggest a productive morning with elevated focus. The current regimen is effectively balancing your cortisol levels.",
        insights: [
          { fragranceProfile: "Apex Gold", biometricType: "focus", insight: "Released during peak cognitive load. Sustained alpha waves observed for 45 minutes." },
          { fragranceProfile: "Deep Synapse", biometricType: "stress", insight: "Significant reduction in GSR readings following the 8:00 PM application." }
        ]
      });
      setLoadingInsights(false);
    }, 1500);
  };

  const handleManualTrigger = () => {
    setFiring(true);
    triggerScent();
    setTimeout(() => setFiring(false), 2000);
  };

  const currentMood = FIRING_MODES.find(m => m.id === selectedMode);
  const deviceLabel = activeDevice === 'ApexEssence' ? 'Apex Essence' : activeDevice;

  return (
    <main className="min-h-screen pb-24 relative overflow-hidden transition-colors duration-1000">

      <div
        className={cn(
          "fixed inset-0 pointer-events-none z-0 transition-opacity duration-700",
          moodPulse ? "opacity-30" : "opacity-0",
          currentMood?.glow
        )}
      />

      <Header />

      <div className="relative z-10 p-6 space-y-8 max-w-lg mx-auto">
        <section className="space-y-1 text-center">
          <h1 className="text-3xl font-headline font-black tracking-tight uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-accent">
            {deviceLabel} WELLNESS
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-brand/40 text-brand font-bold">
              {currentPlan} Tier
            </Badge>
            {currentPlan === 'Premium' && (
              <Badge className="bg-accent text-accent-foreground text-[9px] uppercase tracking-widest animate-pulse font-bold">Live Bio-Sync</Badge>
            )}
          </div>
        </section>

        <section className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-white/5 border-none flex flex-col items-center gap-2 rounded-[2.5rem] relative overflow-hidden group transition-all duration-500 hover:bg-white/10 shadow-lg border border-white/5">
            <div className="absolute inset-0 bg-red-500/10 opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <Heart className={cn("w-6 h-6 text-red-500 transition-transform duration-300", biometrics.hrv > 85 ? "animate-bounce" : "animate-pulse")} />
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">HRV</span>
              <p className="text-2xl font-black font-body tabular-nums text-white">{biometrics.hrv}<span className="text-[10px] ml-0.5 opacity-40">ms</span></p>
            </div>
          </Card>

          <Card className="p-4 bg-white/5 border-none flex flex-col items-center gap-2 rounded-[2.5rem] relative overflow-hidden group transition-all duration-500 hover:bg-white/10 shadow-lg border border-white/5">
            <div className={cn("absolute inset-0 opacity-20 transition-all duration-500", biometrics.stress === 'High' ? 'bg-orange-500' : 'bg-green-500')} />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <Gauge className={cn("w-6 h-6 transition-colors duration-500", biometrics.stress === 'High' ? 'text-orange-500' : 'text-green-400')} />
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Stress</span>
              <p className="text-2xl font-black font-body text-white">{biometrics.stress}</p>
            </div>
          </Card>

          <Card className="p-4 bg-white/5 border-none flex flex-col items-center gap-2 rounded-[2.5rem] relative overflow-hidden group transition-all duration-500 hover:bg-white/10 shadow-lg border border-white/5">
            <div className="absolute inset-0 bg-blue-500/10 opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <Thermometer className="w-6 h-6 text-blue-400 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Temp</span>
              <p className="text-2xl font-black font-body tabular-nums text-white">{biometrics.temp}<span className="text-[10px] ml-0.5 opacity-40">°C</span></p>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
              <Zap className="w-3 h-3" /> Firing Modes
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {FIRING_MODES.map((mode) => (
              <Card
                key={mode.id}
                className={cn(
                  "p-5 cursor-pointer transition-all duration-500 border-none flex items-center gap-4 rounded-[1.8rem] relative overflow-hidden",
                  selectedMode === mode.id ? 'bg-white/10 ring-1 ring-white/10 shadow-2xl scale-[1.02]' : 'bg-card hover:bg-white/5'
                )}
                onClick={() => setSelectedMode(mode.id)}
              >
                {selectedMode === mode.id && (
                  <div className={cn("absolute inset-0 opacity-10 animate-pulse", mode.glow)} />
                )}
                <div className={cn("p-3 rounded-2xl bg-white/5 transition-transform duration-500 relative z-10", mode.color, selectedMode === mode.id && "scale-110")}>
                  <mode.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-0.5 relative z-10">
                  <h4 className="font-bold text-sm tracking-tight">{mode.name}</h4>
                  <p className="text-[10px] text-muted-foreground tracking-wide font-medium">{mode.desc}</p>
                </div>
                {selectedMode === mode.id && (
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-ping absolute" />
                    <div className="w-2.5 h-2.5 bg-brand-accent rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        <Card
          className="relative overflow-hidden group border-none bg-card shadow-2xl rounded-[2.5rem] cursor-pointer hover:bg-white/5 transition-all duration-700"
          onClick={() => router.push('/refill')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20 pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2 font-headline font-bold tracking-tight">
                <Droplets className="w-5 h-5 text-brand-accent" />
                Smart Refill Tracker
              </CardTitle>
              <ChevronRight className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" />
            </div>
            <CardDescription className="text-[10px] uppercase tracking-widest font-bold opacity-60">NFC Synchronization: Verified Volume.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pb-10">
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold tracking-[0.2em] uppercase">
                <span className="opacity-40">Cartridge Volume</span>
                <span className="text-brand-accent font-black">{cartridgeLevel.toFixed(1)}%</span>
              </div>
              <Progress value={cartridgeLevel} className="h-2 bg-white/5" />
            </div>

            <Button
              className={cn(
                "w-full h-20 rounded-[1.8rem] font-black tracking-[0.3em] uppercase transition-all duration-700 overflow-hidden relative shadow-2xl",
                firing ? 'bg-brand text-accent-foreground scale-95' : 'bg-brand text-accent-foreground hover:-translate-y-1'
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleManualTrigger();
              }}
              disabled={firing}
            >
              {firing ? (
                <span className="flex items-center gap-4 animate-pulse">
                  <Wind className="w-6 h-6 animate-spin duration-[3000ms]" /> Releasing Dose
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5 opacity-60" /> Trigger Burst
                </span>
              )}
              {firing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-white/20 animate-ping absolute rounded-full" />
                  <div className="w-full h-full bg-white/10 scale-150 animate-pulse absolute rounded-full" />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <section className="space-y-6 pb-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[10px] tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" /> AI Well-being Insights
            </h3>
            <Button variant="ghost" size="sm" onClick={fetchInsights} className="text-[9px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100" disabled={loadingInsights}>
              {loadingInsights ? "Analyzing..." : "Refresh"}
            </Button>
          </div>

          {loadingInsights ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-[2rem] bg-white/5" />
              <Skeleton className="h-24 w-full rounded-[2rem] bg-white/5" />
            </div>
          ) : insights ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Card className="p-8 bg-gradient-to-br from-brand-primary/20 to-transparent border-none italic text-sm leading-relaxed rounded-[2.5rem] font-light shadow-xl relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Wind className="w-20 h-20 -rotate-12" />
                </div>
                <span className="relative z-10 block text-foreground/90">"{insights.overallSummary}"</span>
              </Card>

              {insights.insights.map((insight, idx) => (
                <Card key={idx} className="p-6 border-none bg-card rounded-[2rem] group hover:bg-white/10 transition-all duration-500 border border-white/5">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      {insight.biometricType === 'stress' && <Gauge className="w-6 h-6 text-orange-400" />}
                      {insight.biometricType === 'heart_rate' && <Heart className="w-6 h-6 text-red-500" />}
                      {insight.biometricType === 'focus' && <BrainCircuit className="w-6 h-6 text-blue-400" />}
                      {!['stress', 'heart_rate', 'focus'].includes(insight.biometricType) && <Wind className="w-6 h-6 text-brand-accent" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black uppercase text-brand-accent tracking-[0.2em]">{insight.fragranceProfile}</p>
                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                        <p className="text-[10px] font-bold uppercase opacity-40 tracking-[0.2em]">{insight.biometricType}</p>
                      </div>
                      <p className="text-xs leading-relaxed opacity-80 font-medium">{insight.insight}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-10 bg-white/5 border-none rounded-[2.5rem] text-center space-y-4 opacity-50">
              <Activity className="w-12 h-12 mx-auto text-muted-foreground opacity-20 animate-pulse" />
              <p className="text-xs font-medium tracking-wide">Initializing biometric deep link...</p>
            </Card>
          )}
        </section>
      </div>
      <Navigation />
    </main>
  );
}
