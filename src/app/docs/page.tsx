
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, KeyRound, Database, Users, UploadCloud } from 'lucide-react';
import Link from 'next/link';

const firestoreData = `{
  "blogPosts": [
    { "id": 1, "title": "Detrás del Micrófono: Una Entrevista con Alex Johnson", "author": "Jane Doe", "date": "15 de Julio, 2024", "excerpt": "Nos sentamos con el presentador de 'Morning Commute' para hablar sobre su trayectoria en la radio, su música favorita y lo que lo despierta por la mañana.", "content": "En esta charla exclusiva, Alex Johnson comparte sus inicios en el mundo de la radio, desde sus días en la radio universitaria hasta convertirse en una de las voces más reconocidas de las mañanas. Hablamos de los retos de la transmisión en vivo, la importancia de conectar con la audiencia y sus momentos más memorables al aire. Además, nos revela su proceso para descubrir nueva música y qué artistas no pueden faltar en su playlist personal. Una conversación íntima que te permitirá conocer al hombre detrás del micrófono.", "imageUrl": "https://placehold.co/600x400.png", "category": "Entrevistas" },
    { "id": 2, "title": "El Auge del Indie Pop: Una Mirada a la Escena Actual", "author": "John Smith", "date": "10 de Julio, 2024", "excerpt": "El indie pop ha conquistado las ondas de radio. Exploramos los artistas y sonidos que definen el género en la década de 2020.", "content": "Desde sus raíces alternativas hasta su actual dominio en las listas de popularidad, el indie pop ha demostrado ser más que una moda pasajera. En este artículo, analizamos las características que definen el sonido actual, la influencia de las plataformas de streaming en su difusión y cómo los artistas independientes están redefiniendo las reglas de la industria musical. Presentamos a algunos de los actos más prometedores y repasamos los álbumes que están marcando el pulso de esta vibrante escena musical.", "imageUrl": "https://placehold.co/600x400.png", "category": "Música" },
    { "id": 3, "title": "Nuestros 5 Álbumes Favoritos del Año (Hasta Ahora)", "author": "Staff de EstacionKusFM", "date": "5 de Julio, 2024", "excerpt": "El año ya va por la mitad, y estamos resumiendo los mejores álbumes que han estado en repetición en el estudio de EstacionKusFM.", "content": "La primera mitad del año nos ha regalado una increíble cantidad de música excepcional. El equipo de EstacionKusFM ha debatido, votado y compilado una lista de los cinco álbumes que consideramos imprescindibles. Desde debuts sorprendentes hasta trabajos consagrados de artistas reconocidos, nuestra selección abarca una variedad de géneros y estilos. Descubre cuáles son nuestros favoritos y por qué creemos que estos discos resistirán el paso del tiempo.", "imageUrl": "https://placehold.co/600x400.png", "category": "Reseñas" },
    { "id": 4, "title": "Cómo Apoyamos el Talento Local con Music Rally", "author": "Equipo Comunitario", "date": "28 de Junio, 2024", "excerpt": "Aprende más sobre nuestra campaña 'Local Music Rally' y los increíbles artistas que hemos presentado hasta ahora.", "content": "En EstacionKusFM, creemos firmemente en el poder de la comunidad y en la importancia de apoyar a los artistas locales. Nuestra iniciativa 'Local Music Rally' nació con el objetivo de dar visibilidad al talento emergente de nuestra ciudad. En este post, te contamos cómo funciona la campaña, compartimos algunas historias de éxito de músicos que han participado y te explicamos cómo puedes unirte, ya sea como artista o como oyente, para fortalecer nuestra escena musical local.", "imageUrl": "https://placehold.co/600x400.png", "category": "Campañas" }
  ],
  "topSongs": [
    { "id": 1, "rank": 1, "title": "Echoes of Tomorrow", "artist": "Starlight Sirens", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "abstract space", "externalLink": "#" },
    { "id": 2, "rank": 2, "title": "Midnight Drive", "artist": "Neon Bloom", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "neon city", "externalLink": "#" },
    { "id": 3, "rank": 3, "title": "Chasing the Sun", "artist": "The Voyagers", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "sunrise beach", "externalLink": "#" },
    { "id": 4, "rank": 4, "title": "Velvet Horizon", "artist": "Aurora Haze", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "purple sunset", "externalLink": "#" },
    { "id": 5, "rank": 5, "title": "Crystal Clear", "artist": "Glass Animals", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "crystal prism", "externalLink": "#" },
    { "id": 6, "rank": 6, "title": "Lost in the Sound", "artist": "Wanderlust", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "person headphones", "externalLink": "#" },
    { "id": 7, "rank": 7, "title": "Retrograde", "artist": "Cosmic Drift", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "retro wave", "externalLink": "#" },
    { "id": 8, "rank": 8, "title": "City Lights", "artist": "Urban Glow", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "city night", "externalLink": "#" },
    { "id": 9, "rank": 9, "title": "Ocean Deep", "artist": "Tidal Waves", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "deep ocean", "externalLink": "#" },
    { "id": 10, "rank": 10, "title": "Solar Flare", "artist": "Galaxy Runners", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "solar flare", "externalLink": "#", "youtubeVideoId": "jfKfPfyJRdk", "spotifyLink": "#", "appleMusicLink": "#", "youtubeMusicLink": "#" }
  ],
  "weeklySchedule": [
    { "day": "Monday", "schedule": [ { "time": "08:00 - 10:00", "title": "Morning Commute", "host": "Alex Johnson" }, { "time": "10:00 - 12:00", "title": "Indie Vibes", "host": "Samantha Bee" } ] },
    { "day": "Tuesday", "schedule": [ { "time": "08:00 - 10:00", "title": "Sunrise Sessions", "host": "Maria Garcia" }, { "time": "10:00 - 12:00", "title": "Tech Talk", "host": "David Chen" } ] },
    { "day": "Wednesday", "schedule": [ { "time": "08:00 - 10:00", "title": "Morning Commute", "host": "Alex Johnson" }, { "time": "10:00 - 12:00", "title": "New Music Wednesday", "host": "Samantha Bee" } ] },
    { "day": "Thursday", "schedule": [ { "time": "08:00 - 10:00", "title": "Sunrise Sessions", "host": "Maria Garcia" }, { "time": "10:00 - 12:00", "title": "Throwback Thursday", "host": "David Chen" } ] },
    { "day": "Friday", "schedule": [ { "time": "08:00 - 10:00", "title": "Morning Commute", "host": "Alex Johnson" }, { "time": "10:00 - 12:00", "title": "Friday Feelings", "host": "Samantha Bee" } ] },
    { "day": "Saturday", "schedule": [ { "time": "09:00 - 11:00", "title": "Saturday Brunch", "host": "Various" }, { "time": "11:00 - 13:00", "title": "The Chart Show", "host": "Leo Maxwell" } ] },
    { "day": "Sunday", "schedule": [ { "time": "09:00 - 11:00", "title": "Easy Like Sunday Morning", "host": "Chloe Adams" }, { "time": "11:00 - 13:00", "title": "The Jazz Lounge", "host": "Marcus Cole" } ] }
  ]
}
`

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
                    <p>La aplicación utilizará Firestore para gestionar contenido dinámico como el Top 10 de canciones, los artículos del blog y los códigos de invitación. Es importante crearlo ahora.</p>
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
                        <UploadCloud className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Paso 3: Importar Contenido Inicial</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>Para empezar rápidamente, puedes poblar tu Firestore con datos de ejemplo. La forma más sencilla es añadir los documentos manualmente a través de la consola de Firebase. A continuación te explicamos cómo hacerlo para la colección `blogPosts` como ejemplo.</p>
                     <ol className="list-decimal list-inside space-y-2">
                        <li>En la consola de Firestore, haz clic en <strong>Iniciar colección</strong>.</li>
                        <li>Como ID de colección, introduce <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">blogPosts</code> y haz clic en <strong>Siguiente</strong>.</li>
                        <li>Para el ID del documento, haz clic en <strong>ID automático</strong>.</li>
                        <li>Ahora, añade los campos para el primer artículo del blog. Para cada campo del objeto JSON de abajo:
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>Introduce el nombre del campo (ej. `title`).</li>
                                <li>Selecciona el tipo de dato correcto (la mayoría son `string`, pero `id` y `rank` son `number`).</li>
                                <li>Copia y pega el valor correspondiente.</li>
                            </ul>
                            Por ejemplo, para el primer campo, introduce <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">id</code>, selecciona el tipo <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">number</code>, y pon como valor <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">1</code>. Haz clic en el icono de '+' para añadir el siguiente.
                        </li>
                        <li>Una vez añadidos todos los campos de un artículo, haz clic en <strong>Guardar</strong>.</li>
                        <li>Repite este proceso para cada uno de los artículos en la sección `blogPosts` de los datos de abajo.</li>
                    </ol>
                    <p className="mt-4 font-bold">Repite el proceso para las otras colecciones:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Colección `topSongs`:</strong> Usa el ID de colección `topSongs`. Los documentos pueden tener un ID automático. Asegúrate de que `rank` sea de tipo `number`.</li>
                        <li><strong>Colección `weeklySchedule`:</strong> Usa el ID de colección `weeklySchedule`. <strong>Importante:</strong> Para esta colección, el ID del documento no es automático. Debe ser el nombre del día en inglés (ej: `Monday`, `Tuesday`, etc.). Cada documento tendrá un solo campo llamado `schedule` de tipo `array`, que contendrá los programas de ese día.</li>
                    </ul>
                    <p className="mt-4">Aquí están los datos que puedes usar:</p>
                    <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm max-h-64">
                        <code className="text-secondary-foreground">
                            {firestoreData}
                        </code>
                    </pre>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                     <div className="p-3 bg-primary/10 rounded-full">
                        <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">Paso 4: Obtener y Añadir tus Credenciales</CardTitle>
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
                        <CardTitle className="font-headline">Paso 5: Crear tu Primer Usuario Administrador</CardTitle>
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

    