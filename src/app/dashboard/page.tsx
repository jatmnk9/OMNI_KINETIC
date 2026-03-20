
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Thermometer, Droplets, Zap, ShieldCheck, Waves, BrainCircuit, Info, Settings, Heart, Gauge, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { biometricScentInsightSummaries, BiometricScentInsightSummariesOutput } from '@/ai/flows/biometric-scent-insight-summaries';
import { Skeleton } from '@/components/ui/skeleton';

const FIRING_MODES = [
  { id: 'focus', name: 'Focus Mode', icon: BrainCircuit, color: 'text-blue-400', desc: 'Sincronía cognitiva 0.3µL' },
  { id: 'energy', name: 'Energy Boost', icon: Zap, color: 'text-yellow-400', desc: 'Estimulación física HRV' },
  { id: 'sensual', name: 'Sensual Night', icon: Sparkles, color: 'text-purple-400', desc: 'Relajación profunda GSR' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { activeDevice, cartridgeLevel, triggerScent, currentPlan } = useDevice();
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
          { timestamp: new Date().toISOString(), type: 'heart_rate', value: 85 },
        ],
        scentUsage: [
          { timestamp: new Date().toISOString(), fragranceProfile: 'Bergamot Bloom', applicationNotes: 'Automatic focus trigger' }
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

  return (
    <main className="min-h-screen pb-24 transition-colors duration-700">
      <div className="p-6 pt-12 space-y-6 max-w-lg mx-auto">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{activeDevice} Hub</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-brand/40 text-brand">
                {currentPlan} Plan
              </Badge>
              {currentPlan === 'Premium' && (
                <Badge className="bg-accent text-white text-[9px] uppercase animate-pulse">Live Bio-Sync</Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
             <Settings className="w-5 h-5" />
          </Button>
        </header>

        <section className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-brand/5 border-brand/20 flex flex-col items-center gap-1">
            <Heart className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-bold uppercase opacity-60">HRV</span>
            <p className="text-lg font-bold">82ms</p>
          </Card>
          <Card className="p-3 bg-brand/5 border-brand/20 flex flex-col items-center gap-1">
            <Gauge className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-bold uppercase opacity-60">Stress</span>
            <p className="text-lg font-bold">Low</p>
          </Card>
          <Card className="p-3 bg-brand/5 border-brand/20 flex flex-col items-center gap-1">
            <Thermometer className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-bold uppercase opacity-60">Body</span>
            <p className="text-lg font-bold">36.6°</p>
          </Card>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Zap className="w-3 h-3" /> Modos de Disparo
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {FIRING_MODES.map((mode) => (
              <Card 
                key={mode.id} 
                className={`p-4 cursor-pointer transition-all border-none flex items-center gap-4 ${selectedMode === mode.id ? 'bg-white/10 ring-1 ring-white/20' : 'bg-card'}`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className={`p-2 rounded-lg bg-white/5 ${mode.color}`}>
                  <mode.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{mode.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{mode.desc}</p>
                </div>
                {selectedMode === mode.id && <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />}
              </Card>
            ))}
          </div>
        </section>

        <Card className="relative overflow-hidden group border-none bg-card shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-30 pointer-events-none" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Smart Refill Tracker
            </CardTitle>
            <CardDescription className="text-xs">Chip NFC: Sincronización exacta de volumen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold tracking-widest uppercase">
                <span className="opacity-60 text-[10px]">Fragrance Volume</span>
                <span className="text-accent">{cartridgeLevel.toFixed(1)}%</span>
              </div>
              <Progress value={cartridgeLevel} className="h-2 bg-white/5" />
              <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                <div className="flex items-center gap-1"><Info className="w-3 h-3" /> Predicción: 12 días restantes</div>
                <Badge variant="secondary" className="bg-brand/10 text-brand">NFC Verified</Badge>
              </div>
            </div>

            <Button 
              className={`w-full h-16 rounded-2xl text-white font-black tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden relative ${firing ? 'bg-accent scale-95 shadow-inner' : 'bg-brand shadow-lg hover:shadow-brand/50 hover:-translate-y-1'}`}
              onClick={handleManualTrigger}
              disabled={firing}
            >
              {firing ? (
                <span className="flex items-center gap-2 animate-pulse">
                  <Waves className="w-5 h-5" /> Liberando Micro-Dose
                </span>
              ) : (
                'Trigger Burst'
              )}
              {firing && <div className="absolute inset-0 bg-white/10 animate-ping" />}
            </Button>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h3 className="font-bold text-[10px] tracking-[0.2em] uppercase text-muted-foreground">AI Well-being Insights</h3>
          {loadingInsights ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : insights ? (
            <div className="space-y-4">
              <Card className="p-4 bg-white/5 border-none italic text-sm leading-relaxed rounded-xl">
                "{insights.overallSummary}"
              </Card>
              {insights.insights.map((insight, idx) => (
                <Card key={idx} className="p-4 border-none bg-card rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                      <Info className="w-5 h-5 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold uppercase text-accent tracking-widest">{insight.fragranceProfile} • {insight.biometricType}</p>
                      <p className="text-xs leading-relaxed opacity-90">{insight.insight}</p>
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
