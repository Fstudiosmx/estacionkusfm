"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce una dirección de correo electrónico válida.",
  }),
  showIdea: z.string().min(10, {
    message: "La idea del programa debe tener al menos 10 caracteres.",
  }),
  message: z.string().optional(),
})

export function JoinForm() {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email: "",
          showIdea: "",
          message: "",
        },
      })
     
      function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        toast({
            title: "¡Solicitud Enviada!",
            description: "Gracias por tu interés. Nos pondremos en contacto pronto.",
          })
        form.reset();
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
                <Input placeholder="Tu Nombre" {...field} />
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
                <Input placeholder="tu@ejemplo.com" {...field} />
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
                <Input placeholder="Ej: 'Análisis semanal del Rock de los 80'" {...field} />
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Enviar Solicitud</Button>
      </form>
    </Form>
  )
}
