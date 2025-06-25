// src/app/api/history/route.ts
import { getSiteSettings } from '@/lib/settings';
import { NextResponse } from 'next/server';

interface SongHistoryItem {
  sh_id: number;
  played_at: number;
  song: {
    text: string;
    artist: string;
    title: string;
    art: string;
  };
}

export async function GET() {
  const settings = await getSiteSettings();
  const headers = new Headers({ 'User-Agent': 'RadioWaveApp/1.0' });
  let apiUrl = '';

  try {
    switch (settings.radioProvider) {
      case 'azuracast':
        if (!settings.azuracastBaseUrl || !settings.azuracastStationId) {
          throw new Error("La configuración de Azuracast está incompleta.");
        }
        apiUrl = `${settings.azuracastBaseUrl}/api/station/${settings.azuracastStationId}/history`;
        if (settings.azuracastApiKey) {
          headers.set('Authorization', `Bearer ${settings.azuracastApiKey}`);
        }
        break;

      case 'live365':
        if (!settings.live365StationId) {
            throw new Error("El ID de estación de Live365 no está configurado.");
        }
        apiUrl = `https://api.live365.com/v2/stations/${settings.live365StationId}/history`;
        break;

      case 'zenofm':
        // ZenoFM does not have a public history API
        return NextResponse.json([]);

      default:
        throw new Error("Proveedor de radio no configurado o no válido.");
    }

    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read error body');
      console.error(`Error from ${settings.radioProvider} API: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`El servidor de la radio (${settings.radioProvider}) devolvió un error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform data if necessary
    if (settings.radioProvider === 'live365') {
        if (!data.success || !Array.isArray(data.data)) {
            return NextResponse.json([]);
        }
        const transformedHistory: SongHistoryItem[] = data.data.map((item: any, index: number) => ({
            sh_id: item.id || index,
            played_at: Math.floor(new Date(item.started_at).getTime() / 1000),
            duration: item.duration / 1000,
            song: {
                text: `${item.artist} - ${item.title}`,
                artist: item.artist,
                title: item.title,
                art: item.album_art_url || 'https://placehold.co/100x100.png',
            }
        }));
        return NextResponse.json(transformedHistory);
    }
    
    // Assume Azuracast format is the default
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Failed to fetch from Radio API:", error);
    return NextResponse.json(
      { message: "No se pudo conectar con el servidor de la radio para obtener el historial.", error: error.message },
      { status: 502 }
    );
  }
}
