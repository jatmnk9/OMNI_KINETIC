"use client";

import React, { useState } from 'react';
import { Activity, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BurstButtonProps {
  onBurst: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export function BurstButton({ onBurst, disabled = false, compact = false }: BurstButtonProps) {
  const [firing, setFiring] = useState(false);

  const handleClick = () => {
    if (firing || disabled) return;
    setFiring(true);
    onBurst();
    setTimeout(() => setFiring(false), 2000);
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={firing || disabled}
        className={cn(
          "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 overflow-hidden",
          firing 
            ? "bg-omni-orange scale-90 shadow-[0_0_30px_hsl(var(--omni-orange)/0.5)]" 
            : "bg-white/10 hover:bg-white/20 active:scale-90 border border-white/10"
        )}
      >
        {firing ? (
          <>
            <Wind className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 bg-white/20 animate-ping rounded-2xl" />
          </>
        ) : (
          <Activity className="w-5 h-5 text-omni-orange" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={firing || disabled}
      className={cn(
        "w-full h-20 rounded-[1.8rem] font-black tracking-[0.3em] uppercase transition-all duration-700 overflow-hidden relative shadow-2xl",
        firing 
          ? 'bg-omni-orange text-white scale-95' 
          : 'bg-brand text-accent-foreground hover:-translate-y-1 active:scale-95'
      )}
    >
      {firing ? (
        <span className="flex items-center justify-center gap-4 animate-pulse relative z-10">
          <Wind className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} /> Releasing Dose
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2 relative z-10">
          <Activity className="w-5 h-5 opacity-60" /> Trigger Burst
        </span>
      )}
      
      {/* Wave expansion effect */}
      {firing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full bg-white/20 animate-ping absolute rounded-full" />
          <div className="w-full h-full bg-white/10 scale-150 animate-pulse absolute rounded-full" />
        </div>
      )}
    </button>
  );
}
