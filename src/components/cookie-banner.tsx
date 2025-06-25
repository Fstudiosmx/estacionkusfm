
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side
    if (typeof window !== 'undefined') {
        const consent = localStorage.getItem('cookie_consent');
        if (consent !== 'true') {
          // Use a timeout to ensure the banner is rendered after the initial page load
          // This avoids layout shift and potential server/client mismatches.
          const timer = setTimeout(() => setShowBanner(true), 500);
          return () => clearTimeout(timer);
        }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[60] w-full',
        'transform-gpu transition-all duration-500 ease-in-out motion-reduce:transition-none',
        showBanner
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0 pointer-events-none'
      )}
      aria-hidden={!showBanner}
      role="region"
      aria-label="Aviso de cookies"
    >
        <div className="container mx-auto p-4">
             <div className="bg-secondary p-4 rounded-lg shadow-2xl border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Cookie className="h-6 w-6 text-primary shrink-0"/>
                    <p className="text-sm text-secondary-foreground">
                        Utilizamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestro uso de cookies.
                        <Link href="/politica-de-privacidad" className="underline ml-1 font-semibold hover:text-primary">
                            Leer más
                        </Link>
                    </p>
                </div>
                <Button onClick={handleAccept} size="sm" className='shrink-0'>
                    Aceptar
                </Button>
            </div>
        </div>
    </div>
  );
}
