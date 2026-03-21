
"use client";

import React from 'react';
import { 
  Shield, 
  Smartphone, 
  Award, 
  Clock,
  ExternalLink,
  Bell,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';

export default function ProfilePage() {
  const { userProfile, activeDevice, currentPlan, points } = useDevice();
  const tier = points > 1000 ? 'Platinum' : 'Gold';

  return (
    <main className="min-h-screen pb-32 bg-background text-foreground">
      <Header />
      
      <div className="max-w-lg mx-auto p-6 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">Identity</h1>
        </header>

        {/* User Header Section */}
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="relative group">
            <div className="absolute -inset-4 bg-brand-accent/20 rounded-full blur-2xl animate-pulse" />
            <Avatar className="h-32 w-32 border-4 border-white/10 relative z-10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <AvatarImage src={`https://picsum.photos/seed/${userProfile?.name || 'user'}/400`} />
              <AvatarFallback className="bg-neutral-800 text-3xl font-bold">
                {userProfile?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {/* Level Badge matching reference image */}
            <div className="absolute bottom-1 right-1 z-20 bg-white text-black text-[10px] font-black px-3 py-1 rounded-full border-2 border-background shadow-lg flex items-center gap-1">
              <span className="opacity-40 font-bold uppercase text-[8px] tracking-widest">Lvl</span> 14
            </div>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-black tracking-tight">{userProfile?.name || 'Jatziry Sanchez'}</h2>
            <p className="text-xs text-muted-foreground font-medium opacity-60 tracking-wider">{userProfile?.email || 'jatzirywong9@gmail.com'}</p>
          </div>
        </div>

        {/* Status Quick Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-white/5 border-none rounded-[2rem] space-y-2 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <Award className="w-12 h-12" />
            </div>
            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest leading-none">Status Tier</p>
            <p className="text-2xl font-black text-brand-accent">{tier}</p>
          </Card>
          <Card className="p-6 bg-white/5 border-none rounded-[2rem] space-y-2 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <Award className="w-12 h-12" />
            </div>
            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest leading-none">Omni Pts</p>
            <p className="text-2xl font-black text-brand-accent">{points}</p>
          </Card>
        </div>

        {/* Hardware & Subscription Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2 px-2">
            <Smartphone className="w-3 h-3" /> Architecture & Plan
          </h3>
          <Card className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                   <Smartphone className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                   <h4 className="font-bold text-base leading-tight">{activeDevice}</h4>
                   <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Hardware Synced</p>
                </div>
              </div>
              <Badge variant="outline" className="border-brand-accent/40 text-brand-accent font-bold text-[9px] h-6 px-3 bg-brand-accent/5">CONNECTED</Badge>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                   <Shield className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                   <h4 className="font-bold text-base leading-tight">{currentPlan} Intelligence</h4>
                   <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Active Tier</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-20" />
            </div>
          </Card>
        </section>

        {/* Identity Settings */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground px-2">Identity Settings</h3>
          <div className="space-y-3">
            {[
              { label: 'Biometric Privacy', icon: Shield },
              { label: 'Notifications', icon: Bell },
              { label: 'History & Logs', icon: Clock },
              { label: 'Official Boutique', icon: ExternalLink },
            ].map((item, idx) => (
              <button key={idx} className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/5 transition-all rounded-[1.8rem] group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    <item.icon className="w-5 h-5 opacity-40" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </section>
      </div>
      <Navigation />
    </main>
  );
}
