
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Crown, Check, ChevronRight, CreditCard, Sparkles, X,
  RefreshCw, Pause, ArrowRight, Bell, Package, Star,
  Newspaper, Lightbulb, TrendingUp, Gift, Shield, Clock,
  Droplets, Heart, Award,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDevice, FRAGRANCES, SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { cn } from '@/lib/utils';

const INSIGHTS = [
  { title: 'Scent & Memory', desc: 'How olfactory triggers create lasting emotional imprints through kinetic delivery.', icon: Lightbulb, tag: 'SCIENCE' },
  { title: 'Summer Layering', desc: 'Combine Apex Essence morning bursts with Flow evening wind-downs for peak harmony.', icon: Sparkles, tag: 'TIP' },
  { title: 'New: Night Protocol', desc: 'Automated micro-doses calibrated to your sleep cycle. Coming Q3.', icon: Bell, tag: 'NEW' },
  { title: 'Usage Report', desc: 'Your Apex Essence consumption dropped 12% — smart mode is optimizing delivery.', icon: TrendingUp, tag: 'INSIGHT' },
];

export default function ScentClubPage() {
  const router = useRouter();
  const { subscriptionPlan, setSubscriptionPlan, points, activeFragrance } = useDevice();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'done'>('form');
  const [selectedFragrance, setSelectedFragrance] = useState(activeFragrance !== 'none' ? activeFragrance : 'Apex');

  const handleSubscribe = (planKey: SubscriptionPlan) => {
    setSelectedPlan(planKey);
    setShowPayment(true);
    setPaymentStep('form');
  };

  const handlePayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('done');
      if (selectedPlan) setSubscriptionPlan(selectedPlan);
    }, 2500);
  };

  const isSubscribed = subscriptionPlan !== 'none';
  const currentPlan = isSubscribed ? SUBSCRIPTION_PLANS[subscriptionPlan as keyof typeof SUBSCRIPTION_PLANS] : null;

  return (
    <main className="min-h-screen pb-32 bg-background text-foreground">
      <Header />

      <div className="max-w-lg mx-auto p-6 space-y-8">
        {/* Page Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">Scent Club</h1>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <Award className="w-4 h-4 text-brand-accent" />
            <span className="font-black tabular-nums text-sm">{points}</span>
            <span className="text-[8px] uppercase tracking-widest opacity-30 font-bold">PTS</span>
          </div>
        </header>

        {/* Hero Banner */}
        <div className="relative w-full h-56 rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl">
          <Image src="/scent_club.jpeg" alt="Omni Kinetic Scent Club" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
            <Badge className="bg-white/10 backdrop-blur-md text-white/90 text-[7px] font-black uppercase border-none tracking-widest">Loyalty Ecosystem</Badge>
            <h2 className="text-2xl font-black tracking-tight leading-tight">Omni Kinetic<br />Scent Club</h2>
            <p className="text-[10px] text-white/50 font-medium max-w-[260px]">Choose your fragrance. We deliver it automatically so you never run out.</p>
          </div>
        </div>

        {/* How it works */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground px-2 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-brand-accent" /> How It Works
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Heart, label: 'Choose your fragrance', sub: 'Pick your favorite scent' },
              { icon: Package, label: 'Receive your 30ml refill', sub: 'Eco-format, no glass bottle' },
              { icon: RefreshCw, label: 'Switch anytime', sub: 'Change fragrance freely' },
              { icon: Pause, label: 'Pause or cancel', sub: 'No commitments, ever' },
            ].map((step, i) => (
              <Card key={i} className="p-4 bg-white/[0.03] border-none rounded-[1.5rem] space-y-2 group hover:bg-white/[0.05] transition-all">
                <step.icon className="w-5 h-5 text-brand-accent opacity-60" />
                <p className="text-[11px] font-bold leading-tight">{step.label}</p>
                <p className="text-[9px] text-white/30">{step.sub}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Refill Format */}
        <Card className="p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center shrink-0">
              <Droplets className="w-7 h-7 text-brand-accent" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm">Smart Refill 30ml</h4>
                <Badge className="bg-green-500/20 text-green-400 border-none text-[7px] font-black uppercase">Eco-Format</Badge>
              </div>
              <p className="text-lg font-black text-brand-accent">$109 <span className="text-[9px] opacity-40 font-medium">/ refill</span></p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {['No glass bottle', 'Biodegradable packaging', '30% less waste'].map(t => (
              <span key={t} className="text-[8px] text-white/30 bg-white/5 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{t}</span>
            ))}
          </div>
        </Card>

        {/* Active Subscription */}
        {isSubscribed && currentPlan && (
          <Card className="p-6 bg-brand-accent/5 border border-brand-accent/20 rounded-[2.5rem] space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{currentPlan.name}</h4>
                  <p className="text-[10px] text-white/40">{currentPlan.subtitle} Plan</p>
                </div>
              </div>
              <Badge className="bg-brand-accent text-background text-[7px] font-black uppercase border-none">Active</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
              <div className="text-center"><p className="text-[8px] text-white/20 uppercase font-bold">Refills</p><p className="text-sm font-black">{currentPlan.refills}x 30ml</p></div>
              <div className="text-center"><p className="text-[8px] text-white/20 uppercase font-bold">Frequency</p><p className="text-sm font-black text-[10px]">{currentPlan.frequency}</p></div>
              <div className="text-center"><p className="text-[8px] text-white/20 uppercase font-bold">Price</p><p className="text-sm font-black">${currentPlan.price}</p></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setSubscriptionPlan('none')} variant="outline" className="flex-1 h-10 font-bold uppercase tracking-widest text-[8px] rounded-xl border-white/10 hover:bg-white hover:text-black transition-all">
                Cancel
              </Button>
              <Button variant="outline" className="flex-1 h-10 font-bold uppercase tracking-widest text-[8px] rounded-xl border-white/10 hover:bg-white hover:text-black transition-all">
                Change Fragrance
              </Button>
            </div>
          </Card>
        )}

        {/* Subscription Plans */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground px-2 flex items-center gap-2">
            <Crown className="w-3 h-3 text-brand-accent" /> Membership Plans
          </h3>

          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => {
            const isActive = subscriptionPlan === key;
            const isDual = key === 'dual';
            return (
              <Card key={key} className={cn(
                "relative p-6 rounded-[2rem] space-y-4 transition-all border overflow-hidden",
                isActive ? "bg-brand-accent/10 border-brand-accent/30 ring-1 ring-brand-accent/20" :
                isDual ? "bg-white/[0.04] border-white/10" : "bg-white/[0.03] border-white/5"
              )}>
                {isDual && !isActive && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white text-black text-[7px] font-black uppercase border-none shadow-lg">Most Popular</Badge>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-[9px] uppercase font-black tracking-[0.3em] text-brand-accent">{plan.subtitle}</p>
                  <h4 className="text-lg font-black tracking-tight">{plan.name}</h4>
                  <p className="text-[10px] text-white/40 leading-relaxed max-w-[280px]">{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">${plan.price}</span>
                  <span className="text-[10px] text-white/30 font-bold">/ {plan.frequency.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white/30">
                  <span className="flex items-center gap-1"><Check className="w-3 h-3 text-brand-accent" /> {plan.refills}x 30ml refill{plan.refills > 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-1.5">
                  {['Free delivery to your door', 'Switch fragrance anytime', 'Pause or cancel anytime', 'Priority access to new scents'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[9px] text-white/40">
                      <Check className="w-3 h-3 text-white/20 shrink-0" />{f}
                    </div>
                  ))}
                </div>
                {!isActive ? (
                  <Button onClick={() => handleSubscribe(key as SubscriptionPlan)}
                    className={cn("w-full h-12 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl active:scale-95 transition-all border-none",
                      isDual ? "bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10" : "bg-white/10 text-white hover:bg-white/20"
                    )}>
                    Join {plan.subtitle}
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-2 h-12 text-[10px] font-black text-brand-accent uppercase tracking-widest">
                    <Check className="w-4 h-4" /> Current Plan
                  </div>
                )}
              </Card>
            );
          })}
        </section>

        {/* Fragrance Selector */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground px-2 flex items-center gap-2">
            <Droplets className="w-3 h-3 text-brand-accent" /> Choose Your Fragrance
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {FRAGRANCES.map(f => (
              <Card key={f.id} onClick={() => setSelectedFragrance(f.id)}
                className={cn("p-4 rounded-[1.5rem] flex flex-col items-center gap-3 cursor-pointer transition-all border",
                  selectedFragrance === f.id ? "bg-brand-accent/10 border-brand-accent/30 ring-1 ring-brand-accent/20" : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
                )}>
                <div className="relative w-14 h-14"><Image src={f.refillImg} alt={f.name} fill className="object-contain" /></div>
                <div className="text-center space-y-0.5">
                  <p className="text-[10px] font-bold leading-tight">{f.name}</p>
                  <p className="text-[8px] text-white/30 italic">{f.tagline}</p>
                </div>
                {selectedFragrance === f.id && (
                  <Badge className="bg-brand-accent text-background text-[6px] font-black uppercase border-none">Selected</Badge>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground px-2">Quick Actions</h3>
          {[
            { label: 'Reorder Last Refill', sub: 'One-tap reorder your previous fragrance', icon: RefreshCw },
            { label: 'Usage History', sub: 'View your complete fragrance timeline', icon: Clock },
            { label: 'Manage Omni-Rewards', sub: `${points} points available to redeem`, icon: Gift, href: '/rewards' },
          ].map((item, i) => (
            <button key={i} onClick={() => item.href && router.push(item.href)}
              className="w-full flex items-center justify-between p-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all rounded-[1.8rem] group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 opacity-40" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm tracking-tight block">{item.label}</span>
                  <span className="text-[9px] text-white/30">{item.sub}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </section>

        {/* Insights & Tips */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground px-2 flex items-center gap-2">
            <Newspaper className="w-3 h-3 text-brand-accent" /> Insights & Tips
          </h3>
          <div className="space-y-3">
            {INSIGHTS.map((item, i) => {
              const Icon = item.icon;
              const tagColors: Record<string, string> = {
                SCIENCE: 'bg-purple-500/20 text-purple-400',
                TIP: 'bg-yellow-500/20 text-yellow-400',
                NEW: 'bg-green-500/20 text-green-400',
                INSIGHT: 'bg-blue-500/20 text-blue-400',
              };
              return (
                <Card key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] flex items-start gap-3 hover:bg-white/[0.04] transition-all cursor-pointer group">
                  <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-brand-accent opacity-60" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-[6px] font-black uppercase border-none px-1.5 py-0", tagColors[item.tag])}>{item.tag}</Badge>
                    </div>
                    <h4 className="text-[11px] font-bold leading-tight">{item.title}</h4>
                    <p className="text-[9px] text-white/30 leading-relaxed">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-10 group-hover:opacity-40 transition-opacity shrink-0 mt-2" />
                </Card>
              );
            })}
          </div>
        </section>

        {/* Eco Commitment */}
        <Card className="p-6 bg-green-500/5 border border-green-500/10 rounded-[2rem] text-center space-y-3">
          <Shield className="w-8 h-8 mx-auto text-green-400 opacity-60" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">The Kinetic Refill System</h4>
            <p className="text-[10px] text-white/30 max-w-[260px] mx-auto leading-relaxed">
              No glass bottles. Biodegradable eco-packaging. The refill goes directly to your wearable — and to your body.
            </p>
          </div>
        </Card>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={() => { setShowPayment(false); setPaymentStep('form'); }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" />
          <div className="relative w-full max-w-lg bg-neutral-950 border-t border-white/10 rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom-8 duration-500 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black tracking-tight">
                {paymentStep === 'done' ? 'Welcome to the Club' : 'Subscribe'}
              </h2>
              <button onClick={() => { setShowPayment(false); setPaymentStep('form'); }} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentStep === 'form' && (() => {
              const plan = SUBSCRIPTION_PLANS[selectedPlan as keyof typeof SUBSCRIPTION_PLANS];
              return (
                <>
                  <Card className="p-5 bg-white/[0.03] border-none rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase font-black tracking-widest text-brand-accent">{plan.subtitle}</p>
                        <h3 className="font-bold text-base">{plan.name}</h3>
                        <p className="text-[10px] text-white/40">{plan.desc}</p>
                      </div>
                      <p className="text-2xl font-black">${plan.price}</p>
                    </div>
                  </Card>
                  {/* Fragrance selection */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Selected Fragrance</p>
                    <div className="flex gap-2">
                      {FRAGRANCES.map(f => (
                        <button key={f.id} onClick={() => setSelectedFragrance(f.id)}
                          className={cn("flex-1 p-3 rounded-xl border transition-all text-center",
                            selectedFragrance === f.id ? "border-brand-accent/40 bg-brand-accent/10" : "border-white/5 bg-white/[0.03]"
                          )}>
                          <div className="relative w-8 h-8 mx-auto"><Image src={f.refillImg} alt={f.name} fill className="object-contain" /></div>
                          <p className="text-[8px] font-bold mt-1">{f.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Card info */}
                  <div className="space-y-3">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Payment Method</p>
                    <div className="bg-white/[0.03] rounded-2xl p-4 space-y-3 border border-white/5">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-white/30" />
                        <div className="flex-1 h-10 bg-white/5 rounded-xl px-4 flex items-center">
                          <span className="text-[11px] text-white/60 font-medium tracking-widest">•••• •••• •••• 4242</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-10 bg-white/5 rounded-xl px-4 flex items-center"><span className="text-[11px] text-white/60 font-medium">12/28</span></div>
                        <div className="h-10 bg-white/5 rounded-xl px-4 flex items-center"><span className="text-[11px] text-white/60 font-medium">•••</span></div>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handlePayment} className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-3 text-[10px] border-none">
                    <CreditCard className="w-5 h-5 opacity-60" /> Subscribe · ${plan.price}
                  </Button>
                </>
              );
            })()}

            {paymentStep === 'processing' && (
              <div className="flex flex-col items-center py-12 space-y-6 animate-in fade-in duration-500">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center animate-pulse">
                  <CreditCard className="w-10 h-10 text-brand-accent" />
                </div>
                <p className="text-[11px] text-white uppercase tracking-[0.4em] font-black animate-pulse">Processing payment...</p>
              </div>
            )}

            {paymentStep === 'done' && (
              <div className="flex flex-col items-center py-8 space-y-6 animate-in fade-in zoom-in duration-700">
                <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black">You're In!</h3>
                  <p className="text-[11px] text-white/40">Your first refill is on its way. Welcome to the Omni Kinetic Scent Club.</p>
                </div>
                <Button onClick={() => { setShowPayment(false); setPaymentStep('form'); }}
                  className="w-full h-14 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-200 active:scale-95 transition-all text-[10px] border-none">
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <Navigation />
    </main>
  );
}
