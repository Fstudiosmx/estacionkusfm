
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { HeroSlide } from "@/lib/data";
import { upsertSlide } from "./actions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "El título es requerido."),
  description: z.string().min(2, "La descripción es requerida."),
  imageUrl: z.string().url("Debe ser una URL de imagen válida."),
  imageHint: z.string().optional(),
  order: z.coerce.number().min(1, "El orden es requerido."),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
}).refine(data => (data.buttonText && data.buttonLink) || (!data.buttonText && !data.buttonLink), {
  message: "Si añades texto al botón, el enlace también es requerido.",
  path: ["buttonLink"],
});

type SlideFormValues = z.infer<typeof formSchema>;

interface SlideFormProps {
  slide?: HeroSlide | null;
  onSuccess: () => void;
}

export function SlideForm({ slide, onSuccess }: SlideFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<SlideFormValues> = slide
    ? slide
    : {
        order: 1,
        title: "",
        description: "",
        imageUrl: 'https://placehold.co/1280x720.png',
        imageHint: 'abstract background',
      };

  const form = useForm<SlideFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [slide, form]);

  async function onSubmit(data: SlideFormValues) {
    setIsSubmitting(true);
    try {
      await upsertSlide(data);
      toast({
        title: "¡Éxito!",
        description: `La diapositiva "${data.title}" ha sido ${slide ? 'actualizada' : 'creada'} correctamente.`,
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la diapositiva.",
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orden</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1" {...field} />
              </FormControl>
              <FormDescription>El orden en que aparecerá la diapositiva.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título principal de la diapositiva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Texto descriptivo corto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL de la Imagen de Fondo</FormLabel>
                <FormControl>
                    <Input placeholder="https://placehold.co/1280x720.png" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="imageHint"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Pista de IA para Imagen</FormLabel>
                <FormControl>
                    <Input placeholder="Ej: concert crowd" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        <Separator />
        <h3 className="font-medium text-lg">Botón (Opcional)</h3>

        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Texto del Botón</FormLabel>
                    <FormControl>
                        <Input placeholder="Ver más" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="buttonLink"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Enlace del Botón</FormLabel>
                    <FormControl>
                        <Input placeholder="/blog" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <Button type="submit" className="w-full !mt-8" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {slide ? "Guardar Cambios" : "Crear Diapositiva"}
        </Button>
      </form>
    </Form>
  );
}
