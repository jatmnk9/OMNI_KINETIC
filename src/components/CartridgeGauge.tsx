"use client";

import React from 'react';

interface CartridgeGaugeProps {
  level: number;
  daysLeft: number;
  size?: number;
  strokeWidth?: number;
  mini?: boolean;
}

export function CartridgeGauge({ level, daysLeft, size = 180, strokeWidth = 8, mini = false }: CartridgeGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  if (mini) {
    const miniSize = 64;
    const miniRadius = (miniSize - 5) / 2;
    const miniCirc = 2 * Math.PI * miniRadius;
    const miniOffset = miniCirc - (level / 100) * miniCirc;

    return (
      <div className="relative flex items-center justify-center" style={{ width: miniSize, height: miniSize }}>
        <svg width={miniSize} height={miniSize} className="ring-glow-orange -rotate-90">
          <circle
            cx={miniSize / 2}
            cy={miniSize / 2}
            r={miniRadius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={4}
          />
          <circle
            cx={miniSize / 2}
            cy={miniSize / 2}
            r={miniRadius}
            fill="none"
            stroke="hsl(var(--omni-orange))"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={miniCirc}
            strokeDashoffset={miniOffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-[11px] font-black text-omni-orange tabular-nums">{Math.round(level)}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Ambient glow behind the ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="rounded-full blur-3xl animate-scale-breathe" 
          style={{ 
            width: size * 0.7, 
            height: size * 0.7, 
            background: 'radial-gradient(circle, hsl(21 91% 54% / 0.25) 0%, transparent 70%)' 
          }} 
        />
      </div>

      {/* SVG Ring */}
      <svg width={size} height={size} className="ring-glow-orange -rotate-90 relative z-10">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Dot markers every 10% */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * 2 * Math.PI - Math.PI / 2;
          const dotR = radius;
          const cx = size / 2 + dotR * Math.cos(angle);
          const cy = size / 2 + dotR * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={1.5}
              fill={i * 10 < level ? 'hsl(var(--omni-orange))' : 'rgba(255,255,255,0.1)'}
              className="transition-colors duration-500"
            />
          );
        })}
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#orangeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F37021" />
            <stop offset="50%" stopColor="#FF8C42" />
            <stop offset="100%" stopColor="#F37021" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-4xl font-black tabular-nums text-white tracking-tighter">
          {Math.round(level)}
          <span className="text-lg opacity-40 ml-0.5">%</span>
        </span>
        <div className="h-px w-10 bg-gradient-to-r from-transparent via-omni-orange/40 to-transparent my-1.5" />
        <span className="text-[10px] font-bold text-omni-orange tracking-wider uppercase">
          {daysLeft} days left
        </span>
        <span className="text-[8px] text-white/30 mt-0.5 font-medium">at your current pace</span>
      </div>
    </div>
  );
}
