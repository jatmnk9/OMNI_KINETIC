
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
  Layers
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
    <main className="h-screen w-full bg-black text-foreground overflow-hidden relative">
      
      {/* FULL SCREEN MAP CONTAINER */}
      <div className="absolute inset-0 z-0">
        {/* Abstract Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
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
        
        {/* Pulsing Radar Line */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[150%] h-[1px] bg-brand-accent/20 animate-[spin_8s_linear_infinite]" />
          <div className="absolute w-[400px] h-[400px] border border-white/5 rounded-full" />
          <div className="absolute w-[800px] h-[800px] border border-white/5 rounded-full" />
        </div>

        {/* Markers Area */}
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
              <div className="relative group">
                {/* Pulse Effect tied to brand colors */}
                <div className={cn(
                  "absolute inset-0 rounded-full animate-ping opacity-30",
                  "bg-brand-accent"
                )} />
                
                {/* Marker Pin */}
                <div className={cn(
                  "relative p-4 rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]",
                  selectedLocation?.id === f.id 
                    ? "bg-white text-black scale-125 ring-8 ring-white/10" 
                    : "bg-card text-white hover:scale-110 hover:bg-neutral-800"
                )}>
                  <MapPin className={cn("w-6 h-6", selectedLocation?.id === f.id ? "text-black" : "text-brand-accent")} />
                </div>

                {/* Mini Label */}
                {selectedLocation?.id !== f.id && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">{f.name}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP OVERLAYS: Search & Controls */}
      <div className="absolute top-12 left-6 right-6 z-30 space-y-4 max-w-lg mx-auto">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
          <Input 
            placeholder="Locate Boutique..." 
            className="pl-14 bg-black/60 backdrop-blur-2xl border-white/10 h-16 text-sm rounded-full focus:ring-brand-accent transition-all shadow-2xl"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
           <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-3 shadow-xl">
             <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">{filteredLocations.length} ACTIVE STATIONS</span>
           </div>
           <Button size="icon" className="bg-white text-black rounded-full h-12 w-12 shadow-2xl hover:bg-neutral-200">
             <NavIcon className="w-5 h-5" />
           </Button>
        </div>
      </div>

      {/* BOTTOM SLIDE-UP PANEL */}
      <div 
        className={cn(
          "absolute bottom-20 left-0 right-0 z-40 transition-all duration-700 ease-in-out max-w-lg mx-auto",
          selectedLocation || showList ? "h-[70vh]" : "h-32"
        )}
      >
        <div className="h-full bg-background rounded-t-[3.5rem] p-8 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] border-t border-white/5 relative overflow-hidden">
          <div 
            className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-8 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => {
              if (selectedLocation) setSelectedLocation(null);
              else setShowList(!showList);
            }}
          />
          
          <ScrollArea className="h-full pr-2 no-scrollbar">
            {selectedLocation ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500 pb-24">
                <header className="flex flex-col gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedLocation(null)}
                    className="w-fit -ml-2 text-muted-foreground hover:text-white uppercase text-[10px] font-black tracking-widest"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> STATIONS LIST
                  </Button>
                  <div className="space-y-1">
                     <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black tracking-tighter">{selectedLocation.name}</h2>
                        <Badge className="bg-brand-accent text-black border-none font-bold text-[10px] px-3">
                          {selectedLocation.rating} <Star className="w-2.5 h-2.5 ml-1 fill-current" />
                        </Badge>
                     </div>
                     <p className="text-sm text-muted-foreground font-medium">{selectedLocation.address}</p>
                  </div>
                </header>

                <div className="grid grid-cols-2 gap-4">
                   <Card className="p-6 bg-white/5 border-none rounded-[2.5rem] space-y-2 group hover:bg-white/10 transition-colors">
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">CARTRIDGE STOCK</p>
                      <div className="flex items-center gap-3">
                         <Package className="w-5 h-5 text-brand-accent" />
                         <span className="font-black text-2xl">{selectedLocation.stock} <span className="text-[10px] opacity-40 uppercase">UNITS</span></span>
                      </div>
                   </Card>
                   <Card className="p-6 bg-white/5 border-none rounded-[2.5rem] space-y-2 group hover:bg-white/10 transition-colors">
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">TIER STATUS</p>
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5 text-emerald-500" />
                         <span className="font-black text-[12px] uppercase tracking-widest">VERIFIED</span>
                      </div>
                   </Card>
                </div>

                <div className="space-y-4">
                   <Button className="w-full h-20 bg-brand text-accent-foreground font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl hover:scale-[1.02] transition-all text-sm">
                     RESERVE INSTANT REFILL
                   </Button>
                   <div className="flex gap-4">
                      <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest">
                        DIRECTIONS
                      </Button>
                      <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest">
                        CONTACT
                      </Button>
                   </div>
                </div>

                <div className="p-6 bg-white/5 rounded-[2.5rem] space-y-5 border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <Clock className="w-5 h-5 opacity-40" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">HOURS</p>
                      <p className="text-sm font-bold">OPEN UNTIL 21:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <Phone className="w-5 h-5 opacity-40" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">PHONE</p>
                      <p className="text-sm font-bold">+34 912 345 678</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 pb-24">
                <div className="flex justify-between items-center">
                   <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-muted-foreground flex items-center gap-2">
                     <Layers className="w-4 h-4" /> NEARBY STATIONS
                   </h2>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowList(!showList)}
                    className="text-[9px] font-black uppercase tracking-widest opacity-40"
                   >
                     {showList ? "MINIMIZE" : "EXPAND"}
                   </Button>
                </div>
                
                <div className="space-y-4">
                  {filteredLocations.length > 0 ? filteredLocations.map((f) => (
                    <Card 
                      key={f.id} 
                      className="p-6 bg-white/5 border-none flex items-center gap-6 cursor-pointer hover:bg-white/10 transition-all rounded-[2.5rem] group relative overflow-hidden"
                      onClick={() => setSelectedLocation(f)}
                    >
                      <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform relative overflow-hidden">
                        <div className={cn("absolute inset-0 opacity-10", f.color)} />
                        <MapPin className={cn("w-7 h-7", f.status === 'Available' ? 'text-emerald-500' : 'text-amber-500')} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-[9px] font-black uppercase text-brand-accent tracking-[0.2em] mb-1">{f.brand}</p>
                        <h3 className="font-bold text-lg leading-tight truncate">{f.name}</h3>
                        <p className="text-[11px] text-muted-foreground truncate font-medium flex items-center gap-2">
                          {f.distance} • <span className={f.status === 'Available' ? 'text-emerald-500' : 'text-amber-500'}>{f.status}</span>
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                    </Card>
                  )) : (
                    <div className="py-20 text-center space-y-4 opacity-40">
                      <Search className="w-12 h-12 mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">NO STATIONS FOUND</p>
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
