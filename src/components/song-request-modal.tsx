
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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { submitSongRequest } from "@/lib/submissions";

export function SongRequestModal() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const songTitle = formData.get("song") as string;
    const songArtist = formData.get("artist") as string;

    try {
        await submitSongRequest({ name, songTitle, songArtist });
        toast({
            title: "¡Petición Enviada!",
            description: "Gracias por tu sugerencia. ¡La tendremos en cuenta!",
        });
        // This is a bit of a hack to close the dialog
        document.getElementById('close-song-request')?.click();
    } catch (error) {
        toast({
            title: "Error",
            description: "No se pudo enviar tu petición. Inténtalo más tarde.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
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
            <Input id="name" name="name" placeholder="Tu nombre" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="song" className="text-right">
                Canción
            </Label>
            <Input id="song" name="song" placeholder="Título de la canción" className="col-span-3" required/>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="artist" className="text-right">
                Artista
            </Label>
            <Input id="artist" name="artist" placeholder="Nombre del artista" className="col-span-3" required/>
            </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost" id="close-song-request">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Enviar Petición
            </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
