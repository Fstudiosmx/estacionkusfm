
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, KeyRound, Database, Users, UploadCloud, Radio } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FaGoogle } from "react-icons/fa";

export default function DocsPage() {
  const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm mt-2">
      <code className="text-secondary-foreground">{children}</code>
    </pre>
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline mb-4">Guía de Configuración de Firebase</h1>
          <p className="text-muted-foreground md:text-xl">
            Sigue estos pasos para conectar tu aplicación EstacionKusFM a tu propio proyecto de Firebase y hacerla completamente funcional.
          </p>
        </header>

        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Paso 1: Añadir tus Credenciales de Firebase</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>Tu aplicación necesita conectar con tu proyecto de Firebase usando unas credenciales únicas.</p>
                     <ol className="list-decimal list-inside space-y-2">
                        <li>En tu <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Consola de Firebase</a>, ve a <strong>Configuración del proyecto</strong> (el icono de engranaje en la parte superior izquierda).</li>
                        <li>En la pestaña <strong>General</strong>, desplázate hacia abajo hasta "Tus apps".</li>
                        <li>Selecciona la app web que has registrado (o crea una si aún no lo has hecho, es importante que sea una app de tipo "Web").</li>
                        <li>Busca la opción <strong>Configuración del SDK</strong> y selecciona <strong>Config</strong>.</li>
                        <li>Copia el objeto `firebaseConfig` que se muestra.</li>
                        <li>Abre el archivo <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">src/lib/firebase.ts</code> en tu proyecto y reemplaza el objeto `firebaseConfig` de marcador de posición con el que acabas de copiar.</li>
                    </ol>
                    <CodeBlock>
{`// src/lib/firebase.ts

// IMPORTANTE: Reemplaza esto con la configuración de tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSy...YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// ...`}
                    </CodeBlock>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Paso 2: Habilitar Autenticación y Firestore</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>Para que el inicio de sesión y la base de datos funcionen, necesitas habilitar dos servicios en Firebase.</p>
                    <ol className="list-decimal list-inside space-y-2">
                        <li><strong>Habilitar Autenticación:</strong>
                            <ul className="list-disc list-inside ml-6 mt-1">
                                <li>En el menú de tu Consola de Firebase, ve a <strong>Authentication</strong>.</li>
                                <li>Selecciona la pestaña <strong>Sign-in method</strong>.</li>
                                <li>Haz clic en <strong>Email/Contraseña</strong> y habilítalo.</li>
                                <li>Haz clic en <strong>Google</strong>, habilítalo y selecciona un correo electrónico de soporte.</li>
                            </ul>
                        </li>
                        <li className="mt-2"><strong>Crear Base de Datos (Firestore):</strong>
                             <ul className="list-disc list-inside ml-6 mt-1">
                                <li>En tu Consola de Firebase, ve a <strong>Firestore Database</strong>.</li>
                                <li>Haz clic en <strong>Crear base de datos</strong>.</li>
                                <li>Inicia en <strong>modo de prueba</strong>. Esto permite un acceso de lectura/escritura más abierto durante el desarrollo. <strong className="text-destructive-foreground">Recuerda asegurar tus reglas de seguridad antes de lanzar a producción.</strong></li>
                                <li>Elige la ubicación del servidor que prefieras y haz clic en <strong>Habilitar</strong>.</li>
                            </ul>
                        </li>
                    </ol>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                     <div className="p-3 bg-primary/10 rounded-full">
                        <UploadCloud className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Paso 3: Crear tu Primer Usuario y Poblar la Base de Datos</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>El registro de nuevos administradores está protegido por un código de invitación. Para crear tu primera cuenta e importar el contenido de demostración, sigue estos pasos:</p>
                     <ol className="list-decimal list-inside space-y-2">
                        <li>Primero, debemos añadir manualmente un código de invitación inicial en Firestore. Navega a tu base de datos y crea una nueva colección llamada `invitationCodes`. Añade un documento con los siguientes campos:
                            <ul className="list-disc list-inside ml-6 mt-1 font-mono text-xs">
                                <li>`code` (string): `KUSFM2024`</li>
                                <li>`used` (boolean): `false`</li>
                                <li>`createdAt` (timestamp): (fecha actual)</li>
                                <li>`usedBy` (string): (dejar vacío)</li>
                                <li>`usedAt` (timestamp): (dejar vacío)</li>
                            </ul>
                        </li>
                         <li className="mt-2">Inicia la aplicación y navega a la página <Link href="/registro" className="text-primary underline">/registro</Link>.</li>
                        <li>Cuando se te pida el código de invitación, introduce: <strong className="text-accent font-mono bg-muted px-2 py-1 rounded">KUSFM2024</strong></li>
                        <li>Completa el formulario con el email y la contraseña que desees para tu cuenta de administrador.</li>
                        <li className="mt-2"><strong>Importar Contenido Demo (¡Recomendado!):</strong>
                            <ul className="list-disc list-inside ml-6 mt-1">
                                <li>Una vez registrado, serás redirigido al panel de administración. Verás una tarjeta especial que te invita a poblar la base de datos.</li>
                                <li>Haz clic en el botón <strong>"Importar Datos de Ejemplo"</strong>.</li>
                                <li>Espera unos segundos y la página se recargará. ¡Todo el contenido de demostración (blog, canciones, patrocinadores, etc.) se habrá importado automáticamente!</li>
                            </ul>
                        </li>
                    </ol>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                     <div className="p-3 bg-primary/10 rounded-full">
                        <Radio className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Paso 4: Configuración de la Radio</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                    <p>
                        Para que el reproductor de radio y el historial de canciones funcionen, debes configurar tu proveedor de servicios de radio. Ve a <strong>Panel de Control &gt; Ajustes Generales</strong>.
                    </p>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="azuracast">
                        <AccordionTrigger>Configurar AzuraCast</AccordionTrigger>
                        <AccordionContent>
                          <p>Necesitarás tres datos de tu instancia de AzuraCast:</p>
                          <ul className="list-disc list-inside space-y-1 mt-2 pl-4">
                              <li><strong>URL Base:</strong> La URL principal de tu panel de AzuraCast. E.g., `https://radio.tudominio.com`</li>
                              <li><strong>ID de Estación:</strong> El nombre corto (shortcode) de tu estación. E.g., `estacion_principal`</li>
                              <li><strong>Clave API (Opcional):</strong> Para acceder al historial. Ve a `Tu Perfil > Claves API` para crear una. E.g., `20489200b1699478:6e6ba9ff38fc0d8c6a19906244a5bbcb`</li>
                          </ul>
                          <p className="mt-2">No olvides también poner la URL del stream de audio en el campo correspondiente.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="zenofm">
                        <AccordionTrigger>Configurar ZenoFM</AccordionTrigger>
                        <AccordionContent>
                          <p>Necesitarás tu UUID de Estación:</p>
                          <ul className="list-disc list-inside space-y-1 mt-2 pl-4">
                              <li><strong>UUID de Estación:</strong> Puedes encontrarlo en la URL de tu página de ZenoFM. Es la cadena de letras y números después de `/s/`.</li>
                          </ul>
                          <p className="mt-2">El historial de canciones no está disponible para ZenoFM a través de su API pública.</p>
                        </AccordionContent>
                      </AccordionItem>
                       <AccordionItem value="live365">
                        <AccordionTrigger>Configurar Live365</AccordionTrigger>
                        <AccordionContent>
                          <p>Necesitarás tu ID de Estación:</p>
                          <ul className="list-disc list-inside space-y-1 mt-2 pl-4">
                              <li><strong>ID de Estación:</strong> Es el número de identificación de tu estación en Live365.</li>
                          </ul>
                           <p className="mt-2">Asegúrate de que tu cuenta de Live365 permite el acceso a la API.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>


             <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                     <div className="p-3 bg-primary/10 rounded-full">
                        <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Referencia de la Base de Datos (Opcional)</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p className="mb-4">
                        A continuación se detalla la estructura de cada colección de Firestore. Usa esta guía si prefieres añadir contenido manualmente en lugar de usar el panel de administración.
                    </p>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="blogPosts">
                        <AccordionTrigger>blogPosts</AccordionTrigger>
                        <AccordionContent>
                          <p>Almacena los artículos del blog. Estructura de un documento:</p>
                          <ul className="list-disc list-inside space-y-1 mt-2 font-mono text-xs pl-4">
                              <li>`author` (string): "Jane Doe"</li>
                              <li>`category` (string): "Entrevistas"</li>
                              <li>`content` (string): "El texto completo..."</li>
                              <li>`excerpt` (string): "El resumen corto..."</li>
                              <li>`imageUrl` (string): "https://url.com/image.png"</li>
                              <li>`publishDate` (timestamp): Fecha y hora</li>
                              <li>`title` (string): "Título del Artículo"</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="topSongs">
                        <AccordionTrigger>topSongs</AccordionTrigger>
                        <AccordionContent>
                          <p>Contiene el ranking de las canciones principales. Estructura de un documento:</p>
                          <ul className="list-disc list-inside space-y-1 mt-2 font-mono text-xs pl-4">
                              <li>`artist` (string): "The Voyagers"</li>
                              <li>`coverArt` (string): "https://url.com/cover.png"</li>
                              <li>`coverArtHint` (string): "sunrise beach"</li>
                              <li>`rank` (number): 3</li>
                              <li>`title` (string): "Chasing the Sun"</li>
                              <li>`externalLink` (string): "#" (valor heredado, no usado)</li>
                              <li>`youtubeVideoId` (string): "jfKfPfyJRdk" (opcional)</li>
                              <li>`spotifyLink` (string): "https://spotify.com/..." (opcional)</li>
                              <li>`appleMusicLink` (string): "https://music.apple.com/..." (opcional)</li>
                              <li>`youtubeMusicLink` (string): "https://music.youtube.com/..." (opcional)</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="weeklySchedule">
                        <AccordionTrigger>weeklySchedule</AccordionTrigger>
                        <AccordionContent>
                          <p>Guarda la programación. Hay un documento por cada día (ID del doc: 'Monday', 'Tuesday', etc.).</p>
                           <p className="mt-2">El documento contiene un único campo `schedule` que es un array de objetos. Estructura del array `schedule`:</p>
                           <CodeBlock>{`
schedule: [
  {
    "time": "08:00 - 10:00",
    "title": "Morning Commute",
    "host": "Alex Johnson"
  },
  {
    "time": "10:00 - 12:00",
    "title": "Indie Vibes",
    "host": "Samantha Bee"
  }
]`}</CodeBlock>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="teamMembers">
                        <AccordionTrigger>teamMembers</AccordionTrigger>
                        <AccordionContent>
                          <p>Lista de los miembros del equipo. Estructura de un documento:</p>
                          <ul className="list-disc list-inside space-y-1 mt-2 font-mono text-xs pl-4">
                              <li>`name` (string): "Alex Johnson"</li>
                              <li>`role` (string): "Morning Commute"</li>
                              <li>`image` (string): "https://url.com/photo.png"</li>
                              <li>`hint` (string): "male portrait"</li>
                              <li>`order` (number): 1</li>
                              <li>`facebookUrl` (string): "https://facebook.com/..." (opcional)</li>
                              <li>`instagramUrl` (string): "https://instagram.com/..." (opcional)</li>
                              <li>`twitterUrl` (string): "https://x.com/..." (opcional)</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="recordedShows">
                        <AccordionTrigger>recordedShows</AccordionTrigger>
                        <AccordionContent>
                          <p>Contiene los podcasts y programas grabados. Estructura de un documento:</p>
                          <ul className="list-disc list-inside space-y-1 mt-2 font-mono text-xs pl-4">
                              <li>`title` (string): "Indie Vibes Ep. 12"</li>
                              <li>`host` (string): "Samantha Bee"</li>
                              <li>`duration` (string): "45 min"</li>
                              <li>`description` (string): "Un mix de nuevos temas..."</li>
                              <li>`imageUrl` (string): "https://url.com/show.png"</li>
                              <li>`imageHint` (string): "indie music"</li>
                              <li>`publishDate` (timestamp): Fecha y hora</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="sponsors">
                        <AccordionTrigger>sponsors</AccordionTrigger>
                        <AccordionContent>
                          <p>Almacena la información de los patrocinadores. Estructura de un documento:</p>
                          <ul className="list-disc list-inside space-y-1 mt-2 font-mono text-xs pl-4">
                              <li>`name` (string): "Café del Sol"</li>
                              <li>`imageUrl` (string): "https://url.com/logo.png"</li>
                              <li>`hint` (string): "coffee shop"</li>
                              <li>`websiteUrl` (string): "https://cafedelsol.com"</li>
                              <li>`level` (string): "platinum" | "gold" | "silver"</li>
                              <li>`order` (number): 1</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="invitationCodes">
                        <AccordionTrigger>invitationCodes</AccordionTrigger>
                        <AccordionContent>
                          <p>Guarda los códigos de invitación. Estructura de un documento:</p>
                          <ul className="list-disc list-inside space-y-1 mt-2 font-mono text-xs pl-4">
                              <li>`code` (string): "KUSFM-ABC12345"</li>
                              <li>`used` (boolean): false</li>
                              <li>`createdAt` (timestamp): Fecha y hora</li>
                              <li>`usedBy` (string): email del usuario (se rellena al usarlo)</li>
                              <li>`usedAt` (timestamp): Fecha y hora (se rellena al usarlo)</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="siteSettings">
                        <AccordionTrigger>siteSettings</AccordionTrigger>
                        <AccordionContent>
                          <p>Un único documento (con ID 'config') que almacena la configuración global del sitio. Estructura del documento:</p>
                          <ul className="list-disc list-inside space-y-1 mt-2 font-mono text-xs pl-4">
                              <li>`radioProvider` (string): "azuracast" | "zenofm" | "live365"</li>
                              <li>`streamUrl` (string): "https://..."</li>
                              <li>`azuracastBaseUrl` (string): "https://..." (si usas Azuracast)</li>
                              <li>`azuracastStationId` (string): "..." (si usas Azuracast)</li>
                              <li>`azuracastApiKey` (string): "..." (opcional, si usas Azuracast)</li>
                              <li>`zenoStationUuid` (string): "..." (si usas ZenoFM)</li>
                              <li>`live365StationId` (string): "..." (si usas Live365)</li>
                              <li>`showDocsLink` (boolean): true</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
