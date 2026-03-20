"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Star, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { personalizedScentRecommendations, PersonalizedScentRecommendationsOutput } from '@/ai/flows/personalized-scent-recommendations-flow';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const PLANS = [
  { name: 'Base', price: '$15/mo', features: ['1 Manual Refill', 'Basic Metrics'] },
  { name: 'Essential', price: '$29/mo', features: ['Predictive Refills', 'AI Learning Insights', '10% Discount'], badge: 'Popular' },
  { name: 'Elite', price: '$49/mo', features: ['Unlimited Refills', 'Live Biometric Sync', 'VIP Access'], badge: 'Elite' },
];

const STARTER_KITS = [
  { name: 'Apex Starter Kit', brand: 'Omni Kinetic', price: 231.02, img: PlaceHolderImages.find(i => i.id === 'device-prada')?.imageUrl },
  { name: 'Synapse Night Kit', brand: 'Omni Kinetic', price: 260.26, img: PlaceHolderImages.find(i => i.id === 'device-ysl')?.imageUrl },
  { name: 'Kinetic Wellness Kit', brand: 'Omni Kinetic', price: 286.58, img: PlaceHolderImages.find(i => i.id === 'device-biotherm')?.imageUrl },
];

export default function BoutiquePage() {
  const { activeDevice } = useDevice();
  const [recommendations, setRecommendations] = useState<PersonalizedScentRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRecs() {
      setLoading(true);
      try {
        const result = await personalizedScentRecommendations({
          deviceType: activeDevice === 'none' ? 'ApexEssence' : (activeDevice === 'ApexEssence' ? 'Prada' : (activeDevice === 'Synapse' ? 'YSL' : 'Biotherm')) as any,
          pastScentUsage: ['Bergamot', 'Sandalwood']
        });
        setRecommendations(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadRecs();
  }, [activeDevice]);

  return (
    <main className="min-h-screen pb-24 bg-background">
      <div className="p-6 pt-12 space-y-8 max-w-lg mx-auto">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-headline font-bold">Boutique</h1>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="w-6 h-6" />
          </Button>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
               <Sparkles className="w-4 h-4 text-accent" /> AI Recommended
             </h2>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
            {loading ? (
              [1, 2].map(i => <div key={i} className="min-w-[280px] h-48 bg-card animate-pulse rounded-[2rem]" />)
            ) : recommendations?.recommendations.map((rec, idx) => (
              <Card key={idx} className="min-w-[280px] bg-card border-none overflow-hidden rounded-[2rem] group hover:bg-white/5 transition-colors">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg tracking-tight">{rec.scentName}</h3>
                    <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-white/20">New</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{rec.description}</p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-bold text-lg text-accent">$45.00</span>
                    <Button size="sm" variant="outline" className="text-[9px] h-8 uppercase tracking-widest font-bold rounded-xl px-4 border-white/10">Add Refill</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Tabs defaultValue="kits" className="w-full">
          <TabsList className="w-full bg-card h-14 rounded-2xl p-1.5">
            <TabsTrigger value="kits" className="flex-1 rounded-xl text-xs font-bold uppercase tracking-widest">Starter Kits</TabsTrigger>
            <TabsTrigger value="subs" className="flex-1 rounded-xl text-xs font-bold uppercase tracking-widest">Intelligence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kits" className="pt-6 space-y-4">
            {STARTER_KITS.map((kit, idx) => (
              <Card key={idx} className="bg-card border-none overflow-hidden flex h-36 group cursor-pointer hover:bg-white/5 transition-colors rounded-[2rem]">
                <div className="w-32 relative bg-white/5">
                  <Image src={kit.img || ''} alt={kit.name} fill className="object-contain p-4 transition-transform group-hover:scale-110" />
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40">{kit.brand}</p>
                    <h3 className="font-bold text-base tracking-tight">{kit.name}</h3>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-headline font-black text-xl text-accent">${kit.price}</span>
                    <Button size="icon" className="h-10 w-10 bg-white text-black rounded-full shadow-lg">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="subs" className="pt-6 space-y-4">
            {PLANS.map((plan, idx) => (
              <Card key={idx} className={`p-6 relative overflow-hidden transition-all rounded-[2rem] ${plan.badge ? 'border-white/20 bg-white/5' : 'bg-card border-none'}`}>
                {plan.badge && <Badge className="absolute top-6 right-6 bg-white text-black font-bold uppercase tracking-widest text-[9px]">{plan.badge}</Badge>}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                    <p className="text-3xl font-black text-accent mt-1">{plan.price}</p>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="text-xs text-muted-foreground flex items-center gap-3">
                        <Check className="w-4 h-4 text-white" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs ${plan.badge ? 'bg-white text-black' : 'bg-neutral-800 text-white'}`}>Choose Intelligence</Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </main>
  );
}
