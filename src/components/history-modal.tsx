"use client";

import { useState, useEffect } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

interface SongHistoryItem {
  sh_id: number;
  played_at: number;
  song: {
    text: string;
    artist: string;
    title: string;
    art: string;
  };
}

export function HistoryModal() {
  const [history, setHistory] = useState<SongHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        // Add a cache-busting query parameter
        const response = await fetch(`https://radio.trabullnetwork.pro/api/station/estacionkusfm/history?_=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error('No se pudo cargar el historial.');
        }
        const data: SongHistoryItem[] = await response.json();
        setHistory(data);
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error inesperado.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
         <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    
    if (history.length === 0) {
        return <p className="text-center text-muted-foreground">No hay historial de canciones disponible.</p>
    }

    return (
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {history.map((item) => (
          <div key={item.sh_id} className="flex items-center gap-4">
            <Image
              src={item.song.art}
              alt={item.song.title || 'Cover art'}
              width={48}
              height={48}
              className="w-12 h-12 rounded-md bg-secondary"
              unoptimized
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.song.title}</p>
              <p className="text-sm text-muted-foreground truncate">{item.song.artist}</p>
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(item.played_at * 1000), { addSuffix: true, locale: es })}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="font-headline">Historial de Canciones</DialogTitle>
        <DialogDescription>Las últimas canciones que han sonado en EstacionKusFM.</DialogDescription>
      </DialogHeader>
      <div className="py-4">
        {renderContent()}
      </div>
    </DialogContent>
  );
}
