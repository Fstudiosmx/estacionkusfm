// src/app/api/nowplaying/route.ts
import { getSiteSettings } from '@/lib/settings';
import { NextResponse } from 'next/server';

export async function GET() {
  const settings = await getSiteSettings();
  const azura_url = settings.nowPlayingUrl;

  try {
    const response = await fetch(azura_url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'RadioWaveApp/1.0',
      }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read error body');
      console.error(`Error from AzuraCast API: ${response.status} ${response.statusText}`, errorText);
      return NextResponse.json(
        { message: `El servidor de la radio devolvió un error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to fetch from AzuraCast API:", error);
    return NextResponse.json(
      { message: "No se pudo conectar con el servidor de la radio para obtener los datos.", error: error.message },
      { status: 502 } // Bad Gateway
    );
  }
}
