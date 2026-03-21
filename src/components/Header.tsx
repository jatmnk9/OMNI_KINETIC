
"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDevice } from '@/lib/device-context';

export function Header() {
  const router = useRouter();
  const { logout } = useDevice();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const brilliantHover = "hover:bg-white/30 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] hover:border-white/50 transition-all duration-300";

  return (
    <header className="relative flex items-center justify-center h-20 px-6 max-w-lg mx-auto w-full z-50 shrink-0">
      <div className="absolute left-6">
         <Button 
           variant="ghost" 
           size="icon" 
           onClick={() => router.push('/profile')} 
           className={`rounded-full h-11 w-11 bg-white/10 border border-white/10 shadow-xl ${brilliantHover}`}
         >
            <User className="w-5 h-5 opacity-90" />
         </Button>
      </div>
      
      <div className="relative w-32 h-12 cursor-pointer" onClick={() => router.push('/dashboard')}>
        <Image 
          src="/logo_omni.PNG" 
          alt="Omni Kinetic" 
          fill 
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute right-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout} 
          className={`rounded-full h-11 w-11 bg-white/10 border border-white/10 shadow-xl ${brilliantHover}`}
        >
           <LogOut className="w-5 h-5 opacity-90 text-red-400 hover:text-red-300" />
        </Button>
      </div>
    </header>
  );
}
