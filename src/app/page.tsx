
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bluetooth, Zap, Scan, ArrowRight, ShieldCheck, Waves, Check, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useDevice, DeviceType, PlanType } from '@/lib/device-context';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Navigation } from '@/components/Navigation';
import { Badge } from '@/components/ui/badge';

const DEVICES = [
  {
    id: 'Prada' as DeviceType,
    name: 'Apex Essence',
    brand: 'Prada',
    desc: 'Technical performance & HRV tracking.',
    img: PlaceHolderImages.find(i => i.id === 'device-prada')?.imageUrl,
  },
  {
    id: 'YSL' as DeviceType,
    name: 'Synapse',
    brand: 'YSL',
    desc: 'Emotional response & nocturnal elegance.',
    img: PlaceHolderImages.find(i => i.id === 'device-ysl')?.imageUrl,
  },
  {
    id: 'Biotherm' as DeviceType,
    name: 'Kinetic',
    brand: 'Biotherm',
    desc: 'Aquatic metrics & organic recovery.',
    img: PlaceHolderImages.find(i => i.id === 'device-biotherm')?.imageUrl,
  }
];

const PLANS = [
  { id: 'Base', name: 'Base', price: '$15/mo', desc: 'Control manual y funciones esenciales.', features: ['Manual Refill', 'Basic Metrics'] },
  { id: 'Essential', name: 'Essential', price: '$29/mo', desc: 'IA que aprende tus rutinas diarias.', features: ['Predictive Refills', 'AI Routine Learning'], badge: 'Popular' },
  { id: 'Premium', name: 'Premium', price: '$49/mo', desc: 'IA de hiper-personalización biométrica.', features: ['Real-time HRV Sync', 'Exclusive Fragrance Drops'], badge: 'Elite' },
];

