
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bluetooth, Scan, ArrowRight, User, Mail, Fingerprint, ChevronLeft, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    brand: 'OMNI KINETIC',
    desc: 'High-performance biometric synchronization for active living.',
    img: '/apex.PNG',
  },
  {
    id: 'Synapse' as DeviceType,
    name: 'Synapse',
    brand: 'OMNI KINETIC',
    desc: 'Deep emotional response mapping with nocturnal elegance.',
    img: '/synapse.PNG',
  },
  {
    id: 'Kinetic' as DeviceType,
    name: 'Kinetic',
    brand: 'OMNI KINETIC',
    desc: 'Aquatic metrics and organic recovery for total well-being.',
    img: '/kinetic.PNG',
  }
];

const PLANS = [
  { id: 'Base', name: 'Functional Luxury', price: '$0/mo', desc: 'Essential hardware sync and basic motion triggers.', features: ['App Core Access', 'NFC Status Check', 'Basic Triggers'] },
  { id: 'Essential', name: 'Essential', price: '$76.03/mo', desc: 'The intelligent ecosystem. Learns your daily rhythms.', features: ['2 Smart Refills', 'AI Routine Learning', 'Predictive Refills'], badge: 'Popular' },
  { id: 'Premium', name: 'Premium', price: '$114.05/mo', desc: 'The gold standard of luxury technology.', features: ['4 Smart Refills', 'Biometric Deep Sync', 'Exclusive LTD Drops'], badge: 'Elite' },
];

