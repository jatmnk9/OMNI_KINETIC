
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Award,
  Recycle,
  Trophy,
  Gift,
  ArrowUpRight,
  QrCode,
  Flame,
  Footprints,
  Leaf,
  Target,
  Zap,
  ChevronRight,
  Timer,
  TrendingUp,
  Star,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { cn } from '@/lib/utils';

type RewardTab = 'challenges' | 'sustainability' | 'rewards';

const MOVEMENT_CHALLENGES = [
  {
    id: 'steps10k',
    title: '10K Steps Marathon',
    desc: 'Walk 10,000 steps in a single day to unlock a performance burst.',
    reward: '350 Pts',
    progress: 7842,
    total: 10000,
    icon: Footprints,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    unit: 'steps',
    active: true,
    daysLeft: 'Today',
  },
  {
    id: 'streak7',
    title: '7-Day Active Streak',
    desc: 'Stay active for 7 consecutive days. Keep your body moving.',
    reward: '750 Pts + Exclusive Aroma',
    progress: 5,
    total: 7,
    icon: Flame,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    unit: 'days',
    active: true,
    daysLeft: '2 days left',
  },
  {
    id: 'hrv_peak',
    title: 'Peak HRV Recovery',
    desc: 'Achieve 5 HRV recovery milestones above 85ms after workouts.',
    reward: '500 Pts',
    progress: 3,
    total: 5,
    icon: TrendingUp,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    unit: 'peaks',
    active: true,
    daysLeft: '4 days left',
  },
  {
    id: 'burst_master',
    title: 'Burst Master',
    desc: 'Trigger 50 manual or scheduled scent bursts in one month.',
    reward: '400 Pts',
    progress: 34,
    total: 50,
    icon: Zap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    unit: 'bursts',
    active: true,
    daysLeft: '18 days left',
  },
];

const SUSTAINABILITY_ACTIONS = [
  {
    id: 'return3',
    title: 'Return 3 Cartridges',
    desc: 'Return empty cartridges at any flagship boutique.',
    reward: '250 Pts + 10% Off',
    progress: 2,
    total: 3,
    icon: Recycle,
    badge: 'ECO HERO',
  },
  {
    id: 'return10',
    title: 'Circular Pioneer',
    desc: 'Return 10 cartridges total. You\'re reducing waste beautifully.',
    reward: '1,000 Pts + Ltd. Edition',
    progress: 5,
    total: 10,
    icon: Leaf,
    badge: 'PIONEER',
  },
  {
    id: 'refill_sub',
    title: 'Subscribe & Save',
    desc: 'Maintain an active subscription for 3 months consecutively.',
    reward: 'Free Refill + 500 Pts',
    progress: 2,
    total: 3,
    icon: Gift,
    badge: 'SUSTAINER',
  },
];

const REDEEMABLE_REWARDS = [
  { title: 'Exclusive Fragrance', cost: 2000, img: '/new.png', unlocked: false },
  { title: 'Limited Cartridge Pack x3', cost: 1500, img: '/trio.png', unlocked: false },
  { title: '30% Off Next Refill', cost: 500, img: '/sustainability_reward.png', unlocked: true },
];

