
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bluetooth, Scan, ArrowRight, User, Mail, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { useDevice, DeviceType, PlanType } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Badge } from '@/components/ui/badge';

const DEVICES = [
  {
    id: 'ApexEssence' as DeviceType,
    name: 'Apex Essence',
    brand: 'Omni Kinetic',
    desc: 'High-performance biometric synchronization for active living.',
    img: '/apex.PNG',
  },
  {
    id: 'Synapse' as DeviceType,
    name: 'Synapse',
    brand: 'Omni Kinetic',
    desc: 'Deep emotional response mapping with nocturnal elegance.',
    img: '/synapse.PNG',
  },
  {
    id: 'Kinetic' as DeviceType,
    name: 'Kinetic',
    brand: 'Omni Kinetic',
    desc: 'Aquatic metrics and organic recovery for total well-being.',
    img: '/kinetic.PNG',
  }
];

const PLANS = [
  { id: 'Base', name: 'Base', price: '$15/mo', desc: 'Manual control and essential hardware features.', features: ['Manual Refill', 'Basic Metrics'] },
  { id: 'Essential', name: 'Essential', price: '$29/mo', desc: 'AI that learns your daily routines automatically.', features: ['Predictive Refills', 'AI Routine Learning'], badge: 'Popular' },
  { id: 'Premium', name: 'Premium', price: '$49/mo', desc: 'Hyper-personalized biometric sync in real-time.', features: ['Real-time HRV Sync', 'Exclusive Fragrance Drops'], badge: 'Elite' },
];

