
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Award, MapPin, Droplets, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDevice } from '@/lib/device-context';

export function Navigation() {
  const pathname = usePathname();
  const { activeDevice } = useDevice();

  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Droplets, label: 'Refill', href: '/refill' },
    { icon: MapPin, label: 'Locator', href: '/map' },
    { icon: Award, label: 'Rewards', href: '/rewards' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  if (pathname === '/') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-background/95 backdrop-blur-3xl border-t border-white/10 px-6 pb-safe-area-inset-bottom h-24">
      <div className="flex items-center justify-around h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300 relative px-3 py-1",
                isActive ? "text-brand-accent scale-110" : "text-muted-foreground/60 hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_hsl(var(--brand-accent))]")} />
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-2 w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--brand-accent))]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
