
"use client";

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  Search, 
  ChevronRight,
  ArrowLeft,
  Star,
  Layers,
  Locate,
  Navigation2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { cn } from '@/lib/utils';

// Dynamic import — Leaflet requires `window`
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

// === MOCK DATA: Paris refill stations ===
interface RefillLocation {
  id: number;
  name: string;
  brand: string;
  status: string;
  stock: number;
  distance: string;
  address: string;
  rating: number;
  lat: number;
  lng: number;
  color: string;
}

const REFILL_LOCATIONS: RefillLocation[] = [
  {
    id: 1,
    name: "Omni Luxe — Champs-Élysées",
    brand: "Flagship",
    status: "Available",
    stock: 18,
    distance: "0.6 km",
    address: "101 Avenue des Champs-Élysées, 75008",
    rating: 4.9,
    lat: 48.8698,
    lng: 2.3076,
    color: "bg-brand-accent",
  },
  {
    id: 2,
    name: "Luxe Wellness — Le Marais",
    brand: "Authorized",
    status: "Limited",
    stock: 4,
    distance: "1.2 km",
    address: "27 Rue des Francs-Bourgeois, 75004",
    rating: 4.7,
    lat: 48.8572,
    lng: 2.3618,
    color: "bg-orange-500",
  },
  {
    id: 3,
    name: "Omni — Galeries Lafayette",
    brand: "Premium",
    status: "Available",
    stock: 32,
    distance: "0.9 km",
    address: "40 Boulevard Haussmann, 75009",
    rating: 4.8,
    lat: 48.8737,
    lng: 2.3320,
    color: "bg-brand-accent",
  },
  {
    id: 4,
    name: "Omni Kinetic — Saint-Germain",
    brand: "Experience Center",
    status: "Available",
    stock: 45,
    distance: "1.8 km",
    address: "170 Boulevard Saint-Germain, 75006",
    rating: 5.0,
    lat: 48.8530,
    lng: 2.3327,
    color: "bg-brand-accent",
  },
  {
    id: 5,
    name: "Omni Atelier — Opéra",
    brand: "Flagship",
    status: "Available",
    stock: 22,
    distance: "0.4 km",
    address: "2 Place de l'Opéra, 75009",
    rating: 4.9,
    lat: 48.8712,
    lng: 2.3316,
    color: "bg-brand-accent",
  },
];

