import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Song } from '@/lib/data';
import { Youtube } from "lucide-react";

interface SongInfoModalProps {
  song: Song;
}

export function SongInfoModal({ song }: SongInfoModalProps) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-headline">{song.title}</DialogTitle>
        <DialogDescription>{song.artist}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {song.youtubeVideoId ? (
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${song.youtubeVideoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
           <div className="w-full aspect-square bg-secondary rounded-lg flex items-center justify-center">
             <p className="text-muted-foreground">Video no disponible</p>
           </div>
        )}
        <p className="text-sm text-muted-foreground">
            Este tema es uno de los más sonados en EstacionKusFM esta semana. ¡Encuéntralo en tu plataforma de música favorita!
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {song.spotifyLink && (
            <Button asChild>
                <a href={song.spotifyLink} target="_blank" rel="noopener noreferrer">
                    Spotify
                </a>
            </Button>
        )}
        {song.appleMusicLink && (
            <Button asChild variant="outline">
                <a href={song.appleMusicLink} target="_blank" rel="noopener noreferrer">
                    Apple Music
                </a>
            </Button>
        )}
        {song.youtubeMusicLink && (
            <Button asChild variant="secondary">
                <a href={song.youtubeMusicLink} target="_blank" rel="noopener noreferrer">
                    <Youtube className="mr-2 h-4 w-4" />
                    YouTube Music
                </a>
            </Button>
        )}
      </div>
    </DialogContent>
  );
}
