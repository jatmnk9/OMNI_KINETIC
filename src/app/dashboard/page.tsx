
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Thermometer, Droplets, Zap, ShieldCheck, Waves, BrainCircuit, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { biometricScentInsightSummaries, BiometricScentInsightSummariesOutput } from '@/ai/flows/biometric-scent-insight-summaries';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const { activeDevice, cartridgeLevel, triggerScent } = useDevice();
  const [firing, setFiring] = useState(false);
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

  const getMetricIcon = () => {
    switch (activeDevice) {
      case 'Prada': return <Activity className="w-8 h-8 text-brand" />;
      case 'YSL': return <BrainCircuit className="w-8 h-8 text-brand" />;
      case 'Biotherm': return <Waves className="w-8 h-8 text-brand" />;
      default: return <Droplets className="w-8 h-8" />;
    }
  };

  const getMetricLabel = () => {
    switch (activeDevice) {
      case 'Prada': return 'HRV & Accel';
      case 'YSL': return 'GSR & Stress';
      case 'Biotherm': return 'Aquatic Recovery';
      default: return 'Telemetry';
    }
  };

  return (
    <main className="min-h-screen pb-24 transition-colors duration-700">
      <div className="p-6 pt-12 space-y-6 max-w-lg mx-auto">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{activeDevice} Hub</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{getMetricLabel()}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
             <Settings className="w-5 h-5" />
          </Button>
        </header>

        <section className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-brand/10 border-brand/20 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Activity className="w-5 h-5 text-accent" />
              <span className="text-[10px] font-bold uppercase opacity-60">Status</span>
            </div>
            <p className="text-2xl font-bold">Optimal</p>
          </Card>
          <Card className="p-4 bg-brand/10 border-brand/20 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Thermometer className="w-5 h-5 text-accent" />
              <span className="text-[10px] font-bold uppercase opacity-60">Temp</span>
            </div>
            <p className="text-2xl font-bold">36.6°C</p>
          </Card>
        </section>

        <Card className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/40 to-transparent opacity-20 pointer-events-none" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getMetricIcon()}
              <span>Real-time Telemetry</span>
            </CardTitle>
            <CardDescription>Live data stream from {activeDevice} sensors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-4xl font-bold tabular-nums">74%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Focus Score</p>
              </div>
              <div className="flex gap-1 items-end h-16">
                {[40, 60, 50, 80, 70, 90, 85].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-2 bg-brand rounded-t-sm" 
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-medium">
                <span>Fragridge Level</span>
                <span>{cartridgeLevel.toFixed(1)}%</span>
              </div>
              <Progress value={cartridgeLevel} className="h-2 bg-white/10" />
            </div>

            <Button 
              className={`w-full h-14 rounded-xl text-white font-bold tracking-widest uppercase transition-all duration-500 overflow-hidden relative ${firing ? 'bg-accent scale-95 shadow-inner' : 'bg-brand shadow-lg hover:shadow-brand/50 hover:-translate-y-1'}`}
              onClick={handleManualTrigger}
              disabled={firing}
            >
              {firing ? (
                <span className="flex items-center gap-2 animate-pulse">
                  <Zap className="w-5 h-5" /> Firing Micro-Dose
                </span>
              ) : (
                'Trigger Burst'
              )}
              {firing && (
                <div className="absolute inset-0 bg-white/20 animate-ping" />
              )}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">Precision 0.3µL to 0.5µL Delivery</p>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h3 className="font-bold text-sm tracking-widest uppercase text-muted-foreground">AI Well-being Insights</h3>
          {loadingInsights ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : insights ? (
            <div className="space-y-4">
              <Card className="p-4 bg-white/5 border-white/10 italic text-sm leading-relaxed">
                "{insights.overallSummary}"
              </Card>
              {insights.insights.map((insight, idx) => (
                <Card key={idx} className="p-4 border-l-4 border-l-brand bg-card">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">{insight.fragranceProfile} • {insight.biometricType}</p>
                      <p className="text-sm">{insight.insight}</p>
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

import { Settings } from 'lucide-react';
