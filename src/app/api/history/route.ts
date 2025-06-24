// src/app/api/history/route.ts
import { NextResponse } from 'next/server';

// This is a route handler that we can use to proxy requests to the AzuraCast API.
// This is useful for avoiding CORS issues, as the request is made from the server-side.
// see: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

// We can also use this to cache the response, but for now we'll just proxy it.
export const revalidate = 0; // do not cache this route

export async function GET() {
  const azura_url = 'https://radio.trabullnetwork.pro/api/station/estacionkusfm/history';
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
    console.error("Error fetching history from AzuraCast:", error);
    return NextResponse.json(
      { message: "Failed to fetch history from upstream API", error: error.message },
      { status: 502 } // Bad Gateway
    );
  }
}
