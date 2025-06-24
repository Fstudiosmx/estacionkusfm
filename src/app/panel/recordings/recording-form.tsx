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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { RecordedShow } from "@/lib/data";
import { upsertRecording } from "./actions";
import { useEffect, useState } from "react";
import { Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  host: z.string().min(2, "El presentador es requerido."),
  publishDate: z.date({
    required_error: "La fecha es requerida.",
  }),
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
    ? { ...recording, publishDate: recording.publishDate.toDate() }
    : {
        publishDate: new Date(),
        host: 'EstacionKusFM',
        imageUrl: 'https://placehold.co/600x400.png',
        duration: "60 min"
      };

  const form = useForm<RecordingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(recording ? { ...recording, publishDate: recording.publishDate.toDate() } : defaultValues);
  }, [recording, form]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                    <FormItem>
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
              name="publishDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Publicación</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd 'de' MMMM, yyyy", { locale: es })
                          ) : (
                            <span>Elige una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
