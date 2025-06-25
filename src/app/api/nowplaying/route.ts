// src/app/api/nowplaying/route.ts
import { getSiteSettings } from '@/lib/settings';
import { NextResponse } from 'next/server';

const transformZenoData = (data: any, stationName: string) => {
    const [title, artist] = (data.stream || ' - ').split(' - ');
    return {
        station: { name: stationName || 'ZenoFM Stream' },
        now_playing: {
            song: {
                text: data.stream,
                title: title.trim(),
                artist: (artist || 'Varios Artistas').trim(),
                art: 'https://placehold.co/100x100.png', // Zeno doesn't provide art
            }
        },
        is_online: true, // API only returns data if online
        live: { is_live: false, streamer_name: '' }
    };
};

const transformLive365Data = (data: any, stationName: string) => {
    const track = data.data;
    return {
        station: { name: stationName || 'Live365 Stream' },
        now_playing: {
            song: {
                text: `${track.artist} - ${track.title}`,
                title: track.title,
                artist: track.artist,
                art: track.album_art_url || 'https://placehold.co/100x100.png',
            }
        },
        is_online: true,
        live: { is_live: track.type === 'live', streamer_name: track.type === 'live' ? 'DJ en Vivo' : '' }
    }
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
        apiUrl = `${settings.azuracastBaseUrl}/api/nowplaying/${settings.azuracastStationId}`;
        if (settings.azuracastApiKey) {
          headers.set('Authorization', `Bearer ${settings.azuracastApiKey}`);
        }
        break;

      case 'zenofm':
        if (!settings.zenoStationUuid) {
          throw new Error("El UUID de estación de ZenoFM no está configurado.");
        }
        apiUrl = `https://stream.zeno.fm/api/zeno/nowplaying?stationuuid=${settings.zenoStationUuid}`;
        break;
      
      case 'live365':
        if (!settings.live365StationId) {
            throw new Error("El ID de estación de Live365 no está configurado.");
        }
        apiUrl = `https://api.live365.com/v2/stations/${settings.live365StationId}/track`;
        break;

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

    // Transform data to a standard format (based on Azuracast's)
    if (settings.radioProvider === 'zenofm') {
      return NextResponse.json(transformZenoData(data, "ZenoFM Stream"));
    }
    if (settings.radioProvider === 'live365') {
      if (!data.success || !data.data) return NextResponse.json({ is_online: false });
      return NextResponse.json(transformLive365Data(data, "Live365 Stream"));
    }
    
    // Assume Azuracast format is the default
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Failed to fetch from Radio API:", error);
    return NextResponse.json(
      { message: "No se pudo conectar con el servidor de la radio para obtener los datos.", error: error.message },
      { status: 502 }
    );
  }
}
