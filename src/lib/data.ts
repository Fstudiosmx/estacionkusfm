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
    id: any; // Can be string from Firestore or number from old data
    title: string;
    author: string;
    date: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: string;
}
