"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });
      router.push("/panel");
    } catch (error: any) {
      console.error("Error signing in: ", error);
      let message = "El correo o la contraseña son incorrectos. Por favor, inténtalo de nuevo.";
      if (error.code === 'auth/invalid-api-key') {
        message = "Error de configuración de Firebase. Revisa que las credenciales en 'src/lib/firebase.ts' sean correctas.";
      }
      toast({
        title: "Error al iniciar sesión",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-20rem)] py-12">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al panel de administración.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">Ingresar</Button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/registro" className="underline">
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
