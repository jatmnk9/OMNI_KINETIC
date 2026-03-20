"use client";

import React from 'react';
import { Award, Recycle, Trophy, Gift, ArrowUpRight, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';

export default function RewardsPage() {
  const { points } = useDevice();
  const nextTier = 1000;
  const progress = (points / nextTier) * 100;

  const missions = [
    { title: 'Return 3 Cartridges', reward: '250 Pts', progress: 2, total: 3, icon: Recycle },
    { title: '10 HRV Milestones', reward: '500 Pts', progress: 7, total: 10, icon: Trophy },
    { title: 'Consistency Streak', reward: 'Exclusive Aroma', progress: 4, total: 5, icon: Gift },
  ];

  return (
    <main className="min-h-screen pb-24 bg-background">
      <div className="p-6 pt-12 space-y-8 max-w-lg mx-auto">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-headline font-bold">Rewards</h1>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <Award className="w-5 h-5 text-accent" />
            <span className="font-bold tabular-nums">{points}</span>
          </div>
        </header>

        <Card className="bg-white text-black border-none relative overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
          <CardHeader>
            <CardTitle className="font-black text-2xl tracking-tight">Elite Status</CardTitle>
            <CardDescription className="text-black/60 font-medium">You are {nextTier - points} points away from Platinum.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progress} className="h-3 bg-black/10" />
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-black/80">
              <span>Tier: Gold</span>
              <span>Next: Platinum</span>
            </div>
            <Button className="w-full bg-black text-white hover:bg-black/90 gap-2 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs">
              <QrCode className="w-4 h-4" /> Scan NFC at Boutique
            </Button>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">Active Missions</h2>
          <div className="space-y-4">
            {missions.map((m, idx) => (
              <Card key={idx} className="p-5 bg-card border-none flex items-center gap-5 rounded-[1.5rem] group hover:bg-white/5 transition-colors">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                  <m.icon className="w-7 h-7 text-accent" />
                </div>
                <div className="flex-1 space-y-2.5">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-sm tracking-tight">{m.title}</h3>
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">{m.reward}</span>
                  </div>
                  <Progress value={(m.progress / m.total) * 100} className="h-1.5 bg-white/5" />
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">{m.progress} / {m.total} Completed</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
              </Card>
            ))}
          </div>
        </section>

        <Card className="bg-card border-none p-8 text-center space-y-6 rounded-[2rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          <Recycle className="w-14 h-14 mx-auto text-accent opacity-40 animate-pulse" />
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Circular Loyalty</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] mx-auto">Return empty cartridges to any flagship boutique to unlock limited edition aromas.</p>
          </div>
          <Button variant="outline" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] border-white/10">Find Nearest Station</Button>
        </Card>
      </div>
      <Navigation />
    </main>
  );
}
