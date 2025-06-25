"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/icons/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });
      router.push("/panel");
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      let errorMessage = "No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.";
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "El inicio de sesión fue cancelado.";
      }
      toast({
        title: "Error de inicio de sesión con Google",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <Button type="submit" className="w-full" disabled={isSubmitting}>Ingresar</Button>
            
            <div className="relative my-4">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">O</span>
            </div>

            <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin} disabled={isSubmitting}>
              <GoogleIcon className="mr-2 h-5 w-5" />
              Iniciar sesión con Google
            </Button>
            
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
