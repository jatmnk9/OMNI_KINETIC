
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
  Locate
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
    color: "bg-emerald-500"
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
    color: "bg-amber-500"
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
    <main className="h-screen w-full bg-black text-foreground overflow-hidden relative font-body">
      
      {/* FULL SCREEN MAP CONTAINER */}
      <div className="absolute inset-0 z-0 bg-[#050505]">
        {/* Architectural Technical Map Background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.1)" />
              </pattern>
              <mask id="fadeMask">
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="100%" stopColor="black" />
                </radialGradient>
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
            
            {/* Fake "Streets" / Technical Lines */}
            <g stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none">
              <path d="M-100,200 L1200,800 M400,-100 L600,1200 M0,400 L1200,400 M600,0 L600,1200" />
              <circle cx="50%" cy="45%" r="150" strokeWidth="0.5" strokeDasharray="5,5" />
              <circle cx="50%" cy="45%" r="300" strokeWidth="0.5" strokeDasharray="10,10" />
              <path d="M200,100 Q400,300 600,100 T1000,100" opacity="0.5" />
              <path d="M100,800 Q300,600 500,800 T900,800" opacity="0.5" />
            </g>
          </svg>
        </div>
        
        {/* Pulsing Scan Line */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
          <div className="w-[200vw] h-[1px] bg-brand-accent animate-[spin_12s_linear_infinite]" />
        </div>

        {/* Dynamic Markers */}
        <div className="absolute inset-0">
          {filteredLocations.map((f, i) => (
            <div 
              key={f.id}
              className={cn(
                "absolute transition-all duration-1000 cursor-pointer transform -translate-x-1/2 -translate-y-1/2",
                isMounting ? "opacity-100 scale-100" : "opacity-0 scale-50"
              )}
              style={{ 
                left: `${f.coords.x}%`, 
                top: `${f.coords.y}%`,
                transitionDelay: `${i * 100}ms`
              }}
              onClick={() => {
                setSelectedLocation(f);
                setShowList(true);
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Ping Effect */}
                <div className={cn(
                  "absolute inset-0 rounded-full animate-ping opacity-20 bg-brand-accent h-12 w-12 -ml-2 -mt-2"
                )} />
                
                {/* Marker Icon */}
                <div className={cn(
                  "relative p-3 rounded-full transition-all duration-500 shadow-2xl",
                  selectedLocation?.id === f.id 
                    ? "bg-white text-black scale-125 ring-4 ring-brand-accent/20" 
                    : "bg-card text-brand-accent hover:scale-110 border border-white/10"
                )}>
                  <MapPin className="w-5 h-5" />
                </div>

                {/* Mini Stock Badge */}
                <div className="absolute -top-1 -right-1 bg-brand text-[8px] font-black px-1 rounded flex items-center gap-0.5 border border-white/10">
                  {f.stock}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP OVERLAYS: Search & Header */}
      <div className="absolute top-10 left-4 right-4 z-30 space-y-3 max-w-md mx-auto">
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <Search className="w-4 h-4 text-white/40 group-focus-within:text-brand-accent transition-colors" />
          </div>
          <Input 
            placeholder="Locate Omni Kinetic Station..." 
            className="pl-12 bg-black/40 backdrop-blur-2xl border-white/10 h-14 text-xs rounded-2xl focus:ring-1 focus:ring-brand-accent transition-all shadow-2xl placeholder:opacity-40"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
           <div className="bg-black/60 backdrop-blur-xl border border-white/5 px-4 py-1.5 rounded-full flex items-center gap-2.5 shadow-lg">
             <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
             <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">{filteredLocations.length} STATIONS ACTIVE</span>
           </div>
           <Button size="icon" variant="ghost" className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-full h-10 w-10 text-white hover:text-brand-accent shadow-lg">
             <Locate className="w-4 h-4" />
           </Button>
        </div>
      </div>

      {/* BOTTOM SLIDE-UP PANEL (Better Scaling) */}
      <div 
        className={cn(
          "absolute bottom-20 left-0 right-0 z-40 transition-all duration-700 ease-in-out max-w-md mx-auto px-4",
          selectedLocation || showList ? "h-[65vh]" : "h-24"
        )}
      >
        <div className="h-full bg-card rounded-t-[2.5rem] p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t border-white/5 relative flex flex-col">
          {/* Handle */}
          <div 
            className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6 cursor-pointer hover:bg-white/20 transition-colors shrink-0"
            onClick={() => {
              if (selectedLocation) setSelectedLocation(null);
              else setShowList(!showList);
            }}
          />
          
          <ScrollArea className="flex-1 overflow-hidden">
            {selectedLocation ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500 pb-10">
                <header className="flex flex-col gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedLocation(null)}
                    className="w-fit -ml-2 h-7 text-muted-foreground hover:text-white uppercase text-[9px] font-black tracking-widest"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> ALL STATIONS
                  </Button>
                  <div className="space-y-1">
                     <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black tracking-tight">{selectedLocation.name}</h2>
                        <Badge className="bg-brand-accent text-black border-none font-bold text-[9px] h-5 px-2">
                          {selectedLocation.rating} <Star className="w-2.5 h-2.5 ml-0.5 fill-current" />
                        </Badge>
                     </div>
                     <p className="text-[11px] text-muted-foreground font-medium">{selectedLocation.address}</p>
                  </div>
                </header>

                <div className="grid grid-cols-2 gap-3">
                   <Card className="p-4 bg-white/5 border-none rounded-2xl space-y-1 group hover:bg-white/10 transition-colors">
                      <p className="text-[8px] uppercase font-bold tracking-[0.1em] opacity-40">STOCK</p>
                      <div className="flex items-center gap-2">
                         <Package className="w-4 h-4 text-brand-accent" />
                         <span className="font-black text-lg">{selectedLocation.stock} <span className="text-[8px] opacity-40">PCS</span></span>
                      </div>
                   </Card>
                   <Card className="p-4 bg-white/5 border-none rounded-2xl space-y-1 group hover:bg-white/10 transition-colors">
                      <p className="text-[8px] uppercase font-bold tracking-[0.1em] opacity-40">TIER</p>
                      <div className="flex items-center gap-2">
                         <ShieldCheck className="w-4 h-4 text-emerald-500" />
                         <span className="font-black text-[10px] uppercase tracking-widest">VERIFIED</span>
                      </div>
                   </Card>
                </div>

                <div className="space-y-3">
                   <Button className="w-full h-14 bg-brand text-accent-foreground font-black uppercase tracking-[0.2em] rounded-xl shadow-xl hover:scale-[1.01] transition-all text-[11px]">
                     RESERVE CARTRIDGE
                   </Button>
                   <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 h-11 rounded-xl border-white/10 hover:bg-white/5 text-[9px] font-bold uppercase tracking-widest">
                        DIRECTIONS
                      </Button>
                      <Button variant="outline" className="flex-1 h-11 rounded-xl border-white/10 hover:bg-white/5 text-[9px] font-bold uppercase tracking-widest">
                        CONTACT
                      </Button>
                   </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl space-y-3 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 opacity-40" />
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black opacity-40 uppercase tracking-widest leading-none">STATUS</p>
                      <p className="text-[10px] font-bold">OPEN UNTIL 21:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 opacity-40" />
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black opacity-40 uppercase tracking-widest leading-none">CONTACT</p>
                      <p className="text-[10px] font-bold">+34 912 345 678</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-10">
                <div className="flex justify-between items-center">
                   <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
                     <Layers className="w-3.5 h-3.5" /> NEARBY STATIONS
                   </h2>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowList(!showList)}
                    className="h-6 text-[8px] font-black uppercase tracking-widest opacity-40 hover:opacity-100"
                   >
                     {showList ? "MINIMIZE" : "EXPAND"}
                   </Button>
                </div>
                
                <div className="space-y-2.5">
                  {filteredLocations.length > 0 ? filteredLocations.map((f) => (
                    <Card 
                      key={f.id} 
                      className="p-4 bg-white/5 border-none flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-all rounded-2xl group relative overflow-hidden"
                      onClick={() => setSelectedLocation(f)}
                    >
                      <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative overflow-hidden">
                        <div className={cn("absolute inset-0 opacity-10", f.color)} />
                        <MapPin className={cn("w-5 h-5", f.status === 'Available' ? 'text-emerald-500' : 'text-amber-500')} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-[8px] font-black uppercase text-brand-accent tracking-[0.15em] opacity-60">{f.brand}</p>
                        <h3 className="font-bold text-sm leading-tight truncate">{f.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground font-medium">{f.distance}</span>
                          <span className="w-1 h-1 bg-white/10 rounded-full" />
                          <span className={cn("text-[10px] font-bold", f.status === 'Available' ? 'text-emerald-500' : 'text-amber-500')}>
                            {f.status}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Card>
                  )) : (
                    <div className="py-12 text-center space-y-3 opacity-30">
                      <Search className="w-8 h-8 mx-auto" />
                      <p className="text-[9px] font-black uppercase tracking-[0.3em]">NO STATIONS FOUND</p>
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
