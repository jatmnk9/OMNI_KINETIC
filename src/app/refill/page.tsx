
"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  Droplets,
  Battery,
  AlertTriangle,
  ShoppingCart,
  Plus,
  Minus,
  Package,
  Check,
  Sparkles,
  MapPin,
  Truck,
  ChevronRight,
  X,
  CreditCard,
  Crown,
  Star,
  Navigation2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDevice, FRAGRANCES, REFILL_PRICE, PACK_PRICES, SUBSCRIPTION_PLANS, FragranceType } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { cn } from '@/lib/utils';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

const PICKUP_LOCATIONS = [
  { id: 1, name: "Omni Luxe — Champs-Élysées", brand: "Flagship", status: "Available", stock: 18, distance: "0.6 km", address: "101 Avenue des Champs-Élysées, 75008", rating: 4.9, lat: 48.8698, lng: 2.3076, color: "bg-brand-accent" },
  { id: 2, name: "Luxe Wellness — Le Marais", brand: "Authorized", status: "Limited", stock: 4, distance: "1.2 km", address: "27 Rue des Francs-Bourgeois, 75004", rating: 4.7, lat: 48.8572, lng: 2.3618, color: "bg-orange-500" },
  { id: 3, name: "Omni — Galeries Lafayette", brand: "Premium", status: "Available", stock: 32, distance: "0.9 km", address: "40 Boulevard Haussmann, 75009", rating: 4.8, lat: 48.8737, lng: 2.3320, color: "bg-brand-accent" },
  { id: 4, name: "Omni Kinetic — Saint-Germain", brand: "Experience Center", status: "Available", stock: 45, distance: "1.8 km", address: "170 Boulevard Saint-Germain, 75006", rating: 5.0, lat: 48.8530, lng: 2.3327, color: "bg-brand-accent" },
  { id: 5, name: "Omni Atelier — Opéra", brand: "Flagship", status: "Available", stock: 22, distance: "0.4 km", address: "2 Place de l'Opéra, 75009", rating: 4.9, lat: 48.8712, lng: 2.3316, color: "bg-brand-accent" },
];

