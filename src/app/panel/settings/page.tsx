"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useTransition } from "react";
import { Loader2, Radio, Video, BrainCircuit } from "lucide-react";
import { getSiteSettingsAction, upsertSiteSettings } from "./actions";
import { siteSettingsSchema, type SiteSettings } from "@/lib/data";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";


export default function SettingsPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    const form = useForm<SiteSettings>({
        resolver: zodResolver(siteSettingsSchema),
        defaultValues: {
            radioProvider: 'azuracast',
            streamUrl: '',
            azuracastBaseUrl: '',
            azuracastStationId: '',
            azuracastApiKey: '',
            zenoStationUuid: '',
            live365StationId: '',
            showDocsLink: true,
            hlsStreamUrl: '',
            streamServer: '',
            streamPort: '',
            streamPassword: '',
            learningSpaceAccessCode: ''
        }
    });

    const provider = form.watch("radioProvider");

    useEffect(() => {
        getSiteSettingsAction().then(data => {
            if (data) {
                setSettings(data);
                form.reset(data);
            }
        })
    }, [form]);


    const onSubmit = (data: SiteSettings) => {
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
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Radio className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle>Configuración de la Radio</CardTitle>
                                <CardDescription>
                                    Define las URLs para el stream de audio y las APIs de tu proveedor.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                        control={form.control}
                        name="radioProvider"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Proveedor de Radio</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un proveedor" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="azuracast">Azuracast</SelectItem>
                                    <SelectItem value="zenofm">ZenoFM</SelectItem>
                                    <SelectItem value="live365">Live365</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Elige el servicio que usas para transmitir tu radio.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
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
                                El enlace directo al stream de audio (ej. MP3, AAC). Es usado por el reproductor.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                        {provider === 'azuracast' && (
                            <div className="space-y-4 p-4 border rounded-md">
                                <h3 className="font-medium">Ajustes de AzuraCast</h3>
                                <FormField control={form.control} name="azuracastBaseUrl" render={({ field }) => (
                                    <FormItem><FormLabel>URL Base de AzuraCast</FormLabel><FormControl><Input placeholder="https://radio.tudominio.com" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="azuracastStationId" render={({ field }) => (
                                    <FormItem><FormLabel>ID de Estación (Shortcode)</FormLabel><FormControl><Input placeholder="estacion_principal" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="azuracastApiKey" render={({ field }) => (
                                    <FormItem><FormLabel>Clave API (Opcional)</FormLabel><FormControl><Input placeholder="20489200b1699478:..." {...field} /></FormControl><FormDescription>Requerida para ver el historial de canciones.</FormDescription><FormMessage /></FormItem>
                                )}/>
                            </div>
                        )}
                         {provider === 'zenofm' && (
                            <div className="space-y-4 p-4 border rounded-md">
                                <h3 className="font-medium">Ajustes de ZenoFM</h3>
                                <FormField control={form.control} name="zenoStationUuid" render={({ field }) => (
                                    <FormItem><FormLabel>UUID de Estación de ZenoFM</FormLabel><FormControl><Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} /></FormControl><FormDescription>Puedes encontrar esto en la URL de tu página de Zeno.</FormDescription><FormMessage /></FormItem>
                                )}/>
                            </div>
                        )}
                        {provider === 'live365' && (
                           <div className="space-y-4 p-4 border rounded-md">
                                <h3 className="font-medium">Ajustes de Live365</h3>
                                <FormField control={form.control} name="live365StationId" render={({ field }) => (
                                    <FormItem><FormLabel>ID de Estación de Live365</FormLabel><FormControl><Input placeholder="a12345" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Video className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle>Configuración de Video</CardTitle>
                                <CardDescription>
                                    Configura el stream para la página "Venos en Video".
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <FormField control={form.control} name="hlsStreamUrl" render={({ field }) => (
                            <FormItem><FormLabel>URL del Stream HLS</FormLabel><FormControl><Input placeholder="https://host.com/stream.m3u8" {...field} /></FormControl><FormDescription>La URL del manifiesto de tu stream de video en formato HLS.</FormDescription><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                </Card>

                 <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <BrainCircuit className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle>Espacio de Aprendizaje</CardTitle>
                                <CardDescription>
                                    Configura los datos para la página de aprendizaje de locutores.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="learningSpaceAccessCode" render={({ field }) => (
                            <FormItem><FormLabel>Código de Acceso</FormLabel><FormControl><Input placeholder="CÓDIGO_SECRETO" {...field} /></FormControl><FormDescription>El código que los locutores necesitarán para acceder a la página de aprendizaje.</FormDescription><FormMessage /></FormItem>
                        )}/>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="streamServer" render={({ field }) => (
                                <FormItem><FormLabel>Servidor de Stream</FormLabel><FormControl><Input placeholder="stream.example.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="streamPort" render={({ field }) => (
                                <FormItem><FormLabel>Puerto</FormLabel><FormControl><Input placeholder="8000" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="streamPassword" render={({ field }) => (
                            <FormItem><FormLabel>Contraseña del Stream</FormLabel><FormControl><Input type="password" placeholder="••••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                </Card>

                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Configuración del Sitio</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>
                
                <div className="flex gap-2 max-w-4xl mx-auto">
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
    </div>
    );
}
