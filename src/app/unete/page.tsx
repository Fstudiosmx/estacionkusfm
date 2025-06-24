import Image from 'next/image';
import { JoinForm } from './join-form';
import { Mic, Radio } from 'lucide-react';

export default function UnetePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-block rounded-lg bg-primary/10 p-3">
            <Mic className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
            Conviértete en una Voz en EstacionKusFM
          </h1>
          <p className="text-muted-foreground md:text-lg">
            ¿Tienes pasión por la música, una perspectiva única o una historia que el mundo necesita escuchar? EstacionKusFM siempre está buscando voces nuevas y frescas para unirse a nuestra diversa familia de presentadores y creadores de contenido.
          </p>
          <p className="text-muted-foreground">
            Tanto si eres un locutor experimentado como si acabas de empezar, te proporcionamos la plataforma y el apoyo para ayudarte a crear contenido de audio atractivo. Rellena el formulario para contarnos tu idea de programa, y hagamos algo increíble juntos.
          </p>
           <div className="border-l-4 border-primary pl-4">
             <p className="italic text-muted-foreground">"La mejor parte de EstacionKusFM es la libertad creativa. Es un lugar donde tu voz realmente importa." - Samantha Bee, presentadora de 'Indie Vibes'</p>
           </div>
        </div>
        <div className="p-8 bg-secondary rounded-lg">
            <JoinForm />
        </div>
      </div>
    </div>
  );
}
