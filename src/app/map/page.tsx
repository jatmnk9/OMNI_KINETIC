
"use client";

import React, { useState } from 'react';
import { MapPin, Search, Navigation as NavIcon, Filter, Info, Phone, Clock, Star } from 'lucide-react';
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
        "address": "Calle de Serrano, 45, Madrid",
        "rating": 4.9
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
        "address": "Calle de Velázquez, 12, Madrid",
        "rating": 4.7
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
        "address": "Paseo del Prado, 28, Madrid",
        "rating": 5.0
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
        
        <div className="relative h-[55%] w-full bg-[#111] overflow-hidden">
          {/* Enhanced "Google Maps Dark" Visuals */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
                </pattern>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Abstract Roads */}
              <path d="M0,100 H400 M0,200 H400 M0,300 H400 M100,0 V400 M200,0 V400 M300,0 V400" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M50,0 L350,400 M0,50 L400,350" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            </svg>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            {filteredFeatures.map((f, i) => (
              <div 
                key={i}
                className={`absolute transition-all cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
                style={{ 
                  left: `${35 + (i * 25)}%`, 
                  top: `${30 + (i * 20)}%` 
                }}
                onClick={() => setSelectedLocation(f)}
              >
                <div className={`relative group flex flex-col items-center`}>
                  <div className={`p-3 rounded-full transition-all duration-500 shadow-2xl ${selectedLocation?.properties.name === f.properties.name ? 'bg-brand scale-125' : 'bg-neutral-800'}`}>
                    <MapPin className={`w-6 h-6 ${selectedLocation?.properties.name === f.properties.name ? 'text-accent-foreground' : 'text-white'}`} />
                  </div>
                  {selectedLocation?.properties.name === f.properties.name && (
                     <div className="absolute -top-12 bg-brand px-3 py-1.5 rounded-xl border-none shadow-xl animate-in zoom-in-50">
                        <span className="text-[10px] font-bold text-accent-foreground uppercase whitespace-nowrap">Selected</span>
                     </div>
                  )}
                  <div className="absolute top-full mt-2 bg-black/90 backdrop-blur-md text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/10 whitespace-nowrap text-white">
                    {f.properties.distance}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute top-12 left-6 right-6 flex gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-3.5 w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
              <Input 
                placeholder="Find station..." 
                className="pl-12 bg-neutral-900/90 backdrop-blur-xl border-white/10 shadow-2xl h-14 text-sm rounded-[1.5rem]"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button size="icon" variant="secondary" className="h-14 w-14 bg-neutral-900/90 backdrop-blur-xl border-white/10 rounded-[1.5rem]">
              <Filter className="w-5 h-5" />
            </Button>
          </div>

          <div className="absolute bottom-12 left-6 right-6 flex items-center justify-between">
            <Badge className="bg-brand text-accent-foreground font-black tracking-[0.2em] uppercase text-[10px] px-4 py-2 rounded-full border-none shadow-xl">
              {filteredFeatures.length} Points Nearby
            </Badge>
            <Button size="sm" variant="secondary" className="text-[9px] uppercase tracking-widest font-black bg-white/10 backdrop-blur-xl rounded-full px-5 h-10 text-white hover:bg-white hover:text-black border-none">
              <NavIcon className="w-3 h-3 mr-2" /> Recenter
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-background rounded-t-[3rem] -mt-10 relative z-20 p-8 space-y-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="w-16 h-1.5 bg-white/5 rounded-full mx-auto" />
          
          <ScrollArea className="h-full pr-4 no-scrollbar">
            {selectedLocation ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-12">
                <header className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                       <h2 className="text-3xl font-headline font-bold tracking-tight">{selectedLocation.properties.name}</h2>
                       <Badge variant="outline" className="border-brand/40 text-brand text-[8px] px-1.5">{selectedLocation.properties.rating} <Star className="w-2 h-2 ml-1 fill-current" /></Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium tracking-wide">{selectedLocation.properties.address}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setSelectedLocation(null)} className="rounded-full h-12 w-12 hover:bg-white/5">
                    <Info className="w-6 h-6 opacity-40" />
                  </Button>
                </header>

                <div className="grid grid-cols-2 gap-4">
                   <Card className="p-5 bg-white/5 border-none space-y-2 rounded-[1.5rem]">
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Status</p>
                      <div className="flex items-center gap-2.5">
                         <div className={`w-2.5 h-2.5 rounded-full ${selectedLocation.properties.status === 'Available' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]'}`} />
                         <span className="font-bold text-sm tracking-tight">{selectedLocation.properties.status}</span>
                      </div>
                   </Card>
                   <Card className="p-5 bg-white/5 border-none space-y-2 rounded-[1.5rem]">
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Live Stock</p>
                      <p className="font-black text-sm text-brand-accent tracking-tight">{selectedLocation.properties.stock} Units</p>
                   </Card>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="flex-1 h-16 bg-brand text-accent-foreground font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl">
                    Reserve Refill
                  </Button>
                  <Button variant="outline" className="flex-1 h-16 font-black uppercase tracking-[0.2em] rounded-2xl border-white/10 hover:bg-white/5 transition-colors">
                    Directions
                  </Button>
                </div>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Contact & Hours</h3>
                  <div className="space-y-5 bg-white/5 p-6 rounded-[2rem]">
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
              </div>
            ) : (
              <div className="space-y-8 pb-12">
                <div className="flex justify-between items-center">
                   <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">Nearby Stations</h2>
                   <span className="text-[10px] font-medium opacity-40">Verified Stores</span>
                </div>
                <div className="space-y-4">
                  {filteredFeatures.map((f, i) => (
                    <Card 
                      key={i} 
                      className="p-5 bg-white/5 border-none flex items-center gap-5 cursor-pointer hover:bg-white/10 transition-all rounded-[1.8rem] group"
                      onClick={() => setSelectedLocation(f)}
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-lg">
                        <MapPin className="w-7 h-7 text-brand-accent" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-base truncate tracking-tight">{f.properties.name}</h3>
                          <span className="text-[10px] font-black opacity-30 tracking-widest">{f.properties.distance}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <p className="text-[11px] text-muted-foreground truncate font-medium">{f.properties.address}</p>
                           <Badge variant="outline" className="h-4 px-1 text-[8px] opacity-40">NFC</Badge>
                        </div>
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
