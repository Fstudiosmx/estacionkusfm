
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, KeyRound, Database, Users, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function DocsPage() {
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
                    <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm">
                        <code className="text-secondary-foreground">
{`
// src/lib/firebase.ts

// ...

// IMPORTANTE: Reemplaza esto con la configuración de tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSy...YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// ...
`}
                        </code>
                    </pre>
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
                                <li>Haz clic en <strong>Email/Contraseña</strong> en la lista de proveedores y habilítalo.</li>
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
                        <li>Primero, debemos añadir manualmente un código de invitación inicial.
                             <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                                <li>Ve a tu base de datos de <strong>Firestore</strong>.</li>
                                <li>Haz clic en <strong>Iniciar colección</strong>. Introduce `invitationCodes` como ID.</li>
                                <li>Haz clic en <strong>ID automático</strong> para el documento.</li>
                                <li>Añade los siguientes campos:
                                    <ul className="list-circle list-inside ml-6 mt-1">
                                        <li>`code` (string): `KUSFM2024`</li>
                                        <li>`used` (boolean): `false`</li>
                                        <li>`createdAt` (timestamp): elige la fecha actual</li>
                                    </ul>
                                </li>
                                <li>Haz clic en <strong>Guardar</strong>.</li>
                            </ul>
                        </li>
                         <li className="mt-2">Inicia la aplicación y navega a la página <Link href="/registro" className="text-primary underline">/registro</Link>.</li>
                        <li>Cuando se te pida el código de invitación, introduce: <strong className="text-accent font-mono bg-muted px-2 py-1 rounded">KUSFM2024</strong></li>
                        <li>Completa el formulario con el email y la contraseña que desees para tu cuenta de administrador.</li>
                        <li>¡Listo! Serás redirigido al panel de administración.</li>
                        <li className="mt-2"><strong>Importar Contenido Demo (¡Fácil!):</strong>
                            <ul className="list-disc list-inside ml-6 mt-1">
                                <li>En el panel, verás una tarjeta especial que te invita a poblar la base de datos.</li>
                                <li>Haz clic en el botón <strong>"Importar Datos de Ejemplo"</strong>.</li>
                                <li>Espera unos segundos y la página se recargará. ¡Todo el contenido de demostración (blog, canciones, etc.) se habrá importado automáticamente!</li>
                            </ul>
                        </li>
                    </ol>
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                     <div className="p-3 bg-primary/10 rounded-full">
                        <Code className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Paso 4: Configurar URLs de la Radio (Opcional)</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>La aplicación ya viene pre-configurada con un stream de radio de demostración. Si tienes tu propio servidor de radio (AzuraCast, ZenoFM, etc.), puedes cambiar las URLs desde el panel de administración.</p>
                     <ol className="list-decimal list-inside space-y-2">
                        <li>Ve a la página de <Link href="/panel" className="text-primary underline">Panel</Link> e inicia sesión.</li>
                        <li>Busca la tarjeta de <strong>Configuración</strong> y haz clic en "Gestionar".</li>
                        <li>Reemplaza las URLs del stream, "Now Playing" e Historial con las de tu propio servidor de radio.</li>
                        <li>Guarda los cambios. ¡Tu radio ahora está conectada!</li>
                    </ol>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
