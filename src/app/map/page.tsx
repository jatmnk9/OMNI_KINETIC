
"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation as NavIcon, 
  Filter, 
  Info, 
  Phone, 
  Clock, 
  Star, 
  Package, 
  ShieldCheck, 
  ChevronRight,
  ArrowLeft
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

  const filteredFeatures = REFILL_LOCATIONS.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground overflow-hidden">
      <div className="max-w-lg mx-auto h-screen flex flex-col relative">
        
        {/* Interactive Radar Map Section */}
        <div className="relative h-[60%] w-full bg-black overflow-hidden border-b border-white/5">
          {/* Abstract Radar UI Background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              <defs>
                <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <circle cx="200" cy="200" r="180" stroke="rgba(255,255,255,0.05)" fill="none" strokeWidth="1" />
              <circle cx="200" cy="200" r="120" stroke="rgba(255,255,255,0.05)" fill="none" strokeWidth="1" />
              <circle cx="200" cy="200" r="60" stroke="rgba(255,255,255,0.05)" fill="none" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              
              {/* Pulsing Scan Line */}
              <g className="animate-[spin_8s_linear_infinite] origin-center">
                 <line x1="200" y1="200" x2="200" y2="20" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
                 <path d="M200,20 A180,180 0 0,1 380,200" stroke="url(#radarGradient)" fill="none" />
              </g>
            </svg>
          </div>
          
          {/* Markers */}
          <div className="absolute inset-0">
            {filteredFeatures.map((f, i) => (
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
                  {/* Pulse Effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-full animate-ping opacity-20",
                    f.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'
                  )} />
                  
                  {/* Marker Pin */}
                  <div className={cn(
                    "relative p-3 rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
                    selectedLocation?.id === f.id 
                      ? "bg-white text-black scale-125 ring-4 ring-white/20" 
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  )}>
                    <MapPin className="w-5 h-5" />
                  </div>

                  {/* Tooltip Label */}
                  {selectedLocation?.id === f.id && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 animate-in fade-in zoom-in slide-in-from-top-2 duration-300">
                      <div className="bg-white text-black px-3 py-1.5 rounded-xl whitespace-nowrap shadow-2xl flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest">{f.distance}</span>
                        <div className="w-2 h-2 bg-white rotate-45 -mt-1 absolute -top-1" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Search Bar Overlay */}
          <div className="absolute top-10 left-6 right-6 flex gap-3 z-30">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
              <Input 
                placeholder="Locate Boutique..." 
                className="pl-12 bg-black/60 backdrop-blur-3xl border-white/10 shadow-2xl h-14 text-sm rounded-[1.8rem] focus:ring-brand-accent transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button size="icon" variant="ghost" className="h-14 w-14 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[1.8rem] hover:bg-white/10">
              <Filter className="w-5 h-5" />
            </Button>
          </div>

          <div className="absolute bottom-16 left-6 right-6 flex items-center justify-between z-30">
             <Badge className="bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold tracking-[0.2em] uppercase text-[9px] px-5 py-2.5 rounded-full">
               {filteredFeatures.length} Live Points
             </Badge>
             <Button size="sm" className="bg-white text-black font-black uppercase tracking-widest text-[9px] px-5 h-10 rounded-full hover:bg-neutral-200 transition-colors">
               <NavIcon className="w-3 h-3 mr-2" /> Recenter
             </Button>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 bg-background rounded-t-[3rem] -mt-10 relative z-40 p-8 space-y-8 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] border-t border-white/5">
          <div className="w-12 h-1 bg-white/10 rounded-full mx-auto" />
          
          <ScrollArea className="h-full pr-2 no-scrollbar">
            {selectedLocation ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700 pb-16">
                <header className="flex flex-col gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedLocation(null)}
                    className="w-fit -ml-2 text-muted-foreground hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to list
                  </Button>
                  <div className="space-y-1">
                     <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-headline font-black tracking-tighter">{selectedLocation.name}</h2>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[10px]">4.9 <Star className="w-2.5 h-2.5 ml-1 fill-current" /></Badge>
                     </div>
                     <p className="text-sm text-muted-foreground font-medium">{selectedLocation.address}</p>
                  </div>
                </header>

                <div className="grid grid-cols-2 gap-4">
                   <Card className="p-6 bg-white/5 border-none rounded-[2rem] space-y-3 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40">Stock Level</p>
                      <div className="flex items-center gap-3">
                         <Package className="w-5 h-5 text-brand-accent" />
                         <span className="font-black text-xl tracking-tight">{selectedLocation.stock} <span className="text-xs opacity-40 font-bold">Units</span></span>
                      </div>
                   </Card>
                   <Card className="p-6 bg-white/5 border-none rounded-[2rem] space-y-3 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40">Verification</p>
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5 text-emerald-500" />
                         <span className="font-black text-xl tracking-tight uppercase text-[12px]">Luxe Store</span>
                      </div>
                   </Card>
                </div>

                <div className="space-y-4 pt-2">
                   <Button className="w-full h-20 bg-brand text-accent-foreground font-black uppercase tracking-[0.3em] rounded-[1.8rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 text-xs">
                     Reserve Instant Refill
                   </Button>
                   <div className="flex gap-4">
                      <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest">
                        Directions
                      </Button>
                      <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest">
                        Store Details
                      </Button>
                   </div>
                </div>

                <div className="p-6 bg-white/5 rounded-[2rem] space-y-4">
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Operating Hours</p>
                        <p className="text-sm font-medium">Open Now • Closes at 21:00</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-20" />
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Direct Contact</p>
                        <p className="text-sm font-medium">+34 912 345 678</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-20" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 pb-16">
                <div className="flex justify-between items-center">
                   <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-muted-foreground">Nearby Stations</h2>
                   <Badge variant="ghost" className="text-[9px] font-bold uppercase opacity-40">Live Syncing...</Badge>
                </div>
                
                <div className="space-y-4">
                  {filteredFeatures.length > 0 ? filteredFeatures.map((f) => (
                    <Card 
                      key={f.id} 
                      className="p-6 bg-white/5 border-none flex items-center gap-6 cursor-pointer hover:bg-white/10 transition-all rounded-[2.2rem] group"
                      onClick={() => setSelectedLocation(f)}
                    >
                      <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative overflow-hidden">
                        <div className={cn("absolute inset-0 opacity-10", f.color)} />
                        <MapPin className={cn("w-8 h-8", f.status === 'Available' ? 'text-emerald-500' : 'text-amber-500')} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[9px] font-black uppercase text-brand-accent tracking-[0.2em] mb-0.5">{f.brand}</p>
                            <h3 className="font-bold text-lg leading-tight truncate">{f.name}</h3>
                          </div>
                          <span className="text-[10px] font-black opacity-30 tracking-widest">{f.distance}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <p className="text-xs text-muted-foreground truncate font-medium">{f.address}</p>
                           <div className={cn("w-1.5 h-1.5 rounded-full", f.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500')} />
                        </div>
                      </div>
                    </Card>
                  )) : (
                    <div className="py-20 text-center space-y-4 opacity-40">
                      <Search className="w-12 h-12 mx-auto" />
                      <p className="text-xs font-bold uppercase tracking-widest">No stations found in this zone.</p>
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