function OmniLogo() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="relative w-64 h-32">
        <Image 
          src="/logo_omni.PNG" 
          alt="Omni Kinetic" 
          fill 
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col items-center space-y-3">
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <p className="text-[10px] tracking-[0.4em] uppercase opacity-60 font-medium text-center">WHERE FRAGRANCE MEETS MOTION</p>
      </div>
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
      <main className="h-svh flex flex-col bg-background overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12 max-w-lg mx-auto text-center">
          <OmniLogo />
          <div className="w-full space-y-6">
             <p className="text-muted-foreground text-sm font-light">Welcome back, {userProfile?.name}.</p>
             <button 
               className="w-full p-10 bg-white text-black overflow-hidden relative border-none group rounded-[2.5rem] transition-transform active:scale-95 text-left flex items-center justify-between" 
               onClick={() => router.push('/dashboard')}
             >
               <div className="space-y-1">
                 <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">{activeDevice}</p>
                 <h2 className="text-2xl font-bold tracking-tight">Enter Hub</h2>
               </div>
               <ArrowRight className="w-6 h-6" />
             </button>
             <Button variant="ghost" size="sm" onClick={logout} className="opacity-40 text-[9px] uppercase tracking-widest font-bold">Sign Out</Button>
          </div>
        </div>
        <Navigation />
      </main>
    );
  }

  return (
    <main className="h-svh flex flex-col bg-background text-foreground overflow-hidden">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-8 py-6">
        
        {step === 'intro' && (
          <section className="flex-1 flex flex-col items-center justify-center space-y-16 animate-in fade-in duration-1000">
            <OmniLogo />
            
            <div className="max-w-[280px] text-center">
              <p className="text-white/40 text-[11px] leading-relaxed tracking-wide font-light">
                Biometric synchronization for the modern avant-garde.
              </p>
            </div>

            <div className="w-full">
              <Button 
                onClick={() => setStep('register')} 
                variant="outline"
                className="w-full h-16 border-white/10 bg-white/5 text-white font-bold tracking-[0.3em] uppercase rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4"
              >
                <Fingerprint className="w-5 h-5 opacity-40" />
                Initialize Profile
              </Button>
            </div>
          </section>
        )}

        {step === 'register' && (
          <section className="flex-1 flex flex-col justify-center space-y-8 animate-in slide-in-from-right-4 duration-500">
            <header className="space-y-3 text-center">
              <h2 className="text-4xl font-headline font-bold tracking-tight">Profile Setup</h2>
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold opacity-40">Initialize your biometric identity</p>
            </header>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[9px] uppercase tracking-[0.3em] opacity-40 font-black">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 opacity-20" />
                  <Input id="name" name="name" placeholder="E.g. Jane Doe" className="pl-10 h-14 bg-white/5 border-none rounded-2xl placeholder:opacity-20 text-white" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[9px] uppercase tracking-[0.3em] opacity-40 font-black">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 opacity-20" />
                  <Input id="email" name="email" type="email" placeholder="jane@omnokinetic.com" className="pl-10 h-14 bg-white/5 border-none rounded-2xl placeholder:opacity-20 text-white" required />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 bg-white text-black font-bold uppercase tracking-[0.3em] rounded-2xl shadow-2xl mt-4 hover:scale-[1.02] active:scale-95 transition-transform">Create Identity</Button>
            </form>
          </section>
        )}

        {step === 'explore' && (
          <section className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-700">
            <header className="text-center space-y-1">
              <h2 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Choose Architecture</h2>
              <p className="text-[10px] font-light italic opacity-60">Swipe to synchronize hardware</p>
            </header>

            <div className="flex-1 flex flex-col relative">
              <Carousel 
                setApi={setApi} 
                className="w-full flex-1"
                opts={{ 
                  loop: true, 
                  align: "center", 
                  skipSnaps: false,
                  dragFree: false
                }}
              >
                <CarouselContent className="-ml-0 h-full">
                  {DEVICES.map((device) => (
                    <CarouselItem key={device.id} className="pl-0 h-full flex flex-col items-center">
                      <div className="flex flex-col items-center h-full w-full">
                        <div className="flex-1 relative w-full flex items-center justify-center p-4">
                           <div className="relative w-full max-w-[240px] aspect-[3/4]">
                             <Image 
                               src={device.img} 
                               alt={device.name} 
                               fill 
                               className="object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-transform duration-1000 scale-105"
                               priority
                             />
                           </div>
                        </div>
                        <div className="text-center space-y-3 pb-4">
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">{device.brand}</p>
                          <h3 className="text-4xl font-headline font-black tracking-tight">{device.name}</h3>
                          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[240px] mx-auto font-medium">{device.desc}</p>
                          <Button 
                            className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.3em] rounded-2xl mt-4 shadow-2xl active:scale-[0.98] transition-transform"
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
              
              <div className="flex justify-center gap-3 pt-2 pb-4">
                {DEVICES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-0.5 transition-all duration-700 rounded-full ${current === i ? 'w-10 bg-white' : 'w-1.5 bg-white/20'}`} 
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
              <button 
                onClick={handleScan}
                disabled={scanning}
                className={`relative h-40 w-40 rounded-full flex flex-col items-center justify-center gap-3 border-none transition-all duration-700 ${scanning ? 'bg-white text-black scale-110 shadow-[0_0_80px_rgba(255,255,255,0.2)]' : 'bg-white/5 text-white border border-white/10 hover:bg-white hover:text-black'}`}
              >
                {scanning ? <Bluetooth className="w-12 h-12 animate-pulse" /> : <Scan className="w-12 h-12" />}
              </button>
            </div>
            <div className="text-center space-y-5">
              <h2 className="text-3xl font-headline font-bold tracking-tight">Pairing {selectedProduct?.name}</h2>
              <p className="text-[10px] text-muted-foreground tracking-[0.4em] uppercase font-black opacity-40">
                {scanning ? 'Detecting via BLE 5.2...' : 'Tap to Initialize Secure Link'}
              </p>
              <p className="text-[10px] text-muted-foreground max-w-[220px] mx-auto opacity-60 leading-relaxed font-medium">Maintain proximity to ensure an encrypted biometric connection.</p>
            </div>
          </section>
        )}

        {step === 'plan' && (
          <section className="flex-1 flex flex-col justify-center space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <header className="text-center space-y-2">
              <h2 className="text-3xl font-headline font-bold tracking-tight">Intelligence Tier</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-40">Biometric Sync Level</p>
            </header>
            <div className="space-y-4">
              {PLANS.map((plan) => (
                <button 
                  key={plan.id} 
                  className={`w-full text-left p-6 transition-all border-none relative overflow-hidden group rounded-[2rem] ${plan.badge ? 'bg-white/5 ring-1 ring-white/10 shadow-xl' : 'bg-white/5 hover:bg-white/10'}`}
                  onClick={() => handlePlanSelection(plan.id as PlanType)}
                >
                  {plan.badge && <Badge className="absolute top-4 right-6 bg-white text-black text-[8px] uppercase tracking-widest font-black px-2">{plan.badge}</Badge>}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                        <p className="text-[9px] text-muted-foreground leading-relaxed max-w-[160px] font-medium">{plan.desc}</p>
                      </div>
                      <p className="text-lg font-black tabular-nums">{plan.price}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <footer className="text-center pt-4 border-t border-white/5">
          <p className="text-[8px] text-muted-foreground uppercase tracking-[0.4em] font-black opacity-30">Omni-Scent Protocol v2.1.0</p>
        </footer>
      </div>
      <Navigation />
    </main>
  );
}
