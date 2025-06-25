
"use client";

import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TeamMember, ScheduleDay, Program } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Facebook, Instagram, Twitter, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getTeamMember(id: string): Promise<TeamMember | null> {
  try {
    const docRef = doc(db, 'teamMembers', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as TeamMember;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting team member:", error);
    return null;
  }
}

function calculateNextShow(shows: { program: Program, day: string }[]): { program: Program, date: Date } | null {
    if (!shows.length) return null;

    const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();

    let nextShowDate: Date | null = null;
    let nextShow: { program: Program, day: string } | null = null;

    for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        const dayName = dayOrder[date.getDay()];

        const showsOnThisDay = shows
            .filter(s => s.day === dayName)
            .sort((a, b) => a.program.time.localeCompare(b.program.time));
        
        for (const show of showsOnThisDay) {
            const [startTime] = show.program.time.split(' - ');
            const [hour, minute] = startTime.split(':');
            
            const potentialShowDate = new Date(date);
            potentialShowDate.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);

            if (potentialShowDate > now) {
                return { program: show.program, date: potentialShowDate };
            }
        }
    }
    
    return null; // No show in the next 7 days, might need to look further
}

function Countdown({ targetDate }: { targetDate: Date }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });

    useEffect(() => {
        if (!targetDate) return;

        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const timeParts = [
        { value: timeLeft.days, label: 'D' },
        { value: timeLeft.hours, label: 'H' },
        { value: timeLeft.minutes, label: 'M' },
        { value: timeLeft.seconds, label: 'S' }
    ];

    return (
        <div className="flex items-center justify-center gap-2 md:gap-4 font-mono text-center">
            {timeParts.map(part => (
                <div key={part.label} className="flex flex-col items-center p-2 bg-primary/10 rounded-lg w-16">
                    <span className="text-3xl font-bold text-primary">{String(part.value).padStart(2, '0')}</span>
                    <span className="text-xs text-muted-foreground">{part.label}</span>
                </div>
            ))}
        </div>
    );
}

function ProfileDetails({ member }: { member: TeamMember }) {
    const [memberShows, setMemberShows] = useState<Program[]>([]);
    const [nextShow, setNextShow] = useState<{ program: Program; date: Date; } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSchedule() {
            try {
                const scheduleCollection = collection(db, 'weeklySchedule');
                const querySnapshot = await getDocs(scheduleCollection);
                const scheduleData = querySnapshot.docs.map(doc => ({
                    day: doc.id,
                    ...doc.data()
                } as ScheduleDay));

                const allShows: { program: Program, day: string }[] = [];
                scheduleData.forEach(daySchedule => {
                    daySchedule.schedule.forEach(program => {
                        if (program.host === member.name) {
                            allShows.push({ program, day: daySchedule.day });
                        }
                    });
                });
                setMemberShows(allShows.map(s => s.program));
                setNextShow(calculateNextShow(allShows));
            } catch (error) {
                console.error("Failed to fetch schedule for member", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSchedule();
    }, [member.name]);

    return (
        <div className="space-y-8 mt-8">
            {loading ? (
                <Skeleton className="h-48 w-full rounded-lg" />
            ) : (
                <>
                    {nextShow && (
                        <Card>
                            <CardHeader className="items-center text-center">
                                <CardTitle className="font-headline">Próximo Show: {nextShow.program.title}</CardTitle>
                                <p className="text-muted-foreground">¡No te lo pierdas! El próximo programa de {member.name} comienza en:</p>
                            </CardHeader>
                            <CardContent>
                                <Countdown targetDate={nextShow.date} />
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Calendar className="h-6 w-6 text-primary" /> Programas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {memberShows.length > 0 ? (
                                <ul className="space-y-2">
                                    {memberShows.map((program, index) => (
                                        <li key={index} className="flex justify-between p-3 rounded-lg bg-secondary">
                                            <p className="font-semibold">{program.title}</p>
                                            <p className="text-sm text-muted-foreground">{program.time}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">Este miembro del equipo no tiene programas asignados actualmente.</p>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

export default function TeamMemberProfilePage({ params }: { params: { id: string } }) {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMember() {
        setLoading(true);
        const memberData = await getTeamMember(params.id);
        if (memberData) {
            setMember(memberData);
        } else {
           notFound();
        }
        setLoading(false);
    }
    loadMember();
  }, [params.id]);


  if (loading) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-3xl mx-auto">
                 <Skeleton className="h-10 w-40 mb-8" />
                 <Card>
                    <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                        <Skeleton className="w-48 h-48 rounded-full" />
                        <div className="space-y-4 flex-1">
                             <Skeleton className="h-10 w-3/4" />
                             <Skeleton className="h-6 w-1/2" />
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-full" />
                             <div className="flex gap-4 mt-6">
                                <Skeleton className="h-10 w-10" />
                                <Skeleton className="h-10 w-10" />
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
  }

  if (!member) {
    notFound();
  }

  const hasSocials = member.twitterUrl || member.instagramUrl || member.facebookUrl;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
         <div className="mb-8">
            <Button asChild variant="outline" size="sm">
                <Link href="/nosotros">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Equipo
                </Link>
            </Button>
        </div>
        <Card>
            <CardContent className="p-8 flex flex-col md:flex-row items-center text-center md:text-left gap-8">
                <Image
                    src={member.image}
                    data-ai-hint={member.hint}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shrink-0 border-4 border-primary shadow-lg"
                    unoptimized
                />
                <div className="flex-1">
                    <h1 className="text-4xl font-bold font-headline">{member.name}</h1>
                    <p className="text-xl text-primary font-semibold mt-1">{member.role}</p>
                    <p className="text-muted-foreground mt-4">
                        {member.name} es una de las voces principales de EstacionKusFM, trayendo su pasión y perspectiva únicas a los oyentes todos los días.
                    </p>
                    {hasSocials && (
                        <div className="flex justify-center md:justify-start items-center gap-4 mt-6">
                            {member.twitterUrl && member.twitterUrl !== '#' && (
                                <Button asChild variant="ghost" size="icon">
                                    <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Twitter`}>
                                        <Twitter className="h-6 w-6" />
                                    </a>
                                </Button>
                            )}
                            {member.instagramUrl && member.instagramUrl !== '#' && (
                                <Button asChild variant="ghost" size="icon">
                                    <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Instagram`}>
                                        <Instagram className="h-6 w-6" />
                                    </a>
                                </Button>
                            )}
                            {member.facebookUrl && member.facebookUrl !== '#' && (
                                <Button asChild variant="ghost" size="icon">
                                    <a href={member.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Facebook`}>
                                        <Facebook className="h-6 w-6" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
        <ProfileDetails member={member} />
      </div>
    </div>
  );
}
