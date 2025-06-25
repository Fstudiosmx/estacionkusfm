
"use client";

import { useEffect, useState } from 'react';
import { getSiteSettings } from '@/lib/settings';
import type { SiteSettings } from '@/lib/data';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, VideoOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function VideoPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component only renders on the client
    setIsClient(true);
    
    async function fetchSettings() {
      try {
        const fetchedSettings = await getSiteSettings();
        setSettings(fetchedSettings);
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const renderPlayer = () => {
    if (loading || !isClient) {
      return (
        <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-lg">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      );
    }
    
    if (!settings?.hlsStreamUrl) {
       return (
        <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center rounded-lg text-center p-4">
          <VideoOff className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-bold text-lg">Stream de Video No Configurado</h3>
          <p className="text-muted-foreground text-sm">El administrador aún no ha configurado una URL para el stream de video.</p>
          <Button asChild variant="link" className="mt-2">
            <Link href="/panel/settings">Ir a Configuración</Link>
          </Button>
        </div>
       )
    }

    return (
      <div className='relative w-full aspect-video'>
        <ReactPlayer
          url={settings.hlsStreamUrl}
          controls
          playing
          width='100%'
          height='100%'
          className='absolute top-0 left-0'
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Venos en Vivo
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          La experiencia completa de EstacionKusFM, ahora en video. Mira nuestros programas en directo desde el estudio.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardContent className="p-0">
          {renderPlayer()}
        </CardContent>
      </Card>
    </div>
  );
}
