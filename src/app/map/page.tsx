"use client";

import React, { useState } from 'react';
import { MapPin, Search, Navigation as NavIcon, Filter, Info, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navigation } from '@/components/Navigation';

const REFILL_LOCATIONS = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-3.70379, 40.416775] },
      "properties": {
        "name": "Omni Kinetic Luxe - Serrano",
        "brand": "Apex & Synapse",
        "status": "Available",
        "stock": 12,
        "distance": "0.8 km",
        "address": "Calle de Serrano, 45, Madrid"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-3.688, 40.423] },
      "properties": {
        "name": "Kinetic Wellness Point",
        "brand": "Kinetic Wellness",
        "status": "Limited Stock",
        "stock": 3,
        "distance": "1.4 km",
        "address": "Calle de Velázquez, 12, Madrid"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-3.695, 40.410] },
      "properties": {
        "name": "Omni Kinetic Flagship",
        "brand": "Full Architecture",
        "status": "Available",
        "stock": 45,
        "distance": "2.1 km",
        "address": "Paseo del Prado, 28, Madrid"
      }
    }
  ]
};

export default function RefillLocatorPage() {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const filteredFeatures = REFILL_LOCATIONS.features.filter(f => 
    f.properties.name.toLowerCase().includes(search.toLowerCase()) ||
    f.properties.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen pb-24 bg-background">
      <div className="max-w-lg mx-auto h-screen flex flex-col">
        
        <div className="relative h-[45%] w-full bg-neutral-900 overflow-hidden border-b border-white/5">
          {/* Enhanced Map Visuals */}
          <div className="absolute inset-0 opacity-40">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M0,50 Q100,20 200,80 T400,30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <path d="M50,0 Q120,150 80,300 T300,400" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </svg>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            {filteredFeatures.map((f, i) => (
              <div 
                key={i}
                className={`absolute transition-all cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
                style={{ 
                  left: `${40 + (i * 20)}%`, 
                  top: `${35 + (i * 15)}%` 
                }}
                onClick={() => setSelectedLocation(f)}
              >
                <div className={`relative group flex flex-col items-center`}>
                  <div className={`p-2 rounded-full transition-all duration-500 ${selectedLocation?.properties.name === f.properties.name ? 'bg-accent scale-125' : 'bg-white/10'}`}>
                    <MapPin className={`w-6 h-6 ${selectedLocation?.properties.name === f.properties.name ? 'text-accent-foreground' : 'text-white opacity-60'}`} />
                  </div>
                  <div className="absolute top-full mt-2 bg-black/80 backdrop-blur-md text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-full border border-white/10 whitespace-nowrap">
                    {f.properties.distance}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute top-12 left-6 right-6 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 opacity-40" />
              <Input 
                placeholder="Find station..." 
                className="pl-12 bg-card/90 backdrop-blur-xl border-none shadow-2xl h-12 text-sm rounded-xl"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button size="icon" variant="secondary" className="h-12 w-12 bg-card/90 backdrop-blur-xl border-none rounded-xl">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute bottom-10 left-6 right-6 flex items-center justify-between">
            <Badge className="bg-white text-black font-bold tracking-[0.2em] uppercase text-[9px] px-3 py-1.5 rounded-full border-none">
              3 Points Nearby
            </Badge>
            <Button size="sm" variant="secondary" className="text-[9px] uppercase tracking-widest font-bold bg-white/10 backdrop-blur-xl rounded-full px-4 h-8 text-white hover:bg-white hover:text-black">
              <NavIcon className="w-3 h-3 mr-2" /> Recenter
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-background rounded-t-[2.5rem] -mt-8 relative z-10 p-8 space-y-8 overflow-hidden">
          <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-2" />
          
          <ScrollArea className="h-full pr-4 no-scrollbar">
            {selectedLocation ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-12">
                <header className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">{selectedLocation.properties.name}</h2>
                    <p className="text-xs text-muted-foreground font-medium tracking-wide">{selectedLocation.properties.address}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setSelectedLocation(null)}>
                    <Info className="w-6 h-6 opacity-40" />
                  </Button>
                </header>

                <div className="grid grid-cols-2 gap-4">
                   <Card className="p-5 bg-card border-none space-y-2 rounded-2xl">
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Status</p>
                      <div className="flex items-center gap-2.5">
                         <div className={`w-2.5 h-2.5 rounded-full ${selectedLocation.properties.status === 'Available' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]'}`} />
                         <span className="font-bold text-sm tracking-tight">{selectedLocation.properties.status}</span>
                      </div>
                   </Card>
                   <Card className="p-5 bg-card border-none space-y-2 rounded-2xl">
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Live Stock</p>
                      <p className="font-bold text-sm text-accent tracking-tight">{selectedLocation.properties.stock} Units</p>
                   </Card>
                </div>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Contact & Hours</h3>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4 text-sm font-medium">
                        <Phone className="w-5 h-5 opacity-40" />
                        <span>+34 912 345 678</span>
                     </div>
                     <div className="flex items-center gap-4 text-sm font-medium">
                        <Clock className="w-5 h-5 opacity-40" />
                        <span>Open until 21:00</span>
                     </div>
                  </div>
                </section>

                <div className="flex gap-4 pt-6">
                  <Button className="flex-1 h-16 bg-accent text-accent-foreground font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl">
                    Reserve Refill
                  </Button>
                  <Button variant="outline" className="flex-1 h-16 font-bold uppercase tracking-[0.2em] rounded-2xl border-white/10 hover:bg-white/5 transition-colors">
                    Directions
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 pb-12">
                <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">Nearby Stations</h2>
                <div className="space-y-4">
                  {filteredFeatures.map((f, i) => (
                    <Card 
                      key={i} 
                      className="p-5 bg-card border-none flex items-center gap-5 cursor-pointer hover:bg-white/5 transition-all rounded-2xl group"
                      onClick={() => setSelectedLocation(f)}
                    >
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <MapPin className="w-7 h-7 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm truncate tracking-tight">{f.properties.name}</h3>
                          <span className="text-[10px] font-bold opacity-30 tracking-widest">{f.properties.distance}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate font-medium">{f.properties.address}</p>
                      </div>
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
