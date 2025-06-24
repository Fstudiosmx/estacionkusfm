"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ServerCrash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ScheduleDay } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const dayTranslations: { [key: string]: string } = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
};

// Define the order of the days
const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


export default function ProgramacionPage() {
  const [activeTab, setActiveTab] = useState<string>('');
  const [weeklySchedule, setWeeklySchedule] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    setActiveTab(today);

    async function fetchSchedule() {
        setLoading(true);
        setFirebaseError(null);
        try {
            const scheduleCollection = collection(db, 'weeklySchedule');
            const querySnapshot = await getDocs(scheduleCollection);
            const scheduleData = querySnapshot.docs.map(doc => ({
                day: doc.id,
                ...doc.data()
            } as ScheduleDay));

            // Sort the data according to the predefined day order
            scheduleData.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

            setWeeklySchedule(scheduleData);
        } catch (error) {
            console.error("Firebase fetch error:", error);
            setFirebaseError("No se pudo cargar la programación desde la base de datos.");
        } finally {
            setLoading(false);
        }
    }

    fetchSchedule();
  }, []);

  const renderContent = () => {
     if (loading) {
        return (
             <div className="w-full space-y-4">
                <Skeleton className="h-10 w-full" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-lg bg-secondary">
                                <div className="mb-2 sm:mb-0 space-y-2">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-8 w-28 rounded-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        )
     }

     if (firebaseError) {
         return (
             <div className="max-w-2xl mx-auto text-center">
                <Card>
                    <CardHeader>
                        <div className="mx-auto bg-destructive/10 p-3 rounded-full">
                         <ServerCrash className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle>Error de Conexión con Firebase</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{firebaseError} Por favor, verifica tu configuración en <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">src/lib/firebase.ts</code> y asegúrate de que la colección <code className="font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded">'weeklySchedule'</code> existe.</p>
                        <Button asChild className="mt-4">
                            <Link href="/docs">Ver Guía de Configuración</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
         )
     }

     return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7 mb-8">
            {weeklySchedule.map((day) => (
                <TabsTrigger key={day.day} value={day.day}>
                {dayTranslations[day.day] || day.day}
                </TabsTrigger>
            ))}
            </TabsList>
            {weeklySchedule.map((day) => (
            <TabsContent key={day.day} value={day.day}>
                <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    Programación del {dayTranslations[day.day] || day.day}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {day.schedule && day.schedule.length > 0 ? (
                    <ul className="space-y-6">
                        {day.schedule.map((program, index) => (
                        <li
                            key={index}
                            className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-lg bg-secondary"
                        >
                            <div className="mb-2 sm:mb-0">
                            <p className="font-semibold text-lg">{program.title}</p>
                            <p className="text-sm text-muted-foreground">
                                con {program.host}
                            </p>
                            </div>
                            <span className="text-sm font-bold text-primary px-3 py-1 bg-primary/10 rounded-full self-start sm:self-center">
                            {program.time}
                            </span>
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-muted-foreground text-center py-8">
                        No hay programas agendados para el {dayTranslations[day.day] || day.day}. ¡Disfruta de nuestra mezcla de música continua!
                    </p>
                    )}
                </CardContent>
                </Card>
            </TabsContent>
            ))}
        </Tabs>
     )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Nuestra Programación
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          No te pierdas nunca tu programa favorito. Aquí tienes lo que suena en EstacionKusFM
          durante toda la semana.
        </p>
      </div>
      
      {renderContent()}

    </div>
  );
}
