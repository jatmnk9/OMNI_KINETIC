"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bluetooth, Scan, ArrowRight, Check, User, Mail, LogOut, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { useDevice, DeviceType, PlanType } from '@/lib/device-context';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Navigation } from '@/components/Navigation';
import { Badge } from '@/components/ui/badge';

const DEVICES = [
  {
    id: 'ApexEssence' as DeviceType,
    name: 'Apex Essence',
    brand: 'Omni Kinetic',
    desc: 'High-performance biometric synchronization for active living.',
    img: PlaceHolderImages.find(i => i.id === 'device-prada')?.imageUrl,
  },
  {
    id: 'Synapse' as DeviceType,
    name: 'Synapse',
    brand: 'Omni Kinetic',
    desc: 'Deep emotional response mapping with nocturnal elegance.',
    img: PlaceHolderImages.find(i => i.id === 'device-ysl')?.imageUrl,
  },
  {
    id: 'Kinetic' as DeviceType,
    name: 'Kinetic',
    brand: 'Omni Kinetic',
    desc: 'Aquatic metrics and organic recovery for total well-being.',
    img: PlaceHolderImages.find(i => i.id === 'device-biotherm')?.imageUrl,
  }
];

const PLANS = [
  { id: 'Base', name: 'Base', price: '$15/mo', desc: 'Manual control and essential hardware features.', features: ['Manual Refill', 'Basic Metrics'] },
  { id: 'Essential', name: 'Essential', price: '$29/mo', desc: 'AI that learns your daily routines automatically.', features: ['Predictive Refills', 'AI Routine Learning'], badge: 'Popular' },
  { id: 'Premium', name: 'Premium', price: '$49/mo', desc: 'Hyper-personalized biometric sync in real-time.', features: ['Real-time HRV Sync', 'Exclusive Fragrance Drops'], badge: 'Elite' },
];

function OmniLogo() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-48 h-24">
        <svg viewBox="0 0 200 100" className="w-full h-full text-white fill-current">
          <text x="50%" y="40%" textAnchor="middle" className="text-xl font-light tracking-[0.5em] uppercase">OMNI</text>
          <path d="M40,75 C60,45 140,45 160,75" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-30" />
          <text x="50%" y="75%" textAnchor="middle" className="text-4xl font-serif italic italic font-light tracking-tight" style={{ fontFamily: 'serif' }}>Kinetic</text>
        </svg>
      </div>
      <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <p className="text-[10px] tracking-[0.5em] uppercase opacity-60 font-medium">WHERE FRAGRANCE MEETS MOTION</p>
    </div>
  );
}

