
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Copy, BrainCircuit, Tv, Clock, GraduationCap } from 'lucide-react';
import { getSiteSettings } from '@/lib/settings';
import type { SiteSettings } from '@/lib/data';
import { MexicoCityClock } from '@/components/mexico-city-clock';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

async function validateAccessCode(code: string): Promise<{ valid: boolean; settings?: SiteSettings }> {
  const settings = await getSiteSettings();
  if (settings.learningSpaceAccessCode && code === settings.learningSpaceAccessCode) {
    return { valid: true, settings };
  }
  return { valid: false };
}

const softwareLinks = [
  { name: 'VirtualDJ', url: 'https://www.virtualdj.com/download/' },
  { name: 'SAM Broadcaster', url: 'https://spacial.com/sam-broadcaster-pro/' },
  { name: 'RadioBOSS', url: 'https://www.djsoft.net/enu/radioboss_download.htm' },
];

const recommendedHardware = [
    { item: 'Micrófono Condensador', example: 'Audio-Technica AT2020' },
    { item: 'Interfaz de Audio', example: 'Focusrite Scarlett 2i2' },
    { item: 'Auriculares de Monitoreo', example: 'Sony MDR-7506' },
    { item: 'Mezcladora (Opcional)', example: 'Behringer Xenyx Q802USB' },
];

const courses = [
  { title: "Técnicas de Voz y Dicción", description: "Aprende a modular tu voz, mejorar tu pronunciación y proyectar con confianza para cautivar a tu audiencia." },
  { title: "Creación de Contenido Atractivo", description: "Descubre cómo estructurar tu programa, planificar segmentos interesantes y mantener a los oyentes enganchados." },
  { title: "Dominio del Software de Transmisión", description: "Una guía práctica sobre las herramientas del oficio, desde la configuración inicial hasta las funciones avanzadas." },
  { title: "Construyendo tu Marca Personal", description: "Aprende a usar las redes sociales y a interactuar con tu comunidad para crear una base de seguidores leales." },
  { title: "Monetización y Crecimiento", description: "Explora estrategias para hacer de tu pasión una carrera sostenible, desde patrocinios hasta donaciones." },
];

export default function LearningSpacePage() {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        const sessionAuth = sessionStorage.getItem('learning_space_auth');
        if (currentUser || sessionAuth === 'true') {
            setIsLoading(true);
            getSiteSettings().then(s => {
                setSettings(s);
                setIsAuthenticated(true);
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    });

    return () => unsubscribe();
  }, []);

  const handleValidation = async () => {
    setIsLoading(true);
    const { valid, settings: fetchedSettings } = await validateAccessCode(accessCode);
    if (valid && fetchedSettings) {
      toast({ title: "Acceso Concedido", description: "Bienvenido al espacio de aprendizaje." });
      sessionStorage.setItem('learning_space_auth', 'true');
      setSettings(fetchedSettings);
      setIsAuthenticated(true);
    } else {
      toast({ title: "Acceso Denegado", description: "El código de acceso es incorrecto.", variant: 'destructive' });
    }
    setIsLoading(false);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado', description: 'El texto ha sido copiado al portapapeles.' });
  }
  
  if (isLoading) {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-20rem)] py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-20rem)] py-12">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline">Espacio de Aprendizaje</CardTitle>
            <CardDescription>Introduce el código de acceso para continuar.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="access-code">Código de Acceso</Label>
              <Input
                id="access-code"
                type="password"
                placeholder="Ingresa el código"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleValidation()}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleValidation} disabled={isLoading || !accessCode} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Espacio de Aprendizaje para Locutores
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Todos los recursos que necesitas para empezar a transmitir como un profesional.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Tv className="h-6 w-6"/>Datos de Conexión</CardTitle>
            <CardDescription>Usa estos datos en tu software de transmisión para salir al aire.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             {Object.entries({
                'Servidor': settings?.streamServer,
                'Puerto': settings?.streamPort,
                'Contraseña': settings?.streamPassword,
             }).map(([label, value]) => value ? (
                <div key={label} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                    <div>
                        <span className="font-semibold">{label}:</span>
                        <span className="ml-2 font-mono text-muted-foreground">{value}</span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => copyToClipboard(value)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
             ) : null)}
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Clock className="h-6 w-6"/>Reloj Oficial</CardTitle>
            <CardDescription>Hora del centro de México, para coordinación de programas.</CardDescription>
          </CardHeader>
          <CardContent>
             <MexicoCityClock />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Software de Transmisión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {softwareLinks.map((software) => (
              <Button key={software.name} asChild variant="secondary" className="w-full justify-between">
                <a href={software.url} target="_blank" rel="noopener noreferrer">
                  {software.name}
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Equipo Recomendado</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="space-y-2 text-sm">
                {recommendedHardware.map((hw) => (
                    <li key={hw.item} className="flex justify-between p-2 bg-muted rounded-md">
                        <span className="font-semibold">{hw.item}:</span>
                        <span className="text-muted-foreground text-right">{hw.example}</span>
                    </li>
                ))}
             </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Spots de la Emisora</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Próximamente: descarga aquí los jingles y spots obligatorios.</p>
          </CardContent>
        </Card>
        
         <div className="md:col-span-2 lg:col-span-3 mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><GraduationCap className="h-6 w-6"/>Cursos Recomendados</CardTitle>
                    <CardDescription>Recursos seleccionados para potenciar tus habilidades como locutor.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course, index) => (
                        <Card key={index} className="bg-secondary/50">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{course.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
