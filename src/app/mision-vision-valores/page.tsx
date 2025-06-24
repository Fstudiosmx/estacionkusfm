import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Heart } from "lucide-react";

export default function MisionVisionValoresPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Nuestros Principios
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Las creencias fundamentales que dan forma a nuestro sonido y nuestra comunidad.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        <Card>
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Target className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Ser la voz líder en la radio en línea, ofreciendo contenido de audio diverso y de alta calidad que entretiene, informa e inspira a nuestra comunidad global de oyentes.
                </p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Eye className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Crear un mundo donde cada voz tenga una plataforma y cada oyente pueda encontrar su comunidad. Visualizamos un futuro donde la radio trasciende fronteras y conecta a las personas a través de historias y sonidos compartidos.
                </p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Heart className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Nuestros Valores</CardTitle>
            </CardHeader>
            <CardContent>
                 <ul className="text-muted-foreground space-y-2 text-left">
                    <li className="flex items-start gap-2"><Heart className="h-4 w-4 mt-1 shrink-0 text-accent"/><strong>Autenticidad:</strong> Nos mantenemos fieles a nosotros mismos y a nuestros oyentes.</li>
                    <li className="flex items-start gap-2"><Heart className="h-4 w-4 mt-1 shrink-0 text-accent"/><strong>Diversidad:</strong> Celebramos una amplia gama de voces, géneros y perspectivas.</li>
                    <li className="flex items-start gap-2"><Heart className="h-4 w-4 mt-1 shrink-0 text-accent"/><strong>Comunidad:</strong> Fomentamos un sentido de pertenencia entre nuestros oyentes y creadores.</li>
                     <li className="flex items-start gap-2"><Heart className="h-4 w-4 mt-1 shrink-0 text-accent"/><strong>Innovación:</strong> Adoptamos nuevas tecnologías para mejorar la experiencia auditiva.</li>
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
