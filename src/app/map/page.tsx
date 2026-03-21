
"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation as NavIcon, 
  Filter, 
  Package, 
  ShieldCheck, 
  ChevronRight,
  ArrowLeft,
  Star,
  Clock,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navigation } from '@/components/Navigation';
import { cn } from '@/lib/utils';

const REFILL_LOCATIONS = [
  {
    id: 1,
    name: "Omni Kinetic Luxe - Serrano",
    brand: "Flagship Boutique",
    status: "Available",
    stock: 12,
    distance: "0.8 km",
    address: "Calle de Serrano, 45, Madrid",
    rating: 4.9,
    coords: { x: 45, y: 35 },
    color: "bg-emerald-500"
  },
  {
    id: 2,
    name: "L'Oréal Luxe Wellness Point",
    brand: "Authorized Station",
    status: "Limited Stock",
    stock: 3,
    distance: "1.4 km",
    address: "Calle de Velázquez, 12, Madrid",
    rating: 4.7,
    coords: { x: 65, y: 55 },
    color: "bg-amber-500"
  },
  {
    id: 3,
    name: "Omni Kinetic - El Corte Inglés",
    brand: "Premium Corner",
    status: "Available",
    stock: 24,
    distance: "2.1 km",
    address: "Paseo de la Castellana, 79, Madrid",
    rating: 4.8,
    coords: { x: 30, y: 70 },
    color: "bg-emerald-500"
  }
];

