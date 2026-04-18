"use client";

import React from 'react';
import { 
  BrainCircuit, 
  Clock, 
  Hand, 
  Zap, 
  Bell, 
  Timer,
  Check,
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { BurstButton } from '@/components/BurstButton';
import type { ControlMode, ScheduledDose } from '@/lib/device-context';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  controlMode: ControlMode;
  setControlMode: (mode: ControlMode) => void;
  scheduledDoses: ScheduledDose[];
  setScheduledDoses: (doses: ScheduledDose[]) => void;
  onBurst: () => void;
  biometrics: { hrv: number; stress: string; temp: number };
}

function ModeToggle({ controlMode, setControlMode }: { controlMode: ControlMode; setControlMode: (m: ControlMode) => void }) {
  const modes: { id: ControlMode; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'smart', label: 'Smart', icon: BrainCircuit, color: 'text-blue-400' },
    { id: 'habit', label: 'Habit', icon: Clock, color: 'text-yellow-400' },
    { id: 'manual', label: 'Manual', icon: Hand, color: 'text-omni-orange' },
  ];

  return (
    <div className="flex bg-white/5 rounded-2xl p-1.5 gap-1">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = controlMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => setControlMode(mode.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl transition-all duration-500 text-[10px] font-bold uppercase tracking-wider",
              isActive 
                ? "bg-white/10 shadow-lg scale-[1.02]" 
                : "opacity-40 hover:opacity-70"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive && mode.color)} />
            <span className={cn(isActive && "text-white")}>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ControlPanel({ controlMode, setControlMode, scheduledDoses, setScheduledDoses, onBurst, biometrics }: ControlPanelProps) {
  const [burstInterval, setBurstInterval] = React.useState([4]);
  const [ignoreSensors, setIgnoreSensors] = React.useState(false);

  const toggleDoseAccepted = (index: number) => {
    const updated = [...scheduledDoses];
    updated[index] = { ...updated[index], accepted: !updated[index].accepted };
    setScheduledDoses(updated);
  };

  const doseTypeColors: Record<string, string> = {
    activation: 'text-yellow-400 bg-yellow-500/10',
    recovery: 'text-green-400 bg-green-500/10',
    focus: 'text-blue-400 bg-blue-500/10',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-2">
          <Zap className="w-3 h-3 text-brand-accent" /> Freedom Toggle
        </h2>
        <p className="text-[10px] text-white/30 font-medium">Control your device autonomy level</p>
      </div>

      {/* Mode Toggle */}
      <ModeToggle controlMode={controlMode} setControlMode={setControlMode} />

      {/* Mode-specific content */}
      {controlMode === 'smart' && (
        <Card className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[2rem] space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-blue-400">Biometric Autopilot</h3>
              <p className="text-[10px] text-white/40 leading-relaxed mt-0.5">
                AI controls dosing based on your real-time telemetry
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-[8px] uppercase opacity-40 font-bold">HRV</p>
              <p className="text-sm font-black tabular-nums">{biometrics.hrv}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-[8px] uppercase opacity-40 font-bold">Stress</p>
              <p className="text-sm font-black">{biometrics.stress}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-[8px] uppercase opacity-40 font-bold">Temp</p>
              <p className="text-sm font-black tabular-nums">{biometrics.temp}°</p>
            </div>
          </div>

          <div className="bg-blue-500/5 rounded-xl p-3 border border-blue-500/10">
            <p className="text-[10px] text-blue-300 italic leading-relaxed">
              &ldquo;Elevated activity pattern detected. Performance dose optimized for the next 45 minutes.&rdquo;
            </p>
          </div>
        </Card>
      )}

      {controlMode === 'habit' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Card className="p-5 bg-yellow-500/5 border border-yellow-500/10 rounded-[2rem] space-y-3">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-yellow-400" />
              <div>
                <h3 className="font-bold text-sm text-yellow-400">Suggested Schedule</h3>
                <p className="text-[10px] text-white/40">Based on your biometric patterns</p>
              </div>
            </div>
            <p className="text-[10px] text-yellow-300/70 italic bg-yellow-500/5 p-3 rounded-xl border border-yellow-500/10">
              &ldquo;We noticed consistent aquatic activity at 7 AM and elevated heart rate on Thursday evenings.&rdquo;
            </p>
          </Card>

          {scheduledDoses.map((dose, idx) => (
            <Card 
              key={idx}
              className={cn(
                "p-4 border-none rounded-[1.5rem] flex items-center gap-4 transition-all duration-300",
                dose.accepted ? "bg-white/5" : "bg-white/[0.02] opacity-60"
              )}
            >
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", doseTypeColors[dose.type])}>
                <Timer className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tabular-nums">{dose.time}</span>
                  <Badge variant="outline" className="text-[7px] uppercase tracking-widest border-white/10 px-1.5 py-0">
                    {dose.type}
                  </Badge>
                </div>
                <p className="text-[10px] text-white/40 truncate">{dose.label}</p>
              </div>
              <button
                onClick={() => toggleDoseAccepted(idx)}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0",
                  dose.accepted ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/20 hover:text-white/50"
                )}
              >
                {dose.accepted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </button>
            </Card>
          ))}
        </div>
      )}

      {controlMode === 'manual' && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Burst Button */}
          <BurstButton onBurst={onBurst} />

          {/* Interval Programming */}
          <Card className="p-5 bg-white/5 border-none rounded-[2rem] space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold tracking-tight">Fixed Interval</h3>
                <p className="text-[10px] text-white/30">Auto-trigger every set period</p>
              </div>
              <span className="text-xl font-black text-omni-orange tabular-nums">
                {burstInterval[0]}h
              </span>
            </div>
            <Slider 
              value={burstInterval} 
              onValueChange={setBurstInterval}
              min={1} 
              max={12} 
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-[8px] uppercase tracking-widest opacity-20 font-bold">
              <span>1h</span>
              <span>6h</span>
              <span>12h</span>
            </div>
          </Card>

          {/* Ignore sensors toggle */}
          <Card className="p-5 bg-white/5 border-none rounded-[2rem] flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold tracking-tight">Ignore Sensors</h3>
              <p className="text-[10px] text-white/30">Disable biometric reading</p>
            </div>
            <Switch 
              checked={ignoreSensors} 
              onCheckedChange={setIgnoreSensors}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
