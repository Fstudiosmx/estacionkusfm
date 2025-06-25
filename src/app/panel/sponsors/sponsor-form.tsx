
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
import { Sponsor } from "@/lib/data";
import { upsertSponsor } from "./actions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre es requerido."),
  websiteUrl: z.string().url("Debe ser una URL válida."),
  imageUrl: z.string().url("Debe ser una URL de imagen válida."),
  hint: z.string().optional(),
  level: z.enum(["platinum", "gold", "silver"], {
    errorMap: () => ({ message: "Debes seleccionar un nivel." }),
  }),
  order: z.coerce.number().min(1, "El orden es requerido."),
});

type SponsorFormValues = z.infer<typeof formSchema>;

interface SponsorFormProps {
  sponsor?: Sponsor | null;
  onSuccess: () => void;
}

export function SponsorForm({ sponsor, onSuccess }: SponsorFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<SponsorFormValues> = sponsor
    ? { ...sponsor }
    : {
        order: 1,
        name: '',
        websiteUrl: 'https://',
        imageUrl: 'https://placehold.co/300x150.png',
        hint: 'logo',
        level: 'silver',
      };

  const form = useForm<SponsorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [sponsor, form]);

  async function onSubmit(data: SponsorFormValues) {
    setIsSubmitting(true);
    try {
      await upsertSponsor(data);
      toast({
        title: "¡Éxito!",
        description: `El patrocinador "${data.name}" ha sido ${sponsor ? 'actualizado' : 'creado'} correctamente.`,
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el patrocinador.",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Patrocinador</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Sitio Web</FormLabel>
                <FormControl>
                    <Input placeholder="https://ejemplo.com" {...field} />
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
                <FormLabel>URL del Logo</FormLabel>
                <FormControl>
                    <Input placeholder="https://placehold.co/300x150.png" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="hint"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Pista de IA para Imagen</FormLabel>
                <FormControl>
                    <Input placeholder="Ej: coffee shop logo" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {sponsor ? "Guardar Cambios" : "Crear Patrocinador"}
        </Button>
      </form>
    </Form>
  );
}
