"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { validateCode, markCodeAsUsed } from "./actions";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      toast({
        title: "Error de Contraseña",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Validar el código de invitación
      const validationResult = await validateCode(invitationCode);
      if (!validationResult.valid) {
        toast({
          title: "Código de Invitación Inválido",
          description: validationResult.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // 2. Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 3. Si la creación es exitosa, marcar el código como usado
      await markCodeAsUsed(invitationCode, userCredential.user.email!);

      toast({
        title: "¡Cuenta Creada!",
        description: "Tu cuenta ha sido creada exitosamente. Ahora serás redirigido al panel.",
      });
      router.push("/panel");

    } catch (error: any) {
      console.error("Error creating user: ", error);
      let message = "Ocurrió un error al crear la cuenta. Por favor, inténtalo de nuevo.";
      if (error.code === 'auth/email-already-in-use') {
        message = "El correo electrónico ya está en uso por otra cuenta.";
      } else if (error.code === 'auth/weak-password') {
        message = "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
      } else if (error.code === 'auth/invalid-api-key' || error.code === 'auth/internal-error') {
        message = "Error de configuración de Firebase. Revisa que las credenciales en 'src/lib/firebase.ts' sean correctas.";
      }
      toast({
        title: "Error de Registro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-20rem)] py-12">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleRegister}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Crear Cuenta de Admin</CardTitle>
            <CardDescription>
              Regístrate con un código de invitación para acceder al panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="invitation-code">Código de Invitación</Label>
              <Input 
                id="invitation-code" 
                type="text" 
                placeholder="Ingresa el código" 
                required 
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@ejemplo.com" 
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
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrarse
            </Button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="underline">
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