export default function RewardsPage() {
  const { points } = useDevice();
  const nextTier = 1500;
  const progress = Math.min((points / nextTier) * 100, 100);
  const tier = points > 1000 ? 'Platinum' : 'Gold';
  const [activeTab, setActiveTab] = useState<RewardTab>('challenges');

  const tabs: { id: RewardTab; label: string; icon: React.ElementType }[] = [
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'sustainability', label: 'Eco Impact', icon: Leaf },
    { id: 'rewards', label: 'Redeem', icon: Gift },
  ];

  return (
    <main className="min-h-screen pb-32 bg-background text-foreground">
      <Header />

      <div className="max-w-lg mx-auto p-6 space-y-8">
        {/* Page Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">Rewards</h1>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <Award className="w-4 h-4 text-brand-accent" />
            <span className="font-black tabular-nums text-sm">{points}</span>
            <span className="text-[8px] uppercase tracking-widest opacity-30 font-bold">PTS</span>
          </div>
        </header>

        {/* Hero — Movement Challenge Banner */}
        <div className="relative w-full h-48 rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl">
          <Image src="/movement_challenge.png" alt="Movement Challenge" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
            <Badge className="bg-yellow-500/20 text-yellow-400 text-[7px] font-black uppercase border-none">Weekly Challenge</Badge>
            <h2 className="text-xl font-black tracking-tight">Move More, Smell Better</h2>
            <p className="text-[10px] text-white/50 font-medium">Your movement unlocks premium fragrance experiences</p>
          </div>
          <div className="absolute top-4 right-4">
            <div className="bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Timer className="w-3 h-3 text-yellow-400" />
              <span className="text-[9px] font-black text-white/80 uppercase tracking-wider">5d Left</span>
            </div>
          </div>
        </div>

        {/* Elite Status Card */}
        <Card className="bg-white text-black border-none relative overflow-hidden rounded-[2.5rem] shadow-2xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl -translate-y-16 translate-x-16" />
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40">Current Status</p>
                <h2 className="text-3xl font-black tracking-tight">{tier}</h2>
              </div>
              <div className="w-16 h-16 relative">
                <Image src="/elite_badge.png" alt="Badge" fill className="object-contain" />
              </div>
            </div>
            <Progress value={progress} className="h-2.5 bg-black/10 rounded-full" />
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase font-black tracking-widest text-black/40">{points} / {nextTier} pts</span>
              <span className="text-[9px] uppercase font-black tracking-widest text-black/40">Next: {tier === 'Gold' ? 'Platinum' : 'Diamond'}</span>
            </div>
            <Button className="w-full bg-black text-white hover:bg-black/90 gap-2 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl border-none">
              <QrCode className="w-4 h-4" /> Scan NFC at Boutique
            </Button>
          </div>
        </Card>

        {/* Tab Selector */}
        <div className="flex bg-white/[0.03] rounded-2xl p-1 gap-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl transition-all duration-300 text-[9px] font-bold uppercase tracking-wider",
                  isActive ? "bg-white/10 text-white shadow-md" : "opacity-30 hover:opacity-60"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* === CHALLENGES TAB === */}
        {activeTab === 'challenges' && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">Active Movement Challenges</h2>
              <Badge variant="outline" className="text-[7px] font-black uppercase border-white/10 px-2">{MOVEMENT_CHALLENGES.length} Active</Badge>
            </div>

            <div className="space-y-3">
              {MOVEMENT_CHALLENGES.map((ch) => {
                const Icon = ch.icon;
                const pct = Math.round((ch.progress / ch.total) * 100);
                return (
                  <Card key={ch.id} className="p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] space-y-4 group hover:bg-white/[0.05] transition-all">
                    <div className="flex items-start gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", ch.bgColor)}>
                        <Icon className={cn("w-6 h-6", ch.color)} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm tracking-tight">{ch.title}</h3>
                          <span className="text-[9px] font-black text-brand-accent uppercase tracking-widest shrink-0">{ch.reward}</span>
                        </div>
                        <p className="text-[10px] text-white/30 leading-relaxed">{ch.desc}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Progress value={pct} className="h-2 bg-white/5" />
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] text-muted-foreground font-bold tabular-nums">
                          {ch.progress.toLocaleString()} / {ch.total.toLocaleString()} {ch.unit}
                        </p>
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-30">{ch.daysLeft}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Daily Stats Mini */}
            <Card className="p-5 bg-white/[0.02] border border-white/5 rounded-[2rem]">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <Footprints className="w-5 h-5 mx-auto text-yellow-400/60" />
                  <p className="text-lg font-black tabular-nums">7,842</p>
                  <p className="text-[8px] uppercase tracking-widest opacity-30 font-bold">Steps Today</p>
                </div>
                <div className="space-y-1">
                  <Flame className="w-5 h-5 mx-auto text-orange-400/60" />
                  <p className="text-lg font-black tabular-nums">5</p>
                  <p className="text-[8px] uppercase tracking-widest opacity-30 font-bold">Day Streak</p>
                </div>
                <div className="space-y-1">
                  <Zap className="w-5 h-5 mx-auto text-blue-400/60" />
                  <p className="text-lg font-black tabular-nums">34</p>
                  <p className="text-[8px] uppercase tracking-widest opacity-30 font-bold">Bursts / Mo</p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* === SUSTAINABILITY TAB === */}
        {activeTab === 'sustainability' && (
          <section className="space-y-5 animate-in fade-in duration-300">
            {/* Eco Hero Banner */}
            <div className="relative w-full h-44 rounded-[2rem] overflow-hidden shadow-xl">
              <Image src="/sustainability_reward.png" alt="Sustainability" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                <Badge className="bg-green-500/20 text-green-400 text-[7px] font-black uppercase border-none">Eco Program</Badge>
                <h3 className="text-lg font-black">Circular Beauty</h3>
                <p className="text-[10px] text-white/40">Return. Recycle. Earn. Repeat.</p>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 bg-green-500/5 border-none rounded-[1.5rem] text-center space-y-1">
                <p className="text-2xl font-black text-green-400">5</p>
                <p className="text-[8px] uppercase tracking-widest opacity-40 font-bold">Returned</p>
              </Card>
              <Card className="p-4 bg-green-500/5 border-none rounded-[1.5rem] text-center space-y-1">
                <p className="text-2xl font-black text-green-400">0.8<span className="text-[10px]">kg</span></p>
                <p className="text-[8px] uppercase tracking-widest opacity-40 font-bold">CO₂ Saved</p>
              </Card>
              <Card className="p-4 bg-green-500/5 border-none rounded-[1.5rem] text-center space-y-1">
                <p className="text-2xl font-black text-green-400">750</p>
                <p className="text-[8px] uppercase tracking-widest opacity-40 font-bold">Eco Pts</p>
              </Card>
            </div>

            {/* Sustainability Missions */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground px-2">Eco Missions</h3>
              {SUSTAINABILITY_ACTIONS.map((action) => {
                const Icon = action.icon;
                const pct = Math.round((action.progress / action.total) * 100);
                return (
                  <Card key={action.id} className="p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] space-y-3 hover:bg-white/[0.05] transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm tracking-tight">{action.title}</h4>
                          <Badge variant="outline" className="text-[7px] font-black uppercase border-green-500/30 text-green-400 px-1.5 py-0">{action.badge}</Badge>
                        </div>
                        <p className="text-[10px] text-white/30 leading-relaxed">{action.desc}</p>
                      </div>
                    </div>
                    <Progress value={pct} className="h-1.5 bg-white/5" />
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-bold tabular-nums opacity-40">{action.progress} / {action.total}</p>
                      <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">{action.reward}</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Return CTA */}
            <Card className="bg-green-500/5 border border-green-500/10 p-6 text-center space-y-4 rounded-[2rem]">
              <Recycle className="w-10 h-10 mx-auto text-green-400 opacity-60" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Return Your Empty Cartridges</h4>
                <p className="text-[10px] text-white/30 max-w-[240px] mx-auto">Bring them to any flagship or authorized point. Each return earns you Eco Pts and exclusive access.</p>
              </div>
              <Button className="w-full h-12 bg-green-500 text-black font-bold uppercase tracking-widest text-[9px] rounded-xl hover:bg-green-400 active:scale-95 transition-all border-none">
                Find Return Station
              </Button>
            </Card>
          </section>
        )}

        {/* === REDEEM TAB === */}
        {activeTab === 'rewards' && (
          <section className="space-y-5 animate-in fade-in duration-300">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground px-2">Redeemable Rewards</h2>

            <div className="space-y-4">
              {REDEEMABLE_REWARDS.map((reward, idx) => {
                const canAfford = points >= reward.cost;
                return (
                  <Card key={idx} className="relative overflow-hidden bg-white/[0.03] border border-white/5 rounded-[2rem] group hover:bg-white/[0.05] transition-all">
                    <div className="relative w-full h-36 overflow-hidden rounded-t-[2rem]">
                      <Image src={reward.img} alt={reward.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      {!canAfford && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Lock className="w-8 h-8 text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm tracking-tight">{reward.title}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-brand-accent" />
                          <span className="text-[10px] font-black text-brand-accent tabular-nums">{reward.cost.toLocaleString()}</span>
                        </div>
                      </div>
                      <Button
                        disabled={!canAfford}
                        className={cn(
                          "w-full h-11 font-bold uppercase tracking-widest text-[9px] rounded-xl transition-all border-none",
                          canAfford
                            ? "bg-white text-black hover:bg-white/90 active:scale-95"
                            : "bg-white/5 text-white/20 cursor-not-allowed"
                        )}
                      >
                        {canAfford ? (
                          <><CheckCircle2 className="w-4 h-4 mr-2" /> Redeem Now</>
                        ) : (
                          <>{reward.cost - points} pts needed</>
                        )}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* History */}
            <Card className="p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-3">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Recent Activity</h3>
              {[
                { label: '10K Steps completed', pts: '+350', time: '2h ago', icon: Footprints },
                { label: 'Cartridge returned', pts: '+100', time: 'Yesterday', icon: Recycle },
                { label: 'HRV Peak achieved', pts: '+100', time: '3 days ago', icon: TrendingUp },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-brand-accent opacity-60" />
                      <div>
                        <p className="text-[11px] font-bold">{item.label}</p>
                        <p className="text-[9px] opacity-30">{item.time}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-green-400">{item.pts}</span>
                  </div>
                );
              })}
            </Card>
          </section>
        )}
      </div>

      <Navigation />
    </main>
  );
}
