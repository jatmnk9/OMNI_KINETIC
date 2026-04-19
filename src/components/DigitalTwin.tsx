"use client";

import React, { useRef, useEffect } from 'react';
import type { ControlMode } from '@/lib/device-context';
import { cn } from '@/lib/utils';

interface DigitalTwinProps {
  hrv: number;
  stress: string;
  temp: number;
  bpm: number;
  controlMode: ControlMode;
  isPlaying: boolean;
  coverColor: string;
}

export function DigitalTwin({ hrv, stress, temp, bpm, controlMode, isPlaying, coverColor }: DigitalTwinProps) {
  const stressColor = stress === 'High' ? '#F97316' : stress === 'Medium' ? '#EAB308' : '#22C55E';
  const isSmartMode = controlMode === 'smart';
  const heartbeatDuration = bpm > 0 ? (60 / bpm) : 1;

  // === CHROMA KEY: remove green screen from video ===
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animFrame: number;
    let running = true;

    const processFrame = () => {
      if (!running) return;
      if (video.paused || video.ended || video.videoWidth === 0) {
        animFrame = requestAnimationFrame(processFrame);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Green screen detection: green channel dominant
        if (g > 80 && g > r * 1.3 && g > b * 1.3) {
          data[i + 3] = 0; // fully transparent
        } else if (g > 60 && g > r * 1.15 && g > b * 1.15) {
          // Soft edge: partially transparent for smoother blending
          data[i + 3] = Math.floor(data[i + 3] * 0.4);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animFrame = requestAnimationFrame(processFrame);
    };

    const onPlay = () => processFrame();
    video.addEventListener('play', onPlay);

    // Start processing if video is already playing
    if (!video.paused) processFrame();

    // Also try to start on loadeddata
    const onLoaded = () => {
      if (!video.paused) processFrame();
    };
    video.addEventListener('loadeddata', onLoaded);

    return () => {
      running = false;
      cancelAnimationFrame(animFrame);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('loadeddata', onLoaded);
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full aspect-square max-w-[290px] mx-auto">
      {/* Outermost orbital ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={cn(
            "w-full h-full rounded-full border transition-all duration-1000",
            isSmartMode ? "border-white/5" : "border-white/3"
          )}
          style={{ 
            animation: isSmartMode ? `spin 30s linear infinite` : 'none',
          }}
        >
          {[0, 90, 180, 270].map((deg) => (
            <div
              key={deg}
              className="absolute w-1.5 h-1.5 rounded-full bg-brand-accent/40"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${deg}deg) translateX(${145 * 0.5}px) translateY(-50%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Inner glow ring */}
      <div className="absolute inset-6 flex items-center justify-center">
        <div 
          className="w-full h-full rounded-full transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle, ${coverColor}08 0%, transparent 70%)`,
            boxShadow: isSmartMode ? `0 0 60px ${coverColor}15, inset 0 0 40px ${coverColor}08` : 'none',
          }}
        />
      </div>

      {/* Particle ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * 360;
          const distance = 95 + Math.random() * 20;
          return (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-float-particle"
              style={{
                background: i % 2 === 0 ? coverColor : stressColor,
                opacity: 0.4,
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translateX(${distance}px)`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            />
          );
        })}
      </div>

      {/* Central character video with chroma key */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={cn(
            "relative transition-all duration-700",
            isSmartMode && isPlaying && "animate-heartbeat-sync"
          )}
          style={{ 
            animationDuration: isSmartMode ? `${heartbeatDuration}s` : undefined 
          }}
        >
          {/* Hidden source video */}
          <video
            key={isPlaying ? "dancing" : "idle"}
            ref={videoRef}
            src={isPlaying ? "/character_dancing.mp4" : "/character.mp4"}
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-0 h-0 opacity-0 pointer-events-none"
          />

          {/* Chroma-keyed canvas output */}
          <div className="w-[200px] h-[230px] rounded-[50%] overflow-hidden relative z-10">
            {/* Stress-colored background glow */}
            <div 
              className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
              style={{
                background: `radial-gradient(circle at 50% 55%, ${stressColor}35 0%, ${stressColor}15 40%, transparent 75%)`,
              }}
            />
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover relative z-10"
              style={{
                filter: `drop-shadow(0 0 25px ${stressColor}50)`,
              }}
            />
            {/* Soft vignette edge for blending */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-[50%] z-20 transition-all duration-[2000ms]"
              style={{
                background: `radial-gradient(circle, transparent 50%, ${stressColor}08 65%, rgba(0,0,0,0.4) 78%, rgba(0,0,0,0.95) 100%)`,
              }}
            />
          </div>

          {/* Data aura glow */}
          <div 
            className="absolute inset-0 rounded-full blur-3xl -z-10 transition-all duration-1000"
            style={{ 
              background: `radial-gradient(ellipse at center, ${stressColor}25 0%, ${coverColor}15 50%, transparent 80%)`,
            }}
          />

          {/* Pulsing stress ring */}
          <div 
            className="absolute -inset-2 rounded-full border -z-5 animate-pulse transition-colors duration-1000"
            style={{ 
              borderColor: `${stressColor}15`,
              boxShadow: `0 0 30px ${stressColor}10`,
            }}
          />
        </div>
      </div>

      {/* HRV floating label */}
      <div className="absolute top-4 right-2 glass-premium px-2.5 py-1 rounded-lg">
        <span className="text-[8px] font-bold uppercase tracking-wider opacity-50">HRV</span>
        <p className="text-[11px] font-black tabular-nums text-white">{hrv}<span className="text-[7px] opacity-30 ml-0.5">ms</span></p>
      </div>

      {/* Stress floating label */}
      <div className="absolute bottom-12 left-0 glass-premium px-2.5 py-1 rounded-lg">
        <span className="text-[8px] font-bold uppercase tracking-wider opacity-50">Stress</span>
        <p className="text-[11px] font-black" style={{ color: stressColor }}>{stress}</p>
      </div>

      {/* Temp floating label */}
      <div className="absolute bottom-12 right-0 glass-premium px-2.5 py-1 rounded-lg">
        <span className="text-[8px] font-bold uppercase tracking-wider opacity-50">Temp</span>
        <p className="text-[11px] font-black tabular-nums text-white">{temp}<span className="text-[7px] opacity-30 ml-0.5">°C</span></p>
      </div>

      {/* Mode indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className={cn(
          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] transition-colors duration-500",
          controlMode === 'smart' && "bg-blue-500/20 text-blue-400",
          controlMode === 'habit' && "bg-yellow-500/20 text-yellow-400",
          controlMode === 'manual' && "bg-omni-orange/20 text-omni-orange",
        )}>
          {controlMode === 'smart' && 'Autopilot'}
          {controlMode === 'habit' && 'Habit'}
          {controlMode === 'manual' && 'Manual'}
        </div>
      </div>
    </div>
  );
}
