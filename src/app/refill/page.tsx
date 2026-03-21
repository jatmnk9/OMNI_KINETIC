
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';

export default function RefillPage() {
  const { activeDevice, cartridgeLevel, currentPlan } = useDevice();

  const deviceName = activeDevice === 'ApexEssence' ? 'Apex' : (activeDevice === 'Synapse' ? 'Synapse' : 'Kinetic');
  const price = activeDevice === 'ApexEssence' ? '$52.64' : (activeDevice === 'Synapse' ? '$58.49' : '$70.18');

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground">
      <Header />
      
      <div className="max-w-lg mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">Cartridge Status</h1>
        </header>

        {/* Status Card */}
        <Card className="relative overflow-hidden aspect-[4/5] border-none rounded-[2.5rem] bg-neutral-900 shadow-2xl">
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-black/40" />
            <div className="flex-1 bg-brand opacity-40" />
          </div>
          
          <div className="absolute inset-0 p-10 flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">Status</p>
              <h2 className="text-4xl font-black italic tracking-tighter text-brand-accent">SMART REFILL</h2>
            </div>
            
            <div className="relative">
              <span className="absolute -top-32 -left-4 text-[18rem] font-black opacity-10 leading-none select-none">
                {Math.round(cartridgeLevel)}
              </span>
              <div className="relative space-y-0">
                <p className="text-7xl font-black tracking-tighter flex items-start gap-1">
                  {Math.round(cartridgeLevel)}
                  <span className="text-2xl mt-3 opacity-60">%</span>
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Remaining</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-white/5 border-none rounded-[2rem] space-y-4">
            <p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-40">Daily Avg</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">1.2</span>
              <span className="text-xs opacity-40">ml</span>
            </div>
          </Card>
          <Card className="p-6 bg-white/5 border-none rounded-[2rem] space-y-4">
            <p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-40">Estimate</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">18</span>
              <span className="text-xs opacity-40">days</span>
            </div>
          </Card>
        </div>

        {/* Purchase Section */}
        <section className="space-y-6 pt-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold uppercase tracking-tight">Smart Refills Individual</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              For users who need refills outside of their current plan or for specific architectures:
            </p>
          </div>

          <Card className="p-5 bg-white/5 border-none rounded-[2rem] flex items-center gap-5 group hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center p-2">
              <Droplets className="w-8 h-8 opacity-40 text-brand-accent" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest">{deviceName} Cartridge</h4>
                  <p className="text-[10px] text-muted-foreground">High-performance refinement</p>
                </div>
                <span className="text-brand-accent font-black">{price}</span>
              </div>
            </div>
          </Card>

          <Button className="w-full h-20 bg-brand text-accent-foreground font-black uppercase tracking-[0.3em] rounded-[1.8rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm">
            Buy Refill
          </Button>
        </section>
      </div>
      <Navigation />
    </main>
  );
}
