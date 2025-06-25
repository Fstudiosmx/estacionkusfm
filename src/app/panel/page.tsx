
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { Loader2, UploadCloud, ListMusic, FileText, CalendarDays, Users, Ticket, PlayCircle, Megaphone, Settings, MessageSquareQuote, UserPlus, Presentation, Trophy } from "lucide-react";
import Link from "next/link";

export default function PanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [isDbSeeded, setIsDbSeeded] = useState(true);
  const [isCheckingDb, setIsCheckingDb] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check if DB is seeded
        setIsCheckingDb(true);
        try {
          const q = query(collection(db, "blogPosts"), limit(1));
          const querySnapshot = await getDocs(q);
          setIsDbSeeded(!querySnapshot.empty);
        } catch (error) {
            // This might happen if firestore rules are not set up yet.
            // Assuming not seeded is a safe bet to show the button.
            console.warn("Could not check if DB is seeded, assuming it is not.", error);
            setIsDbSeeded(false);
        } finally {
            setIsCheckingDb(false);
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Sesión Cerrada",
        description: "Has cerrado sesión correctamente.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión.",
        variant: "destructive",
      });
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch('/api/seed-database', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocurrió un error al importar los datos.');
      }

      toast({
        title: "¡Éxito!",
        description: "Los datos de demostración han sido importados correctamente. La página se recargará.",
      });
      setIsDbSeeded(true); // Hide the button after success
      
      // Reload the page to reflect changes everywhere
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
       toast({
        title: "Error al importar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
        setIsSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col items-center text-center mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-80" />
        </div>
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-32" />
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect is handled in useEffect
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
       <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
                Estación de Control
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
                El centro de mando para todo el contenido de EstacionKusFM.
            </p>
        </div>

      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Hola, {user.email}</CardTitle>
          <CardDescription>
            Desde aquí puedes administrar cada aspecto de tu sitio web y estación de radio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogout}>Salir</Button>
        </CardContent>
      </Card>

      {!isCheckingDb && !isDbSeeded && (
        <Card className="max-w-4xl mx-auto mt-8 mb-8 bg-secondary border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                    <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <CardTitle>Comienza a usar tu App</CardTitle>
                    <CardDescription>
                        Tu base de datos parece estar vacía. Importa el contenido de demostración para ver la aplicación en acción.
                    </CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSeedDatabase} disabled={isSeeding}>
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                "Importar Datos de Ejemplo"
              )}
            </Button>
             <p className="text-xs text-muted-foreground mt-2">
                Esta acción es segura y solo se puede realizar una vez.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-headline mb-4">Módulos de Gestión</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Presentation className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Hero Slideshow</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Administra las diapositivas de la página de inicio.</p>
                     <Button asChild><Link href="/panel/hero-slides">Administrar</Link></Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Blog</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Escribe y administra los artículos de tu blog.</p>
                     <Button asChild>
                        <Link href="/panel/blog">Administrar</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <ListMusic className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Top 10 Musical</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Define y ordena el ranking semanal de éxitos.</p>
                    <Button asChild><Link href="/panel/top-songs">Administrar</Link></Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <CalendarDays className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Parrilla Semanal</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Organiza la programación de la radio para cada día.</p>
                    <Button asChild><Link href="/panel/schedule">Administrar</Link></Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Users className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Miembros del Equipo</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Añade o edita los perfiles del personal de la radio.</p>
                    <Button asChild><Link href="/panel/team">Administrar</Link></Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <PlayCircle className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Podcasts</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Sube y gestiona los episodios de tus programas grabados.</p>
                    <Button asChild><Link href="/panel/recordings">Administrar</Link></Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Megaphone className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Patrocinio</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Administra los logos y enlaces de tus patrocinadores.</p>
                    <Button asChild><Link href="/panel/sponsors">Administrar</Link></Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Trophy className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Campañas</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Gestiona eventos, concursos y campañas especiales.</p>
                    <Button asChild><Link href="/panel/campaigns">Administrar</Link></Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Ticket className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Invitaciones</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Crea códigos para registrar nuevos administradores.</p>
                    <Button asChild><Link href="/panel/invitations">Administrar</Link></Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <MessageSquareQuote className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Interacción Oyentes</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Visualiza peticiones de canciones y saludos.</p>
                    <Button asChild><Link href="/panel/requests">Administrar</Link></Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <UserPlus className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Solicitudes Equipo</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Revisa las aplicaciones para unirse al equipo.</p>
                    <Button asChild><Link href="/panel/join-submissions">Administrar</Link></Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Settings className="h-8 w-8 text-primary" />
                    <h3 className="font-headline text-xl font-semibold">Ajustes Generales</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Configura los parámetros técnicos de la radio y el sitio.</p>
                    <Button asChild><Link href="/panel/settings">Administrar</Link></Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
