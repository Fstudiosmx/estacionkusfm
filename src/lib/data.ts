import { z } from "zod";

export interface Song {
  id: any; // Can be string from Firestore or number from old data
  rank?: number;
  title: string;
  artist: string;
  coverArt: string;
  coverArtHint?: string;
  externalLink: string;
  youtubeVideoId?: string;
  spotifyLink?: string;
  appleMusicLink?: string;
  youtubeMusicLink?: string;
}

export interface Program {
  time: string;
  title: string;
  host: string;
}

export interface ScheduleDay {
  day: string;
  schedule: Program[];
}

export interface Campaign {
  id: any;
  title: string;
  date: any; // Firestore Timestamp
  description: string;
  icon: 'Calendar' | 'Gift' | 'Trophy' | 'Mic';
}

export interface BlogPost {
    id: any;
    title: string;
    author: string;
    publishDate: any; // Firestore Timestamp
    excerpt: string;
    content: string;
    imageUrl: string;
    category: string;
}

export interface InvitationCode {
    id: string;
    code: string;
    createdAt: any; // Firestore Timestamp
    used: boolean;
    usedBy?: string;
    usedAt?: any;
}

export interface TeamMember {
    id: any;
    name: string;
    role: string;
    image: string;
    hint: string;
    order: number;
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
}

export interface RecordedShow {
    id: any;
    title: string;
    host: string;
    publishDate: any; // Firestore Timestamp
    duration: string;
    description: string;
    imageUrl: string;
    imageHint: string;
}

export interface Sponsor {
  id: any;
  name: string;
  imageUrl: string;
  hint: string;
  websiteUrl: string;
  level: 'platinum' | 'gold' | 'silver';
  order: number;
}

export const siteSettingsSchema = z.object({
    radioProvider: z.enum(["azuracast", "zenofm", "live365"]),
    streamUrl: z.string().url("Debe ser una URL de streaming válida.").or(z.literal('')),
    
    azuracastBaseUrl: z.string().url("Debe ser una URL base válida.").optional().or(z.literal('')),
    azuracastStationId: z.string().optional().or(z.literal('')),
    azuracastApiKey: z.string().optional().or(z.literal('')),

    zenoStationUuid: z.string().optional().or(z.literal('')),
    live365StationId: z.string().optional().or(z.literal('')),

    showDocsLink: z.boolean(),

    hlsStreamUrl: z.string().url("Debe ser una URL HLS válida.").optional().or(z.literal('')),
    streamServer: z.string().optional().or(z.literal('')),
    streamPort: z.string().optional().or(z.literal('')),
    streamPassword: z.string().optional().or(z.literal('')),
    learningSpaceAccessCode: z.string().min(4, "El código debe tener al menos 4 caracteres").optional().or(z.literal('')),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;


export interface UserSubmission {
    id: string;
    type: 'request' | 'shoutout';
    name: string;
    message: string;
    songTitle?: string;
    songArtist?: string;
    createdAt: any; // Firestore Timestamp
    isRead: boolean;
}

export interface JoinSubmission {
    id: string;
    name: string;
    email: string;
    showIdea: string;
    message?: string;
    createdAt: any; // Firestore Timestamp
    isReviewed: boolean;
}

export interface HeroSlide {
    id: any;
    title: string;
    description: string;
    imageUrl: string;
    imageHint: string;
    buttonText?: string;
    buttonLink?: string;
    order: number;
}
