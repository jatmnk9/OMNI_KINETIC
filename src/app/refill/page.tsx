
"use client";

import React, { useState } from 'react';
import {
  Droplets,
  Sparkles,
  Shuffle,
  Check,
  Package,
  ChevronRight,
  Gift,
  Zap,
  Beaker,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDevice, ALL_VARIANTS } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { CartridgeGauge } from '@/components/CartridgeGauge';
import { VariantIcon } from '@/components/VariantIcon';
import { cn } from '@/lib/utils';

export default function RefillPage() {
  const { 
    activeDevice, 
    cartridgeLevel, 
    cartridgeDaysLeft, 
    dailyUsageMl,
    currentPlan, 
    selectedVariant, 
    setSelectedVariant,
    getVariantsForDevice,
  } = useDevice();

  const [blindDropActive, setBlindDropActive] = useState(false);
  const [blindDropRevealing, setBlindDropRevealing] = useState(false);
  const [revealedVariant, setRevealedVariant] = useState<typeof ALL_VARIANTS[0] | null>(null);

  const deviceName = activeDevice === 'ApexEssence' ? 'Apex' : (activeDevice === 'Synapse' ? 'Synapse' : 'Kinetic');
  const price = activeDevice === 'ApexEssence' ? '$52.64' : (activeDevice === 'Synapse' ? '$58.49' : '$70.18');
  const variants = getVariantsForDevice(activeDevice);

  const handleBlindDrop = () => {
    setBlindDropActive(true);
    setBlindDropRevealing(true);
    setTimeout(() => {
      const chosen = variants[Math.floor(Math.random() * variants.length)];
      setRevealedVariant(chosen);
      setTimeout(() => {
        setBlindDropRevealing(false);
      }, 800);
    }, 2500);
  };

  const resetBlindDrop = () => {
    setBlindDropActive(false);
    setBlindDropRevealing(false);
    setRevealedVariant(null);
  };

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground">
      <Header />
      
      <div className="max-w-lg mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">Author Variants</h1>
        </header>

        {/* === TELEMETRY GAUGE === */}
        <section className="flex flex-col items-center space-y-4">
          <CartridgeGauge level={cartridgeLevel} daysLeft={cartridgeDaysLeft} />
          
          <div className="flex items-center gap-4 text-center">
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-40">Daily Usage</p>
              <p className="text-lg font-black tabular-nums">{dailyUsageMl}<span className="text-[10px] opacity-40 ml-0.5">ml</span></p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-40">Forecast</p>
              <p className="text-lg font-black tabular-nums">{cartridgeDaysLeft}<span className="text-[10px] opacity-40 ml-0.5">days</span></p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-40">Line</p>
              <p className="text-lg font-black">{deviceName}</p>
            </div>
          </div>
        </section>

        {/* === CURRENT VARIANT === */}
        {selectedVariant && (
          <Card className="p-5 bg-gradient-to-br from-brand/10 to-transparent border border-brand/20 rounded-[2rem] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/15 rounded-xl flex items-center justify-center">
                  <VariantIcon iconName={selectedVariant.iconName} className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-40">Installed Variant</p>
                  <h3 className="font-bold text-base tracking-tight text-white">{deviceName} Base + {selectedVariant.name}</h3>
                </div>
              </div>
              <Badge className="bg-brand-accent/20 text-brand-accent border-none text-[8px] font-bold uppercase">Active</Badge>
            </div>
            <p className="text-[10px] text-white/40 pl-[52px] italic">{selectedVariant.notes}</p>
          </Card>
        )}

        {/* === VARIANT SELECTOR === */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-brand-accent" /> Choose Variant
          </h2>
          
          <div className="space-y-3">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <Card
                  key={variant.id}
                  className={cn(
                    "p-5 border-none rounded-[1.8rem] flex items-center gap-4 cursor-pointer transition-all duration-500 group relative overflow-hidden",
                    isSelected 
                      ? "bg-white/10 ring-1 ring-brand-accent/30 shadow-2xl" 
                      : "bg-white/[0.03] hover:bg-white/[0.06]"
                  )}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-transparent opacity-50" />
                  )}
                  <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center relative z-10 shrink-0">
                    <VariantIcon iconName={variant.iconName} className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div className="flex-1 space-y-1 relative z-10 min-w-0">
                    <h4 className="font-bold text-sm tracking-tight">{variant.name}</h4>
                    <p className="text-[10px] text-white/40 truncate">{variant.notes}</p>
                  </div>
                  {isSelected ? (
                    <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center shrink-0 relative z-10 shadow-lg">
                      <Check className="w-4 h-4 text-background" />
                    </div>
                  ) : (
                    <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-60 transition-opacity relative z-10 shrink-0" />
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        {/* === DISCOVERY MODE: BLIND DROP === */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
            <Shuffle className="w-3 h-3 text-omni-orange" /> Discovery Mode
          </h2>

          {!blindDropActive ? (
            <Card 
              className="p-6 border border-omni-orange/20 rounded-[2rem] bg-omni-orange/5 space-y-4 cursor-pointer group hover:bg-omni-orange/10 transition-all duration-500 relative overflow-hidden"
              onClick={handleBlindDrop}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-omni-orange/5 rounded-full blur-2xl group-hover:bg-omni-orange/10 transition-all" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-omni-orange/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gift className="w-7 h-7 text-omni-orange" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">Blind Drop</h3>
                    <Badge className="bg-omni-orange/20 text-omni-orange border-none text-[7px] font-black uppercase tracking-wider animate-pulse">
                      AI Selects
                    </Badge>
                  </div>
                  <p className="text-[10px] text-white/40 mt-0.5 max-w-[240px]">
                    AI will analyze your biometric history and send the optimal variant for your recent performance
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-[74px] relative z-10">
                <Zap className="w-3 h-3 text-omni-orange opacity-60" />
                <span className="text-[9px] text-omni-orange/60 uppercase tracking-widest font-bold">Tap to activate</span>
              </div>
            </Card>
          ) : (
            <Card className="p-8 border border-omni-orange/30 rounded-[2rem] bg-omni-orange/5 relative overflow-hidden">
              {blindDropRevealing ? (
                <div className="flex flex-col items-center space-y-6 py-4 animate-in fade-in zoom-in duration-500">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-omni-orange/20 flex items-center justify-center animate-pulse">
                      <Package className="w-12 h-12 text-omni-orange animate-bounce" />
                    </div>
                    <div className="absolute inset-0 bg-omni-orange/30 rounded-3xl animate-wave-expand" />
                    <div className="absolute inset-0 bg-omni-orange/20 rounded-3xl animate-wave-expand" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <p className="text-[11px] text-omni-orange uppercase tracking-[0.4em] font-black animate-pulse">
                    Analyzing biometrics...
                  </p>
                </div>
              ) : revealedVariant ? (
                <div className="flex flex-col items-center space-y-5 py-2 animate-in fade-in zoom-in duration-700">
                  <div className="w-16 h-16 bg-brand/15 rounded-2xl flex items-center justify-center">
                    <VariantIcon iconName={revealedVariant.iconName} className="w-8 h-8 text-brand-accent" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-omni-orange font-bold">AI Selection</p>
                    <h3 className="text-2xl font-black tracking-tight text-white">{revealedVariant.name}</h3>
                    <p className="text-[10px] text-white/40 italic">{revealedVariant.notes}</p>
                  </div>
                  <div className="flex gap-3 w-full pt-2">
                    <Button 
                      className="flex-1 h-12 bg-omni-orange text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg border-none hover:bg-omni-orange/90"
                      onClick={() => { setSelectedVariant(revealedVariant); resetBlindDrop(); }}
                    >
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] border-white/10 hover:bg-white/5"
                      onClick={resetBlindDrop}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
          )}
        </section>

        {/* === PURCHASE CTA === */}
        <section className="space-y-4 pt-2 pb-4">
          <Card className="p-5 bg-white/5 border-none rounded-[2rem] flex items-center gap-5 group hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center p-2">
              <Droplets className="w-8 h-8 opacity-40 text-brand-accent" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest">{deviceName} Smart Refill</h4>
                  <p className="text-[10px] text-muted-foreground">
                    {selectedVariant ? `${selectedVariant.name}` : 'Base formula'}
                  </p>
                </div>
                <span className="text-brand-accent font-black">{price}</span>
              </div>
            </div>
          </Card>

          <Button className="w-full h-20 bg-brand text-accent-foreground font-black uppercase tracking-[0.3em] rounded-[1.8rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm">
            Confirm Smart Refill
          </Button>
        </section>
      </div>
      <Navigation />
    </main>
  );
}
