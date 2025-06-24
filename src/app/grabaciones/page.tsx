import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock } from 'lucide-react';
import Image from 'next/image';

const recordedShows = [
    {
        id: 1,
        title: 'Indie Vibes Ep. 12: Summer Sounds',
        host: 'Samantha Bee',
        date: 'July 14, 2024',
        duration: '45 min',
        description: 'A mix of the best new indie tracks perfect for a summer day. Featuring interviews with upcoming artists.',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'indie music'
    },
    {
        id: 2,
        title: 'Tech Talk Ep. 8: The Future of AI',
        host: 'David Chen',
        date: 'July 12, 2024',
        duration: '60 min',
        description: 'Exploring the latest advancements in Artificial Intelligence and its impact on our daily lives.',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'tech podcast'
    },
    {
        id: 3,
        title: 'Global Grooves Ep. 5: Rhythms of Brazil',
        host: 'Fatima Khan',
        date: 'July 10, 2024',
        duration: '55 min',
        description: 'A journey through the vibrant and diverse music of Brazil, from Samba to Bossa Nova.',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'brazil carnival'
    },
     {
        id: 4,
        title: 'Throwback Thursday: 90s Hip-Hop Special',
        host: 'David Chen',
        date: 'July 8, 2024',
        duration: '90 min',
        description: 'Revisiting the golden age of Hip-Hop with classic tracks and forgotten gems from the 1990s.',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'hip hop'
    }
];

export default function GrabacionesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Podcasts & Recorded Shows
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Missed a live show? Catch up on our latest episodes and exclusive podcasts anytime, anywhere.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {recordedShows.map((show) => (
          <Card key={show.id} className="flex flex-col sm:flex-row overflow-hidden">
             <Image
                src={show.imageUrl}
                data-ai-hint={show.imageHint}
                alt={show.title}
                width={200}
                height={200}
                className="w-full sm:w-1/3 h-48 sm:h-auto object-cover"
              />
            <div className="flex flex-col flex-1">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">{show.title}</CardTitle>
                    <CardDescription>Hosted by {show.host}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground">{show.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-secondary/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{show.date} &middot; {show.duration}</span>
                    </div>
                    <Button size="sm">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Listen Now
                    </Button>
                </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
