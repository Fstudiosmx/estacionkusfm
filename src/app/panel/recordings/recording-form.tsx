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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RecordedShow } from "@/lib/data";
import { upsertRecording } from "./actions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  host: z.string().min(2, "El presentador es requerido."),
  date: z.string().min(1, "La fecha es requerida."),
  duration: z.string().min(3, "La duración es requerida."),
  description: z.string().min(10, "La descripción es requerida."),
  imageUrl: z.string().url("Debe ser una URL válida."),
  imageHint: z.string().optional(),
});

type RecordingFormValues = z.infer<typeof formSchema>;

interface RecordingFormProps {
  recording?: RecordedShow | null;
  onSuccess: () => void;
}

export function RecordingForm({ recording, onSuccess }: RecordingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<RecordingFormValues> = recording
    ? { ...recording }
    : {
        date: format(new Date(), 'dd MMMM, yyyy'),
        host: 'EstacionKusFM',
        imageUrl: 'https://placehold.co/600x400.png',
        duration: "60 min"
      };

  const form = useForm<RecordingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [recording, form, defaultValues]);

  async function onSubmit(data: RecordingFormValues) {
    setIsSubmitting(true);
    try {
      await upsertRecording(data);
      toast({
        title: "¡Éxito!",
        description: `La grabación "${data.title}" ha sido ${recording ? 'actualizada' : 'creada'} correctamente.`,
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la grabación.",
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título de la grabación" {...field} />
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
                <Textarea placeholder="Un resumen corto de la grabación" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                    <FormLabel>Presentador</FormLabel>
                    <FormControl>
                        <Input placeholder="Nombre del presentador" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                        <Input placeholder="1 de Enero, 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Duración</FormLabel>
                    <FormControl>
                        <Input placeholder="60 min" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                    <FormLabel>URL de la Imagen</FormLabel>
                    <FormControl>
                        <Input placeholder="https://placehold.co/600x400.png" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
         <FormField
            control={form.control}
            name="imageHint"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Pista IA para Imagen</FormLabel>
                <FormControl>
                    <Input placeholder="Ej: tech podcast" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {recording ? "Guardar Cambios" : "Crear Grabación"}
        </Button>
      </form>
    </Form>
  );
}