export default function RefillLocatorPage() {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isMounting, setIsMounting] = useState(false);

  useEffect(() => {
    setIsMounting(true);
  }, []);

  const filteredLocations = REFILL_LOCATIONS.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground overflow-hidden">
      <div className="max-w-lg mx-auto h-screen flex flex-col relative">
        
        {/* Interactive Radar Map Section */}
        <div className="relative h-[55%] w-full bg-black overflow-hidden border-b border-white/5">
          {/* Abstract Grid Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
                <radialGradient id="radarFade" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="50%" cy="50%" r="40%" fill="url(#radarFade)" />
            </svg>
          </div>
          
          {/* Pulsing Scan Line */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-[200%] h-[2px] bg-white/5 -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite]" />
          </div>

          {/* Markers */}
          <div className="absolute inset-0">
            {filteredLocations.map((f, i) => (
              <div 
                key={f.id}
                className={cn(
                  "absolute transition-all duration-700 cursor-pointer transform -translate-x-1/2 -translate-y-1/2",
                  isMounting ? "opacity-100 scale-100" : "opacity-0 scale-50"
                )}
                style={{ 
                  left: `${f.coords.x}%`, 
                  top: `${f.coords.y}%`,
                  transitionDelay: `${i * 150}ms`
                }}
                onClick={() => setSelectedLocation(f)}
              >
                <div className="relative">
                  {/* Pulse Effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-full animate-ping opacity-20",
                    f.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'
                  )} />
                  
                  {/* Marker Pin */}
                  <div className={cn(
                    "relative p-3 rounded-full transition-all duration-300 shadow-2xl",
                    selectedLocation?.id === f.id 
                      ? "bg-white text-black scale-125 ring-4 ring-white/10" 
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  )}>
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Overlays: Search Bar */}
          <div className="absolute top-8 left-6 right-6 z-30">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
              <Input 
                placeholder="Locate Boutique..." 
                className="pl-12 bg-black/40 backdrop-blur-xl border-white/10 h-12 text-sm rounded-full focus:ring-accent transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Map Controls: Floating Action Bar */}
          <div className="absolute bottom-16 left-6 right-6 flex items-center justify-between z-30">
             <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-widest">{filteredLocations.length} ACTIVE POINTS</span>
             </div>
             <Button size="sm" className="bg-white text-black font-black uppercase tracking-widest text-[9px] px-6 h-10 rounded-full hover:bg-neutral-200 shadow-2xl">
               <NavIcon className="w-3 h-3 mr-2" /> RECENTER
             </Button>
          </div>
        </div>

        {/* Dynamic Content Area: Slide-up Panel */}
        <div className="flex-1 bg-background rounded-t-[3rem] -mt-10 relative z-40 p-8 space-y-6 shadow-[0_-20px_50px_rgba(0,0,0,0.7)] border-t border-white/5">
          <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-2" />
          
          <ScrollArea className="h-full pr-2 no-scrollbar">
            {selectedLocation ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500 pb-16">
                <header className="flex flex-col gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedLocation(null)}
                    className="w-fit -ml-2 text-muted-foreground hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO STATIONS
                  </Button>
                  <div className="space-y-1">
                     <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black tracking-tighter">{selectedLocation.name}</h2>
                        <Badge className="bg-white/10 text-white border-none font-bold text-[10px]">4.9 <Star className="w-2.5 h-2.5 ml-1 fill-current text-brand-accent" /></Badge>
                     </div>
                     <p className="text-sm text-muted-foreground font-medium">{selectedLocation.address}</p>
                  </div>
                </header>

                <div className="grid grid-cols-2 gap-4">
                   <Card className="p-6 bg-white/5 border-none rounded-[2rem] space-y-2 group">
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">AVAILABILITY</p>
                      <div className="flex items-center gap-3">
                         <Package className="w-5 h-5 text-brand-accent" />
                         <span className="font-black text-xl">{selectedLocation.stock} <span className="text-[10px] opacity-40">UNITS</span></span>
                      </div>
                   </Card>
                   <Card className="p-6 bg-white/5 border-none rounded-[2rem] space-y-2 group">
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">TIER</p>
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5 text-emerald-500" />
                         <span className="font-black text-[12px] uppercase">VERIFIED</span>
                      </div>
                   </Card>
                </div>

                <div className="space-y-3">
                   <Button className="w-full h-16 bg-brand text-accent-foreground font-black uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl hover:scale-[1.02] transition-all text-xs">
                     RESERVE INSTANT REFILL
                   </Button>
                   <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 text-[9px] font-bold uppercase tracking-widest">
                        DIRECTIONS
                      </Button>
                      <Button variant="outline" className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 text-[9px] font-bold uppercase tracking-widest">
                        STORE INFO
                      </Button>
                   </div>
                </div>

                <div className="p-6 bg-white/5 rounded-[2rem] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">STATUS</p>
                        <p className="text-sm font-medium">OPEN UNTIL 21:00</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">CONTACT</p>
                        <p className="text-sm font-medium">+34 912 345 678</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 pb-16">
                <div className="flex justify-between items-center">
                   <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-muted-foreground">NEARBY STATIONS</h2>
                   <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse" />
                     <span className="text-[9px] font-bold uppercase opacity-40">LIVE SYNC</span>
                   </div>
                </div>
                
                <div className="space-y-4">
                  {filteredLocations.length > 0 ? filteredLocations.map((f) => (
                    <Card 
                      key={f.id} 
                      className="p-5 bg-white/5 border-none flex items-center gap-5 cursor-pointer hover:bg-white/10 transition-all rounded-[2rem] group"
                      onClick={() => setSelectedLocation(f)}
                    >
                      <div className="w-16 h-16 bg-neutral-900 rounded-[1.2rem] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative overflow-hidden">
                        <div className={cn("absolute inset-0 opacity-10", f.color)} />
                        <MapPin className={cn("w-6 h-6", f.status === 'Available' ? 'text-emerald-500' : 'text-amber-500')} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[8px] font-black uppercase text-brand-accent tracking-widest mb-0.5">{f.brand}</p>
                            <h3 className="font-bold text-base leading-tight truncate">{f.name}</h3>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                           <p className="text-[11px] text-muted-foreground truncate font-medium">{f.distance} • {f.status}</p>
                           <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Card>
                  )) : (
                    <div className="py-20 text-center space-y-4 opacity-40">
                      <Search className="w-12 h-12 mx-auto" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em]">NO STATIONS IN THIS AREA</p>
                    </div>
                  )}
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
