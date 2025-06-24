'use server';
/**
 * @fileOverview An AI flow to find song details on various platforms.
 *
 * - findSongLinks - A function that finds links for a song.
 * - SongLinksInput - The input type for the findSongLinks function.
 * - SongLinksOutput - The return type for the findSongLinks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SongLinksInputSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().describe('The artist of the song.'),
});
export type SongLinksInput = z.infer<typeof SongLinksInputSchema>;

export const SongLinksOutputSchema = z.object({
  youtubeVideoId: z.string().optional().describe('The YouTube video ID for the song. Just the ID, not the full URL.'),
  spotifyLink: z.string().url().optional().or(z.literal('')).describe('The direct URL to the song on Spotify.'),
  appleMusicLink: z.string().url().optional().or(z.literal('')).describe('The direct URL to the song on Apple Music.'),
  youtubeMusicLink: z.string().url().optional().or(z.literal('')).describe('The direct URL to the song on YouTube Music.'),
});
export type SongLinksOutput = z.infer<typeof SongLinksOutputSchema>;

export async function findSongLinks(input: SongLinksInput): Promise<SongLinksOutput> {
  return findSongLinksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSongLinksPrompt',
  input: {schema: SongLinksInputSchema},
  output: {schema: SongLinksOutputSchema},
  prompt: `You are a music expert and your task is to find links for a given song.

You will be provided with a song title and artist. Find the official YouTube Video ID (just the ID, not the full URL), the Spotify link, the Apple Music link, and the YouTube Music link for the song.

Prioritize official sources (e.g., artist's official channel). If an official link cannot be found for a platform, return an empty string for that specific field.

Song Title: {{{title}}}
Artist: {{{artist}}}`,
});

const findSongLinksFlow = ai.defineFlow(
  {
    name: 'findSongLinksFlow',
    inputSchema: SongLinksInputSchema,
    outputSchema: SongLinksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
