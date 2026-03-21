
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Thermometer, 
  Zap, 
  Waves, 
  BrainCircuit, 
  Info, 
  Heart, 
  Gauge, 
  Sparkles, 
  LogOut, 
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
import { biometricScentInsightSummaries, BiometricScentInsightSummariesOutput } from '@/ai/flows/biometric-scent-insight-summaries';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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
          { timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'stress', value: 72 },
          { timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'focus', value: 45 },
          { timestamp: new Date().toISOString(), type: 'heart_rate', value: biometrics.hrv },
        ],
        scentUsage: [
          { timestamp: new Date(Date.now() - 3600000).toISOString(), fragranceProfile: 'Aether Bloom', applicationNotes: 'Automatic focus trigger' },
          { timestamp: new Date(Date.now() - 7200000).toISOString(), fragranceProfile: 'Midnight Synapse', applicationNotes: 'Evening relaxation' }
        ]
      });
      setInsights(result);
    } catch (e) {
      console.error("Failed to fetch AI insights:", e);
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
      <div className="p-6 pt-12 space-y-8 max-w-lg mx-auto">
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
          <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-white/5 rounded-full h-12 w-12 transition-all">
             <LogOut className="w-5 h-5 opacity-40" />
          </Button>
        </header>

        {/* Biometric Cards with enhanced color and animation */}
        <section className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-white/5 border-none flex flex-col items-center gap-2 rounded-[2rem] relative overflow-hidden group transition-all duration-500 hover:bg-white/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Heart className={cn("w-5 h-5 text-red-500 transition-transform duration-300", biometrics.hrv > 85 ? "animate-bounce" : "animate-pulse")} />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">HRV</span>
            <p className="text-2xl font-black font-body tabular-nums">{biometrics.hrv}<span className="text-[10px] ml-0.5 opacity-40">ms</span></p>
          </Card>
          
          <Card className="p-4 bg-white/5 border-none flex flex-col items-center gap-2 rounded-[2rem] relative overflow-hidden group transition-all duration-500 hover:bg-white/10">
             <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Gauge className={cn("w-5 h-5 transition-colors duration-500", biometrics.stress === 'High' ? 'text-orange-500' : 'text-green-500')} />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Stress</span>
            <p className="text-2xl font-black font-body">{biometrics.stress}</p>
          </Card>

          <Card className="p-4 bg-white/5 border-none flex flex-col items-center gap-2 rounded-[2rem] relative overflow-hidden group transition-all duration-500 hover:bg-white/10">
             <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Thermometer className="w-5 h-5 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Temp</span>
            <p className="text-2xl font-black font-body tabular-nums">{biometrics.temp}<span className="text-[10px] ml-0.5 opacity-40">°C</span></p>
          </Card>
        </section>

        {/* Firing Modes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
              <Zap className="w-3 h-3" /> Firing Modes
            </h3>
            <Badge variant="ghost" className="text-[8px] opacity-40 uppercase tracking-widest">Active Link</Badge>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {FIRING_MODES.map((mode) => (
              <Card 
                key={mode.id} 
                className={`p-5 cursor-pointer transition-all duration-500 border-none flex items-center gap-4 rounded-[1.8rem] ${selectedMode === mode.id ? 'bg-white/10 ring-1 ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)]' : 'bg-card hover:bg-white/5'}`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className={`p-3 rounded-2xl bg-white/5 ${mode.color} transition-transform duration-500 group-hover:scale-110`}>
                  <mode.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <h4 className="font-bold text-sm tracking-tight">{mode.name}</h4>
                  <p className="text-[10px] text-muted-foreground tracking-wide font-medium">{mode.desc}</p>
                </div>
                {selectedMode === mode.id && <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.5)]" />}
              </Card>
            ))}
          </div>
        </section>

        {/* Smart Refill Tracker */}
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
              <div className="flex justify-between items-center text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                <div className="flex items-center gap-1.5"><Info className="w-3 h-3" /> Estimate: 18 days left</div>
                <Badge variant="secondary" className="bg-white/5 text-white border-none text-[8px] tracking-widest">NFC Validated</Badge>
              </div>
            </div>

            <Button 
              className={`w-full h-20 rounded-[1.8rem] font-black tracking-[0.3em] uppercase transition-all duration-700 overflow-hidden relative shadow-2xl ${firing ? 'bg-brand text-accent-foreground scale-95' : 'bg-brand text-accent-foreground hover:-translate-y-1'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleManualTrigger();
              }}
              disabled={firing}
            >
              {firing ? (
                <span className="flex items-center gap-4 animate-pulse text-accent-foreground">
                  <Wind className="w-6 h-6" /> Releasing Dose
                </span>
              ) : (
                <span className="text-accent-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 opacity-60" /> Trigger Burst
                </span>
              )}
              {firing && <div className="absolute inset-0 bg-white/20 animate-ping" />}
            </Button>
          </CardContent>
        </Card>

        {/* AI Well-being Insights Section */}
        <section className="space-y-6 pb-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[10px] tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" /> AI Well-being Insights
            </h3>
            <Button variant="ghost" size="sm" onClick={fetchInsights} className="text-[9px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100">Refresh</Button>
          </div>

          {loadingInsights ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-[2rem] bg-white/5" />
              <Skeleton className="h-24 w-full rounded-[2rem] bg-white/5" />
              <Skeleton className="h-24 w-full rounded-[2rem] bg-white/5" />
            </div>
          ) : insights ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Card className="p-8 bg-gradient-to-br from-brand-primary/20 to-transparent border-none italic text-sm leading-relaxed rounded-[2.5rem] font-light shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Wind className="w-20 h-20 -rotate-12" />
                </div>
                <span className="relative z-10 block">"{insights.overallSummary}"</span>
              </Card>

              {insights.insights.map((insight, idx) => (
                <Card key={idx} className="p-6 border-none bg-card rounded-[2rem] group hover:bg-white/10 transition-all duration-500">
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
               <Activity className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
               <p className="text-xs font-medium tracking-wide">Syncing biometric history for deep analysis...</p>
             </Card>
          )}
        </section>
      </div>
      <Navigation />
    </main>
  );
}
