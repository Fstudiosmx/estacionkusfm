"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Share2, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { allSongs } from '@/lib/data';

export function RadioPlayer() {
  const [isOnline, setIsOnline] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const lastVolume = useRef(50);

  const currentTrack = allSongs[currentTrackIndex];

  useEffect(() => {
    if (!isPlaying || !isOnline) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % allSongs.length);
          return 0;
        }
        return prev + 100 / 30; // Simulate a 30-second track
      });
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [isPlaying, isOnline]);
  
  useEffect(() => {
    lastVolume.current = volume;
  }, [volume])

  const togglePlay = () => {
    if (isOnline) {
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
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if(newVolume > 0 && isMuted) {
        setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
        setIsMuted(true);
    }
  }

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl backdrop-blur-lg bg-card/80">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-4">
            <Image
              src={currentTrack.coverArt}
              data-ai-hint="album cover"
              alt="Album Art"
              width={64}
              height={64}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-md"
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
                  {isOnline ? 'On Air' : 'Offline'}
                </p>
              </div>
              <h3 className="font-bold truncate font-headline text-lg">{currentTrack.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
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
                <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                    <Share2 className="h-5 w-5" />
                </Button>
                <Button onClick={togglePlay} size="icon" className="w-12 h-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary overflow-hidden rounded-b-lg">
            <div
              className="h-full bg-accent transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
