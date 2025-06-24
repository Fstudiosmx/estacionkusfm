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
import { useToast } from "@/hooks/use-toast";

export function SongRequestModal() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "¡Petición Enviada!",
      description: "Gracias por tu sugerencia. ¡La tendremos en cuenta!",
    });
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-headline">Pedir una Canción</DialogTitle>
        <DialogDescription>¿Qué te gustaría escuchar? Dinos y lo pondremos en cola.</DialogDescription>
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
            <Label htmlFor="song" className="text-right">
                Canción
            </Label>
            <Input id="song" placeholder="Título de la canción" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="artist" className="text-right">
                Artista
            </Label>
            <Input id="artist" placeholder="Nombre del artista" className="col-span-3" />
            </div>
        </div>
        <DialogFooter>
            <Button type="submit">Enviar Petición</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
