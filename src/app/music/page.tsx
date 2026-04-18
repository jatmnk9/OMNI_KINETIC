"use client";

import React from 'react';
import {
  Music,
  Headphones,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Wifi,
  WifiOff,
  BrainCircuit,
  Hand,
  ListMusic,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useDevice, ALL_TRACKS_BY_SERVICE } from '@/lib/device-context';
import type { MusicService } from '@/lib/device-context';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { cn } from '@/lib/utils';

const SERVICES: { id: MusicService; name: string; color: string; bg: string }[] = [
  { id: 'spotify', name: 'Spotify', color: '#1DB954', bg: '#1DB95415' },
  { id: 'apple', name: 'Apple Music', color: '#FC3C44', bg: '#FC3C4415' },
  { id: 'youtube', name: 'YouTube Music', color: '#FF0000', bg: '#FF000015' },
];

function EQVisualizerLarge({ isPlaying, color }: { isPlaying: boolean; color: string }) {
  return (
    <div className="flex items-end justify-center gap-[3px] h-16">
      {[0, 0.1, 0.2, 0.05, 0.15, 0.25, 0.08, 0.18, 0.12, 0.22, 0.03, 0.13].map((delay, i) => (
        <div
          key={i}
          className={cn(
            "w-[3px] rounded-full transition-all duration-300",
            isPlaying ? "eq-bar" : "h-[4px]"
          )}
          style={{
            '--eq-speed': `${0.4 + Math.random() * 0.6}s`,
            '--eq-delay': `${delay}s`,
            background: color,
            minHeight: 4,
            opacity: isPlaying ? 0.8 : 0.2,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function MusicPage() {
  const {
    musicState,
    musicConnected,
    musicAIMode,
    selectedService,
    setSelectedService,
    toggleMusicConnection,
    toggleMusicAIMode,
    musicTogglePlayPause,
    musicNext,
    musicPrev,
    biometrics,
  } = useDevice();

  const currentServiceConfig = SERVICES.find(s => s.id === selectedService)!;
  const tracks = ALL_TRACKS_BY_SERVICE[selectedService];

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground">
      <Header />

      <div className="max-w-lg mx-auto p-6 space-y-8">
        {/* Page title */}
        <header className="space-y-1">
          <h1 className="text-3xl font-headline font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-accent">
            Audio-Scent Sync
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">
            Music Synchronization Module
          </p>
        </header>

        {/* === SERVICE SELECTOR === */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
            <Headphones className="w-3 h-3" /> Streaming Service
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {SERVICES.map((service) => {
              const isActive = selectedService === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={cn(
                    "relative p-4 rounded-[1.5rem] flex flex-col items-center gap-2 transition-all duration-500 overflow-hidden border",
                    isActive
                      ? "scale-[1.02] shadow-lg"
                      : "bg-white/[0.02] border-white/5 opacity-50 hover:opacity-80"
                  )}
                  style={isActive ? {
                    borderColor: `${service.color}40`,
                    background: service.bg,
                    boxShadow: `0 0 30px ${service.color}15`,
                  } : undefined}
                >
                  <Music className="w-6 h-6" style={isActive ? { color: service.color } : { opacity: 0.4 }} />
                  <span
                    className="text-[9px] font-black uppercase tracking-wider"
                    style={isActive ? { color: service.color } : undefined}
                  >
                    {service.name}
                  </span>
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full"
                      style={{ background: service.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* === CONNECTION TOGGLE === */}
        <Card className={cn(
          "p-5 rounded-[2rem] flex items-center justify-between transition-all duration-500 border",
          musicConnected
            ? "border-green-500/20 bg-green-500/5"
            : "bg-white/[0.03] border-white/5"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
              musicConnected
                ? "bg-green-500/20"
                : "bg-white/5"
            )}>
              {musicConnected ? (
                <Wifi className="w-6 h-6 text-green-400" />
              ) : (
                <WifiOff className="w-6 h-6 text-white/30" />
              )}
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bold text-sm tracking-tight">
                {musicConnected ? 'Connected' : 'Disconnected'}
              </h3>
              <p className="text-[10px] text-white/30">
                {musicConnected
                  ? `Playing from ${currentServiceConfig.name}`
                  : 'Tap to connect your streaming service'}
              </p>
            </div>
          </div>
          <Switch
            checked={musicConnected}
            onCheckedChange={toggleMusicConnection}
          />
        </Card>

        {/* === NOW PLAYING === */}
        {musicConnected && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Album art / visualizer */}
            <Card
              className="p-8 rounded-[2.5rem] border-none relative overflow-hidden"
              style={{ background: `${musicState.coverColor}08` }}
            >
              {/* Big ambient glow */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${musicState.coverColor}30 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10 flex flex-col items-center space-y-6">
                {/* EQ Visualizer */}
                <div
                  className="w-32 h-32 rounded-3xl flex items-center justify-center relative"
                  style={{ background: `${musicState.coverColor}15` }}
                >
                  <EQVisualizerLarge isPlaying={musicState.isPlaying} color={musicState.coverColor} />
                  <div
                    className="absolute inset-0 rounded-3xl animate-pulse opacity-20"
                    style={{ background: `radial-gradient(circle, ${musicState.coverColor} 0%, transparent 70%)` }}
                  />
                </div>

                {/* Track info */}
                <div className="text-center space-y-1 w-full">
                  <h3 className="text-xl font-black tracking-tight truncate">{musicState.track}</h3>
                  <p className="text-sm text-muted-foreground font-medium truncate">{musicState.artist}</p>
                </div>

                {/* BPM + Service badge */}
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="text-[9px] font-black uppercase tracking-widest px-3 border-white/10"
                  >
                    <span className="animate-heartbeat-sync" style={{ color: musicState.coverColor }}>
                      {musicState.bpm}
                    </span>
                    <span className="ml-1 opacity-40">BPM</span>
                  </Badge>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ background: `${musicState.coverColor}15` }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: musicState.coverColor }}
                    />
                    <span
                      className="text-[8px] font-bold uppercase tracking-wider"
                      style={{ color: musicState.coverColor }}
                    >
                      {currentServiceConfig.name}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest px-3 border-white/10 opacity-40">
                    {musicState.duration}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="w-full space-y-2">
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-linear"
                      style={{
                        width: `${musicState.progress}%`,
                        background: `linear-gradient(90deg, ${musicState.coverColor}80, ${musicState.coverColor})`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] tabular-nums opacity-30 font-bold">
                    <span>{formatTime(musicState.progress, musicState.duration)}</span>
                    <span>{musicState.duration}</span>
                  </div>
                </div>

                {/* Transport controls */}
                <div className="flex items-center gap-6">
                  <button
                    onClick={musicPrev}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all active:scale-90"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={musicTogglePlayPause}
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-xl",
                      musicState.isPlaying
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-white text-black hover:bg-white/90"
                    )}
                    style={musicState.isPlaying ? {
                      boxShadow: `0 0 30px ${musicState.coverColor}40`,
                    } : undefined}
                  >
                    {musicState.isPlaying ? (
                      <Pause className="w-7 h-7" fill="currentColor" />
                    ) : (
                      <Play className="w-7 h-7 ml-1" fill="currentColor" />
                    )}
                  </button>

                  <button
                    onClick={musicNext}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all active:scale-90"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* === AI MODE TOGGLE === */}
        {musicConnected && (
          <Card className={cn(
            "p-5 rounded-[2rem] flex items-center justify-between transition-all duration-500 border",
            musicAIMode
              ? "border-blue-500/20 bg-blue-500/5"
              : "bg-white/[0.03] border-white/5"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                musicAIMode ? "bg-blue-500/20" : "bg-white/5"
              )}>
                {musicAIMode ? (
                  <BrainCircuit className="w-6 h-6 text-blue-400 animate-pulse" />
                ) : (
                  <Hand className="w-6 h-6 text-white/40" />
                )}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm tracking-tight">
                  {musicAIMode ? 'AI Picks Music' : 'Manual Control'}
                </h3>
                <p className="text-[10px] text-white/30 max-w-[200px]">
                  {musicAIMode
                    ? 'AI mixes tracks based on your real-time biometrics'
                    : 'You control the playlist manually'}
                </p>
              </div>
            </div>
            <Switch
              checked={musicAIMode}
              onCheckedChange={toggleMusicAIMode}
            />
          </Card>
        )}

        {/* === AI STATUS === */}
        {musicConnected && musicAIMode && (
          <Card className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-[1.5rem] animate-in fade-in duration-500">
            <p className="text-[10px] text-blue-300 italic leading-relaxed">
              &ldquo;Current HRV: {biometrics.hrv}ms — Stress: {biometrics.stress}.
              {biometrics.stress === 'High'
                ? ' Selecting low-intensity tracks to reduce cortisol.'
                : biometrics.stress === 'Medium'
                ? ' Maintaining moderate rhythm to balance energy.'
                : ' Optimizing BPM to maximize cognitive performance.'}
              &rdquo;
            </p>
          </Card>
        )}

        {/* === QUEUE / PLAYLIST === */}
        {musicConnected && (
          <section className="space-y-4 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
              <ListMusic className="w-3 h-3" /> 
              {musicAIMode ? 'Biometric AI Queue' : 'Playlist'} — {currentServiceConfig.name}
            </h2>
            <div className="space-y-2">
              {tracks.map((track, idx) => {
                const isCurrent = musicState.trackIndex === idx && musicConnected;
                return (
                  <Card
                    key={idx}
                    className={cn(
                      "p-4 border-none rounded-[1.3rem] flex items-center gap-4 transition-all duration-300 cursor-pointer group",
                      isCurrent
                        ? "bg-white/10 ring-1 ring-white/10"
                        : "bg-white/[0.02] hover:bg-white/[0.05]"
                    )}
                  >
                    {/* Track number or EQ */}
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                      {isCurrent && musicState.isPlaying ? (
                        <div className="flex items-end gap-[2px] h-4">
                          {[0, 0.15, 0.3].map((d, i) => (
                            <div
                              key={i}
                              className="w-[2px] rounded-full eq-bar"
                              style={{
                                '--eq-speed': `${0.5 + i * 0.15}s`,
                                '--eq-delay': `${d}s`,
                                background: musicState.coverColor,
                                minHeight: 3,
                              } as React.CSSProperties}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className={cn(
                          "text-[11px] font-bold tabular-nums",
                          isCurrent ? "text-white" : "opacity-20"
                        )}>
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Track info */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className={cn(
                        "text-sm font-bold truncate tracking-tight",
                        isCurrent && "text-white"
                      )}>
                        {track.track}
                      </p>
                      <p className="text-[10px] text-white/30 truncate">{track.artist}</p>
                    </div>

                    {/* BPM + Duration */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[9px] font-bold tabular-nums opacity-20">{track.bpm} BPM</span>
                      <span className="text-[9px] tabular-nums opacity-20">{track.duration}</span>
                    </div>

                    {isCurrent && (
                      <div
                        className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                        style={{ background: musicState.coverColor, boxShadow: `0 0 8px ${musicState.coverColor}` }}
                      />
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* === NOT CONNECTED STATE === */}
        {!musicConnected && (
          <Card className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-center space-y-5 animate-in fade-in duration-500">
            <Music className="w-12 h-12 mx-auto text-white/10" />
            <div className="space-y-1">
              <h3 className="font-bold text-lg opacity-50">No music connection</h3>
              <p className="text-[10px] text-white/20 max-w-[240px] mx-auto leading-relaxed">
                Select your streaming service and enable the connection to synchronize music with your biometrics
              </p>
            </div>
            <Button
              onClick={toggleMusicConnection}
              className="mx-auto h-14 px-8 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-2xl shadow-xl hover:bg-white/90 active:scale-95 transition-all"
            >
              <Wifi className="w-4 h-4 mr-2" /> Connect {currentServiceConfig.name}
            </Button>
          </Card>
        )}
      </div>
      <Navigation />
    </main>
  );
}

// Utility: calculate elapsed time from progress percentage and duration string
function formatTime(progress: number, duration: string): string {
  const parts = duration.split(':');
  const totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  const elapsed = Math.floor((progress / 100) * totalSeconds);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
