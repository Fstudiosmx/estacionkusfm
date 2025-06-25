
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { HeroSlide } from '@/lib/data';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';

export function HeroSlideshow() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const slidesCollection = collection(db, 'heroSlides');
        const q = query(slidesCollection, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const slidesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroSlide));
        setSlides(slidesData);
      } catch (error) {
        console.error("Error fetching hero slides:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSlides();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-20 md:py-32 lg:py-40">
        <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-10 w-32 mt-4" />
                </div>
                <Skeleton className="w-full aspect-video rounded-xl" />
            </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    // Fallback to a default static hero if no slides are configured
    return (
        <section className="w-full py-20 md:py-32 lg:py-40 bg-primary/5">
            <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-1 lg:gap-12 xl:grid-cols-2">
                <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    EstacionKusFM
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Tu dosis diaria de sonido. Música ininterrumpida, programas de entrevistas y el pulso de la ciudad, al alcance de tu mano.
                    </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button asChild size="lg" className="font-bold">
                    <Link href="/programacion">Ver Programación</Link>
                    </Button>
                </div>
                </div>
                <Image
                    src="https://placehold.co/600x400.png"
                    data-ai-hint="radio microphone"
                    width="600"
                    height="400"
                    alt="Hero"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                    unoptimized
                />
            </div>
            </div>
        </section>
    );
  }

  return (
    <Carousel className="w-full" opts={{ loop: true }} autoplay>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="p-0">
                <section className="relative w-full h-[60vh] md:h-[70vh]">
                    <Image
                        src={slide.imageUrl}
                        data-ai-hint={slide.imageHint}
                        alt={slide.title}
                        layout="fill"
                        objectFit="cover"
                        className="z-0"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <div className="relative container h-full px-4 md:px-6 z-20">
                        <div className="flex flex-col justify-center h-full max-w-2xl text-white space-y-4">
                             <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                                {slide.title}
                            </h1>
                            <p className="md:text-xl text-primary-foreground/80">
                                {slide.description}
                            </p>
                            {slide.buttonLink && slide.buttonText && (
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button asChild size="lg" className="font-bold">
                                        <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30" />
    </Carousel>
  );
}
