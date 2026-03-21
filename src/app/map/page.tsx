
"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Package, 
  ShieldCheck, 
  ChevronRight,
  ArrowLeft,
  Star,
  Clock,
  Phone,
  Layers,
  Locate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { useDevice } from '@/lib/device-context';
import { cn } from '@/lib/utils';

const REFILL_LOCATIONS = [
  { id: 1, name: "Omni Luxe - Serrano", brand: "Flagship", status: "Available", stock: 12, distance: "0.8 km", address: "Calle de Serrano, 45", rating: 4.9, coords: { x: 42, y: 38 }, color: "bg-brand-accent" },
  { id: 2, name: "Luxe Wellness Pt", brand: "Authorized", status: "Limited", stock: 3, distance: "1.4 km", address: "Calle de Velázquez, 12", rating: 4.7, coords: { x: 58, y: 52 }, color: "bg-orange-500" },
  { id: 3, name: "Omni - El Corte Inglés", brand: "Premium", status: "Available", stock: 24, distance: "2.1 km", address: "Paseo de la Castellana, 79", rating: 4.8, coords: { x: 35, y: 65 }, color: "bg-brand-accent" },
  { id: 4, name: "Omni Kinetic - Retiro", brand: "Experience Center", status: "Available", stock: 45, distance: "3.2 km", address: "Calle de Alfonso XII, 14", rating: 5.0, coords: { x: 72, y: 45 }, color: "bg-brand-accent" }
];

export default function RefillLocatorPage() {
  const { activeDevice } = useDevice();
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isMounting, setIsMounting] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setIsMounting(true);
  }, []);

  const filteredLocations = REFILL_LOCATIONS.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="h-screen w-full bg-background text-foreground overflow-hidden relative font-body">
      
      <div className="absolute top-0 left-0 right-0 z-[100] bg-background/50 backdrop-blur-md">
        <Header />
      </div>

      {/* FULL SCREEN MAP CONTAINER */}
      <div className="absolute inset-0 z-0 bg-[#050505] pt-20">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.15)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
            <g stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none">
              <path d="M-100,250 L1200,850" />
              <path d="M400,-100 L650,1200" />
              <path d="M0,450 L1200,450" />
              <path d="M650,0 L650,1200" />
              <circle cx="50%" cy="45%" r="180" strokeWidth="0.5" strokeDasharray="8,8" />
              <circle cx="50%" cy="45%" r="350" strokeWidth="0.5" strokeDasharray="12,12" />
            </g>
          </svg>
        </div>
        
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
          <div className="w-[150vw] h-[2px] bg-brand-accent animate-[spin_15s_linear_infinite]" />
        </div>

        <div className="absolute inset-0">
          {filteredLocations.map((f, i) => (
            <div 
              key={f.id}
              className={cn(
                "absolute transition-all duration-1000 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-20",
                isMounting ? "opacity-100 scale-100" : "opacity-0 scale-50"
              )}
              style={{ left: `${f.coords.x}%`, top: `${f.coords.y + 10}%`, transitionDelay: `${i * 150}ms` }}
              onClick={() => { setSelectedLocation(f); setShowList(true); }}
            >
              <div className="relative group">
                <div className={cn("absolute inset-[-12px] rounded-full animate-ping opacity-25 duration-[2000ms]", selectedLocation?.id === f.id ? "bg-white" : "bg-brand-accent")} />
                <div className={cn("relative h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl border", selectedLocation?.id === f.id ? "bg-brand-accent text-background scale-125 border-white" : "bg-card text-brand-accent border-white/10")}>
                  <MapPin className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-24 left-6 right-6 z-40 space-y-4 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <Input 
            placeholder="Locate Omni Kinetic Station..." 
            className="pl-12 bg-black/80 backdrop-blur-3xl border-white/10 h-14 text-sm rounded-2xl shadow-2xl"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
           <div className="bg-black/80 backdrop-blur-2xl border border-white/5 px-4 py-2 rounded-full flex items-center gap-3">
             <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse shadow-[0_0_12px_hsl(var(--brand-accent))]" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{filteredLocations.length} STATIONS DETECTED</span>
           </div>
           <Button size="icon" variant="ghost" className="bg-black/80 backdrop-blur-2xl border border-white/5 rounded-full h-11 w-11 text-white hover:text-brand-accent shadow-xl">
             <Locate className="w-5 h-5" />
           </Button>
        </div>
      </div>

      <div className={cn("absolute bottom-24 left-0 right-0 z-40 transition-all duration-700 ease-in-out max-w-md mx-auto px-4", selectedLocation || showList ? "h-[50vh]" : "h-20")}>
        <div className="h-full bg-card/95 backdrop-blur-3xl rounded-t-[3rem] p-6 shadow-2xl border-t border-white/10 flex flex-col">
          <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-6 cursor-pointer" onClick={() => selectedLocation ? setSelectedLocation(null) : setShowList(!showList)} />
          <ScrollArea className="flex-1">
            {selectedLocation ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500 pb-10">
                <Button variant="ghost" size="sm" onClick={() => setSelectedLocation(null)} className="w-fit -ml-2 h-8 text-muted-foreground uppercase text-[10px] font-black"><ArrowLeft className="w-4 h-4 mr-2" /> ALL HUBS</Button>
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black tracking-tight">{selectedLocation.name}</h2>
                      <Badge className="bg-brand-accent text-background font-black text-[10px] h-6 px-3">{selectedLocation.rating} <Star className="w-3 h-3 ml-1 fill-current" /></Badge>
                   </div>
                   <p className="text-xs text-muted-foreground font-medium">{selectedLocation.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <Card className="p-5 bg-white/5 border-none rounded-3xl space-y-2"><p className="text-[9px] uppercase font-black text-brand-accent">LIVE STOCK</p><span className="font-black text-xl">{selectedLocation.stock} <span className="text-[10px] opacity-40">UNITS</span></span></Card>
                   <Card className="p-5 bg-white/5 border-none rounded-3xl space-y-2"><p className="text-[9px] uppercase font-black text-brand-accent">TIER</p><span className="font-black text-[11px] uppercase">VERIFIED PREMIUM</span></Card>
                </div>
                <Button className="w-full h-16 bg-brand-accent text-background font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl">RESERVE REFILL</Button>
              </div>
            ) : (
              <div className="space-y-6 pb-10">
                <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-muted-foreground flex items-center gap-3"><Layers className="w-4 h-4 text-brand-accent" /> NEARBY HUBS</h2>
                <div className="space-y-3">
                  {filteredLocations.map((f) => (
                    <Card key={f.id} className="p-5 bg-white/5 border-none flex items-center gap-5 cursor-pointer hover:bg-white/10 transition-all rounded-[1.8rem] group relative" onClick={() => setSelectedLocation(f)}>
                      <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 relative overflow-hidden"><div className={cn("absolute inset-0 opacity-10", f.color)} /><MapPin className="w-6 h-6 text-brand-accent" /></div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-[9px] font-black uppercase text-brand-accent tracking-[0.15em]">{f.brand}</p>
                        <h3 className="font-bold text-base leading-tight truncate">{f.name}</h3>
                        <span className="text-[11px] text-muted-foreground font-medium">{f.distance} AWAY</span>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100" />
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
      <Navigation />
    </main>
  );
}
