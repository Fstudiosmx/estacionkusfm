import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Sponsor } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Megaphone } from 'lucide-react';

async function getSponsors(): Promise<Sponsor[]> {
  try {
    const sponsorsCollection = collection(db, "sponsors");
    const q = query(sponsorsCollection, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sponsor));
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    return [];
  }
}

export async function SponsorsSection() {
  const sponsors = await getSponsors();

  if (sponsors.length === 0) {
    return null; // Don't render the section if there are no sponsors
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-secondary p-3">
                <Megaphone className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
            Nuestros Patrocinadores
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Agradecemos el apoyo de las empresas que hacen posible nuestra transmisión.
            </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-center">
          {sponsors.map(sponsor => (
            <Link key={sponsor.id} href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex justify-center">
              <Image 
                src={sponsor.imageUrl} 
                data-ai-hint={sponsor.hint}
                alt={sponsor.name} 
                width={200}
                height={100}
                className="object-contain"
                unoptimized
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
