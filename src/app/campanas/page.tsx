
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Campaign } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Gift, Mic, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const campaignsCollection = collection(db, 'campaigns');
    const q = query(campaignsCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
}

const iconMap: { [key: string]: React.ElementType } = {
  Calendar: Calendar,
  Gift: Gift,
  Trophy: Trophy,
  Mic: Mic,
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Eventos y Campañas
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Mantente al día de nuestros últimos concursos, eventos especiales y campañas comunitarias.
        </p>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const Icon = iconMap[campaign.icon] || Calendar;
            return (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">{campaign.title}</CardTitle>
                        <CardDescription>{format(campaign.date.toDate(), "dd 'de' MMMM, yyyy", { locale: es })}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{campaign.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No hay campañas activas en este momento. ¡Vuelve pronto!</p>
        </div>
      )}
    </div>
  );
}