function OmniTopLogo() {
  return (
    <div className="w-full flex justify-center pt-6 pb-2 animate-in fade-in duration-700 shrink-0">
      <div className="relative w-28 h-12">
        <Image 
          src="/logo_omni.PNG" 
          alt="Omni Kinetic" 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

export default function WelcomePage() {
  const router = useRouter();
  const { activeDevice, setActiveDevice, setCurrentPlan, setUserProfile, userProfile, logout } = useDevice();
  const [step, setStep] = useState<'intro' | 'register' | 'explore' | 'scan' | 'plan'>(userProfile ? 'explore' : 'intro');
  const [scanState, setScanState] = useState<'idle' | 'detecting' | 'preparing' | 'ready'>('idle');
  const [selectedProduct, setSelectedProduct] = useState<typeof DEVICES[0] | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if ((step === 'intro' || step === 'register') && videoRef.current) {
      videoRef.current.play().catch(e => console.error("Autoplay thwarted", e));
    }
  }, [step]);

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

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  };

  const startLinking = (device: (typeof DEVICES)[0]) => {
    setSelectedProduct(device);
    setActiveDevice(device.id);
    setStep('scan');
    setScanState('detecting');
    
    clearAllTimeouts();

    timeoutRefs.current.push(setTimeout(() => setScanState('preparing'), 1500));
    timeoutRefs.current.push(setTimeout(() => setScanState('ready'), 3500));
    timeoutRefs.current.push(setTimeout(() => {
      setScanState('idle');
      setStep('plan');
    }, 5000));
  };

  const handlePlanSelection = (plan: PlanType) => {
    setCurrentPlan(plan);
    router.push('/dashboard');
  };

  const showHeaderLogo = step !== 'intro';

  // Universal Back Button Handler
  const handleBack = () => {
    if (step === 'register') setStep('intro');
    else if (step === 'explore') setStep('intro'); // Always allow backing out to the beautiful welcome screen
    else if (step === 'scan') { clearAllTimeouts(); setActiveDevice('none'); setStep('explore'); }
    else if (step === 'plan') { setActiveDevice('none'); setStep('explore'); }
  };

  if (activeDevice !== 'none' && step === 'intro') {
    return (
      <main className="h-svh flex flex-col bg-background overflow-hidden relative">
        <div className="absolute top-6 left-6 z-50">
           <Button variant="ghost" size="icon" onClick={() => setActiveDevice('none')} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full">
             <ArrowLeft className="w-6 h-6" />
           </Button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12 max-w-lg mx-auto text-center">
          <OmniTopLogo />
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
    <main className="h-svh flex flex-col bg-background text-foreground overflow-hidden relative">
      
      {/* Universal Floating Back Button */}
      {step !== 'intro' && (
        <div className="absolute top-6 left-6 z-50 animate-in fade-in zoom-in duration-500 delay-300 fill-mode-both">
          <Button variant="ghost" size="icon" onClick={handleBack} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full w-12 h-12">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Background Video for Intro and Register Steps */}
      {(step === 'intro' || step === 'register') && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
            poster="/logo_omni.PNG"
          >
            <source src="/bg.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      <div className="relative z-10 w-full">
        {showHeaderLogo && <OmniTopLogo />}
      </div>
      
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-8 relative overflow-hidden z-10">
        
        {step === 'intro' && (
          <section className="flex-1 flex flex-col items-center justify-between py-10 sm:py-16 w-full animate-in fade-in duration-1000 min-h-0">
             
             {/* Dynamic Top Block */}
             <div className="flex flex-col items-center justify-center flex-1 min-h-0 w-full shrink-0">
               <div className="relative w-56 h-28 sm:w-72 sm:h-36 mb-6">
                <Image 
                  src="/logo_omni.PNG" 
                  alt="Omni Kinetic" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
              
              <div className="max-w-[300px] text-center px-4">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-4 sm:mb-6" />
                <p className="text-white/80 text-[10px] sm:text-[11px] tracking-[0.4em] sm:tracking-[0.5em] uppercase font-bold mb-2 sm:mb-3">
                  WHERE FRAGRANCE MEETS MOTION
                </p>
                <p className="text-white/40 text-[10px] sm:text-[12px] leading-relaxed tracking-wide font-light italic">
                  Biometric synchronization for the modern avant-garde.
                </p>
              </div>
            </div>

            {/* Dynamic Bottom Block */}
            <div className="w-full flex flex-col items-center justify-end shrink-0 pt-6">
              <div className="w-full mb-6 sm:mb-8">
                <Button 
                  onClick={() => setStep('register')} 
                  className="w-full h-14 sm:h-16 bg-white text-black font-bold tracking-[0.3em] uppercase rounded-xl sm:rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-4 border-none shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95"
                >
                  <Fingerprint className="w-5 h-5 opacity-40 shrink-0" />
                  <span className="text-[11px] sm:text-xs">Start Journey</span>
                </Button>
              </div>

              <div className="flex flex-col items-center space-y-2 sm:space-y-4 opacity-80 pb-2">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.5em] font-black text-white/40">BY</span>
                <div className="relative w-20 h-4 sm:w-28 sm:h-6">
                  <Image 
                    src="/loreal_logo.png" 
                    alt="L'Oréal Luxe" 
                    fill 
                    sizes="120px"
                    className="object-contain" 
                  />
                </div>
              </div>
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
                  <User className="absolute left-4 top-4 w-4 h-4 opacity-20" />
                  <Input id="name" name="name" placeholder="E.g. Jane Doe" className="pl-12 h-14 bg-white/5 border-none rounded-2xl placeholder:opacity-20 text-white" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[9px] uppercase tracking-[0.3em] opacity-40 font-black">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-4 h-4 opacity-20" />
                  <Input id="email" name="email" type="email" placeholder="jane@omnokinetic.com" className="pl-12 h-14 bg-white/5 border-none rounded-2xl placeholder:opacity-20 text-white" required />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 bg-white text-black font-bold uppercase tracking-[0.3em] rounded-2xl shadow-2xl mt-4 hover:bg-neutral-200 transition-transform">Create Identity</Button>
            </form>
          </section>
        )}

        {step === 'explore' && (
          <section className={`flex-1 flex flex-col animate-in fade-in duration-700 overflow-hidden theme-${DEVICES[current].id.toLowerCase()}`}>
            
            {/* Ambient Animated Orbs for the Carousel Preview */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-1000">
              <div className="absolute -top-[15%] -left-[10%] w-[70vw] h-[70vh] rounded-full bg-brand/30 blur-[120px] mix-blend-screen animate-slow-drift" />
              <div className="absolute top-[25%] -right-[15%] w-[60vw] h-[60vh] rounded-full bg-brand-accent/20 blur-[130px] mix-blend-screen animate-slow-drift-reverse" />
            </div>

            <header className="text-center space-y-1 mb-2 shrink-0 relative z-10">
              <h2 className="text-[11px] uppercase tracking-[0.4em] font-black opacity-80">CHOOSE ARCHITECTURE</h2>
              <p className="text-[10px] font-light italic opacity-40">Swipe to synchronize hardware</p>
            </header>

            <div className="flex-1 flex flex-col relative overflow-hidden min-h-0 z-10 w-full max-w-[420px] mx-auto">
              <Carousel 
                setApi={setApi} 
                className="w-full h-full"
                opts={{ 
                  loop: true, 
                  align: "center", 
                  skipSnaps: false,
                }}
              >
                <CarouselContent className="-ml-0 h-full">
                  {DEVICES.map((device) => (
                    <CarouselItem key={device.id} className="pl-0 h-full">
                      <div className="flex flex-col items-center justify-between h-full w-full py-4">
                        
                        <div className="relative w-full flex-1 min-h-[30vh] max-h-[50vh] my-4 transition-transform duration-1000 md:hover:scale-105 active:scale-95">
                          <Image 
                            src={device.img} 
                            alt={device.name} 
                            fill 
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                            priority
                          />
                        </div>

                        <div className="text-center space-y-2 px-4 shrink-0">
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">{device.brand}</p>
                          <h3 className="text-3xl font-headline font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-accent pb-1">
                            {device.name}
                          </h3>
                          <p className="text-[11px] text-white/60 leading-relaxed max-w-[260px] mx-auto font-medium">
                            {device.desc}
                          </p>
                          
                          <div className="pt-4">
                            <Button 
                              className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-transform border-none hover:bg-neutral-200"
                              onClick={() => startLinking(device)}
                            >
                              Synchronize
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            
            <div className="flex justify-center gap-2 py-4 shrink-0 relative z-10 mb-4">
              {DEVICES.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 transition-all duration-700 rounded-full ${current === i ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} 
                />
              ))}
            </div>
          </section>
        )}

        {step === 'scan' && (
          <section className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in zoom-in-95 duration-500 relative z-10 px-4">
            <div className="relative z-20">
              {/* Optimized Background Glow: No constant pulse on giant blurs to prevent mobile GPU hang */}
              <div className={`absolute -inset-16 bg-brand/30 rounded-full blur-2xl transition-all duration-1000 opacity-100 scale-125`} />
              
              <div className={`relative h-32 w-32 sm:h-40 sm:w-40 rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-700 bg-brand text-accent-foreground scale-110 shadow-[0_0_40px_hsl(var(--brand-primary)/0.4)]`}>
                {scanState === 'ready' ? <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-in zoom-in duration-500" /> : <Bluetooth className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse text-white" />}
              </div>
            </div>

            <div className="text-center space-y-6 relative z-30">
              <h2 className="text-2xl sm:text-3xl font-headline font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-accent pb-1">
                {scanState === 'ready' ? 'Link Established' : `Pairing ${selectedProduct?.name}`}
              </h2>
              
              <div className="h-10 sm:h-12 flex items-center justify-center px-4 w-full">
                <p className="text-[10px] sm:text-[11px] text-brand-accent tracking-[0.2em] sm:tracking-[0.4em] uppercase font-black opacity-90 animate-in fade-in slide-in-from-bottom-2 duration-500 text-center" key={scanState}>
                  {scanState === 'detecting' && 'Detecting via BLE 5.2...'}
                  {scanState === 'preparing' && 'Preparing Omni Kinetic Environment...'}
                  {scanState === 'ready' && 'Omni Kinetic is ready for you.'}
                </p>
              </div>
              
              <p className="text-[9px] sm:text-[10px] text-white/60 max-w-[240px] mx-auto leading-relaxed font-medium">
                Maintain proximity to ensure an encrypted biometric connection.
              </p>
            </div>
            
            <Button variant="ghost" onClick={() => { clearAllTimeouts(); setActiveDevice('none'); setStep('explore'); }} className="relative z-30 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest opacity-50 hover:text-brand-accent hover:opacity-100 mt-8">
               <ChevronLeft className="w-4 h-4 mr-2" /> Cancel Synchronization
            </Button>
          </section>
        )}

        {step === 'plan' && (
          <section className="flex-1 flex flex-col justify-center space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative z-10">
            <header className="text-center space-y-2">
              <h2 className="text-3xl font-headline font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-accent pb-1">Intelligence Tier</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Biometric Sync Level</p>
            </header>
            <div className="space-y-3">
              {PLANS.map((plan) => (
                <button 
                  key={plan.id} 
                  className={`w-full text-left p-5 transition-all border-none relative overflow-hidden group rounded-[2rem] bg-white/5 hover:bg-brand/10 ring-1 ring-white/10 hover:ring-brand/40 hover:shadow-[0_0_30px_hsl(var(--brand-primary)/0.2)]`}
                  onClick={() => handlePlanSelection(plan.id as PlanType)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-brand-accent transition-colors">{plan.name}</h3>
                      <p className="text-[9px] text-white/50 leading-relaxed max-w-[160px] font-medium">{plan.desc}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      {plan.badge && (
                        <Badge className="bg-brand-accent text-accent-foreground text-[8px] uppercase tracking-widest font-black px-2 mb-1 shadow-[0_0_10px_hsl(var(--brand-accent)/0.5)] border-none">
                          {plan.badge}
                        </Badge>
                      )}
                      <p className="text-base font-black tabular-nums text-white">{plan.price}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <footer className="text-center pb-4 shrink-0">
          <p className="text-[8px] text-muted-foreground uppercase tracking-[0.4em] font-black opacity-30">Omni-Scent Protocol v2.1.0</p>
        </footer>
      </div>
      <Navigation />
    </main>
  );
}
