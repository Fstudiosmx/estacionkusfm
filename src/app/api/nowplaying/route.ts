// src/app/api/nowplaying/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const azura_url = 'https://radio.trabullnetwork.pro/api/nowplaying/estacionkusfm';
  try {
    const response = await fetch(azura_url, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Error from AzuraCast API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching now playing from AzuraCast:", error);
    return NextResponse.json(
      { message: "Failed to fetch now playing data from upstream API", error: error.message },
      { status: 502 } // Bad Gateway
    );
  }
}
