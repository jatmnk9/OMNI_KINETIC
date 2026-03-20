
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
    <main className="min-h-screen pb-24">
      <div className="p-6 pt-12 space-y-8 max-w-lg mx-auto">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-headline font-bold">Rewards</h1>
          <div className="flex items-center gap-2 bg-brand/10 border border-brand/20 px-4 py-2 rounded-full">
            <Award className="w-5 h-5 text-accent" />
            <span className="font-bold tabular-nums">{points}</span>
          </div>
        </header>

        <Card className="bg-brand border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
          <CardHeader>
            <CardTitle>Elite Status</CardTitle>
            <CardDescription className="text-white/70">You are 550 points away from Platinum.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="h-3 bg-white/20" />
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/80">
              <span>Current: Gold</span>
              <span>Next: Platinum</span>
            </div>
            <Button className="w-full bg-white text-black hover:bg-white/90 gap-2">
              <QrCode className="w-4 h-4" /> Scan NFC at Store
            </Button>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Active Missions</h2>
          <div className="space-y-4">
            {missions.map((m, idx) => (
              <Card key={idx} className="p-4 bg-card border-none flex items-center gap-4">
                <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center">
                  <m.icon className="w-6 h-6 text-brand" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-sm">{m.title}</h3>
                    <span className="text-[10px] font-bold text-accent uppercase">{m.reward}</span>
                  </div>
                  <Progress value={(m.progress / m.total) * 100} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{m.progress} / {m.total} Completed</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </Card>
            ))}
          </div>
        </section>

        <Card className="bg-card border-none p-6 text-center space-y-4">
          <Recycle className="w-12 h-12 mx-auto text-brand opacity-80" />
          <div className="space-y-1">
            <h3 className="font-bold">Sustainable Gamification</h3>
            <p className="text-sm text-muted-foreground">Return your empty cartridges to any L'Oréal boutique to unlock exclusive limited-edition aromas.</p>
          </div>
          <Button variant="outline" className="w-full">Locate Nearest Boutique</Button>
        </Card>
      </div>
      <Navigation />
    </main>
  );
}
