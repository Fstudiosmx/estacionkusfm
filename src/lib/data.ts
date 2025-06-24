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
  id: number;
  title:string;
  date: string;
  description: string;
  icon: 'Calendar' | 'Heart';
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
