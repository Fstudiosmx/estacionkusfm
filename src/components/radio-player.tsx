"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Share2, History, RefreshCw, Music } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  
  const streamUrl = "https://radio.trabullnetwork.pro/listen/estacionkusfm/radio.mp3";
  const apiUrl = "https://radio.trabullnetwork.pro/api/nowplaying/estacionkusfm";

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: AzuraCastNowPlaying = await response.json();
      setNowPlaying(data);
    } catch (error) {
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
  
  const toggleMute = () => {
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

  const handleShare = async () => {
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
  const coverArt = currentTrack?.art && currentTrack.art !== 'https://www.azuracast.com/img/api/album_art_blank.png' 
    ? currentTrack.art 
    : 'https://placehold.co/100x100.png';
  const trackTitle = currentTrack?.title || (isOnline ? 'En Vivo' : 'Offline');
  const trackArtist = currentTrack?.artist || nowPlaying?.station.name || 'EstacionKusFM';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4">
      <audio ref={audioRef} src={streamUrl} preload="auto" />
      <Card className="w-full max-w-4xl mx-auto shadow-2xl backdrop-blur-lg bg-card/80">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-4">
            <Image
              src={coverArt}
              data-ai-hint="album cover"
              alt="Album Art"
              width={64}
              height={64}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-md"
              unoptimized // Recommended for external art URLs that are not in next.config.js
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
                            <Button variant="ghost" size="icon">
                                <Music className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Pedir una canción</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <History className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Historial</p></TooltipContent>
                    </Tooltip>
                     <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={fetchNowPlaying}>
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
              </TooltipProvider>

                <Button onClick={togglePlay} size="icon" className="w-12 h-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!isOnline}>
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
