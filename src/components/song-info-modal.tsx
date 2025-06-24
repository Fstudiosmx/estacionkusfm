import Image from "next/image";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Song } from '@/lib/data';
import { ExternalLink } from "lucide-react";

interface SongInfoModalProps {
  song: Song;
}

export function SongInfoModal({ song }: SongInfoModalProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="font-headline">{song.title}</DialogTitle>
        <DialogDescription>{song.artist}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Image
          src={song.coverArt}
          data-ai-hint="album cover"
          alt={`Cover art for ${song.title}`}
          width={400}
          height={400}
          className="w-full h-auto rounded-lg"
        />
        <p className="text-sm text-muted-foreground">
            This track is one of the top hits on RadioWave this week. Find it on your favorite music platform!
        </p>
      </div>
      <a href={song.externalLink} target="_blank" rel="noopener noreferrer">
        <Button className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            Find on Music Platform
        </Button>
      </a>
    </DialogContent>
  );
}
