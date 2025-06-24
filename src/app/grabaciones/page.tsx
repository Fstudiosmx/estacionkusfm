"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock, ServerCrash } from 'lucide-react';
import Image from 'next/image';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { RecordedShow } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function GrabacionesPage() {
  const [recordedShows, setRecordedShows] = useState<RecordedShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShows() {
      setLoading(true);
      setFirebaseError(null);
      try {
        const showsCollection = collection(db, 'recordedShows');
        const q = query(showsCollection, orderBy('publishDate', 'desc'));
        const querySnapshot = await getDocs(q);
        const showsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RecordedShow));
        setRecordedShows(showsData);
      } catch (error) {
        console.error("Firebase fetch error:", error);
        setFirebaseError("No se pudo cargar la lista de grabaciones desde la base de datos.");
      } finally {
        setLoading(false);
      }
    }
    fetchShows();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="flex flex-col sm:flex-row overflow-hidden">
              <Skeleton className="w-full sm:w-1/3 h-48 sm:h-auto" />
              <div className="flex flex-col flex-1 p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
                <div className="flex justify-between items-center pt-4">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-8 w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (firebaseError) {
      return (
        <div className="max-w-2xl mx-auto text-center">
            <Card>
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full">
                     <ServerCrash className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle>Error de Conexión</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{firebaseError}</p>
                    <Button asChild className="mt-4">
                        <Link href="/docs">Ver Guía de Configuración</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
    }
    
    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {recordedShows.map((show) => (
            <Card key={show.id} className="flex flex-col sm:flex-row overflow-hidden">
                <Image
                    src={show.imageUrl}
                    data-ai-hint={show.imageHint}
                    alt={show.title}
                    width={200}
                    height={200}
                    className="w-full sm:w-1/3 h-48 sm:h-auto object-cover"
                    unoptimized
                />
                <div className="flex flex-col flex-1">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">{show.title}</CardTitle>
                        <CardDescription>Hosted by {show.host}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground">{show.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center bg-secondary/50 p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{format(show.publishDate.toDate(), "dd 'de' MMMM, yyyy", { locale: es })} &middot; {show.duration}</span>
                        </div>
                        <Button size="sm">
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Listen Now
                        </Button>
                    </CardFooter>
                </div>
            </Card>
            ))}
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Podcasts & Recorded Shows
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Missed a live show? Catch up on our latest episodes and exclusive podcasts anytime, anywhere.
        </p>
      </div>
      {renderContent()}
    </div>
  );
}
