
"use client";

import React, { useState } from 'react';
import { MapPin, Search, Navigation as NavIcon, Star, Filter, Info, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navigation } from '@/components/Navigation';

// Mocked GeoJSON-like data for L'Oréal Luxe locations
const REFILL_LOCATIONS = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-3.70379, 40.416775] },
      "properties": {
        "name": "L'Oréal Luxe Boutique - Serrano",
        "brand": "Prada & YSL",
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
        "name": "Boutique Biotherm - Velázquez",
        "brand": "Biotherm Kinetic",
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
        "name": "Omni-Scent Flagship - Prado",
        "brand": "Full Collection",
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
        
        {/* Mock Map UI */}
        <div className="relative h-[45%] w-full bg-neutral-900 overflow-hidden">
          {/* Decorative SVG Map Background */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
            <path d="M0,50 Q100,20 200,80 T400,30" fill="none" stroke="gray" strokeWidth="0.5" />
            <path d="M50,0 Q120,150 80,300 T300,400" fill="none" stroke="gray" strokeWidth="0.5" />
            <circle cx="150" cy="180" r="120" fill="none" stroke="gray" strokeWidth="0.2" />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            {filteredFeatures.map((f, i) => (
              <div 
                key={i}
                className={`absolute transition-all cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
                style={{ 
                  left: `${40 + (i * 25)}%`, 
                  top: `${30 + (i * 20)}%` 
                }}
                onClick={() => setSelectedLocation(f)}
              >
                <div className={`relative group`}>
                  <MapPin className={`w-8 h-8 ${selectedLocation?.properties.name === f.properties.name ? 'text-accent scale-125' : 'text-brand opacity-60'}`} />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full whitespace-nowrap shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {f.properties.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute top-12 left-6 right-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 opacity-40" />
              <Input 
                placeholder="Find boutique or refill point..." 
                className="pl-10 bg-card/80 backdrop-blur-md border-none shadow-2xl h-11 text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button size="icon" variant="secondary" className="h-11 w-11 bg-card/80 backdrop-blur-md border-none">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <Badge className="bg-accent text-white font-bold tracking-widest uppercase text-[10px]">3 Points Nearby</Badge>
            <Button size="sm" variant="secondary" className="text-[10px] uppercase font-bold bg-white/10 backdrop-blur-md">
              <NavIcon className="w-3 h-3 mr-2" /> Recenter
            </Button>
          </div>
        </div>

        {/* Location List / Details */}
        <div className="flex-1 bg-background rounded-t-3xl -mt-6 relative z-10 p-6 space-y-6">
          <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-2" />
          
          <ScrollArea className="h-full pr-4">
            {selectedLocation ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <header className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{selectedLocation.properties.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedLocation.properties.address}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setSelectedLocation(null)}>
                    <Info className="w-5 h-5 opacity-40" />
                  </Button>
                </header>

                <div className="grid grid-cols-2 gap-3">
                   <Card className="p-4 bg-card border-none space-y-2">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Status</p>
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${selectedLocation.properties.status === 'Available' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                         <span className="font-bold text-sm">{selectedLocation.properties.status}</span>
                      </div>
                   </Card>
                   <Card className="p-4 bg-card border-none space-y-2">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Stock Live</p>
                      <p className="font-bold text-sm text-accent">{selectedLocation.properties.stock} Units</p>
                   </Card>
                </div>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Contact & Hours</h3>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 opacity-40" />
                        <span>+34 912 345 678</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 opacity-40" />
                        <span>Open until 21:00</span>
                     </div>
                  </div>
                </section>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 h-14 bg-brand font-bold uppercase tracking-widest rounded-2xl">
                    Reserve Refill
                  </Button>
                  <Button variant="outline" className="flex-1 h-14 font-bold uppercase tracking-widest rounded-2xl">
                    Get Directions
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Nearby Stations</h2>
                {filteredFeatures.map((f, i) => (
                  <Card 
                    key={i} 
                    className="p-4 bg-card border-none flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors group"
                    onClick={() => setSelectedLocation(f)}
                  >
                    <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm truncate">{f.properties.name}</h3>
                        <span className="text-[10px] font-bold opacity-40">{f.properties.distance}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{f.properties.address}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
      <Navigation />
    </main>
  );
}