export default function WelcomePage() {
  const router = useRouter();
  const { activeDevice, setActiveDevice, setCurrentPlan, setUserProfile, userProfile } = useDevice();
  const [step, setStep] = useState<'intro' | 'register' | 'scan' | 'plan'>(userProfile ? 'scan' : 'intro');
  const [scanning, setScanning] = useState(false);
  const [detectedDevices, setDetectedDevices] = useState<typeof DEVICES>([]);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(formData);
    setStep('scan');
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setDetectedDevices(DEVICES);
    }, 2500);
  };

  const selectDevice = (device: DeviceType) => {
    setActiveDevice(device);
    setStep('plan');
  };

  const selectPlan = (plan: PlanType) => {
    setCurrentPlan(plan);
    router.push('/dashboard');
  };

  if (activeDevice !== 'none' && step === 'intro') {
    return (
      <main className="min-h-screen pb-24">
        <div className="p-8 pt-16 space-y-8 max-w-lg mx-auto">
          <header className="space-y-2">
            <h1 className="text-3xl font-headline font-bold tracking-tight">Active Ecosytem</h1>
            <p className="text-muted-foreground">Welcome back, {userProfile?.name}.</p>
          </header>
          <Card className="p-6 bg-brand overflow-hidden relative border-none group cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold opacity-80">{activeDevice}</p>
                <h2 className="text-2xl font-bold">Manage Hub</h2>
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
    <main className="min-h-screen flex flex-col bg-background text-foreground transition-all">
      <div className="flex-1 flex flex-col p-8 pt-20 max-w-lg mx-auto w-full space-y-12">
        
        {step === 'intro' && (
          <section className="space-y-8 text-center animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Zap className="w-10 h-10 text-black fill-black" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-headline font-bold tracking-tighter">OMNI-KINETIC</h1>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
                El futuro de la perfumería cinética. Tecnología minimalista para el máximo bienestar.
              </p>
            </div>
            <Button onClick={() => setStep('register')} className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200">
              Comenzar Experiencia
            </Button>
          </section>
        )}

        {step === 'register' && (
          <section className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Onboarding de Lujo</h2>
              <p className="text-muted-foreground text-sm">Crea tu perfil biográfico para sincronizar tus sentidos.</p>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[10px] uppercase tracking-widest opacity-60">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 opacity-40" />
                  <Input 
                    id="name" 
                    placeholder="Jane Doe" 
                    className="pl-10 h-12 bg-card border-none" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-widest opacity-60">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 opacity-40" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="jane@luxe.com" 
                    className="pl-10 h-12 bg-card border-none" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 bg-accent font-bold uppercase tracking-widest">Crear Cuenta</Button>
            </form>
          </section>
        )}

        {step === 'scan' && (
          <section className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-500">
            {!detectedDevices.length ? (
              <>
                <div className="relative">
                  <div className={`absolute -inset-12 bg-accent/20 rounded-full blur-3xl transition-opacity duration-1000 ${scanning ? 'opacity-100 scale-110 animate-pulse' : 'opacity-0 scale-90'}`} />
                  <Button 
                    onClick={handleScan}
                    disabled={scanning}
                    size="lg"
                    className="relative h-28 w-28 rounded-full bg-white text-black hover:bg-white/90 shadow-[0_0_50px_rgba(255,255,255,0.3)] group transition-all"
                  >
                    {scanning ? <Bluetooth className="w-10 h-10 animate-pulse" /> : <Scan className="w-10 h-10 group-hover:scale-110 transition-transform" />}
                  </Button>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-bold tracking-widest uppercase">
                    {scanning ? 'Detección vía BLE 5.2...' : 'Sincronización Inteligente'}
                  </p>
                  <p className="text-xs text-muted-foreground">Coloca tu wearable cerca del sensor.</p>
                </div>
              </>
            ) : (
              <div className="w-full space-y-8">
                <h2 className="text-center text-sm font-bold tracking-widest uppercase text-muted-foreground">Dispositivos Detectados</h2>
                <Carousel className="w-full">
                  <CarouselContent>
                    {detectedDevices.map((device) => (
                      <CarouselItem key={device.id}>
                        <Card className="border-none bg-card/40 backdrop-blur-md overflow-hidden flex flex-col">
                          <div className="aspect-[4/5] relative">
                            <Image src={device.img || ''} alt={device.name} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                              <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">{device.brand}</p>
                              <h3 className="text-3xl font-bold">{device.name}</h3>
                            </div>
                          </div>
                          <div className="p-6 space-y-6">
                            <p className="text-sm text-muted-foreground leading-relaxed">{device.desc}</p>
                            <Button className="w-full bg-white text-black h-12 rounded-xl font-bold" onClick={() => selectDevice(device.id)}>
                              Vincular Hardware
                            </Button>
                          </div>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-4" />
                  <CarouselNext className="-right-4" />
                </Carousel>
              </div>
            )}
          </section>
        )}

        {step === 'plan' && (
          <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Niveles de Inteligencia</h2>
              <p className="text-sm text-muted-foreground">Decide qué tan inteligente será tu rastro.</p>
            </div>
            <div className="space-y-4">
              {PLANS.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`p-5 cursor-pointer transition-all border-none relative overflow-hidden ${plan.badge ? 'ring-2 ring-accent bg-accent/5' : 'bg-card'}`}
                  onClick={() => selectPlan(plan.id as PlanType)}
                >
                  {plan.badge && <Badge className="absolute top-4 right-4 bg-accent text-white text-[10px]">{plan.badge}</Badge>}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-lg font-black text-accent">{plan.price}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{plan.desc}</p>
                    <ul className="flex flex-wrap gap-2 pt-2">
                      {plan.features.map((f, i) => (
                        <li key={i} className="text-[9px] uppercase font-bold tracking-wider flex items-center gap-1 opacity-60">
                          <Check className="w-2.5 h-2.5" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <footer className="text-center pt-8">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">Omni-Scent Core v1.0.4</p>
        </footer>
      </div>
      <Navigation />
    </main>
  );
}
