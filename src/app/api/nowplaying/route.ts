// src/app/api/nowplaying/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 0; // do not cache this route

export async function GET() {
  const azura_url = 'https://radio.trabullnetwork.pro/api/nowplaying/estacionkusfm';
  try {
    const response = await fetch(azura_url, {
      next: { revalidate: 0 } // Revalidate every 0 seconds
    });

    if (!response.ok) {
      throw new Error(`Error from AzuraCast API: ${response.statusText}`);
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
