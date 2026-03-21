
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Thermometer, Zap, Waves, BrainCircuit, Info, Heart, Gauge, Sparkles, LogOut, ChevronRight, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { biometricScentInsightSummaries, BiometricScentInsightSummariesOutput } from '@/ai/flows/biometric-scent-insight-summaries';
import { Skeleton } from '@/components/ui/skeleton';

const FIRING_MODES = [
  { id: 'focus', name: 'Focus Mode', icon: BrainCircuit, color: 'text-blue-400', desc: 'Cognitive Sync 0.3µL' },
  { id: 'energy', name: 'Energy Boost', icon: Zap, color: 'text-yellow-400', desc: 'Physical Stimulation' },
  { id: 'sensual', name: 'Sensual Night', icon: Sparkles, color: 'text-purple-400', desc: 'Deep GSR Relaxation' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { activeDevice, cartridgeLevel, triggerScent, currentPlan, biometrics, logout } = useDevice();
  const [firing, setFiring] = useState(false);
  const [selectedMode, setSelectedMode] = useState('focus');
  const [insights, setInsights] = useState<BiometricScentInsightSummariesOutput | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (activeDevice === 'none') {
      router.push('/');
    } else {
      fetchInsights();
    }
  }, [activeDevice, router]);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const result = await biometricScentInsightSummaries({
        biometricData: [
          { timestamp: new Date().toISOString(), type: 'stress', value: 72 },
          { timestamp: new Date().toISOString(), type: 'focus', value: 45 },
          { timestamp: new Date().toISOString(), type: 'heart_rate', value: biometrics.hrv },
        ],
        scentUsage: [
          { timestamp: new Date().toISOString(), fragranceProfile: 'Aether Bloom', applicationNotes: 'Automatic focus trigger' }
        ]
      });
      setInsights(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleManualTrigger = () => {
    setFiring(true);
    triggerScent();
    setTimeout(() => setFiring(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const deviceLabel = activeDevice === 'ApexEssence' ? 'Apex Essence' : activeDevice;

  return (
    <main className="min-h-screen pb-24 transition-colors duration-700">
      <div className="p-6 pt-12 space-y-6 max-w-lg mx-auto">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold tracking-tight">{deviceLabel} Hub</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-brand/40 text-brand font-bold">
                {currentPlan} Intelligence
              </Badge>
              {currentPlan === 'Premium' && (
                <Badge className="bg-accent text-accent-foreground text-[9px] uppercase tracking-widest animate-pulse font-bold">Live Bio-Sync</Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
             <LogOut className="w-5 h-5 opacity-40" />
          </Button>
        </header>

        <section className="grid grid-cols-3 gap-3">
          <Card className="p-4 bg-white/5 border-none flex flex-col items-center gap-2 rounded-2xl">
            <Heart className="w-4 h-4 text-brand-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">HRV</span>
            <p className="text-xl font-bold font-body tabular-nums">{biometrics.hrv}ms</p>
          </Card>
          <Card className="p-4 bg-white/5 border-none flex flex-col items-center gap-2 rounded-2xl">
            <Gauge className="w-4 h-4 text-brand-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Stress</span>
            <p className="text-xl font-bold font-body">{biometrics.stress}</p>
          </Card>
          <Card className="p-4 bg-white/5 border-none flex flex-col items-center gap-2 rounded-2xl">
            <Thermometer className="w-4 h-4 text-brand-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Temp</span>
            <p className="text-xl font-bold font-body tabular-nums">{biometrics.temp}°</p>
          </Card>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
            <Zap className="w-3 h-3" /> Firing Modes
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {FIRING_MODES.map((mode) => (
              <Card 
                key={mode.id} 
                className={`p-5 cursor-pointer transition-all border-none flex items-center gap-4 rounded-2xl ${selectedMode === mode.id ? 'bg-white/10 ring-1 ring-white/10' : 'bg-card'}`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className={`p-3 rounded-xl bg-white/5 ${mode.color}`}>
                  <mode.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <h4 className="font-bold text-sm tracking-tight">{mode.name}</h4>
                  <p className="text-[10px] text-muted-foreground tracking-wide font-medium">{mode.desc}</p>
                </div>
                {selectedMode === mode.id && <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]" />}
              </Card>
            ))}
          </div>
        </section>

        <Card 
          className="relative overflow-hidden group border-none bg-card shadow-2xl rounded-[2rem] cursor-pointer hover:bg-white/5 transition-colors"
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
                <span className="text-brand-accent">{cartridgeLevel.toFixed(1)}%</span>
              </div>
              <Progress value={cartridgeLevel} className="h-2 bg-white/5" />
              <div className="flex justify-between items-center text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                <div className="flex items-center gap-1.5"><Info className="w-3 h-3" /> Estimate: 18 days left</div>
                <Badge variant="secondary" className="bg-white/5 text-white border-none text-[8px] tracking-widest">NFC Validated</Badge>
              </div>
            </div>

            <Button 
              className={`w-full h-16 rounded-2xl font-bold tracking-[0.3em] uppercase transition-all duration-700 overflow-hidden relative shadow-2xl ${firing ? 'bg-brand text-accent-foreground scale-95' : 'bg-brand text-accent-foreground hover:-translate-y-1'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleManualTrigger();
              }}
              disabled={firing}
            >
              {firing ? (
                <span className="flex items-center gap-3 animate-pulse text-accent-foreground">
                  <Waves className="w-5 h-5" /> Releasing Dose
                </span>
              ) : (
                <span className="text-accent-foreground">Trigger Burst</span>
              )}
              {firing && <div className="absolute inset-0 bg-white/10 animate-ping" />}
            </Button>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h3 className="font-bold text-[10px] tracking-[0.3em] uppercase text-muted-foreground">AI Well-being Insights</h3>
          {loadingInsights ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ) : insights ? (
            <div className="space-y-4">
              <Card className="p-6 bg-white/5 border-none italic text-sm leading-relaxed rounded-2xl font-light">
                "{insights.overallSummary}"
              </Card>
              {insights.insights.map((insight, idx) => (
                <Card key={idx} className="p-5 border-none bg-card rounded-2xl group hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                      <Info className="w-5 h-5 text-brand-accent" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase text-brand-accent tracking-[0.2em]">{insight.fragranceProfile} • {insight.biometricType}</p>
                      <p className="text-xs leading-relaxed opacity-80 font-medium">{insight.insight}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}
        </section>
      </div>
      <Navigation />
    </main>
  );
}
