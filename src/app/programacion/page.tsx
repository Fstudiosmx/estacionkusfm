"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { weeklySchedule } from '@/lib/data';
import { Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProgramacionPage() {
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    // Set the active tab to the current day, only on the client
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    setActiveTab(today);
  }, []);

  // Render a loading state on the server and initial client render
  if (!activeTab) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
            Our Schedule
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
            Never miss your favorite show. Here’s what’s playing on RadioWave
            throughout the week.
          </p>
        </div>
        <div className="w-full space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Our Schedule
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Never miss your favorite show. Here’s what’s playing on RadioWave
          throughout the week.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7 mb-8">
          {weeklySchedule.map((day) => (
            <TabsTrigger key={day.day} value={day.day}>
              {day.day}
            </TabsTrigger>
          ))}
        </TabsList>
        {weeklySchedule.map((day) => (
          <TabsContent key={day.day} value={day.day}>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  {day.day}'s Programming
                </CardTitle>
              </CardHeader>
              <CardContent>
                {day.schedule.length > 0 ? (
                  <ul className="space-y-6">
                    {day.schedule.map((program, index) => (
                      <li
                        key={index}
                        className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-lg bg-secondary"
                      >
                        <div className="mb-2 sm:mb-0">
                          <p className="font-semibold text-lg">{program.title}</p>
                          <p className="text-sm text-muted-foreground">
                            with {program.host}
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
                    No programs scheduled for {day.day}. Enjoy our continuous music mix!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
