"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function PanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col items-center text-center mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-80" />
        </div>
        <Card className="max-w-2xl mx-auto">
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
                Gestiona el contenido de EstacionKusFM.
            </p>
        </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Bienvenido, {user.email}</CardTitle>
          <CardDescription>
            Este es tu panel de control. Desde aquí podrás gestionar las canciones, programas, artículos del blog y más. Esta funcionalidad se implementará próximamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogout}>Cerrar Sesión</Button>
        </CardContent>
      </Card>
    </div>
  );
}
