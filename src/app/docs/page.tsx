
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, KeyRound, Database, Users } from 'lucide-react';
import Link from 'next/link';

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
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Paso 1: Configurar la Autenticación de Firebase</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>Para que el inicio de sesión y el registro funcionen, necesitas habilitar el proveedor de Email/Contraseña en tu proyecto de Firebase.</p>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Ve a tu <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Consola de Firebase</a> y selecciona tu proyecto.</li>
                        <li>En el menú de la izquierda, ve a <strong>Authentication</strong>.</li>
                        <li>Selecciona la pestaña <strong>Sign-in method</strong>.</li>
                        <li>Haz clic en <strong>Email/Contraseña</strong> en la lista de proveedores y habilítalo.</li>
                    </ol>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                     <div className="p-3 bg-primary/10 rounded-full">
                        <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Paso 2: Crear la Base de Datos (Firestore)</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>En el futuro, la aplicación utilizará Firestore para gestionar contenido dinámico como el Top 10 de canciones, los artículos del blog y los códigos de invitación. Es importante crearlo ahora.</p>
                     <ol className="list-decimal list-inside space-y-2">
                        <li>En tu Consola de Firebase, ve a <strong>Firestore Database</strong>.</li>
                        <li>Haz clic en <strong>Crear base de datos</strong>.</li>
                        <li>Inicia en <strong>modo de prueba</strong>. Esto permite un acceso de lectura/escritura más abierto durante el desarrollo. <strong className="text-destructive-foreground">Recuerda asegurar tus reglas de seguridad antes de lanzar a producción.</strong></li>
                        <li>Elige la ubicación del servidor que prefieras y haz clic en <strong>Habilitar</strong>.</li>
                    </ol>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                     <div className="p-3 bg-primary/10 rounded-full">
                        <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Paso 3: Obtener y Añadir tus Credenciales</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>Tu aplicación necesita conectar con tu proyecto de Firebase usando unas credenciales únicas.</p>
                     <ol className="list-decimal list-inside space-y-2">
                        <li>En tu Consola de Firebase, ve a <strong>Configuración del proyecto</strong> (el icono de engranaje en la parte superior izquierda).</li>
                        <li>En la pestaña <strong>General</strong>, desplázate hacia abajo hasta "Tus apps".</li>
                        <li>Selecciona la app web que has registrado (o crea una si aún no lo has hecho).</li>
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
                        <Code className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Paso 4: Crear tu Primer Usuario Administrador</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>El registro está protegido por un código de invitación para evitar registros no deseados. Para crear tu primera cuenta, utiliza el código de invitación predefinido.</p>
                     <ol className="list-decimal list-inside space-y-2">
                        <li>Inicia la aplicación y navega a la página <Link href="/registro" className="text-primary underline">/registro</Link>.</li>
                        <li>Cuando se te pida el código de invitación, introduce: <strong className="text-accent font-mono bg-muted px-2 py-1 rounded">KUSFM2024</strong></li>
                        <li>Completa el formulario con el email y la contraseña que desees para tu cuenta de administrador.</li>
                        <li>¡Listo! Serás redirigido al panel de administración.</li>
                    </ol>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
