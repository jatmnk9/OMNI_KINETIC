
"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation as NavIcon, 
  Package, 
  ShieldCheck, 
  ChevronRight,
  ArrowLeft,
  Star,
  Clock,
  Phone,
  Layers,
  Locate,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navigation } from '@/components/Navigation';
import { useDevice } from '@/lib/device-context';
import { cn } from '@/lib/utils';

const REFILL_LOCATIONS = [
  {
    id: 1,
    name: "Omni Luxe - Serrano",
    brand: "Flagship",
    status: "Available",
    stock: 12,
    distance: "0.8 km",
    address: "Calle de Serrano, 45",
    rating: 4.9,
    coords: { x: 42, y: 38 },
    color: "bg-brand-accent"
  },
  {
    id: 2,
    name: "Luxe Wellness Pt",
    brand: "Authorized",
    status: "Limited",
    stock: 3,
    distance: "1.4 km",
    address: "Calle de Velázquez, 12",
    rating: 4.7,
    coords: { x: 58, y: 52 },
    color: "bg-orange-500"
  },
  {
    id: 3,
    name: "Omni - El Corte Inglés",
    brand: "Premium",
    status: "Available",
    stock: 24,
    distance: "2.1 km",
    address: "Paseo de la Castellana, 79",
    rating: 4.8,
    coords: { x: 35, y: 65 },
    color: "bg-brand-accent"
  }
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
      
      {/* FULL SCREEN MAP CONTAINER */}
      <div className="absolute inset-0 z-0 bg-[#050505]">
        {/* Architectural Technical Map Background with Grid and Streets */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.15)" />
              </pattern>
              <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--brand-primary))" stopOpacity="0.1" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
            
            {/* Architectural Streets & Lines */}
            <g stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none">
              <path d="M-100,250 L1200,850" />
              <path d="M400,-100 L650,1200" />
              <path d="M0,450 L1200,450" />
              <path d="M650,0 L650,1200" />
              <path d="M100,100 Q400,300 700,100 T1100,100" stroke="hsl(var(--brand-accent))" strokeOpacity="0.1" />
              <circle cx="50%" cy="45%" r="180" strokeWidth="0.5" strokeDasharray="8,8" />
              <circle cx="50%" cy="45%" r="350" strokeWidth="0.5" strokeDasharray="12,12" />
            </g>
          </svg>
        </div>
        
        {/* Pulsing Scan Line Effect */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
          <div className="w-[150vw] h-[2px] bg-brand-accent animate-[spin_15s_linear_infinite]" />
        </div>

        {/* Dynamic Branded Markers */}
        <div className="absolute inset-0">
          {filteredLocations.map((f, i) => (
            <div 
              key={f.id}
              className={cn(
                "absolute transition-all duration-1000 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-20",
                isMounting ? "opacity-100 scale-100" : "opacity-0 scale-50"
              )}
              style={{ 
                left: `${f.coords.x}%`, 
                top: `${f.coords.y}%`,
                transitionDelay: `${i * 150}ms`
              }}
              onClick={() => {
                setSelectedLocation(f);
                setShowList(true);
              }}
            >
              <div className="relative group">
                {/* Visual Ping */}
                <div className={cn(
                  "absolute inset-[-12px] rounded-full animate-ping opacity-25 duration-[2000ms]",
                  selectedLocation?.id === f.id ? "bg-white" : "bg-brand-accent"
                )} />
                
                {/* Marker Design */}
                <div className={cn(
                  "relative h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] border",
                  selectedLocation?.id === f.id 
                    ? "bg-brand-accent text-black scale-125 border-white ring-4 ring-brand-accent/20" 
                    : "bg-card text-brand-accent border-white/10 hover:scale-110 hover:border-brand-accent/50"
                )}>
                  <MapPin className="w-6 h-6" />
                  
                  {/* Stock Tooltip Indicator */}
                  <div className="absolute -top-3 -right-3 bg-white text-black text-[8px] font-black px-1.5 py-0.5 rounded-full border border-black shadow-lg">
                    {f.stock}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP OVERLAYS: Search & Dynamic Status */}
      <div className="absolute top-12 left-6 right-6 z-40 space-y-4 max-w-md mx-auto">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <Search className="w-5 h-5 text-white/30 group-focus-within:text-brand-accent transition-colors" />
          </div>
          <Input 
            placeholder="Locate Omni Kinetic Station..." 
            className="pl-12 bg-black/60 backdrop-blur-3xl border-white/10 h-14 text-sm rounded-2xl focus:ring-1 focus:ring-brand-accent transition-all shadow-2xl placeholder:opacity-40"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
           <div className="bg-black/80 backdrop-blur-2xl border border-white/5 px-4 py-2 rounded-full flex items-center gap-3 shadow-xl">
             <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse shadow-[0_0_12px_hsl(var(--brand-accent))]" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
               {filteredLocations.length} ACTIVE HUBS DETECTED
             </span>
           </div>
           <Button size="icon" variant="ghost" className="bg-black/80 backdrop-blur-2xl border border-white/5 rounded-full h-11 w-11 text-white hover:text-brand-accent shadow-xl transition-all hover:scale-110 active:scale-95">
             <Locate className="w-5 h-5" />
           </Button>
        </div>
      </div>

      {/* BOTTOM DRAWER PANEL */}
      <div 
        className={cn(
          "absolute bottom-24 left-0 right-0 z-40 transition-all duration-700 ease-in-out max-w-md mx-auto px-4",
          selectedLocation || showList ? "h-[60vh]" : "h-20"
        )}
      >
        <div className="h-full bg-card/95 backdrop-blur-3xl rounded-t-[3rem] p-6 shadow-[0_-30px_60px_rgba(0,0,0,1)] border-t border-white/10 flex flex-col">
          {/* Handle for dragging feel */}
          <div 
            className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-6 cursor-pointer hover:bg-white/20 transition-colors shrink-0"
            onClick={() => {
              if (selectedLocation) setSelectedLocation(null);
              else setShowList(!showList);
            }}
          />
          
          <ScrollArea className="flex-1">
            {selectedLocation ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500 pb-10">
                <header className="flex flex-col gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedLocation(null)}
                    className="w-fit -ml-2 h-8 text-muted-foreground hover:text-white uppercase text-[10px] font-black tracking-widest"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> VIEW ALL HUBS
                  </Button>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight">{selectedLocation.name}</h2>
                        <Badge className="bg-brand-accent text-black border-none font-black text-[10px] h-6 px-3">
                          {selectedLocation.rating} <Star className="w-3 h-3 ml-1 fill-current" />
                        </Badge>
                     </div>
                     <p className="text-xs text-muted-foreground font-medium leading-relaxed">{selectedLocation.address}</p>
                  </div>
                </header>

                <div className="grid grid-cols-2 gap-4">
                   <Card className="p-5 bg-white/5 border-none rounded-3xl space-y-2 group hover:bg-white/10 transition-all">
                      <p className="text-[9px] uppercase font-black tracking-[0.2em] text-brand-accent opacity-60">LIVE STOCK</p>
                      <div className="flex items-center gap-3">
                         <Package className="w-5 h-5 text-white/40" />
                         <span className="font-black text-xl">{selectedLocation.stock} <span className="text-[10px] opacity-40">CARTRIDGES</span></span>
                      </div>
                   </Card>
                   <Card className="p-5 bg-white/5 border-none rounded-3xl space-y-2 group hover:bg-white/10 transition-all">
                      <p className="text-[9px] uppercase font-black tracking-[0.2em] text-brand-accent opacity-60">STATION TIER</p>
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5 text-emerald-500" />
                         <span className="font-black text-[11px] uppercase tracking-widest leading-none">VERIFIED<br/>PREMIUM</span>
                      </div>
                   </Card>
                </div>

                <div className="space-y-3 pt-2">
                   <Button className="w-full h-16 bg-brand-accent text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xs">
                     RESERVE REFILL
                   </Button>
                   <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest">
                        DIRECTIONS
                      </Button>
                      <Button variant="outline" className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest">
                        CALL HUB
                      </Button>
                   </div>
                </div>

                <div className="p-5 bg-white/5 rounded-3xl space-y-4 border border-white/5">
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 opacity-40" />
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black opacity-40 uppercase tracking-widest leading-none">HOURS</p>
                      <p className="text-[11px] font-bold">OPERATIONAL UNTIL 21:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 opacity-40" />
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black opacity-40 uppercase tracking-widest leading-none">TECHNICAL SUPPORT</p>
                      <p className="text-[11px] font-bold">+34 912 345 678</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-10">
                <div className="flex justify-between items-center">
                   <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-muted-foreground flex items-center gap-3">
                     <Layers className="w-4 h-4 text-brand-accent" /> NEARBY HUBS
                   </h2>
                </div>
                
                <div className="space-y-3">
                  {filteredLocations.length > 0 ? filteredLocations.map((f) => (
                    <Card 
                      key={f.id} 
                      className="p-5 bg-white/5 border-none flex items-center gap-5 cursor-pointer hover:bg-white/10 transition-all rounded-[1.8rem] group relative overflow-hidden"
                      onClick={() => setSelectedLocation(f)}
                    >
                      <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative overflow-hidden border border-white/5">
                        <div className={cn("absolute inset-0 opacity-10", f.color)} />
                        <MapPin className={cn("w-6 h-6", f.status === 'Available' ? 'text-brand-accent' : 'text-orange-500')} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                           <p className="text-[9px] font-black uppercase text-brand-accent tracking-[0.15em] opacity-80">{f.brand}</p>
                           {f.status === 'Limited' && <Badge className="h-3 px-1.5 bg-orange-500/20 text-orange-500 text-[8px] uppercase font-black border-none">LOW STOCK</Badge>}
                        </div>
                        <h3 className="font-bold text-base leading-tight truncate">{f.name}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-muted-foreground font-medium">{f.distance} AWAY</span>
                          <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                          <span className={cn("text-[11px] font-black", f.status === 'Available' ? 'text-emerald-500' : 'text-orange-500')}>
                            {f.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Card>
                  )) : (
                    <div className="py-20 text-center space-y-4 opacity-30">
                      <Search className="w-10 h-10 mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">NO HUBS FOUND IN RANGE</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* PERSISTENT NAVIGATION */}
      <Navigation />
    </main>
  );
}
