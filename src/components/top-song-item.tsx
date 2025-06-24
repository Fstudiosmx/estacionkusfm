"use client";

import Image from 'next/image';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { SongInfoModal } from '@/components/song-info-modal';
import type { Song } from '@/lib/data';

interface TopSongItemProps {
  song: Song;
}

export function TopSongItem({ song }: TopSongItemProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors">
          <span className="text-lg font-bold text-muted-foreground w-6 text-center">
            {song.rank}
          </span>
          <Image
            src={song.coverArt}
            data-ai-hint={song.coverArtHint}
            alt={song.title}
            width={48}
            height={48}
            className="w-12 h-12 rounded-md"
          />
          <div className="flex-1">
            <p className="font-semibold">{song.title}</p>
            <p className="text-sm text-muted-foreground">{song.artist}</p>
          </div>
        </div>
      </DialogTrigger>
      <SongInfoModal song={song} />
    </Dialog>
  );
}
