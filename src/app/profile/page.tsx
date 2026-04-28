"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Shield, 
  Smartphone, 
  Award, 
  Clock,
  ExternalLink,
  Bell,
  ChevronRight,
  Heart,
  Gauge,
  Thermometer,
  Moon,
  Smile,
  Activity,
  Footprints,
  Droplets,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Crown,
  Watch,
  Plus,
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine,
  Label
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDevice, BIOMETRIC_HISTORY, DOSE_HISTORY, SUBSCRIPTION_PLANS } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { cn } from '@/lib/utils';

type MetricTab = 'overview' | 'heart' | 'sleep' | 'activity' | 'environment' | 'impact';

// Mini spark chart component
function SparkChart({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((val - min) / range) * (height - 4);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill={`url(#grad-${color.replace('#','')})`}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Current value dot */}
      {data.length > 0 && (
        <circle
          cx="100"
          cy={height - ((data[data.length - 1] - min) / range) * (height - 4)}
          r="2.5"
          fill={color}
          className="animate-pulse"
        />
      )}
    </svg>
  );
}

function ImpactAnalysisChart({ data, doses }: { data: typeof BIOMETRIC_HISTORY; doses: typeof DOSE_HISTORY }) {
  const chartData = data.map(d => ({
    ...d,
  }));

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}
            interval={2}
          />
          <YAxis yAxisId="left" hide />
          <YAxis yAxisId="right" hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '12px', fontSize: '10px' }}
            itemStyle={{ padding: '0px' }}
          />
          
          <Area 
            yAxisId="right"
            type="monotone" 
            dataKey="movement" 
            fill="rgba(34, 197, 94, 0.1)" 
            stroke="none" 
          />

          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="stress" 
            stroke="#EAB308" 
            strokeWidth={2} 
            dot={false}
            name="Stress"
          />

          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="heartRate" 
            stroke="#EF4444" 
            strokeWidth={2} 
            dot={false}
            name="Heart Rate"
          />

          {doses.map((dose, i) => (
            <ReferenceLine 
              key={i}
              x={dose.time.split(':')[0] + ':00'} 
              yAxisId="left"
              stroke="rgba(255,255,255,0.4)"
              strokeDasharray="3 3"
            >
              <Label 
                value="DOSE" 
                position="top" 
                fill="rgba(255,255,255,0.5)" 
                fontSize={8} 
                fontWeight="black"
              />
            </ReferenceLine>
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}


function TrendIndicator({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  const pct = previous > 0 ? Math.abs(Math.round((diff / previous) * 100)) : 0;
  if (diff > 0) return <span className="flex items-center gap-0.5 text-green-400 text-[9px] font-bold"><TrendingUp className="w-3 h-3" />+{pct}%</span>;
  if (diff < 0) return <span className="flex items-center gap-0.5 text-red-400 text-[9px] font-bold"><TrendingDown className="w-3 h-3" />-{pct}%</span>;
  return <span className="flex items-center gap-0.5 text-white/30 text-[9px] font-bold"><Minus className="w-3 h-3" />0%</span>;
}

const MOOD_LABELS = ['', 'Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];

export default function ProfilePage() {
  const { userProfile, activeDevice, activeFragrance, getFragrance, points, biometrics, subscriptionPlan, linkedSensor } = useDevice();
  const tier = points > 1000 ? 'Platinum' : 'Gold';
  const [activeTab, setActiveTab] = useState<MetricTab>('overview');

  const history = BIOMETRIC_HISTORY;
  const latest = history[history.length - 1];
  const earlier = history[Math.floor(history.length / 2)];

  const tabs: { id: MetricTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'heart', label: 'Heart', icon: Heart },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'activity', label: 'Activity', icon: Footprints },
    { id: 'impact', label: 'Impact', icon: Zap },
    { id: 'environment', label: 'Environ.', icon: Thermometer },
  ];

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
              <AvatarImage src="/perfil.jpg" alt="Profile" className="object-cover" />
              <AvatarFallback className="bg-neutral-800 text-3xl font-bold">
                {userProfile?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-1 right-1 z-20 bg-white text-black text-[10px] font-black px-3 py-1 rounded-full border-2 border-background shadow-lg flex items-center gap-1">
              <span className="opacity-40 font-bold uppercase text-[8px] tracking-widest">Lvl</span> 14
            </div>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-black tracking-tight">{userProfile?.name || 'Jatziry Sanchez'}</h2>
            <p className="text-xs text-muted-foreground font-medium opacity-60 tracking-wider">{userProfile?.email || 'jatzirywong9@gmail.com'}</p>
          </div>
        </div>

        {/* Telemetry Sensors */}
        <section className="space-y-4 animate-in slide-in-from-top-4 duration-700">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground px-2">Telemetry Sensors</h3>
          <Card className="bg-white/5 border border-white/5 p-5 rounded-[2rem] space-y-4">
            {linkedSensor === 'smartwatch' ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner overflow-hidden relative">
                    <Image src="/smartwatch.png" alt="Smartwatch" fill className="object-contain p-1 opacity-80" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">Apple Watch Ultra</h4>
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Primary Data Source</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-500/40 text-green-400 font-bold text-[7px] h-5 px-2 bg-green-500/5 animate-pulse">STREAMING</Badge>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-[10px] text-white/20 uppercase tracking-widest font-black italic">No telemetry sensor linked</p>
              </div>
            )}
            
            <button className="w-full h-12 bg-white/5 hover:bg-white/10 transition-all rounded-xl border border-white/5 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
              <Plus className="w-3 h-3" /> Link New Sensor
            </button>
          </Card>
        </section>

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

        {/* === BIOMETRIC HISTORY SECTION === */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2 px-2">
            <Activity className="w-3 h-3" /> Biometric History
          </h3>

          {/* Tab selector */}
          <div className="flex bg-white/[0.03] rounded-2xl p-1 gap-0.5 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all duration-300 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap px-2",
                    isActive ? "bg-white/10 text-white shadow-md" : "opacity-30 hover:opacity-60"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* === OVERVIEW TAB === */}
          {activeTab === 'overview' && (
            <div className="space-y-3 animate-in fade-in duration-300">
              {/* Live stats row */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 bg-red-500/5 border-none rounded-[1.5rem] space-y-2">
                  <div className="flex items-center justify-between">
                    <Heart className="w-4 h-4 text-red-400" />
                    <TrendIndicator current={latest.heartRate} previous={earlier.heartRate} />
                  </div>
                  <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Heart Rate</p>
                  <p className="text-lg font-black tabular-nums">{biometrics.hrv}<span className="text-[9px] opacity-30 ml-0.5">bpm</span></p>
                  <SparkChart data={history.map(h => h.heartRate)} color="#EF4444" height={28} />
                </Card>

                <Card className="p-4 bg-yellow-500/5 border-none rounded-[1.5rem] space-y-2">
                  <div className="flex items-center justify-between">
                    <Gauge className="w-4 h-4 text-yellow-400" />
                    <TrendIndicator current={latest.stress} previous={earlier.stress} />
                  </div>
                  <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Stress</p>
                  <p className="text-lg font-black tabular-nums">{latest.stress}<span className="text-[9px] opacity-30 ml-0.5">%</span></p>
                  <SparkChart data={history.map(h => h.stress)} color="#EAB308" height={28} />
                </Card>

                <Card className="p-4 bg-blue-500/5 border-none rounded-[1.5rem] space-y-2">
                  <div className="flex items-center justify-between">
                    <Thermometer className="w-4 h-4 text-blue-400" />
                    <TrendIndicator current={Math.round(latest.temp * 10)} previous={Math.round(earlier.temp * 10)} />
                  </div>
                  <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Temp</p>
                  <p className="text-lg font-black tabular-nums">{biometrics.temp}<span className="text-[9px] opacity-30 ml-0.5">°C</span></p>
                  <SparkChart data={history.map(h => h.temp)} color="#3B82F6" height={28} />
                </Card>
              </div>

              {/* Secondary metrics */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 bg-white/[0.03] border-none rounded-[1.5rem] space-y-2">
                  <div className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-green-400" />
                    <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Steps</p>
                  </div>
                  <p className="text-lg font-black tabular-nums">{latest.steps.toLocaleString()}</p>
                  <SparkChart data={history.map(h => h.steps)} color="#22C55E" height={24} />
                </Card>
                <Card className="p-4 bg-white/[0.03] border-none rounded-[1.5rem] space-y-2">
                  <div className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-purple-400" />
                    <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Mood</p>
                  </div>
                  <p className="text-lg font-black">{MOOD_LABELS[latest.mood]}</p>
                  <SparkChart data={history.map(h => h.mood)} color="#A855F7" height={24} />
                </Card>
              </div>
            </div>
          )}

          {/* === HEART TAB === */}
          {activeTab === 'heart' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card className="p-6 bg-red-500/5 border-none rounded-[2rem] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-red-400 animate-heartbeat-sync" />
                    <div>
                      <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Heart Rate</p>
                      <p className="text-3xl font-black tabular-nums">{biometrics.hrv}<span className="text-sm opacity-30 ml-1">bpm</span></p>
                    </div>
                  </div>
                  <TrendIndicator current={latest.heartRate} previous={earlier.heartRate} />
                </div>
                <SparkChart data={history.map(h => h.heartRate)} color="#EF4444" height={60} />
                <div className="flex justify-between text-[8px] opacity-20 font-bold tabular-nums">
                  {history.filter((_, i) => i % 3 === 0).map(h => <span key={h.time}>{h.time}</span>)}
                </div>
              </Card>

              <Card className="p-6 bg-green-500/5 border-none rounded-[2rem] space-y-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">HRV (Heart Rate Variability)</p>
                    <p className="text-2xl font-black tabular-nums">{latest.hrv}<span className="text-sm opacity-30 ml-1">ms</span></p>
                  </div>
                </div>
                <SparkChart data={history.map(h => h.hrv)} color="#22C55E" height={50} />
              </Card>

              <Card className="p-5 bg-yellow-500/5 border-none rounded-[2rem] space-y-3">
                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Stress Level</p>
                    <p className="text-2xl font-black tabular-nums">{latest.stress}<span className="text-sm opacity-30 ml-1">%</span></p>
                  </div>
                </div>
                <SparkChart data={history.map(h => h.stress)} color="#EAB308" height={50} />
              </Card>
            </div>
          )}

          {/* === SLEEP TAB === */}
          {activeTab === 'sleep' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card className="p-6 bg-indigo-500/5 border-none rounded-[2rem] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="w-6 h-6 text-indigo-400" />
                    <div>
                      <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Last Night Sleep</p>
                      <p className="text-3xl font-black tabular-nums">{latest.sleep}<span className="text-sm opacity-30 ml-1">hrs</span></p>
                    </div>
                  </div>
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-none text-[8px] font-bold uppercase">Good</Badge>
                </div>
                {/* Sleep breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '25%' }} />
                    </div>
                    <span className="text-[9px] w-14 text-right font-bold tabular-nums opacity-40">Deep 1.8h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: '45%' }} />
                    </div>
                    <span className="text-[9px] w-14 text-right font-bold tabular-nums opacity-40">Light 3.2h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: '20%' }} />
                    </div>
                    <span className="text-[9px] w-14 text-right font-bold tabular-nums opacity-40">REM 1.4h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-white/20 rounded-full" style={{ width: '10%' }} />
                    </div>
                    <span className="text-[9px] w-14 text-right font-bold tabular-nums opacity-40">Awake 0.8h</span>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-purple-500/5 border-none rounded-[2rem] space-y-3">
                <div className="flex items-center gap-3">
                  <Smile className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Morning Mood</p>
                    <p className="text-xl font-black">{MOOD_LABELS[latest.mood]}</p>
                  </div>
                </div>
                <SparkChart data={history.map(h => h.mood)} color="#A855F7" height={40} />
              </Card>
            </div>
          )}

          {/* === ACTIVITY TAB === */}
          {activeTab === 'activity' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card className="p-6 bg-green-500/5 border-none rounded-[2rem] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Footprints className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Steps Today</p>
                      <p className="text-3xl font-black tabular-nums">{latest.steps.toLocaleString()}</p>
                    </div>
                  </div>
                  <TrendIndicator current={latest.steps} previous={earlier.steps} />
                </div>
                <SparkChart data={history.map(h => h.steps)} color="#22C55E" height={60} />
                <div className="flex justify-between text-[8px] opacity-20 font-bold tabular-nums">
                  {history.filter((_, i) => i % 3 === 0).map(h => <span key={h.time}>{h.time}</span>)}
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-5 bg-orange-500/5 border-none rounded-[1.5rem] space-y-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-400" />
                    <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Movement</p>
                  </div>
                  <p className="text-xl font-black tabular-nums">{latest.movement}<span className="text-[9px] opacity-30 ml-0.5">%</span></p>
                  <SparkChart data={history.map(h => h.movement)} color="#F97316" height={30} />
                </Card>

                <Card className="p-5 bg-cyan-500/5 border-none rounded-[1.5rem] space-y-3">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-cyan-400" />
                    <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Inclination</p>
                  </div>
                  <p className="text-xl font-black tabular-nums">{latest.inclination}<span className="text-[9px] opacity-30 ml-0.5">deg</span></p>
                  <SparkChart data={history.map(h => h.inclination)} color="#06B6D4" height={30} />
                </Card>
              </div>
            </div>
          )}

          {/* === ENVIRONMENT TAB === */}
          {activeTab === 'environment' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card className="p-6 bg-blue-500/5 border-none rounded-[2rem] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Body Temperature</p>
                      <p className="text-3xl font-black tabular-nums">{biometrics.temp}<span className="text-sm opacity-30 ml-1">°C</span></p>
                    </div>
                  </div>
                  <TrendIndicator current={Math.round(latest.temp * 10)} previous={Math.round(earlier.temp * 10)} />
                </div>
                <SparkChart data={history.map(h => h.temp)} color="#3B82F6" height={60} />
              </Card>

              <Card className="p-6 bg-teal-500/5 border-none rounded-[2rem] space-y-4">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-[8px] uppercase font-bold tracking-widest opacity-40">Humidity</p>
                    <p className="text-2xl font-black tabular-nums">{latest.humidity}<span className="text-sm opacity-30 ml-1">%</span></p>
                  </div>
                </div>
                <SparkChart data={history.map(h => h.humidity)} color="#14B8A6" height={50} />
              </Card>
            </div>
          )}

          {/* === IMPACT TAB === */}
          {activeTab === 'impact' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <header className="px-2 space-y-1">
                <h4 className="text-xl font-black tracking-tight">Efficacy Analysis</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Correlation: Movement vs Fragrance Recovery</p>
              </header>

              <Card className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10 mb-2">
                   <div className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-[8px] font-bold opacity-40 uppercase">Heart Rate</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span className="text-[8px] font-bold opacity-40 uppercase">Stress</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-400/30" />
                        <span className="text-[8px] font-bold opacity-40 uppercase">Movement</span>
                      </div>
                   </div>
                </div>

                <ImpactAnalysisChart data={history} doses={DOSE_HISTORY} />
                
                <div className="mt-6 p-4 bg-brand-accent/5 rounded-2xl border border-brand-accent/20 flex gap-4 items-center">
                  <div className="w-10 h-10 bg-brand-accent/20 rounded-xl flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Neuro-Analysis Insight</p>
                    <p className="text-[11px] text-white/80 leading-relaxed font-medium">
                      Dosage at 14:05 successfully mitigated a potential stress peak. <span className="text-brand-accent">HR recovery was 18% faster</span> compared to unmanaged cycles.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-5 bg-white/[0.03] border-none rounded-[1.8rem] space-y-2">
                  <p className="text-[8px] uppercase font-bold tracking-widest opacity-30">Avg. Recovery Time</p>
                  <p className="text-2xl font-black text-green-400">12.4<span className="text-[10px] ml-1">mins</span></p>
                  <p className="text-[9px] opacity-40 font-medium italic">-2.1m from baseline</p>
                </Card>
                <Card className="p-5 bg-white/[0.03] border-none rounded-[1.8rem] space-y-2">
                  <p className="text-[8px] uppercase font-bold tracking-widest opacity-30">Stress Inhibition</p>
                  <p className="text-2xl font-black text-yellow-400">84<span className="text-[10px] ml-1">%</span></p>
                  <p className="text-[9px] opacity-40 font-medium italic">High efficacy rating</p>
                </Card>
              </div>

              <section className="space-y-3">
                <h5 className="text-[9px] font-black uppercase tracking-widest px-2 opacity-30">Dosage Event Logs</h5>
                <div className="space-y-2">
                  {DOSE_HISTORY.slice(0, 3).map((dose, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-[10px] opacity-40">{dose.time}</div>
                        <div>
                          <p className="text-xs font-bold">{dose.variant}</p>
                          <p className="text-[9px] opacity-30 uppercase tracking-tighter">Impact: High Stability</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-20" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )
}
        </section>

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
                   <h4 className="font-bold text-base leading-tight">{activeDevice === 'ApexEssence' ? 'Necklace' : activeDevice === 'Synapse' ? 'Bracelet' : 'Ring'}</h4>
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
                   <h4 className="font-bold text-base leading-tight">{getFragrance()?.name || 'No Fragrance'}</h4>
                   <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Active Fragrance</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-20" />
            </div>
          </Card>

          {/* Subscription status */}
          {subscriptionPlan !== 'none' && (
            <Card className="p-5 bg-brand-accent/5 border border-brand-accent/20 rounded-[2rem] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                    <Crown className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{SUBSCRIPTION_PLANS[subscriptionPlan as keyof typeof SUBSCRIPTION_PLANS]?.name}</h4>
                    <p className="text-[10px] text-white/40">€{SUBSCRIPTION_PLANS[subscriptionPlan as keyof typeof SUBSCRIPTION_PLANS]?.monthlyPrice}/mo</p>
                  </div>
                </div>
                <Badge className="bg-brand-accent text-background text-[7px] font-black uppercase border-none">Active</Badge>
              </div>
              <p className="text-[10px] text-white/30 italic">{SUBSCRIPTION_PLANS[subscriptionPlan as keyof typeof SUBSCRIPTION_PLANS]?.desc}</p>
            </Card>
          )}
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
