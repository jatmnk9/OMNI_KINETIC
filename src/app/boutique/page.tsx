
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
  { name: 'Essential', price: '$29/mo', features: ['Predictive Refills', 'Advanced AI Insights', '10% Shop Discount'], badge: 'Popular' },
  { name: 'Elite', price: '$49/mo', features: ['Unlimited Refills', 'Biometric Correlated Scents', 'VIP Lounge Access'], badge: 'Premium' },
];

const STARTER_KITS = [
  { name: 'Apex Starter Kit', brand: 'Prada', price: 231.02, img: PlaceHolderImages.find(i => i.id === 'device-prada')?.imageUrl },
  { name: 'Synapse Night Kit', brand: 'YSL', price: 260.26, img: PlaceHolderImages.find(i => i.id === 'device-ysl')?.imageUrl },
  { name: 'Kinetic Wellness Kit', brand: 'Biotherm', price: 286.58, img: PlaceHolderImages.find(i => i.id === 'device-biotherm')?.imageUrl },
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
          deviceType: activeDevice === 'none' ? 'Prada' : activeDevice as any,
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
    <main className="min-h-screen pb-24">
      <div className="p-6 pt-12 space-y-8 max-w-lg mx-auto">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-headline font-bold">Boutique</h1>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="w-6 h-6" />
          </Button>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
               <Sparkles className="w-4 h-4 text-accent" /> AI Recommendations
             </h2>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
            {loading ? (
              [1, 2].map(i => <div key={i} className="min-w-[280px] h-48 bg-card animate-pulse rounded-xl" />)
            ) : recommendations?.recommendations.map((rec, idx) => (
              <Card key={idx} className="min-w-[280px] bg-card border-none overflow-hidden group">
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{rec.scentName}</h3>
                    <Badge variant="secondary" className="bg-brand/20 text-brand border-brand/30">New</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{rec.description}</p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-bold text-accent">$45.00</span>
                    <Button size="sm" variant="outline" className="text-[10px] h-7 uppercase tracking-widest font-bold">Add Refill</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Tabs defaultValue="kits" className="w-full">
          <TabsList className="w-full bg-card h-12">
            <TabsTrigger value="kits" className="flex-1">Starter Kits</TabsTrigger>
            <TabsTrigger value="subs" className="flex-1">Subscriptions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kits" className="pt-4 space-y-4">
            {STARTER_KITS.map((kit, idx) => (
              <Card key={idx} className="bg-card border-none overflow-hidden flex h-32 group cursor-pointer hover:bg-white/5 transition-colors">
                <div className="w-32 relative">
                  <Image src={kit.img || ''} alt={kit.name} fill className="object-cover transition-transform group-hover:scale-110" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">{kit.brand}</p>
                    <h3 className="font-bold text-sm">{kit.name}</h3>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-headline font-bold text-accent">${kit.price}</span>
                    <Button size="icon" className="h-8 w-8 bg-brand rounded-full">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="subs" className="pt-4 space-y-4">
            {PLANS.map((plan, idx) => (
              <Card key={idx} className={`p-5 relative overflow-hidden transition-all ${plan.badge ? 'border-brand/40 bg-brand/5' : 'bg-card border-none'}`}>
                {plan.badge && <Badge className="absolute top-4 right-4 bg-brand text-white">{plan.badge}</Badge>}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-2xl font-black text-accent">{plan.price}</p>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="text-xs text-muted-foreground flex items-center gap-2">
                        <Check className="w-3 h-3 text-brand" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.badge ? 'bg-brand' : 'bg-white text-black'}`}>Select Plan</Button>
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
