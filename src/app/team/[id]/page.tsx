
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TeamMember } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Facebook, Instagram, Twitter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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

export default async function TeamMemberProfilePage({ params }: { params: { id: string } }) {
  const member = await getTeamMember(params.id);

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
      </div>
    </div>
  );
}
