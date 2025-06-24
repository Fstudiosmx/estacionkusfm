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
import { Loader2, UploadCloud, ListMusic, FileText, CalendarDays, Users } from "lucide-react";
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
                Panel de Administración
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
                Gestiona el contenido y la configuración de EstacionKusFM.
            </p>
        </div>

      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Bienvenido, {user.email}</CardTitle>
          <CardDescription>
            Usa las herramientas de abajo para gestionar el contenido de tu sitio web.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogout}>Cerrar Sesión</Button>
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
        <h2 className="text-2xl font-bold font-headline mb-4">Panel de Contenido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <ListMusic className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-xl">Top 10 Canciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Edita el ranking de las canciones más populares de la semana.</p>
                    <Button disabled>Gestionar (Próximamente)</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-xl">Blog</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Crea, edita y publica nuevos artículos en el blog.</p>
                     <Button asChild>
                        <Link href="/panel/blog">Gestionar</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <CalendarDays className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-xl">Programación</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Actualiza el horario semanal de todos los programas.</p>
                    <Button disabled>Gestionar (Próximamente)</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Users className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-xl">Invitaciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Genera nuevos códigos para invitar a otros administradores.</p>
                    <Button disabled>Gestionar (Próximamente)</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
