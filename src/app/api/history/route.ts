// src/app/api/history/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const azura_url = 'https://radio.trabullnetwork.pro/api/station/estacionkusfm/history';
  try {
    const response = await fetch(azura_url, {
      cache: 'no-store',
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
      { message: "No se pudo conectar con el servidor de la radio para obtener el historial.", error: error.message },
      { status: 502 } // Bad Gateway
    );
  }
}
