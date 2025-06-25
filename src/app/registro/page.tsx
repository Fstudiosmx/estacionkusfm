"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { validateCode, markCodeAsUsed } from "./actions";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/icons/google";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCodeValidated, setIsCodeValidated] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleValidateCode = async () => {
    setIsCheckingCode(true);
    const validationResult = await validateCode(invitationCode);
    if (validationResult.valid) {
      toast({
        title: "Código Válido",
        description: "Ahora puedes completar tu registro.",
      });
      setIsCodeValidated(true);
    } else {
      toast({
        title: "Código Inválido",
        description: validationResult.message,
        variant: "destructive",
      });
    }
    setIsCheckingCode(false);
  };

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    let userEmail: string | null = null;

    try {
      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden.");
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      userEmail = userCredential.user.email;
      
      if (!userEmail) throw new Error("No se pudo obtener el email del usuario.");

      await markCodeAsUsed(invitationCode, userEmail);

      toast({
        title: "¡Cuenta Creada!",
        description: "Tu cuenta ha sido creada exitosamente. Ahora serás redirigido al panel.",
      });
      router.push("/panel");

    } catch (error: any) {
      let message = error.message || "Ocurrió un error al crear la cuenta. Por favor, inténtalo de nuevo.";
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

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    let userEmail: string | null = null;
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      userEmail = userCredential.user.email;

      if (!userEmail) throw new Error("No se pudo obtener el email del usuario.");
      
      await markCodeAsUsed(invitationCode, userEmail);
      toast({
        title: "¡Cuenta Creada!",
        description: "Tu cuenta ha sido creada exitosamente. Serás redirigido al panel.",
      });
      router.push("/panel");
    } catch (error: any) {
      let message = "No se pudo completar el registro con Google.";
      if (error.code === 'auth/popup-closed-by-user') {
          message = "El registro fue cancelado.";
      }
      toast({
        title: "Error de Registro con Google",
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
              {isCodeValidated 
                ? "Completa tus datos para finalizar el registro."
                : "Regístrate con un código de invitación para acceder al panel."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             {!isCodeValidated ? (
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
             ) : (
                <>
                 <div className="p-2 border border-dashed border-green-500 bg-green-500/10 rounded-md text-center">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Código <span className="font-mono">{invitationCode}</span> validado.</p>
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
                </>
             )}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            {!isCodeValidated ? (
                <Button type="button" className="w-full" disabled={isCheckingCode || !invitationCode} onClick={handleValidateCode}>
                    {isCheckingCode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Validar Código
                </Button>
            ) : (
                <>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Registrarse con Email
                    </Button>
                    <div className="relative my-4">
                        <Separator />
                        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">O</span>
                    </div>
                     <Button variant="outline" className="w-full" type="button" onClick={handleGoogleRegister} disabled={isSubmitting}>
                        <GoogleIcon className="mr-2 h-5 w-5" />
                        Registrarse con Google
                    </Button>
                </>
            )}

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
