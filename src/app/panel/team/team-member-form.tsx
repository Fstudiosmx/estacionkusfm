
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
import { TeamMember } from "@/lib/data";
import { upsertTeamMember } from "./actions";
import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre es requerido."),
  role: z.string().min(2, "El rol es requerido."),
  image: z.string().url("Debe ser una URL válida."),
  hint: z.string().optional(),
  order: z.coerce.number().min(1, "El orden es requerido."),
  facebookUrl: z.string().url("URL de Facebook no válida").optional().or(z.literal('')),
  instagramUrl: z.string().url("URL de Instagram no válida").optional().or(z.literal('')),
  twitterUrl: z.string().url("URL de Twitter/X no válida").optional().or(z.literal('')),
});

type TeamMemberFormValues = z.infer<typeof formSchema>;

interface TeamMemberFormProps {
  member?: TeamMember | null;
  onSuccess: () => void;
}

export function TeamMemberForm({ member, onSuccess }: TeamMemberFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo(() => (member 
    ? { ...member, facebookUrl: member.facebookUrl || '', instagramUrl: member.instagramUrl || '', twitterUrl: member.twitterUrl || '' }
    : {
        order: 1,
        name: '',
        role: '',
        image: 'https://placehold.co/300x300.png',
        hint: 'portrait',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: ''
      }), [member]);

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  async function onSubmit(data: TeamMemberFormValues) {
    setIsSubmitting(true);
    try {
      await upsertTeamMember(data);
      toast({
        title: "¡Éxito!",
        description: `El miembro "${data.name}" ha sido ${member ? 'actualizado' : 'creado'} correctamente.`,
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el miembro del equipo.",
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
              name="order"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
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
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del miembro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol / Programa</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Morning Commute" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL de Imagen</FormLabel>
                <FormControl>
                    <Input placeholder="https://placehold.co/300x300.png" {...field} />
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
                    <Input placeholder="Ej: male portrait" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <Separator className="my-6"/>
        
        <h3 className="text-lg font-medium">Redes Sociales (Opcional)</h3>

        <FormField
            control={form.control}
            name="twitterUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL de Twitter / X</FormLabel>
                <FormControl>
                    <Input placeholder="https://x.com/usuario" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="instagramUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL de Instagram</FormLabel>
                <FormControl>
                    <Input placeholder="https://instagram.com/usuario" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="facebookUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL de Facebook</FormLabel>
                <FormControl>
                    <Input placeholder="https://facebook.com/usuario" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {member ? "Guardar Cambios" : "Crear Miembro"}
        </Button>
      </form>
    </Form>
  );
}
