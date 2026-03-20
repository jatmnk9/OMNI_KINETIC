"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bluetooth, Scan, ArrowRight, Check, User, Mail, LogOut } from 'lucide-react';
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
    id: 'Prada' as DeviceType,
    name: 'Apex Essence',
    brand: 'Prada',
    desc: 'High-tech performance with HRV tracking for high-performance living.',
    img: PlaceHolderImages.find(i => i.id === 'device-prada')?.imageUrl,
  },
  {
    id: 'YSL' as DeviceType,
    name: 'Synapse',
    brand: 'YSL',
    desc: 'Emotional response synchronization with nocturnal elegance.',
    img: PlaceHolderImages.find(i => i.id === 'device-ysl')?.imageUrl,
  },
  {
    id: 'Biotherm' as DeviceType,
    name: 'Kinetic',
    brand: 'Biotherm',
    desc: 'Aquatic metrics and organic recovery for wellness-centric users.',
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
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-headline tracking-[0.3em] font-black leading-none">OMNI</h1>
      <h2 className="text-sm font-body tracking-[0.5em] font-bold opacity-40 -mt-1 uppercase">Kinetic</h2>
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

  // If already logged in, show access card
  if (activeDevice !== 'none' && step === 'intro') {
    return (
      <main className="min-h-screen pb-24">
        <div className="p-8 pt-16 space-y-8 max-w-lg mx-auto">
          <header className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-3xl font-headline font-bold">Active Ecosystem</h1>
              <p className="text-muted-foreground">Welcome back, {userProfile?.name}.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-5 h-5 opacity-40" />
            </Button>
          </header>
          <Card className="p-10 bg-brand overflow-hidden relative border-none group cursor-pointer rounded-[2rem]" onClick={() => router.push('/dashboard')}>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">{activeDevice}</p>
                <h2 className="text-2xl font-bold tracking-tight">Access Hub</h2>
              </div>
              <ArrowRight className="w-6 h-6" />
            </div>
          </Card>
        </div>
        <Navigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 flex flex-col p-8 pt-20 max-w-lg mx-auto w-full space-y-12">
        
        {step === 'intro' && (
          <section className="space-y-12 text-center animate-in fade-in duration-1000">
            <OmniLogo />
            <div className="space-y-4">
              <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed tracking-wide font-light">
                The future of kinetic perfumery. Minimalist technology for maximal well-being.
              </p>
            </div>
            <div className="pt-8">
              <Button onClick={() => setStep('register')} className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all">
                Begin Experience
              </Button>
            </div>
          </section>
        )}

        {step === 'register' && (
          <section className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <header className="space-y-2">
              <h2 className="text-4xl font-headline font-bold">Biographic Onboarding</h2>
              <p className="text-muted-foreground text-sm">Create your biographical profile to synchronize your senses.</p>
            </header>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 opacity-40" />
                  <Input id="name" name="name" placeholder="Jane Doe" className="pl-10 h-14 bg-card border-none rounded-xl" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 opacity-40" />
                  <Input id="email" name="email" type="email" placeholder="jane@luxe.com" className="pl-10 h-14 bg-card border-none rounded-xl" required />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 bg-accent font-bold uppercase tracking-[0.2em] rounded-xl mt-4">Create Account</Button>
            </form>
          </section>
        )}

        {step === 'explore' && (
          <section className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-700">
            <header className="text-center space-y-2">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50">Select Your Hardware</h2>
              <p className="text-sm font-light italic">Explore the kinetic collection</p>
            </header>

            <div className="relative flex-1 flex flex-col items-center overflow-hidden">
              <Carousel 
                setApi={setApi} 
                className="w-full h-full cursor-grab active:cursor-grabbing"
                opts={{ loop: true }}
              >
                <CarouselContent className="h-full">
                  {DEVICES.map((device) => (
                    <CarouselItem key={device.id} className="h-full flex flex-col items-center">
                      <div className="flex flex-col items-center space-y-8 px-4 w-full h-full">
                        <div className="relative w-full aspect-[3/4] overflow-visible rounded-[3rem] transition-transform duration-700">
                           <Image 
                             src={device.img || ''} 
                             alt={device.name} 
                             fill 
                             className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-1000"
                             data-ai-hint="luxury perfume"
                             priority
                           />
                        </div>
                        <div className="text-center space-y-3 pb-8">
                          <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">{device.brand}</p>
                          <h3 className="text-4xl font-headline font-black tracking-tight">{device.name}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">{device.desc}</p>
                          <Button 
                            className="w-full h-12 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-xl mt-4 shadow-lg hover:shadow-white/10"
                            onClick={() => startLinking(device)}
                          >
                            Select Device
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              <div className="flex gap-2 pb-4 mt-auto">
                {DEVICES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${current === i ? 'w-6 bg-accent' : 'w-1.5 bg-white/20'}`} 
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {step === 'scan' && (
          <section className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-500">
            <div className="relative">
              <div className={`absolute -inset-16 bg-accent/20 rounded-full blur-3xl transition-opacity duration-1000 ${scanning ? 'opacity-100 scale-125 animate-pulse' : 'opacity-0 scale-90'}`} />
              <Button 
                onClick={handleScan}
                disabled={scanning}
                className={`relative h-32 w-32 rounded-full flex flex-col items-center justify-center gap-2 border-none transition-all duration-500 ${scanning ? 'bg-accent text-white scale-110 shadow-[0_0_30px_rgba(var(--accent),0.4)]' : 'bg-white text-black shadow-2xl hover:scale-105'}`}
              >
                {scanning ? <Bluetooth className="w-10 h-10 animate-pulse" /> : <Scan className="w-10 h-10" />}
              </Button>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-headline font-bold">Pairing {selectedProduct?.name}</h2>
              <p className="text-xs text-muted-foreground tracking-widest uppercase font-bold">
                {scanning ? 'Detecting via BLE 5.2...' : 'Tap to Synchronize'}
              </p>
              <p className="text-[10px] text-muted-foreground max-w-xs opacity-60">Place your wearable near the mobile sensor to initialize the encrypted link.</p>
            </div>
          </section>
        )}

        {step === 'plan' && (
          <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <header className="text-center space-y-2">
              <h2 className="text-3xl font-headline font-bold">Scent Intelligence Levels</h2>
              <p className="text-sm text-muted-foreground font-light">Choose the depth of your olfactory intelligence.</p>
            </header>
            <div className="space-y-4 pb-12">
              {PLANS.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`p-6 cursor-pointer transition-all border-none relative overflow-hidden group rounded-[1.5rem] ${plan.badge ? 'ring-2 ring-accent bg-accent/5' : 'bg-card hover:bg-white/5'}`}
                  onClick={() => handlePlanSelection(plan.id as PlanType)}
                >
                  {plan.badge && <Badge className="absolute top-4 right-4 bg-accent text-white text-[10px] uppercase tracking-widest font-bold">{plan.badge}</Badge>}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{plan.desc}</p>
                      </div>
                      <p className="text-lg font-black text-accent">{plan.price}</p>
                    </div>
                    <ul className="flex flex-wrap gap-2 pt-2 border-t border-white/5 mt-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="text-[9px] uppercase font-bold tracking-widest flex items-center gap-1 opacity-60">
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
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.4em] font-bold">Omni-Scent Core v1.0.4</p>
        </footer>
      </div>
      <Navigation />
    </main>
  );
}
