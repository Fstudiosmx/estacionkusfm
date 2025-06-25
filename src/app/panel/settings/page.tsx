
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { getSiteSettings, upsertSiteSettings, type SiteSettingsSchema } from "./actions";
import Link from "next/link";


export default function SettingsPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState<SiteSettingsSchema | null>(null);

    const form = useForm<SiteSettingsSchema>({
        resolver: zodResolver(z.object({
            streamUrl: z.string().url("Debe ser una URL de streaming válida."),
            nowPlayingUrl: z.string().url("Debe ser una URL de API válida."),
            historyUrl: z.string().url("Debe ser una URL de API válida."),
            showDocsLink: z.boolean(),
        })),
        defaultValues: {
            streamUrl: '',
            nowPlayingUrl: '',
            historyUrl: '',
            showDocsLink: true,
        }
    });

    useEffect(() => {
        getSiteSettings().then(data => {
            if (data) {
                setSettings(data);
                form.reset(data);
            }
        })
    }, [form]);


    const onSubmit = (data: SiteSettingsSchema) => {
        startTransition(async () => {
            try {
                await upsertSiteSettings(data);
                toast({
                    title: "¡Éxito!",
                    description: "La configuración del sitio ha sido actualizada.",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Ocurrió un error al guardar la configuración.",
                    variant: "destructive",
                });
            }
        });
    }

    if (!settings) {
        return (
             <div className="container mx-auto py-10">
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
             </div>
        )
    }

    return (
    <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Configuración General</h1>
                <p className="text-muted-foreground">Gestiona la configuración principal de tu sitio y radio.</p>
            </div>
        </div>

        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Configuración de la Radio</CardTitle>
                <CardDescription>
                    Define las URLs para el stream de audio y las APIs de AzuraCast, ZenoFM u otro proveedor.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="streamUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>URL del Stream de Audio</FormLabel>
                            <FormControl>
                                <Input placeholder="https://radio.servidor.com/listen/stream/radio.mp3" {...field} />
                            </FormControl>
                            <FormDescription>
                                El enlace directo al stream de audio (ej. MP3, AAC).
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="nowPlayingUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>URL de API "Now Playing"</FormLabel>
                            <FormControl>
                                <Input placeholder="https://radio.servidor.com/api/nowplaying/stream" {...field} />
                            </FormControl>
                             <FormDescription>
                                La URL de la API que devuelve la información de la canción actual.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="historyUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>URL de API del Historial</FormLabel>
                            <FormControl>
                                <Input placeholder="https://radio.servidor.com/api/station/stream/history" {...field} />
                            </FormControl>
                             <FormDescription>
                                La URL de la API que devuelve el historial de canciones.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <CardTitle>Configuración del Sitio</CardTitle>
                        
                        <FormField
                            control={form.control}
                            name="showDocsLink"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                    Mostrar Guía de Configuración
                                    </FormLabel>
                                    <FormDescription>
                                    Activa esta opción para mostrar el enlace a la página de documentación en el pie de página.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2">
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Cambios
                            </Button>
                             <Button variant="outline" asChild>
                                <Link href="/panel">Volver al Panel</Link>
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
         <div className="mt-8">
       
      </div>
    </div>
    );
}
