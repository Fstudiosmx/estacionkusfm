export interface Song {
  id: number;
  rank?: number;
  title: string;
  artist: string;
  coverArt: string;
  externalLink: string;
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
  title: string;
  date: string;
  description: string;
  icon: 'Calendar' | 'Heart';
}

export interface BlogPost {
    id: number;
    title: string;
    author: string;
    date: string;
    excerpt: string;
    imageUrl: string;
    category: string;
}

export const topSongs: Song[] = [
  { id: 1, rank: 1, title: 'Echoes of Tomorrow', artist: 'Starlight Sirens', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
  { id: 2, rank: 2, title: 'Midnight Drive', artist: 'Neon Bloom', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
  { id: 3, rank: 3, title: 'Chasing the Sun', artist: 'The Voyagers', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
  { id: 4, rank: 4, title: 'Velvet Horizon', artist: 'Aurora Haze', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
  { id: 5, rank: 5, title: 'Crystal Clear', artist: 'Glass Animals', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
  { id: 6, rank: 6, title: 'Lost in the Sound', artist: 'Wanderlust', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
  { id: 7, rank: 7, title: 'Retrograde', artist: 'Cosmic Drift', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
  { id: 8, rank: 8, title: 'City Lights', artist: 'Urban Glow', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
  { id: 9, rank: 9, title: 'Ocean Deep', artist: 'Tidal Waves', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
  { id: 10, rank: 10, title: 'Solar Flare', artist: 'Galaxy Runners', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
];

export const allSongs: Song[] = [
    ...topSongs,
    { id: 11, title: 'Forest Murmurs', artist: 'Willow Creek', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
    { id: 12, title: 'Mountain High', artist: 'The Peaks', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
    { id: 13, title: 'Desert Wind', artist: 'Mirage', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
    { id: 14, title: 'River Flow', artist: 'The Current', coverArt: 'https://placehold.co/100x100.png', externalLink: '#' },
];


export const weeklySchedule: ScheduleDay[] = [
  {
    day: 'Monday',
    schedule: [
      { time: '08:00 - 10:00', title: 'Morning Commute', host: 'Alex Johnson' },
      { time: '10:00 - 12:00', title: 'Indie Vibes', host: 'Samantha Bee' },
      { time: '12:00 - 14:00', title: 'Lunchtime Classics', host: 'Mike Richards' },
      { time: '14:00 - 16:00', title: 'Afternoon Chill', host: 'Jessica Wu' },
      { time: '16:00 - 18:00', title: 'Drive Time Power Mix', host: 'Chris Green' },
    ],
  },
  {
    day: 'Tuesday',
    schedule: [
        { time: '08:00 - 10:00', title: 'Sunrise Sessions', host: 'Maria Garcia' },
        { time: '10:00 - 12:00', title: 'Tech Talk', host: 'David Chen' },
        { time: '12:00 - 14:00', title: 'Global Grooves', host: 'Fatima Khan' },
        { time: '14:00 - 16:00', title: 'Rock Anthems', host: 'Tom Burger' },
        { time: '16:00 - 18:00', title: 'The Wind Down', host: 'Emily White' },
    ],
  },
    {
    day: 'Wednesday',
    schedule: [
      { time: '08:00 - 10:00', title: 'Morning Commute', host: 'Alex Johnson' },
      { time: '10:00 - 12:00', title: 'New Music Wednesday', host: 'Samantha Bee' },
      { time: '12:00 - 14:00', title: 'Lunchtime Classics', host: 'Mike Richards' },
      { time: '14:00 - 16:00', title: 'Acoustic Cafe', host: 'Jessica Wu' },
      { time: '16:00 - 18:00', title: 'Drive Time Power Mix', host: 'Chris Green' },
    ],
  },
    {
    day: 'Thursday',
    schedule: [
        { time: '08:00 - 10:00', title: 'Sunrise Sessions', host: 'Maria Garcia' },
        { time: '10:00 - 12:00', title: 'Throwback Thursday', host: 'David Chen' },
        { time: '12:00 - 14:00', title: 'Global Grooves', host: 'Fatima Khan' },
        { time: '14:00 - 16:00', title: 'Rock Anthems', host: 'Tom Burger' },
        { time: '16:00 - 18:00', title: 'The Wind Down', host: 'Emily White' },
    ],
  },
    {
    day: 'Friday',
    schedule: [
       { time: '08:00 - 10:00', title: 'Morning Commute', host: 'Alex Johnson' },
      { time: '10:00 - 12:00', title: 'Friday Feelings', host: 'Samantha Bee' },
      { time: '12:00 - 14:00', title: 'Lunchtime Classics', host: 'Mike Richards' },
      { time: '14:00 - 16:00', title: 'Weekend Warmup', host: 'Jessica Wu' },
      { time: '16:00 - 18:00', title: 'Friday Night Party', host: 'Chris Green' },
    ],
  },
    {
    day: 'Saturday',
    schedule: [
        { time: '09:00 - 11:00', title: 'Saturday Brunch', host: 'Various' },
        { time: '11:00 - 13:00', title: 'The Chart Show', host: 'Leo Maxwell' },
        { time: '13:00 - 15:00', title: 'Sports Hour', host: 'Frank Riley' },
        { time: '15:00 - 17:00', title: 'Saturday Matinee', host: 'Anna Lee' },
    ],
  },
    {
    day: 'Sunday',
    schedule: [
        { time: '09:00 - 11:00', title: 'Easy Like Sunday Morning', host: 'Chloe Adams' },
        { time: '11:00 - 13:00', title: 'The Jazz Lounge', host: 'Marcus Cole' },
        { time: '13:00 - 15:00', title: 'Community Focus', host: 'Various' },
        { time: '15:00 - 17:00', title: 'Sunday Unwind', host: 'Grace Note' },
    ],
  },
];

export const campaigns: Campaign[] = [
    { id: 1, title: 'Youth Fest 2024', date: 'August 15-17, 2024', description: 'A 3-day festival celebrating local youth talent in music, arts, and culture. Join us for live performances and workshops.', icon: 'Calendar' },
    { id: 2, title: 'Local Music Rally', date: 'Ongoing', description: 'Support our local artists! We\'re promoting up-and-coming musicians from our city. Tune in to discover new talent.', icon: 'Heart' },
    { id: 3, title: 'Community Garden Project', date: 'Fall 2024', description: 'Helping build a greener city. We\'re partnering with local organizations to create community gardens.', icon: 'Heart' },
];

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: 'Behind the Mic: An Interview with Alex Johnson',
        author: 'Jane Doe',
        date: 'July 15, 2024',
        excerpt: 'We sat down with the host of "Morning Commute" to talk about his journey in radio, his favorite music, and what wakes him up in the morning.',
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Interviews'
    },
    {
        id: 2,
        title: 'The Rise of Indie Pop: A Look at Today\'s Scene',
        author: 'John Smith',
        date: 'July 10, 2024',
        excerpt: 'Indie pop has taken over the airwaves. We explore the artists and sounds that are defining the genre in the 2020s.',
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Music'
    },
    {
        id: 3,
        title: 'Our Top 5 Albums of the Year (So Far)',
        author: 'EstacionKusFM Staff',
        date: 'July 5, 2024',
        excerpt: 'The year is halfway over, and we\'re rounding up the best albums that have been on repeat in the EstacionKusFM studio.',
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Reviews'
    },
    {
        id: 4,
        title: 'How We\'re Supporting Local Talent with Music Rally',
        author: 'Community Team',
        date: 'June 28, 2024',
        excerpt: 'Learn more about our "Local Music Rally" campaign and the amazing artists we\'ve featured so far.',
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Campaigns'
    }
];
