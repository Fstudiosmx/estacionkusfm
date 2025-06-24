"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Song } from "@/lib/data";
import { upsertTopSong } from "./actions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  id: z.string().optional(),
  rank: z.coerce.number().min(1, "El ranking es requerido."),
  title: z.string().min(1, "El título es requerido."),
  artist: z.string().min(1, "El artista es requerido."),
  coverArt: z.string().url("Debe ser una URL válida."),
  coverArtHint: z.string().optional(),
  youtubeVideoId: z.string().optional(),
  spotifyLink: z.string().url("URL de Spotify no válida").optional().or(z.literal('')),
  appleMusicLink: z.string().url("URL de Apple Music no válida").optional().or(z.literal('')),
  youtubeMusicLink: z.string().url("URL de YouTube Music no válida").optional().or(z.literal('')),
});

type SongFormValues = z.infer<typeof formSchema>;

interface SongFormProps {
  song?: Song | null;
  onSuccess: () => void;
}

export function SongForm({ song, onSuccess }: SongFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<SongFormValues> = song 
    ? { ...song }
    : {
        rank: 1,
        title: '',
        artist: '',
        coverArt: 'https://placehold.co/100x100.png',
        coverArtHint: '',
        youtubeVideoId: '',
        spotifyLink: '',
        appleMusicLink: '',
        youtubeMusicLink: ''
      };

  const form = useForm<SongFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [song, form]);

  async function onSubmit(data: SongFormValues) {
    setIsSubmitting(true);
    try {
      await upsertTopSong(data);
      toast({
        title: "¡Éxito!",
        description: `La canción "${data.title}" ha sido ${song ? 'actualizada' : 'creada'} correctamente.`,
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la canción.",
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel>Rank</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título de la canción" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artista</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del artista" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="coverArt"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL Carátula</FormLabel>
                <FormControl>
                    <Input placeholder="https://placehold.co/100x100.png" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="coverArtHint"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Pista IA Carátula</FormLabel>
                <FormControl>
                    <Input placeholder="Ej: abstract space" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="youtubeVideoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Video YouTube (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="jfKfPfyJRdk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4">
           <FormField
          control={form.control}
          name="spotifyLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enlace Spotify (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://open.spotify.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="appleMusicLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enlace Apple Music (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://music.apple.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="youtubeMusicLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enlace YouTube Music (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://music.youtube.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {song ? "Guardar Cambios" : "Crear Canción"}
        </Button>
      </form>
    </Form>
  );
}
