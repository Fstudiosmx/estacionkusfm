
"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Share2, History, RefreshCw, Music, MessageCircle, MoreVertical, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog';
import { SongRequestModal } from './song-request-modal';
import { HistoryModal } from './history-modal';
import { ShoutoutModal } from './shoutout-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';


interface AzuraCastNowPlaying {
  station: {
    name: string;
  };
  now_playing: {
    song: {
      text: string;
      artist: string;
      title: string;
      art: string;
    };
  };
  is_online: boolean;
}

export function RadioPlayer() {
  const [nowPlaying, setNowPlaying] = useState<AzuraCastNowPlaying | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastVolume = useRef(50);
  const [isMounted, setIsMounted] = useState(false);
  
  const [songRequestOpen, setSongRequestOpen] = useState(false);
  const [shoutoutOpen, setShoutoutOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isPlayerDetailOpen, setPlayerDetailOpen] = useState(false);

  const isMobile = useIsMobile();

  const streamUrl = "https://radio.trabullnetwork.pro/listen/estacionkusfm/radio.mp3";
  const apiUrl = "/api/nowplaying";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || 'El servidor de la radio no responde.';
        throw new Error(message);
      }
      const data: AzuraCastNowPlaying = await response.json();
      setNowPlaying(data);
    } catch (error: any) {
      console.error("Error fetching Now Playing data:", error);
      setNowPlaying(prev => ({
        ...(prev || { 
            station: { name: 'EstacionKusFM' }, 
            now_playing: { song: { text: 'Offline', artist: 'EstacionKusFM', title: 'Offline', art: 'https://placehold.co/100x100.png' } } 
        }),
        is_online: false
      }));
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    lastVolume.current = volume;
  }, [volume]);
  
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Error playing audio:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (nowPlaying?.is_online) {
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => {
        const newMutedState = !prev;
        if (newMutedState) {
            setVolume(0);
        } else {
            setVolume(lastVolume.current > 0 ? lastVolume.current : 50);
        }
        return newMutedState;
    });
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if(newVolume > 0 && isMuted) {
        setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
        setIsMuted(true);
    }
  };

  const handleShare = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const trackInfo = nowPlaying?.now_playing.song.text || 'Música en vivo';
    const shareData = {
      title: 'EstacionKusFM',
      text: `Escuchando ahora: ${trackInfo} en EstacionKusFM`,
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
        alert('Enlace de la radio copiado al portapapeles!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const isOnline = nowPlaying?.is_online ?? false;
  const currentTrack = nowPlaying?.now_playing.song;
  const coverArt = currentTrack?.art && currentTrack.art.includes('http') 
    ? currentTrack.art 
    : 'https://placehold.co/600x600.png';
  const trackTitle = currentTrack?.title || (isOnline ? 'En Vivo' : 'Offline');
  const trackArtist = currentTrack?.artist || nowPlaying?.station.name || 'EstacionKusFM';


  const miniPlayerContent = (
      <div className="flex items-center gap-4">
        <Image
          src={coverArt}
          data-ai-hint="album cover"
          alt="Album Art"
          width={64}
          height={64}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover"
          unoptimized
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`relative flex h-3 w-3 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
            </span>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">
              {isOnline ? 'En Vivo' : 'Offline'}
            </p>
          </div>
          <h3 className="font-bold truncate font-headline text-lg">{trackTitle}</h3>
          <p className="text-sm text-muted-foreground truncate">{trackArtist}</p>
        </div>

        <div className="hidden md:flex items-center gap-4 flex-1 max-w-xs">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            className="w-full"
            onValueChange={handleVolumeChange}
            aria-label="Volume"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={100}>
            <div className="hidden sm:flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); setSongRequestOpen(true)}}><Music className="h-5 w-5" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Pedir una canción</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); setShoutoutOpen(true)}}><MessageCircle className="h-5 w-5" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Enviar un saludo</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); setHistoryOpen(true)}}><History className="h-5 w-5" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Historial</p></TooltipContent>
                </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); fetchNowPlaying();}}>
                            <RefreshCw className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Refrescar</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleShare}>
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Compartir</p></TooltipContent>
                </Tooltip>
            </div>
              <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Más opciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onSelect={() => setSongRequestOpen(true)}>
                    <Music className="mr-2 h-4 w-4" />
                    <span>Pedir una canción</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setShoutoutOpen(true)}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Enviar un saludo</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setHistoryOpen(true)}>
                    <History className="mr-2 h-4 w-4" />
                    <span>Historial</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={fetchNowPlaying}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Refrescar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleShare()}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Compartir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TooltipProvider>

            <Button onClick={(e) => { e.stopPropagation(); togglePlay(); }} size="icon" className="w-12 h-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shrink-0" disabled={!isOnline}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>
        </div>
      </div>
  );

  const fullScreenPlayerView = (
    <DialogContent className="p-0 m-0 w-screen h-screen max-w-full rounded-none border-none bg-background flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${coverArt})` }}
      >
        <div className="absolute inset-0 bg-background/70 backdrop-blur-xl" />
      </div>

      <div className="flex justify-between items-center p-4 text-foreground absolute top-0 left-0 right-0 z-10">
          <h2 className="font-headline text-lg">{nowPlaying?.station.name || 'EstacionKusFM'}</h2>
          <DialogClose asChild>
          <Button variant="ghost" size="icon" className="hover:bg-white/10">
            <ChevronDown className="w-8 h-8" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </DialogClose>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-foreground text-center px-6 pt-16 pb-8 overflow-hidden">
        <Image
          src={coverArt}
          data-ai-hint="album cover"
          alt={trackTitle}
          width={500}
          height={500}
          className="w-full max-w-[75vw] sm:max-w-xs aspect-square rounded-lg shadow-2xl object-cover"
          unoptimized
        />
        <div className="mt-8 w-full">
          <h3 className="font-bold font-headline text-3xl truncate">{trackTitle}</h3>
          <p className="text-lg text-muted-foreground truncate">{trackArtist}</p>
        </div>
      </div>

      <div className="p-6 text-foreground">
        <div className="flex justify-center items-center gap-6 mb-8">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/10" onClick={() => { setHistoryOpen(true); }}>
              <History className="h-6 w-6" />
            </Button>

          <Button onClick={togglePlay} size="icon" className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!isOnline}>
            {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1 fill-current" />}
          </Button>
          
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/10" onClick={() => handleShare()}>
              <Share2 className="h-6 w-6" />
            </Button>
        </div>

        <div className="flex items-center gap-4">
          <VolumeX className="h-5 w-5" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            className="w-full [&>span:first-child]:bg-secondary/50 [&>span:first-child>span]:bg-white"
            onValueChange={handleVolumeChange}
            aria-label="Volume"
          />
          <Volume2 className="h-5 w-5" />
        </div>
      </div>
    </DialogContent>
  );

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4">
        {isMounted && <audio ref={audioRef} src={streamUrl} preload="none" />}

        {isMobile && isMounted ? (
            <Dialog open={isPlayerDetailOpen} onOpenChange={setPlayerDetailOpen}>
                <DialogTrigger asChild>
                    <Card className="w-full max-w-4xl mx-auto shadow-2xl backdrop-blur-lg bg-card/80 cursor-pointer">
                        <CardContent className="p-3 sm:p-4">
                           {miniPlayerContent}
                        </CardContent>
                    </Card>
                </DialogTrigger>
                {fullScreenPlayerView}
            </Dialog>
        ) : isMounted ? (
            <Card className="w-full max-w-4xl mx-auto shadow-2xl backdrop-blur-lg bg-card/80">
                <CardContent className="p-3 sm:p-4">
                    {miniPlayerContent}
                </CardContent>
            </Card>
        ) : null}
      </div>

      <Dialog open={songRequestOpen} onOpenChange={setSongRequestOpen}>
        <SongRequestModal />
      </Dialog>
      <Dialog open={shoutoutOpen} onOpenChange={setShoutoutOpen}>
        <ShoutoutModal />
      </Dialog>
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <HistoryModal />
      </Dialog>
    </>
  );
}
