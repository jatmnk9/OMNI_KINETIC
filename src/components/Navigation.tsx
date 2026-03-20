
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, BarChart3, Award, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDevice } from '@/lib/device-context';

export function Navigation() {
  const pathname = usePathname();
  const { activeDevice } = useDevice();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: BarChart3, label: 'Wellness', href: '/dashboard' },
    { icon: MapPin, label: 'Locator', href: '/map' },
    { icon: ShoppingBag, label: 'Boutique', href: '/boutique' },
    { icon: Award, label: 'Rewards', href: '/rewards' },
  ];

  if (activeDevice === 'none' && (pathname === '/' || pathname === '/map')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-2xl border-t border-white/5 px-6 pb-safe-area-inset-bottom h-20">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-accent scale-110" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[8px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
              {isActive && <div className="w-1 h-1 bg-accent rounded-full mt-0.5 animate-pulse" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