export default function RefillLocatorPage() {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<RefillLocation | null>(null);
  const [showList, setShowList] = useState(false);

  const filteredLocations: RefillLocation[] = REFILL_LOCATIONS.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleMarkerClick = useCallback((id: number) => {
    const loc = REFILL_LOCATIONS.find(l => l.id === id) || null;
    setSelectedLocation(loc);
    setShowList(true);
  }, []);

  const mapMarkers = filteredLocations.map(f => ({
    id: f.id,
    lat: f.lat,
    lng: f.lng,
    name: f.name,
    status: f.status,
    color: f.color,
  }));

  return (
    <main className="h-screen w-full bg-background text-foreground overflow-hidden relative font-body">
      
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-[100] bg-background/50 backdrop-blur-md">
        <Header />
      </div>

      {/* === FULL SCREEN LEAFLET MAP === */}
      <LeafletMap 
        markers={mapMarkers}
        selectedId={selectedLocation?.id ?? null}
        onMarkerClick={handleMarkerClick}
        center={[48.8566, 2.3522]}
        zoom={13}
      />

      {/* === SEARCH & STATUS OVERLAY === */}
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
           <div className="flex gap-2">
             <Button 
               size="icon" 
               variant="ghost" 
               className="bg-black/80 backdrop-blur-2xl border border-white/5 rounded-full h-11 w-11 text-white hover:text-brand-accent shadow-xl"
               onClick={() => setShowList(!showList)}
             >
               <Layers className="w-5 h-5" />
             </Button>
             <Button 
               size="icon" 
               variant="ghost" 
               className="bg-black/80 backdrop-blur-2xl border border-white/5 rounded-full h-11 w-11 text-white hover:text-brand-accent shadow-xl"
             >
               <Locate className="w-5 h-5" />
             </Button>
           </div>
        </div>
      </div>

      {/* === BOTTOM SHEET (NEARBY HUBS / DETAIL) === */}
      <div className={cn(
        "absolute bottom-24 left-0 right-0 z-40 transition-all duration-700 ease-in-out max-w-md mx-auto px-4",
        selectedLocation || showList ? "h-[50vh]" : "h-20"
      )}>
        <div className="h-full bg-card/95 backdrop-blur-3xl rounded-t-[3rem] p-6 shadow-2xl border-t border-white/10 flex flex-col">
          <div 
            className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-6 cursor-pointer hover:bg-white/20 transition-colors" 
            onClick={() => selectedLocation ? setSelectedLocation(null) : setShowList(!showList)} 
          />
          <ScrollArea className="flex-1">
            {selectedLocation ? (
              /* === DETAIL VIEW === */
              <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500 pb-10">
                <Button 
                  variant="ghost" size="sm" 
                  onClick={() => setSelectedLocation(null)} 
                  className="w-fit -ml-2 h-8 text-muted-foreground uppercase text-[10px] font-black"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> ALL HUBS
                </Button>
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black tracking-tight">{selectedLocation.name}</h2>
                      <Badge className="bg-brand-accent text-background font-black text-[10px] h-6 px-3">
                        {selectedLocation.rating} <Star className="w-3 h-3 ml-1 fill-current" />
                      </Badge>
                   </div>
                   <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                     <Navigation2 className="w-3 h-3" />
                     {selectedLocation.address}
                   </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                   <Card className="p-4 bg-white/5 border-none rounded-2xl space-y-1 text-center">
                     <p className="text-[8px] uppercase font-black text-brand-accent tracking-widest">Stock</p>
                     <span className="font-black text-xl tabular-nums">{selectedLocation.stock}</span>
                   </Card>
                   <Card className="p-4 bg-white/5 border-none rounded-2xl space-y-1 text-center">
                     <p className="text-[8px] uppercase font-black text-brand-accent tracking-widest">Distance</p>
                     <span className="font-black text-sm">{selectedLocation.distance}</span>
                   </Card>
                   <Card className="p-4 bg-white/5 border-none rounded-2xl space-y-1 text-center">
                     <p className="text-[8px] uppercase font-black text-brand-accent tracking-widest">Tier</p>
                     <span className="font-black text-[10px] uppercase">{selectedLocation.brand}</span>
                   </Card>
                </div>
                <Button className="w-full h-16 bg-brand-accent text-background font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:opacity-90 active:scale-[0.98] transition-all">
                  RESERVE REFILL
                </Button>
              </div>
            ) : (
              /* === LIST VIEW === */
              <div className="space-y-6 pb-10">
                <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-muted-foreground flex items-center gap-3">
                  <Layers className="w-4 h-4 text-brand-accent" /> NEARBY HUBS
                </h2>
                <div className="space-y-3">
                  {filteredLocations.map((f: RefillLocation) => (
                    <Card 
                      key={f.id} 
                      className={cn(
                        "p-5 border-none flex items-center gap-5 cursor-pointer hover:bg-white/10 transition-all rounded-[1.8rem] group relative",
                        (selectedLocation as any)?.id === f.id ? "bg-white/10" : "bg-white/5"
                      )} 
                      onClick={() => { setSelectedLocation(f); }}
                    >
                      <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 relative overflow-hidden">
                        <div className={cn("absolute inset-0 opacity-10", f.color)} />
                        <MapPin className="w-6 h-6 text-brand-accent" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-[9px] font-black uppercase text-brand-accent tracking-[0.15em]">{f.brand}</p>
                        <h3 className="font-bold text-base leading-tight truncate">{f.name}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-muted-foreground font-medium">{f.distance}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[8px] uppercase tracking-wider px-2 py-0 h-4 border-white/10",
                              f.status === 'Limited' ? "text-orange-400" : "text-green-400"
                            )}
                          >
                            {f.status}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity shrink-0" />
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
