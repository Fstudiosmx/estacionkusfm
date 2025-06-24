"use client"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function ShoutoutModal() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "¡Saludo Enviado!",
      description: "Gracias por tu mensaje. ¡Puede que lo leamos en directo!",
    });
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
                <Input id="name" placeholder="Tu nombre" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                    Mensaje
                </Label>
                <Textarea id="message" placeholder="Escribe tu saludo aquí..." className="col-span-3" />
            </div>
        </div>
        <DialogFooter>
            <Button type="submit">Enviar Saludo</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
