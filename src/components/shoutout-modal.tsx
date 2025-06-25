
"use client"
import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { submitShoutout } from "@/lib/submissions";

export function ShoutoutModal() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;

    try {
        await submitShoutout({ name, message });
        toast({
            title: "¡Saludo Enviado!",
            description: "Gracias por tu mensaje. ¡Puede que lo leamos en directo!",
        });
        document.getElementById('close-shoutout-modal')?.click();
    } catch(error) {
        toast({
            title: "Error",
            description: "No se pudo enviar tu saludo. Inténtalo más tarde.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
       <DialogHeader>
        <DialogTitle className="font-headline">Enviar un Saludo</DialogTitle>
        <DialogDescription>Manda un saludo a tus amigos, familia, o a quien quieras. ¡Podríamos leerlo en directo!</DialogDescription>
      </DialogHeader>
       <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Tu Nombre
                </Label>
                <Input id="name" name="name" placeholder="Tu nombre" className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                    Mensaje
                </Label>
                <Textarea id="message" name="message" placeholder="Escribe tu saludo aquí..." className="col-span-3" required/>
            </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost" id="close-shoutout-modal">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Enviar Saludo
            </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
