
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { joinFormSchema, submitJoinApplication } from "./actions"
import { Loader2 } from "lucide-react"

export function JoinForm() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof joinFormSchema>>({
        resolver: zodResolver(joinFormSchema),
        defaultValues: {
          name: "",
          email: "",
          showIdea: "",
          message: "",
        },
      })
     
    async function onSubmit(values: z.infer<typeof joinFormSchema>) {
        setIsSubmitting(true)
        const result = await submitJoinApplication(values);

        if (result.success) {
            toast({
                title: "¡Solicitud Enviada!",
                description: result.message,
            })
            form.reset();
        } else {
             toast({
                title: "Error al enviar",
                description: result.message,
                variant: "destructive"
            })
        }
        setIsSubmitting(false)
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-2xl font-bold text-center font-headline">Formulario de Aplicación</h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Tu Nombre" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="tu@ejemplo.com" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="showIdea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tu Idea para un Programa</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 'Análisis semanal del Rock de los 80'" {...field} disabled={isSubmitting} />
              </FormControl>
               <FormDescription>
                Danos un título llamativo o un concepto breve para tu programa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuéntanos Más (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cuéntanos un poco sobre ti y tu idea para el programa..."
                  className="resize-none"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar Solicitud
        </Button>
      </form>
    </Form>
  )
}
