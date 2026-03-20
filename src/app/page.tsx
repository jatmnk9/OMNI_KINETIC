
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bluetooth, Zap, Scan, ArrowRight, ShieldCheck, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useDevice, DeviceType } from '@/lib/device-context';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Navigation } from '@/components/Navigation';

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

export default function WelcomePage() {
  const router = useRouter();
  const { activeDevice, setActiveDevice } = useDevice();
  const [scanning, setScanning] = useState(false);
  const [detectedDevices, setDetectedDevices] = useState<typeof DEVICES>([]);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setDetectedDevices(DEVICES);
    }, 2500);
  };

  const confirmDevice = (device: DeviceType) => {
    setActiveDevice(device);
    router.push('/dashboard');
  };

  if (activeDevice !== 'none') {
    return (
      <main className="min-h-screen pb-24">
        <div className="p-8 pt-16 space-y-8 max-w-lg mx-auto">
          <header className="space-y-2">
            <h1 className="text-3xl font-headline font-bold tracking-tight">Active Ecosytem</h1>
            <p className="text-muted-foreground">Welcome back to your personalized scent hub.</p>
          </header>

          <Card className="p-6 bg-brand overflow-hidden relative border-none group cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold opacity-80">{activeDevice}</p>
                <h2 className="text-2xl font-bold">Manage {activeDevice === 'Prada' ? 'Apex' : activeDevice === 'YSL' ? 'Synapse' : 'Kinetic'}</h2>
              </div>
              <ArrowRight className="w-6 h-6" />
            </div>
          </Card>

          <section className="grid grid-cols-2 gap-4">
             <Card className="p-4 bg-card flex flex-col items-center justify-center text-center gap-2">
                <ShieldCheck className="w-8 h-8 text-accent" />
                <span className="text-xs font-medium">Device Secured</span>
             </Card>
             <Card className="p-4 bg-card flex flex-col items-center justify-center text-center gap-2">
                <Zap className="w-8 h-8 text-accent" />
                <span className="text-xs font-medium">85% Energy</span>
             </Card>
          </section>

          <Card className="p-6 bg-card space-y-4">
            <div className="flex items-center gap-3">
              <Waves className="w-5 h-5 text-accent" />
              <h3 className="font-bold">Latest Insight</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your stress levels were slightly elevated this morning. A micro-dose of 0.4µL Bergamot extract was released to help center your focus.
            </p>
          </Card>
        </div>
        <Navigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground transition-all">
      <div className="flex-1 flex flex-col p-8 pt-20 max-w-lg mx-auto w-full space-y-12">
        <section className="space-y-4 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 border-4 border-black border-t-transparent animate-spin rounded-full" />
          </div>
          <h1 className="text-4xl font-headline font-bold tracking-tighter">OMNI-KINETIC</h1>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Experience the future of kinetic perfumery. Minimalist tech, maximum wellness.
          </p>
        </section>

        {!detectedDevices.length ? (
          <section className="flex-1 flex flex-col items-center justify-center space-y-8">
            <div className="relative">
              <div className={`absolute -inset-8 bg-accent/20 rounded-full blur-2xl transition-opacity duration-1000 ${scanning ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`} />
              <Button 
                onClick={handleScan}
                disabled={scanning}
                size="lg"
                className="relative h-24 w-24 rounded-full bg-white text-black hover:bg-white/90 shadow-2xl group transition-all"
              >
                {scanning ? <Bluetooth className="w-8 h-8 animate-pulse" /> : <Scan className="w-8 h-8 group-hover:scale-110 transition-transform" />}
              </Button>
            </div>
            <p className="text-sm font-medium tracking-widest uppercase">
              {scanning ? 'Searching for devices...' : 'Tap to scan hardware'}
            </p>
          </section>
        ) : (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-center text-sm font-bold tracking-widest uppercase text-muted-foreground">Devices Found</h2>
            <Carousel className="w-full">
              <CarouselContent>
                {detectedDevices.map((device) => (
                  <CarouselItem key={device.id}>
                    <div className="p-1">
                      <Card className="border-none bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
                        <div className="aspect-[4/5] relative">
                          <Image 
                            src={device.img || ''} 
                            alt={device.name} 
                            fill 
                            className="object-cover" 
                            data-ai-hint="perfume bottle technology"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1">{device.brand}</p>
                            <h3 className="text-3xl font-bold">{device.name}</h3>
                          </div>
                        </div>
                        <div className="p-6 space-y-6">
                          <p className="text-sm text-muted-foreground leading-relaxed">{device.desc}</p>
                          <Button 
                            className="w-full bg-white text-black hover:bg-white/90 h-12"
                            onClick={() => confirmDevice(device.id)}
                          >
                            Pair Device
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 bg-white/10 border-none text-white hover:bg-white/20" />
              <CarouselNext className="-right-4 bg-white/10 border-none text-white hover:bg-white/20" />
            </Carousel>
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
