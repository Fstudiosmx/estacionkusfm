export interface Song {
  id: number;
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
    id: number;
    title: string;
    author: string;
    date: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: string;
}

export const topSongs: Song[] = [
  { id: 1, rank: 1, title: 'Echoes of Tomorrow', artist: 'Starlight Sirens', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'abstract space', externalLink: '#' },
  { id: 2, rank: 2, title: 'Midnight Drive', artist: 'Neon Bloom', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'neon city', externalLink: '#' },
  { id: 3, rank: 3, title: 'Chasing the Sun', artist: 'The Voyagers', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'sunrise beach', externalLink: '#' },
  { id: 4, rank: 4, title: 'Velvet Horizon', artist: 'Aurora Haze', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'purple sunset', externalLink: '#' },
  { id: 5, rank: 5, title: 'Crystal Clear', artist: 'Glass Animals', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'crystal prism', externalLink: '#' },
  { id: 6, rank: 6, title: 'Lost in the Sound', artist: 'Wanderlust', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'person headphones', externalLink: '#' },
  { id: 7, rank: 7, title: 'Retrograde', artist: 'Cosmic Drift', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'retro wave', externalLink: '#' },
  { id: 8, rank: 8, title: 'City Lights', artist: 'Urban Glow', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'city night', externalLink: '#' },
  { id: 9, rank: 9, title: 'Ocean Deep', artist: 'Tidal Waves', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'deep ocean', externalLink: '#' },
  { id: 10, rank: 10, title: 'Solar Flare', artist: 'Galaxy Runners', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'solar flare', externalLink: '#', youtubeVideoId: 'jfKfPfyJRdk', spotifyLink: '#', appleMusicLink: '#', youtubeMusicLink: '#' },
];

export const allSongs: Song[] = [
    ...topSongs,
    { id: 11, title: 'Forest Murmurs', artist: 'Willow Creek', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'enchanted forest', externalLink: '#' },
    { id: 12, title: 'Mountain High', artist: 'The Peaks', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'mountain peak', externalLink: '#' },
    { id: 13, title: 'Desert Wind', artist: 'Mirage', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'sand dunes', externalLink: '#' },
    { id: 14, title: 'River Flow', artist: 'The Current', coverArt: 'https://placehold.co/100x100.png', coverArtHint: 'river rapids', externalLink: '#' },
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
        title: 'Detrás del Micrófono: Una Entrevista con Alex Johnson',
        author: 'Jane Doe',
        date: '15 de Julio, 2024',
        excerpt: 'Nos sentamos con el presentador de "Morning Commute" para hablar sobre su trayectoria en la radio, su música favorita y lo que lo despierta por la mañana.',
        content: 'En esta charla exclusiva, Alex Johnson comparte sus inicios en el mundo de la radio, desde sus días en la radio universitaria hasta convertirse en una de las voces más reconocidas de las mañanas. Hablamos de los retos de la transmisión en vivo, la importancia de conectar con la audiencia y sus momentos más memorables al aire. Además, nos revela su proceso para descubrir nueva música y qué artistas no pueden faltar en su playlist personal. Una conversación íntima que te permitirá conocer al hombre detrás del micrófono.',
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Entrevistas'
    },
    {
        id: 2,
        title: 'El Auge del Indie Pop: Una Mirada a la Escena Actual',
        author: 'John Smith',
        date: '10 de Julio, 2024',
        excerpt: 'El indie pop ha conquistado las ondas de radio. Exploramos los artistas y sonidos que definen el género en la década de 2020.',
        content: 'Desde sus raíces alternativas hasta su actual dominio en las listas de popularidad, el indie pop ha demostrado ser más que una moda pasajera. En este artículo, analizamos las características que definen el sonido actual, la influencia de las plataformas de streaming en su difusión y cómo los artistas independientes están redefiniendo las reglas de la industria musical. Presentamos a algunos de los actos más prometedores y repasamos los álbumes que están marcando el pulso de esta vibrante escena musical.',
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Música'
    },
    {
        id: 3,
        title: 'Nuestros 5 Álbumes Favoritos del Año (Hasta Ahora)',
        author: 'Staff de EstacionKusFM',
        date: '5 de Julio, 2024',
        excerpt: 'El año ya va por la mitad, y estamos resumiendo los mejores álbumes que han estado en repetición en el estudio de EstacionKusFM.',
        content: 'La primera mitad del año nos ha regalado una increíble cantidad de música excepcional. El equipo de EstacionKusFM ha debatido, votado y compilado una lista de los cinco álbumes que consideramos imprescindibles. Desde debuts sorprendentes hasta trabajos consagrados de artistas reconocidos, nuestra selección abarca una variedad de géneros y estilos. Descubre cuáles son nuestros favoritos y por qué creemos que estos discos resistirán el paso del tiempo.',
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Reseñas'
    },
    {
        id: 4,
        title: 'Cómo Apoyamos el Talento Local con Music Rally',
        author: 'Equipo Comunitario',
        date: '28 de Junio, 2024',
        excerpt: 'Aprende más sobre nuestra campaña "Local Music Rally" y los increíbles artistas que hemos presentado hasta ahora.',
        content: 'En EstacionKusFM, creemos firmemente en el poder de la comunidad y en la importancia de apoyar a los artistas locales. Nuestra iniciativa "Local Music Rally" nació con el objetivo de dar visibilidad al talento emergente de nuestra ciudad. En este post, te contamos cómo funciona la campaña, compartimos algunas historias de éxito de músicos que han participado y te explicamos cómo puedes unirte, ya sea como artista o como oyente, para fortalecer nuestra escena musical local.',
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Campañas'
    }
];
