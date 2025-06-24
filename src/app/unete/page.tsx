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
            Become a Voice at RadioWave
          </h1>
          <p className="text-muted-foreground md:text-lg">
            Do you have a passion for music, a unique perspective, or a story the world needs to hear? RadioWave is always searching for fresh, new voices to join our diverse family of hosts and content creators.
          </p>
          <p className="text-muted-foreground">
            Whether you're an experienced broadcaster or just starting, we provide the platform and support to help you create compelling audio content. Fill out the form to tell us about your show idea, and let's make something amazing together.
          </p>
           <div className="border-l-4 border-primary pl-4">
             <p className="italic text-muted-foreground">"The best part about RadioWave is the creative freedom. It's a place where your voice truly matters." - Samantha Bee, Host of 'Indie Vibes'</p>
           </div>
        </div>
        <div className="p-8 bg-secondary rounded-lg">
            <JoinForm />
        </div>
      </div>
    </div>
  );
}