export default function RefillPage() {
  const router = useRouter();
  const {
    activeFragrance,
    devicePerfumeMl,
    bottlePerfumeMl,
    deviceBattery,
    dailySprayCount,
    estimatedBottleDays,
    estimatedDeviceSprays,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    subscriptionPlan,
    setSubscriptionPlan,
  } = useDevice();

  const [quantities, setQuantities] = useState<Record<string, number>>({ Apex: 1, Synapse: 1, Flow: 1 });
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'processing' | 'done'>('idle');
  const [deliveryChoice, setDeliveryChoice] = useState<'pickup' | 'deliver' | null>(null);
  const [selectedPickupId, setSelectedPickupId] = useState<number | null>(null);

  const handlePickupMarkerClick = useCallback((id: number) => {
    setSelectedPickupId(id);
  }, []);

  const pickupMapMarkers = PICKUP_LOCATIONS.map(f => ({ id: f.id, lat: f.lat, lng: f.lng, name: f.name, status: f.status, color: f.color }));
  const selectedPickup = PICKUP_LOCATIONS.find(l => l.id === selectedPickupId);

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, Math.min(10, (prev[id] || 1) + delta)) }));
  };

  const handleAddToCart = (fragranceId: FragranceType) => {
    addToCart({
      fragranceId,
      quantity: quantities[fragranceId] || 1,
      type: 'single',
      unitPrice: REFILL_PRICE,
    });
  };

  const handleAddPack = (fragranceId: FragranceType, packType: 'pack2' | 'pack3' | 'pack4') => {
    const pack = PACK_PRICES[packType];
    addToCart({
      fragranceId,
      quantity: 1,
      type: packType,
      unitPrice: pack.price,
    });
  };

  const handleCheckout = () => {
    setCheckoutStep('processing');
    setTimeout(() => setCheckoutStep('done'), 2500);
  };

  const needsRefillSoon = devicePerfumeMl < 0.3;
  const bottleLow = bottlePerfumeMl < 10;
  const devicePct = Math.round((devicePerfumeMl / 1.2) * 100);
  const bottlePct = Math.round((bottlePerfumeMl / 30) * 100);

  return (
    <main className="min-h-screen pb-32 bg-background text-foreground">
      <Header />

      <div className="max-w-lg mx-auto p-6 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">Smart Refill</h1>
          <button onClick={() => setShowCart(true)} className="relative bg-white/5 border border-white/10 rounded-full h-11 w-11 flex items-center justify-center hover:bg-white/10 transition-all">
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-background text-[9px] font-black rounded-full flex items-center justify-center">{cart.length}</div>
            )}
          </button>
        </header>

        {/* === SECTION 1: PERFUME STATUS === */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
            <Droplets className="w-3 h-3 text-brand-accent" /> Status
          </h2>

          {/* Alert banner */}
          {(needsRefillSoon || bottleLow) && (
            <Card className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-[1.5rem] flex items-center gap-3 animate-in fade-in duration-500">
              <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
              <p className="text-[11px] text-orange-300 font-medium">
                {needsRefillSoon ? 'Device running low — recharge your wearable soon.' : 'Bottle level is low — consider ordering a refill.'}
              </p>
            </Card>
          )}

          <div className="grid grid-cols-3 gap-3">
            {/* Device Perfume */}
            <Card className="p-4 bg-white/[0.03] border-none rounded-[1.5rem] flex flex-col items-center gap-2">
              <div className="relative w-12 h-12">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--brand-accent))" strokeWidth="3" strokeDasharray={`${devicePct * 0.94} 100`} strokeLinecap="round" />
                </svg>
                <Droplets className="absolute inset-0 m-auto w-4 h-4 text-brand-accent" />
              </div>
              <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Device</p>
              <p className="text-sm font-black tabular-nums">{devicePerfumeMl.toFixed(2)}<span className="text-[8px] opacity-30 ml-0.5">ml</span></p>
            </Card>

            {/* Battery */}
            <Card className="p-4 bg-white/[0.03] border-none rounded-[1.5rem] flex flex-col items-center gap-2">
              <div className="relative w-12 h-12">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke={deviceBattery > 20 ? '#22C55E' : '#EF4444'} strokeWidth="3" strokeDasharray={`${deviceBattery * 0.94} 100`} strokeLinecap="round" />
                </svg>
                <Battery className="absolute inset-0 m-auto w-4 h-4" style={{ color: deviceBattery > 20 ? '#22C55E' : '#EF4444' }} />
              </div>
              <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Battery</p>
              <p className="text-sm font-black tabular-nums">{deviceBattery}<span className="text-[8px] opacity-30 ml-0.5">%</span></p>
            </Card>

            {/* Bottle Level */}
            <Card className="p-4 bg-white/[0.03] border-none rounded-[1.5rem] flex flex-col items-center gap-2">
              <div className="relative w-12 h-12">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--omni-orange))" strokeWidth="3" strokeDasharray={`${bottlePct * 0.94} 100`} strokeLinecap="round" />
                </svg>
                <Package className="absolute inset-0 m-auto w-4 h-4 text-omni-orange" />
              </div>
              <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Bottle</p>
              <p className="text-sm font-black tabular-nums">{bottlePerfumeMl.toFixed(1)}<span className="text-[8px] opacity-30 ml-0.5">ml</span></p>
            </Card>
          </div>

          {/* Predictive info */}
          <div className="flex items-center justify-between px-2">
            <div className="space-y-0.5">
              <p className="text-[9px] uppercase font-bold tracking-widest opacity-40">Est. Bottle Life</p>
              <p className="text-sm font-black tabular-nums">{estimatedBottleDays} days</p>
            </div>
            <div className="space-y-0.5 text-right">
              <p className="text-[9px] uppercase font-bold tracking-widest opacity-40">Today</p>
              <p className="text-sm font-black tabular-nums">{dailySprayCount}<span className="text-[9px] opacity-30 ml-0.5">/ 6 sprays</span></p>
            </div>
          </div>
        </section>

        {/* === SECTION 2: REFILL STORE === */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-brand-accent" /> Refill Store
          </h2>

          {FRAGRANCES.map((frag) => (
            <Card key={frag.id} className={cn(
              "p-5 border-none rounded-[2rem] space-y-4 transition-all",
              activeFragrance === frag.id ? "bg-brand/10 ring-1 ring-brand-accent/20" : "bg-white/[0.03]"
            )}>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <Image src={frag.refillImg} alt={frag.name} fill className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base tracking-tight">{frag.name}</h3>
                    {activeFragrance === frag.id && (
                      <Badge className="bg-brand-accent/20 text-brand-accent border-none text-[7px] font-bold uppercase">Active</Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-white/40 italic">{frag.tagline}</p>
                  <p className="text-base font-black text-brand-accent mt-1">€{REFILL_PRICE}<span className="text-[9px] opacity-40 ml-1 font-medium">/ 30ml</span></p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-1">
                  <button onClick={() => updateQty(frag.id, -1)} className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors">
                    <Minus className="w-4 h-4 opacity-40" />
                  </button>
                  <span className="text-sm font-black tabular-nums w-6 text-center">{quantities[frag.id] || 1}</span>
                  <button onClick={() => updateQty(frag.id, 1)} className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors">
                    <Plus className="w-4 h-4 opacity-40" />
                  </button>
                </div>
                <Button onClick={() => handleAddToCart(frag.id)} className="h-10 bg-white text-black font-bold uppercase tracking-widest text-[9px] rounded-xl px-5 hover:bg-neutral-200 active:scale-95 transition-all border-none">
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </section>

        {/* === SECTION 3: PACKS === */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
            <Package className="w-3 h-3 text-omni-orange" /> Packs & Savings
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(PACK_PRICES).map(([key, pack]) => (
              <Card key={key} className="p-4 bg-white/[0.03] border-none rounded-[1.5rem] flex flex-col items-center gap-2 cursor-pointer hover:bg-white/[0.06] transition-all group"
                onClick={() => handleAddPack(activeFragrance !== 'none' ? activeFragrance : 'Apex', key as any)}>
                <Badge className="bg-omni-orange/20 text-omni-orange border-none text-[8px] font-black uppercase">{pack.discount} off</Badge>
                <p className="text-xl font-black">x{pack.qty}</p>
                <p className="text-sm font-black text-brand-accent">€{pack.price}</p>
                <p className="text-[8px] opacity-30 uppercase font-bold">€{Math.round(pack.price / pack.qty)}/ea</p>
              </Card>
            ))}
          </div>
        </section>

        {/* === SECTION 4: SUBSCRIPTION === */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
            <Crown className="w-3 h-3 text-brand-accent" /> Smart Subscription
          </h2>
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => {
            const isActive = subscriptionPlan === key;
            return (
              <Card key={key} className={cn(
                "p-5 rounded-[2rem] space-y-3 transition-all border",
                isActive ? "bg-brand-accent/10 border-brand-accent/30 ring-1 ring-brand-accent/20" : "bg-white/[0.03] border-white/5"
              )}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm tracking-tight">{plan.name}</h3>
                    <p className="text-[10px] text-white/40 mt-0.5">{plan.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-brand-accent">€{plan.monthlyPrice}<span className="text-[9px] opacity-40">/mo</span></p>
                    {isActive && (
                      <Badge className="bg-brand-accent text-background text-[7px] font-black uppercase border-none mt-1">Active</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white/30">
                  <Check className="w-3 h-3" /> Free delivery
                  <Check className="w-3 h-3 ml-2" /> Cancel anytime
                  <Check className="w-3 h-3 ml-2" /> Priority access
                </div>
                {!isActive ? (
                  <Button onClick={() => {
                    setSubscriptionPlan(key as any);
                    addToCart({ fragranceId: activeFragrance !== 'none' ? activeFragrance : 'Apex', quantity: 1, type: 'single', unitPrice: plan.monthlyPrice });
                    setShowCart(true);
                  }} className="w-full h-11 bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest text-[9px] rounded-xl active:scale-95 transition-all border-none">
                    Subscribe · €{plan.monthlyPrice}/mo
                  </Button>
                ) : (
                  <Button onClick={() => setSubscriptionPlan('none')} variant="outline" className="w-full h-11 font-bold uppercase tracking-widest text-[9px] rounded-xl border-white/10 hover:bg-white hover:text-black transition-all">
                    Cancel Subscription
                  </Button>
                )}
              </Card>
            );
          })}
        </section>
      </div>

      {/* === CART DRAWER === */}
      {showCart && (
        <div className="fixed inset-0 z-[70] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setShowCart(false); setCheckoutStep('idle'); setDeliveryChoice(null); }} />
          <div className="absolute bottom-0 left-0 right-0 max-w-lg mx-auto bg-card rounded-t-[3rem] p-6 space-y-6 animate-in slide-in-from-bottom-8 duration-500 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black tracking-tight">Your Cart</h2>
              <button onClick={() => { setShowCart(false); setCheckoutStep('idle'); setDeliveryChoice(null); }} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutStep === 'idle' && (
              <>
                {cart.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <ShoppingCart className="w-12 h-12 mx-auto text-white/10" />
                    <p className="text-sm text-white/30">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cart.map((item, idx) => {
                        const frag = FRAGRANCES.find(f => f.id === item.fragranceId);
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl">
                            <div className="flex items-center gap-3">
                              {frag && (
                                <div className="relative w-10 h-10 shrink-0">
                                  <Image src={frag.refillImg} alt={frag.name} fill className="object-contain" />
                                </div>
                              )}
                              <div>
                                <p className="text-xs font-bold">{frag?.name} {item.type !== 'single' ? `(${item.type.replace('pack', 'x')})` : ''}</p>
                                <p className="text-[10px] text-white/30">Qty: {item.quantity} × €{item.unitPrice}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black">€{item.unitPrice * item.quantity}</span>
                              <button onClick={() => removeFromCart(idx)} className="w-7 h-7 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors">
                                <X className="w-3 h-3 opacity-40" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <p className="text-[9px] uppercase font-bold tracking-widest opacity-40">Total</p>
                        <p className="text-2xl font-black">€{cartTotal}</p>
                      </div>
                      <Button onClick={clearCart} variant="ghost" className="text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100">Clear All</Button>
                    </div>
                    <Button onClick={handleCheckout} className="w-full h-16 bg-white text-black font-bold uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-3 border-none">
                      <CreditCard className="w-5 h-5 opacity-60" />
                      Checkout · €{cartTotal}
                    </Button>
                  </>
                )}
              </>
            )}

            {checkoutStep === 'processing' && (
              <div className="flex flex-col items-center py-12 space-y-6 animate-in fade-in duration-500">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center animate-pulse">
                  <CreditCard className="w-10 h-10 text-brand-accent" />
                </div>
                <p className="text-[11px] text-white uppercase tracking-[0.4em] font-black animate-pulse">Processing payment...</p>
              </div>
            )}

            {checkoutStep === 'done' && !deliveryChoice && (
              <div className="flex flex-col items-center py-8 space-y-6 animate-in fade-in zoom-in duration-700">
                <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black">Payment Successful</h3>
                  <p className="text-[11px] text-white/40">How would you like to receive your order?</p>
                </div>
                <div className="w-full space-y-3">
                  <Button onClick={() => setDeliveryChoice('pickup')} className="w-full h-14 bg-white text-black hover:bg-white/90 font-bold uppercase tracking-[0.2em] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 text-[10px] border-none">
                    <MapPin className="w-5 h-5 opacity-60" /> Pick up at Store
                  </Button>
                  <Button onClick={() => setDeliveryChoice('deliver')} variant="outline" className="w-full h-14 font-bold uppercase tracking-[0.2em] rounded-2xl border-white/20 text-white hover:bg-white hover:text-black active:scale-95 transition-all flex items-center justify-center gap-3 text-[10px]">
                    <Truck className="w-5 h-5 opacity-60" /> Deliver to my Address
                  </Button>
                </div>
              </div>
            )}

            {checkoutStep === 'done' && deliveryChoice === 'pickup' && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black">Select Pickup Point</h3>
                  <p className="text-[10px] text-white/40">Tap a marker on the map to select your store</p>
                </div>

                {/* Embedded map */}
                <div className="relative w-full h-[220px] rounded-2xl overflow-hidden border border-white/10">
                  <LeafletMap
                    markers={pickupMapMarkers}
                    selectedId={selectedPickupId}
                    onMarkerClick={handlePickupMarkerClick}
                    center={[48.8650, 2.3320]}
                    zoom={12}
                  />
                </div>

                {/* Selected location detail */}
                {selectedPickup && (
                  <Card className="p-4 bg-white/5 border-none rounded-2xl space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm tracking-tight">{selectedPickup.name}</h4>
                      <Badge className="bg-brand-accent text-background font-black text-[9px] h-5 px-2">
                        {selectedPickup.rating} <Star className="w-2.5 h-2.5 ml-0.5 fill-current" />
                      </Badge>
                    </div>
                    <p className="text-[10px] text-white/40 flex items-center gap-1">
                      <Navigation2 className="w-3 h-3" /> {selectedPickup.address} · {selectedPickup.distance}
                    </p>
                  </Card>
                )}

                <Button
                  disabled={!selectedPickup}
                  onClick={() => { setShowCart(false); clearCart(); setCheckoutStep('idle'); setDeliveryChoice(null); setSelectedPickupId(null); }}
                  className={cn(
                    "w-full h-14 font-bold uppercase tracking-[0.2em] rounded-2xl active:scale-95 transition-all text-[10px] border-none",
                    selectedPickup ? "bg-white text-black hover:bg-white/90" : "bg-white/10 text-white/30 cursor-not-allowed"
                  )}
                >
                  {selectedPickup ? `Confirm Pickup — ${selectedPickup.name.split('—')[0].trim()}` : 'Select a store on the map'}
                </Button>
              </div>
            )}

            {checkoutStep === 'done' && deliveryChoice === 'deliver' && (
              <div className="flex flex-col items-center py-8 space-y-6 animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Truck className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-black">Order Confirmed</h3>
                  <p className="text-[11px] text-white/40">Estimated delivery: 2-3 business days</p>
                </div>
                <Button onClick={() => { setShowCart(false); clearCart(); setCheckoutStep('idle'); setDeliveryChoice(null); }} className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-200 active:scale-95 transition-all text-[10px] border-none">
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <Navigation />
    </main>
  );
}