export default function WelcomePage() {
  const router = useRouter();
  const { activeDevice, setActiveDevice, setCurrentPlan, setUserProfile, userProfile, logout } = useDevice();
  const [step, setStep] = useState<'intro' | 'register' | 'explore' | 'scan' | 'plan'>(userProfile ? 'explore' : 'intro');
  const [scanning, setScanning] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof DEVICES[0] | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    setUserProfile({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    });
    setStep('explore');
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setStep('plan');
    }, 2500);
  };

  const startLinking = (device: (typeof DEVICES)[0]) => {
    setSelectedProduct(device);
    setActiveDevice(device.id);
    setStep('scan');
  };

  const handlePlanSelection = (plan: PlanType) => {
    setCurrentPlan(plan);
    router.push('/dashboard');
  };

  if (activeDevice !== 'none' && step === 'intro') {
    return (
      <main className="min-h-screen pb-24 bg-background">
        <div className="p-8 pt-24 space-y-8 max-w-lg mx-auto text-center">
          <OmniLogo />
          <div className="pt-12 space-y-4">
             <p className="text-muted-foreground text-sm font-light">Welcome back, {userProfile?.name}.</p>
             <Card className="p-10 bg-white text-black overflow-hidden relative border-none group cursor-pointer rounded-[2.5rem]" onClick={() => router.push('/dashboard')}>
               <div className="relative z-10 flex items-center justify-between">
                 <div className="text-left space-y-1">
                   <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">{activeDevice}</p>
                   <h2 className="text-2xl font-bold tracking-tight">Enter Hub</h2>
                 </div>
                 <ArrowRight className="w-6 h-6" />
               </div>
             </Card>
             <Button variant="ghost" size="sm" onClick={logout} className="opacity-40 text-[9px] uppercase tracking-widest font-bold">Sign Out</Button>
          </div>
        </div>
        <Navigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <div className="flex-1 flex flex-col p-8 pt-24 max-w-lg mx-auto w-full space-y-12">
        
        {step === 'intro' && (
          <section className="flex-1 flex flex-col items-center justify-center space-y-16 animate-in fade-in duration-1000">
            <OmniLogo />
            
            <div className="max-w-[280px] text-center space-y-6">
              <p className="text-white/60 text-sm leading-relaxed tracking-wide font-light">
                Your biometric journey begins here. Connect your wearable to unlock a personalized fragrance experience powered by your body&apos;s own signals.
              </p>
            </div>

            <div className="w-full pt-8">
              <Button 
                onClick={() => setStep('register')} 
                variant="outline"
                className="w-full h-16 border-white/20 bg-transparent text-white font-light tracking-[0.2em] uppercase rounded-none hover:bg-white/5 transition-all flex items-center justify-center gap-4"
              >
                <Fingerprint className="w-5 h-5 opacity-40" />
                IDENTIFY YOUR DEVICE
              </Button>
            </div>
          </section>
        )}

        {step === 'register' && (
          <section className="space-y-12 animate-in slide-in-from-right-4 duration-500 pt-12">
            <header className="space-y-3 text-center">
              <h2 className="text-4xl font-headline font-bold tracking-tight">Biographic Profile</h2>
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold opacity-40">Initialize your identity</p>
            </header>
            <form onSubmit={handleRegister} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[9px] uppercase tracking-[0.3em] opacity-40 font-black">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 opacity-20" />
                  <Input id="name" name="name" placeholder="E.g. Jane Doe" className="pl-10 h-14 bg-white/5 border-none rounded-2xl placeholder:opacity-20" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[9px] uppercase tracking-[0.3em] opacity-40 font-black">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 opacity-20" />
                  <Input id="email" name="email" type="email" placeholder="jane@kinetic.com" className="pl-10 h-14 bg-white/5 border-none rounded-2xl placeholder:opacity-20" required />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 bg-white text-black font-bold uppercase tracking-[0.3em] rounded-2xl shadow-2xl">Create Profile</Button>
            </form>
          </section>
        )}

        {step === 'explore' && (
          <section className="flex-1 flex flex-col space-y-12 animate-in fade-in duration-700">
            <header className="text-center space-y-3">
              <h2 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Choose Hardware Architecture</h2>
              <p className="text-xs font-light italic opacity-60">Swipe to synchronize</p>
            </header>

            <div className="relative flex-1 flex flex-col items-center">
              <Carousel 
                setApi={setApi} 
                className="w-full"
                opts={{ 
                  loop: true, 
                  align: "center", 
                  skipSnaps: false,
                  dragFree: false
                }}
              >
                <CarouselContent className="-ml-0">
                  {DEVICES.map((device) => (
                    <CarouselItem key={device.id} className="pl-0 flex flex-col items-center">
                      <div className="flex flex-col items-center space-y-12 px-4 w-full pb-10">
                        <div className="relative w-72 aspect-[3/4] overflow-visible">
                           <Image 
                             src={device.img || ''} 
                             alt={device.name} 
                             fill 
                             className="object-contain drop-shadow-[0_30px_60px_rgba(255,255,255,0.1)] transition-transform duration-1000 scale-110"
                             data-ai-hint="perfume bottle technology"
                             priority
                           />
                        </div>
                        <div className="text-center space-y-4">
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">{device.brand}</p>
                          <h3 className="text-5xl font-headline font-black tracking-tight">{device.name}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-[260px] mx-auto font-medium">{device.desc}</p>
                          <Button 
                            className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.3em] rounded-2xl mt-6 shadow-2xl hover:scale-[1.02] transition-transform"
                            onClick={() => startLinking(device)}
                          >
                            Synchronize
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              <div className="flex gap-4 pb-12 mt-auto">
                {DEVICES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 transition-all duration-700 rounded-full ${current === i ? 'w-12 bg-white' : 'w-2 bg-white/20'}`} 
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {step === 'scan' && (
          <section className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
            <div className="relative">
              <div className={`absolute -inset-24 bg-white/5 rounded-full blur-[100px] transition-opacity duration-1000 ${scanning ? 'opacity-100 scale-150 animate-pulse' : 'opacity-0 scale-90'}`} />
              <Button 
                onClick={handleScan}
                disabled={scanning}
                className={`relative h-44 w-44 rounded-full flex flex-col items-center justify-center gap-3 border-none transition-all duration-700 ${scanning ? 'bg-white text-black scale-110 shadow-[0_0_80px_rgba(255,255,255,0.2)]' : 'bg-white/5 text-white border border-white/10 hover:bg-white hover:text-black'}`}
              >
                {scanning ? <Bluetooth className="w-14 h-14 animate-pulse" /> : <Scan className="w-14 h-14" />}
              </Button>
            </div>
            <div className="text-center space-y-5">
              <h2 className="text-4xl font-headline font-bold tracking-tight">Pairing {selectedProduct?.name}</h2>
              <p className="text-[10px] text-muted-foreground tracking-[0.4em] uppercase font-black opacity-40">
                {scanning ? 'Detecting via BLE 5.2...' : 'Tap to Initialize Secure Link'}
              </p>
              <p className="text-[10px] text-muted-foreground max-w-[240px] opacity-60 leading-relaxed font-medium">Maintain proximity to ensure an encrypted biometric connection.</p>
            </div>
          </section>
        )}

        {step === 'plan' && (
          <section className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pt-8">
            <header className="text-center space-y-3">
              <h2 className="text-4xl font-headline font-bold tracking-tight">Intelligence Tier</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-40">Biometric Sync Level</p>
            </header>
            <div className="space-y-5 pb-20">
              {PLANS.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`p-8 cursor-pointer transition-all border-none relative overflow-hidden group rounded-[2.5rem] ${plan.badge ? 'bg-white/5 ring-1 ring-white/10 shadow-2xl' : 'bg-white/5 hover:bg-white/10'}`}
                  onClick={() => handlePlanSelection(plan.id as PlanType)}
                >
                  {plan.badge && <Badge className="absolute top-6 right-8 bg-white text-black text-[9px] uppercase tracking-widest font-black px-3">{plan.badge}</Badge>}
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>
                        <p className="text-[10px] text-muted-foreground leading-relaxed max-w-[180px] font-medium">{plan.desc}</p>
                      </div>
                      <p className="text-xl font-black tabular-nums">{plan.price}</p>
                    </div>
                    <ul className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                      {plan.features.map((f, i) => (
                        <li key={i} className="text-[9px] uppercase font-bold tracking-[0.2em] flex items-center gap-2 opacity-50">
                          <Check className="w-3 h-3 text-accent" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <footer className="text-center pt-8 border-t border-white/5 mt-auto">
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.4em] font-black opacity-30">Omni-Scent Protocol v2.1.0</p>
        </footer>
      </div>
      <Navigation />
    </main>
  );
}
