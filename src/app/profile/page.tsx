
"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Shield, 
  Smartphone, 
  Award, 
  Clock,
  ExternalLink,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDevice } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { userProfile, activeDevice, currentPlan, points, logout } = useDevice();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const tier = points > 1000 ? 'Platinum' : 'Gold';

  return (
    <main className="min-h-screen pb-32 bg-background text-foreground">
      <div className="max-w-lg mx-auto p-6 pt-12 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-headline font-bold uppercase tracking-widest">Identity</h1>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/5 h-12 w-12">
            <Settings className="w-5 h-5 opacity-40" />
          </Button>
        </header>

        {/* User Header Section */}
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="relative">
            <div className="absolute -inset-4 bg-brand-accent/20 rounded-full blur-2xl animate-pulse" />
            <Avatar className="h-28 w-28 border-4 border-brand-accent/20 relative z-10 shadow-2xl">
              <AvatarImage src={`https://picsum.photos/seed/${userProfile?.name || 'user'}/200`} />
              <AvatarFallback className="bg-neutral-800 text-2xl font-bold">
                {userProfile?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <Badge className="absolute bottom-0 right-0 bg-brand-accent text-black border-none font-black text-[10px] h-6 px-3 shadow-lg">
              LEVEL 14
            </Badge>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black tracking-tight">{userProfile?.name || 'Omni User'}</h2>
            <p className="text-xs text-muted-foreground font-medium opacity-60">{userProfile?.email || 'identity@omnokinetic.com'}</p>
          </div>
        </div>

        {/* Status Quick Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 bg-white/5 border-none rounded-[2rem] space-y-2">
            <Award className="w-5 h-5 text-brand-accent" />
            <div className="space-y-0">
              <p className="text-[9px] font-black opacity-40 uppercase tracking-widest leading-none">Status Tier</p>
              <p className="text-xl font-black">{tier}</p>
            </div>
          </Card>
          <Card className="p-5 bg-white/5 border-none rounded-[2rem] space-y-2">
            <Award className="w-5 h-5 text-brand-accent" />
            <div className="space-y-0">
              <p className="text-[9px] font-black opacity-40 uppercase tracking-widest leading-none">Omni Pts</p>
              <p className="text-xl font-black">{points}</p>
            </div>
          </Card>
        </div>

        {/* Hardware & Subscription Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
            <Smartphone className="w-3 h-3" /> Architecture & Plan
          </h3>
          <Card className="bg-white/5 border-none p-6 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/10">
                   <Smartphone className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                   <h4 className="font-bold text-base leading-tight">{activeDevice}</h4>
                   <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Hardware Synced</p>
                </div>
              </div>
              <Badge variant="outline" className="border-brand-accent/40 text-brand-accent font-bold text-[9px] h-6">CONNECTED</Badge>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/10">
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
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Identity Settings</h3>
          <div className="space-y-2">
            {[
              { label: 'Biometric Privacy', icon: Shield },
              { label: 'Notifications', icon: Bell },
              { label: 'History & Logs', icon: Clock },
              { label: 'Official Boutique', icon: ExternalLink },
            ].map((item, idx) => (
              <button key={idx} className="w-full flex items-center justify-between p-5 bg-card hover:bg-white/5 transition-all rounded-[1.8rem] group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 opacity-40" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </section>

        {/* Logout */}
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full h-16 rounded-2xl border-white/5 bg-white/5 text-red-400 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-red-500/10 transition-all mt-4 mb-10"
        >
          <LogOut className="w-4 h-4 mr-2" /> De-initialize Session
        </Button>
      </div>
      <Navigation />
    </main>
  );
}
