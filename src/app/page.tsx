import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TopSongItem } from '@/components/top-song-item';
import { ArrowRight, Mic, Rss, ServerCrash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Program, Song, BlogPost } from '@/lib/data';
import { SponsorsSection } from '@/components/sponsors-section';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

async function getPageData() {
  try {
    const dayOfWeekEn = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // Fetch Top Songs
    const songsQuery = query(collection(db, "topSongs"), orderBy("rank"), limit(10));
    const songsSnapshot = await getDocs(songsQuery);
    const topSongs = songsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));

    // Fetch Today's Schedule
    const scheduleDocRef = doc(db, "weeklySchedule", dayOfWeekEn);
    const scheduleDocSnap = await getDoc(scheduleDocRef);
    const todaysSchedule = scheduleDocSnap.exists() ? (scheduleDocSnap.data().schedule || []) : [];

    // Fetch Blog Posts
    const postsQuery = query(collection(db, "blogPosts"), orderBy("publishDate", "desc"), limit(4));
    const postsSnapshot = await getDocs(postsQuery);
    const blogPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));

    return { topSongs, todaysSchedule, blogPosts, error: null };
  } catch (error: any) {
    console.error("Firebase fetch error:", error);
    return { 
      topSongs: [], 
      todaysSchedule: [], 
      blogPosts: [], 
      error: "No se pudo conectar con la base de datos. Por favor, revisa la configuración de Firebase." 
    };
  }
}


export default async function Home() {
  const { topSongs, todaysSchedule, blogPosts, error } = await getPageData();
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long' });

  const renderFirebaseError = () => (
    <div className="max-w-2xl mx-auto text-center my-12">
      <Card>
        <CardContent className="p-6">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
            <ServerCrash className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-xl font-bold font-headline">Error de Conexión con Firebase</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button asChild className="mt-4">
            <Link href="/docs">Ver Guía de Configuración</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-1 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                  EstacionKusFM
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Tu dosis diaria de sonido. Música ininterrumpida, programas de entrevistas y el pulso de la ciudad, al alcance de tu mano.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="font-bold">
                  <Link href="/programacion">Ver Programación</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-bold">
                  <Link href="/unete">Únete</Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://placehold.co/600x400.png"
              data-ai-hint="radio microphone"
              width="600"
              height="400"
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          {error ? renderFirebaseError() : (
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="flex flex-col space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Top 10 Canciones
              </h2>
              <p className="text-muted-foreground">
                Las canciones más sonadas y solicitadas esta semana en EstacionKusFM.
              </p>
              <div className="space-y-4">
                {topSongs.map((song) => (
                  <TopSongItem key={song.id} song={song} />
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-8">
              <div>
                <h3 className="text-2xl font-bold tracking-tighter font-headline mb-4 capitalize">
                  Programación de Hoy: {today}
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {todaysSchedule.length > 0 ? (
                        todaysSchedule.map((program, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="font-semibold">{program.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {program.host}
                              </p>
                            </div>
                            <span className="text-sm font-medium text-primary">
                              {program.time}
                            </span>
                          </li>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          No hay programas para hoy. ¡Disfruta de la música!
                        </p>
                      )}
                    </ul>
                    <Button asChild variant="link" className="px-0 mt-4">
                      <Link href="/programacion">
                        Horario Semanal Completo <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tighter font-headline">
                  Únete a Nuestro Equipo
                </h3>
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-6 flex items-center gap-6">
                    <Mic className="h-12 w-12 shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg">
                        Conviértete en una Voz en EstacionKusFM
                      </h4>
                      <p className="text-sm text-primary-foreground/80">
                        ¿Tienes pasión por la música o una historia que contar? Buscamos nuevos talentos.
                      </p>
                      <Button asChild variant="secondary" className="mt-4">
                        <Link href="/unete">Aplica Ahora</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
               <div className="inline-block rounded-lg bg-primary/10 p-3">
                 <Rss className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Desde Nuestro Blog
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Entrevistas, reseñas y las últimas noticias del mundo de la música.
              </p>
            </div>
          </div>
          <div className="mt-12">
            {error ? renderFirebaseError() : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {blogPosts.map((post) => (
                      <Card key={post.id} className="flex flex-col overflow-hidden h-full">
                          <Link href={`/blog/${post.id}`}>
                          <Image
                              src={post.imageUrl}
                              data-ai-hint={post.category === 'Entrevistas' ? 'portrait microphone' : 'music lifestyle'}
                              alt={post.title}
                              width={600}
                              height={400}
                              className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                          />
                          </Link>
                          <CardContent className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <Badge variant="outline">{post.category}</Badge>
                            </div>
                            <CardTitle className="font-headline text-lg mb-2 flex-1">
                                <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                                {post.title}
                                </Link>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mb-4">
                                {post.excerpt}
                            </p>
                            <Button asChild variant="link" className="p-0 justify-start mt-auto self-start">
                                <Link href={`/blog/${post.id}`}>
                                Leer Más <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                          </CardContent>
                      </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <SponsorsSection />
    </div>
  );
}
