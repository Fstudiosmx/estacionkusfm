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
import { BlogPost } from "@/lib/data";
import { upsertBlogPost } from "./actions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  author: z.string().min(2, "El autor debe tener al menos 2 caracteres."),
  date: z.string().min(1, "La fecha es requerida."),
  excerpt: z.string().min(10, "El extracto debe tener al menos 10 caracteres."),
  content: z.string().min(20, "El contenido debe tener al menos 20 caracteres."),
  imageUrl: z.string().url("Debe ser una URL válida."),
  category: z.string().min(2, "La categoría debe tener al menos 2 caracteres."),
});

type BlogPostFormValues = z.infer<typeof formSchema>;

interface BlogPostFormProps {
  post?: BlogPost | null;
  onSuccess: () => void;
}

export function BlogPostForm({ post, onSuccess }: BlogPostFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<BlogPostFormValues> = post
    ? { ...post }
    : {
        date: format(new Date(), 'dd de MMMM, yyyy'),
        author: 'Staff de EstacionKusFM',
        imageUrl: 'https://placehold.co/600x400.png'
      };

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [post, form, defaultValues]);

  async function onSubmit(data: BlogPostFormValues) {
    setIsSubmitting(true);
    try {
      await upsertBlogPost(data);
      toast({
        title: "¡Éxito!",
        description: `El artículo "${data.title}" ha sido ${post ? 'actualizado' : 'creado'} correctamente.`,
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el artículo.",
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
                <Input placeholder="Título del artículo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extracto</FormLabel>
              <FormControl>
                <Textarea placeholder="Un resumen corto del artículo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido Completo</FormLabel>
              <FormControl>
                <Textarea placeholder="El contenido completo del artículo..." className="min-h-[150px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Autor</FormLabel>
                <FormControl>
                    <Input placeholder="Nombre del autor" {...field} />
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
         <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Categoría</FormLabel>
                <FormControl>
                    <Input placeholder="Ej: Música, Entrevistas" {...field} />
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
                <FormLabel>URL de la Imagen</FormLabel>
                <FormControl>
                    <Input placeholder="https://placehold.co/600x400.png" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {post ? "Guardar Cambios" : "Crear Artículo"}
        </Button>
      </form>
    </Form>
  );
}
