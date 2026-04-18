"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Music, Play, Pause, ChevronRight, WifiOff } from 'lucide-react';
import type { MusicState } from '@/lib/device-context';
import { cn } from '@/lib/utils';

interface MusicSyncWidgetProps {
  music: MusicState;
  bpm?: number;
  compact?: boolean;
  connected?: boolean;
  onPlayPause?: () => void;
  clickable?: boolean;
}

function ServiceIcon({ service, size = 14 }: { service: MusicState['service']; size?: number }) {
  const colors = {
    spotify: '#1DB954',
    apple: '#FC3C44',
    youtube: '#FF0000',
  };
  const labels = {
    spotify: 'Spotify',
    apple: 'Apple Music',
    youtube: 'YouTube Music',
  };

  return (
    <div 
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" 
      style={{ background: `${colors[service]}15` }}
    >
      <div 
        className="rounded-full" 
        style={{ width: size * 0.6, height: size * 0.6, background: colors[service] }} 
      />
      <span 
        className="text-[8px] font-bold uppercase tracking-wider" 
        style={{ color: colors[service] }}
      >
        {labels[service]}
      </span>
    </div>
  );
}

function EQVisualizer({ isPlaying, color }: { isPlaying: boolean; color: string }) {
  return (
    <div className="flex items-end gap-[2px] h-5">
      {[0, 0.15, 0.3, 0.05, 0.2, 0.1, 0.25].map((delay, i) => (
        <div
          key={i}
          className={cn("w-[2px] rounded-full transition-all duration-300", isPlaying ? "eq-bar" : "h-[3px]")}
          style={{
            '--eq-speed': `${0.5 + Math.random() * 0.5}s`,
            '--eq-delay': `${delay}s`,
            background: color,
            minHeight: 3,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function MusicSyncWidget({ 
  music, 
  bpm, 
  compact = false, 
  connected = true,
  onPlayPause,
  clickable = false,
}: MusicSyncWidgetProps) {
  const router = useRouter();

  const handleClick = () => {
    if (clickable) router.push('/music');
  };

  // Disconnected state — prompt to connect
  if (!connected) {
    return (
      <div 
        className={cn(
          "glass-premium rounded-[2rem] p-5 flex items-center gap-4 transition-all duration-300",
          clickable && "cursor-pointer hover:bg-white/[0.06] group"
        )}
        onClick={handleClick}
      >
        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
          <WifiOff className="w-6 h-6 text-white/20" />
        </div>
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-sm font-bold opacity-40">Music not connected</p>
          <p className="text-[10px] text-white/20">Tap to configure Audio-Scent Sync</p>
        </div>
        {clickable && (
          <ChevronRight className="w-5 h-5 opacity-10 group-hover:opacity-40 transition-opacity shrink-0" />
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div 
        className={cn(
          "flex items-center gap-3 p-3 glass-premium rounded-2xl max-w-[220px]",
          clickable && "cursor-pointer hover:bg-white/[0.06]"
        )}
        onClick={handleClick}
      >
        <EQVisualizer isPlaying={music.isPlaying} color={music.coverColor} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold truncate text-white">{music.track}</p>
          <p className="text-[8px] opacity-40 truncate">{music.artist}</p>
        </div>
        {bpm && (
          <span className="text-[9px] font-black tabular-nums text-omni-orange animate-heartbeat-sync">
            {bpm}
          </span>
        )}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "glass-premium rounded-[2rem] p-5 space-y-4 transition-all duration-300",
        clickable && "cursor-pointer hover:bg-white/[0.06] group"
      )}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 opacity-40" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Audio-Scent Sync</span>
        </div>
        <div className="flex items-center gap-2">
          <ServiceIcon service={music.service} />
          {clickable && (
            <ChevronRight className="w-4 h-4 opacity-10 group-hover:opacity-40 transition-opacity" />
          )}
        </div>
      </div>

      {/* Track info */}
      <div className="flex items-center gap-4">
        {/* Album art placeholder with EQ */}
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0"
          style={{ background: `${music.coverColor}20` }}
        >
          <EQVisualizer isPlaying={music.isPlaying} color={music.coverColor} />
          <div 
            className="absolute inset-0 opacity-10 animate-pulse" 
            style={{ background: `radial-gradient(circle, ${music.coverColor} 0%, transparent 70%)` }} 
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h4 className="text-sm font-bold truncate tracking-tight">{music.track}</h4>
          <p className="text-[10px] text-muted-foreground truncate font-medium">{music.artist}</p>
        </div>

        {/* Play/Pause mini button */}
        {onPlayPause && (
          <button 
            onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-90 shrink-0"
          >
            {music.isPlaying ? (
              <Pause className="w-4 h-4" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            )}
          </button>
        )}

        {/* BPM badge */}
        {bpm && !onPlayPause && (
          <div className="flex flex-col items-center shrink-0">
            <span className="text-lg font-black tabular-nums text-omni-orange animate-heartbeat-sync">{bpm}</span>
            <span className="text-[7px] uppercase tracking-widest opacity-30 font-bold">BPM</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ 
              width: `${music.progress}%`, 
              background: `linear-gradient(90deg, ${music.coverColor}80, ${music.coverColor})` 
            }}
          />
        </div>
      </div>
    </div>
  );
}
