import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Radio, Users, History } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const teamMembers = [
  { name: 'Alex Johnson', role: 'Morning Commute', image: 'https://placehold.co/300x300.png' },
  { name: 'Samantha Bee', role: 'Indie Vibes', image: 'https://placehold.co/300x300.png' },
  { name: 'Mike Richards', role: 'Lunchtime Classics', image: 'https://placehold.co/300x300.png' },
  { name: 'Jessica Wu', role: 'Afternoon Chill', image: 'https://placehold.co/300x300.png' },
  { name: 'Chris Green', role: 'Drive Time Power Mix', image: 'https://placehold.co/300x300.png' },
  { name: 'Maria Garcia', role: 'Sunrise Sessions', image: 'https://placehold.co/300x300.png' },
];

export default function NosotrosPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          About RadioWave
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          The people, the passion, and the story behind your favorite station.
        </p>
      </div>

      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-secondary p-3">
              <Radio className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold font-headline">Who We Are</h2>
            <p className="text-muted-foreground">
              RadioWave started as a small project by a group of music lovers who wanted to create a space for authentic, diverse, and engaging audio content. We're more than just a radio station; we're a community of artists, storytellers, and listeners united by a passion for great sound. We believe in the power of radio to connect people and ideas.
            </p>
            <p className="text-muted-foreground">
              Our programming is carefully curated to bring you a mix of genres, from indie rock to global grooves, alongside thought-provoking talk shows that explore culture, technology, and community life.
            </p>
             <Button asChild>
                <Link href="/mision-vision-valores">Our Mission & Vision</Link>
            </Button>
          </div>
          <div>
            <Image
              src="https://placehold.co/600x400.png"
              data-ai-hint="radio studio"
              width={600}
              height={400}
              alt="RadioWave Studio"
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
            <h2 className="text-3xl font-bold font-headline mt-4">Meet the Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The voices that keep you company every day. Our hosts are passionate individuals with unique perspectives and a love for what they do.</p>
        </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {teamMembers.map((member) => (
                <div key={member.name} className="text-center">
                    <Image src={member.image} data-ai-hint="portrait person" alt={member.name} width={150} height={150} className="rounded-full mx-auto mb-4" />
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
            <h2 className="text-3xl font-bold font-headline mt-4">Our Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A brief look at our history and milestones.</p>
        </div>
        <Card>
            <CardContent className="p-8">
                <ol className="relative border-l border-border">                  
                    <li className="mb-10 ml-6">            
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-secondary rounded-full -left-3 ring-8 ring-background">
                            <Radio className="w-3 h-3 text-primary" />
                        </span>
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-foreground">The Idea is Born <span className="bg-primary/20 text-primary text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">2020</span></h3>
                        <p className="text-base font-normal text-muted-foreground">A few friends, a garage, and a dream to bring better radio to the web. RadioWave is conceptualized.</p>
                    </li>
                    <li className="mb-10 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-secondary rounded-full -left-3 ring-8 ring-background">
                            <Radio className="w-3 h-3 text-primary" />
                        </span>
                        <h3 className="mb-1 text-lg font-semibold text-foreground">First Broadcast</h3>
                        <p className="text-base font-normal text-muted-foreground">After months of planning, RadioWave officially goes on air, streaming our first show online.</p>
                    </li>
                    <li className="ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-secondary rounded-full -left-3 ring-8 ring-background">
                            <Radio className="w-3 h-3 text-primary" />
                        </span>
                        <h3 className="mb-1 text-lg font-semibold text-foreground">Community Growth</h3>
                        <p className="text-base font-normal text-muted-foreground">Today, we reach thousands of listeners daily and continue to grow, thanks to our amazing community.</p>
                    </li>
                </ol>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
