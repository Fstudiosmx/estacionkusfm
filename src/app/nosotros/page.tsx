import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Radio, Users, History } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const teamMembers = [
  { name: 'Alex Johnson', role: 'Morning Commute', image: 'https://placehold.co/300x300.png', hint: 'male portrait' },
  { name: 'Samantha Bee', role: 'Indie Vibes', image: 'https://placehold.co/300x300.png', hint: 'female portrait' },
  { name: 'Mike Richards', role: 'Lunchtime Classics', image: 'https://placehold.co/300x300.png', hint: 'male portrait smiling' },
  { name: 'Jessica Wu', role: 'Afternoon Chill', image: 'https://placehold.co/300x300.png', hint: 'female portrait glasses' },
  { name: 'Chris Green', role: 'Drive Time Power Mix', image: 'https://placehold.co/300x300.png', hint: 'male portrait headphones' },
  { name: 'Maria Garcia', role: 'Sunrise Sessions', image: 'https://placehold.co/300x300.png', hint: 'female portrait smiling' },
];

export default function NosotrosPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Sobre EstacionKusFM
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          La gente, la pasión y la historia detrás de tu estación favorita.
        </p>
      </div>

      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-secondary p-3">
              <Radio className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold font-headline">Quiénes Somos</h2>
            <p className="text-muted-foreground">
              EstacionKusFM comenzó como un pequeño proyecto de un grupo de amantes de la música que querían crear un espacio para contenido de audio auténtico, diverso y atractivo. Somos más que una estación de radio; somos una comunidad de artistas, narradores y oyentes unidos por la pasión por el buen sonido.
            </p>
            <p className="text-muted-foreground">
              Nuestra programación está cuidadosamente seleccionada para ofrecerte una mezcla de géneros, desde rock indie hasta ritmos globales, junto con programas de entrevistas que invitan a la reflexión y que exploran la cultura, la tecnología y la vida comunitaria.
            </p>
             <Button asChild>
                <Link href="/mision-vision-valores">Nuestra Misión y Visión</Link>
            </Button>
          </div>
          <div>
            <Image
              src="https://placehold.co/600x400.png"
              data-ai-hint="radio studio"
              width={600}
              height={400}
              alt="Estudio de EstacionKusFM"
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="text-center mb-8">
            <div className="inline-block rounded-lg bg-secondary p-3">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold font-headline mt-4">Conoce al Equipo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Las voces que te acompañan cada día. Nuestros presentadores son personas apasionadas con perspectivas únicas y amor por lo que hacen.</p>
        </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {teamMembers.map((member) => (
                <div key={member.name} className="text-center">
                    <Image src={member.image} data-ai-hint={member.hint} alt={member.name} width={150} height={150} className="rounded-full mx-auto mb-4" />
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
            ))}
        </div>
      </section>
      
       <section>
        <div className="text-center mb-8">
             <div className="inline-block rounded-lg bg-secondary p-3">
              <History className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold font-headline mt-4">Nuestra Trayectoria</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Un breve vistazo a nuestra historia e hitos.</p>
        </div>
        <Card>
            <CardContent className="p-8">
                <ol className="relative border-l border-border">                  
                    <li className="mb-10 ml-6">            
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-secondary rounded-full -left-3 ring-8 ring-background">
                            <Radio className="w-3 h-3 text-primary" />
                        </span>
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-foreground">Nace la Idea <span className="bg-primary/20 text-primary text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">2020</span></h3>
                        <p className="text-base font-normal text-muted-foreground">Unos amigos, un garaje y el sueño de llevar una mejor radio a la web. Se conceptualiza EstacionKusFM.</p>
                    </li>
                    <li className="mb-10 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-secondary rounded-full -left-3 ring-8 ring-background">
                            <Radio className="w-3 h-3 text-primary" />
                        </span>
                        <h3 className="mb-1 text-lg font-semibold text-foreground">Primera Transmisión</h3>
                        <p className="text-base font-normal text-muted-foreground">Después de meses de planificación, EstacionKusFM sale oficialmente al aire, transmitiendo nuestro primer programa en línea.</p>
                    </li>
                    <li className="ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-secondary rounded-full -left-3 ring-8 ring-background">
                            <Radio className="w-3 h-3 text-primary" />
                        </span>
                        <h3 className="mb-1 text-lg font-semibold text-foreground">Crecimiento de la Comunidad</h3>
                        <p className="text-base font-normal text-muted-foreground">Hoy, llegamos a miles de oyentes diariamente y seguimos creciendo, gracias a nuestra increíble comunidad.</p>
                    </li>
                </ol>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
