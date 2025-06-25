
import { NextResponse } from 'next/server';
import { collection, writeBatch, doc, Timestamp, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const parseDate = (dateString: string) => {
    const months: { [key: string]: string } = {
        'Enero': '01', 'Febrero': '02', 'Marzo': '03', 'Abril': '04', 'Mayo': '05', 'Junio': '06',
        'Julio': '07', 'Agosto': '08', 'Septiembre': '09', 'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
    };
    const parts = dateString.replace(/ de /g, ' ').replace(',', '').split(' ');
    // Format: DD MMMM YYYY -> YYYY-MM-DD
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const monthName = parts[1];
      const year = parts[2];
      const month = months[monthName];
      if (day && month && year) {
        return new Date(`${year}-${month}-${day}T12:00:00Z`);
      }
    }
    // Fallback for "Month DD, YYYY"
     const fallbackDate = new Date(dateString);
     if (!isNaN(fallbackDate.getTime())) {
         return fallbackDate;
     }

    // Default to now if parsing fails
    return new Date();
};


const firestoreData = {
  "blogPosts": [
    { "id": "demo-post-1", "title": "Detrás del Micrófono: Una Entrevista con Alex Johnson", "author": "Jane Doe", "date": "15 de Julio, 2024", "excerpt": "Nos sentamos con el presentador de 'Morning Commute' para hablar sobre su trayectoria en la radio, su música favorita y lo que lo despierta por la mañana.", "content": "En esta charla exclusiva, Alex Johnson comparte sus inicios en el mundo de la radio, desde sus días en la radio universitaria hasta convertirse en una de las voces más reconocidas de las mañanas. Hablamos de los retos de la transmisión en vivo, la importancia de conectar con la audiencia y sus momentos más memorables al aire. Además, nos revela su proceso para descubrir nueva música y qué artistas no pueden faltar en su playlist personal. Una conversación íntima que te permitirá conocer al hombre detrás del micrófono.", "imageUrl": "https://placehold.co/600x400.png", "category": "Entrevistas" },
    { "id": "demo-post-2", "title": "El Auge del Indie Pop: Una Mirada a la Escena Actual", "author": "John Smith", "date": "10 de Julio, 2024", "excerpt": "El indie pop ha conquistado las ondas de radio. Exploramos los artistas y sonidos que definen el género en la década de 2020.", "content": "Desde sus raíces alternativas hasta su actual dominio en las listas de popularidad, el indie pop ha demostrado ser más que una moda pasajera. En este artículo, analizamos las características que definen el sonido actual, la influencia de las plataformas de streaming en su difusión y cómo los artistas independientes están redefiniendo las reglas de la industria musical. Presentamos a algunos de los actos más prometedores y repasamos los álbumes que están marcando el pulso de esta vibrante escena musical.", "imageUrl": "https://placehold.co/600x400.png", "category": "Música" },
    { "id": "demo-post-3", "title": "Nuestros 5 Álbumes Favoritos del Año (Hasta Ahora)", "author": "Staff de EstacionKusFM", "date": "5 de Julio, 2024", "excerpt": "El año ya va por la mitad, y estamos resumiendo los mejores álbumes que han estado en repetición en el estudio de EstacionKusFM.", "content": "La primera mitad del año nos ha regalado una increíble cantidad de música excepcional. El equipo de EstacionKusFM ha debatido, votado y compilado una lista de los cinco álbumes que consideramos imprescindibles. Desde debuts sorprendentes hasta trabajos consagrados de artistas reconocidos, nuestra selección abarca una variedad de géneros y estilos. Descubre cuáles son nuestros favoritos y por qué creemos que estos discos resistirán el paso del tiempo.", "imageUrl": "https://placehold.co/600x400.png", "category": "Reseñas" },
    { "id": "demo-post-4", "title": "Cómo Apoyamos el Talento Local con Music Rally", "author": "Equipo Comunitario", "date": "28 de Junio, 2024", "excerpt": "Aprende más sobre nuestra campaña 'Local Music Rally' y los increíbles artistas que hemos presentado hasta ahora.", "content": "En EstacionKusFM, creemos firmemente en el poder de la comunidad y en la importancia de apoyar a los artistas locales. Nuestra iniciativa 'Local Music Rally' nació con el objetivo de dar visibilidad al talento emergente de nuestra ciudad. En este post, te contamos cómo funciona la campaña, compartimos algunas historias de éxito de músicos que han participado y te explicamos cómo puedes unirte, ya sea como artista o como oyente, para fortalecer nuestra escena musical local.", "imageUrl": "https://placehold.co/600x400.png", "category": "Campañas" }
  ],
  "topSongs": [
    { "id": "demo-song-1", "rank": 1, "title": "Echoes of Tomorrow", "artist": "Starlight Sirens", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "abstract space", "externalLink": "#" },
    { "id": "demo-song-2", "rank": 2, "title": "Midnight Drive", "artist": "Neon Bloom", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "neon city", "externalLink": "#" },
    { "id": "demo-song-3", "rank": 3, "title": "Chasing the Sun", "artist": "The Voyagers", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "sunrise beach", "externalLink": "#" },
    { "id": "demo-song-4", "rank": 4, "title": "Velvet Horizon", "artist": "Aurora Haze", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "purple sunset", "externalLink": "#" },
    { "id": "demo-song-5", "rank": 5, "title": "Crystal Clear", "artist": "Glass Animals", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "crystal prism", "externalLink": "#" },
    { "id": "demo-song-6", "rank": 6, "title": "Lost in the Sound", "artist": "Wanderlust", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "person headphones", "externalLink": "#" },
    { "id": "demo-song-7", "rank": 7, "title": "Retrograde", "artist": "Cosmic Drift", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "retro wave", "externalLink": "#" },
    { "id": "demo-song-8", "rank": 8, "title": "City Lights", "artist": "Urban Glow", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "city night", "externalLink": "#" },
    { "id": "demo-song-9", "rank": 9, "title": "Ocean Deep", "artist": "Tidal Waves", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "deep ocean", "externalLink": "#" },
    { "id": "demo-song-10", "rank": 10, "title": "Solar Flare", "artist": "Galaxy Runners", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "solar flare", "externalLink": "#", "youtubeVideoId": "jfKfPfyJRdk", "spotifyLink": "#", "appleMusicLink": "#", "youtubeMusicLink": "#" }
  ],
  "weeklySchedule": [
    { "day": "Monday", "schedule": [ { "time": "08:00 - 10:00", "title": "Morning Commute", "host": "Alex Johnson" }, { "time": "10:00 - 12:00", "title": "Indie Vibes", "host": "Samantha Bee" } ] },
    { "day": "Tuesday", "schedule": [ { "time": "08:00 - 10:00", "title": "Sunrise Sessions", "host": "Maria Garcia" }, { "time": "10:00 - 12:00", "title": "Tech Talk", "host": "David Chen" } ] },
    { "day": "Wednesday", "schedule": [ { "time": "08:00 - 10:00", "title": "Morning Commute", "host": "Alex Johnson" }, { "time": "10:00 - 12:00", "title": "New Music Wednesday", "host": "Samantha Bee" } ] },
    { "day": "Thursday", "schedule": [ { "time": "08:00 - 10:00", "title": "Sunrise Sessions", "host": "Maria Garcia" }, { "time": "10:00 - 12:00", "title": "Throwback Thursday", "host": "David Chen" } ] },
    { "day": "Friday", "schedule": [ { "time": "08:00 - 10:00", "title": "Morning Commute", "host": "Alex Johnson" }, { "time": "10:00 - 12:00", "title": "Friday Feelings", "host": "Samantha Bee" } ] },
    { "day": "Saturday", "schedule": [ { "time": "09:00 - 11:00", "title": "Saturday Brunch", "host": "Various" }, { "time": "11:00 - 13:00", "title": "The Chart Show", "host": "Leo Maxwell" } ] },
    { "day": "Sunday", "schedule": [ { "time": "09:00 - 11:00", "title": "Easy Like Sunday Morning", "host": "Chloe Adams" }, { "time": "11:00 - 13:00", "title": "The Jazz Lounge", "host": "Marcus Cole" } ] }
  ],
  "teamMembers": [
    { "id": "demo-member-1", "order": 1, "name": "Alex Johnson", "role": "Morning Commute", "image": "https://placehold.co/300x300.png", "hint": "male portrait", "facebookUrl": "https://facebook.com", "instagramUrl": "https://instagram.com", "twitterUrl": "https://x.com" },
    { "id": "demo-member-2", "order": 2, "name": "Samantha Bee", "role": "Indie Vibes", "image": "https://placehold.co/300x300.png", "hint": "female portrait", "facebookUrl": "https://facebook.com", "instagramUrl": "https://instagram.com", "twitterUrl": "https://x.com" },
    { "id": "demo-member-3", "order": 3, "name": "Mike Richards", "role": "Lunchtime Classics", "image": "https://placehold.co/300x300.png", "hint": "male portrait smiling", "facebookUrl": "https://facebook.com", "instagramUrl": "https://instagram.com", "twitterUrl": "https://x.com" },
    { "id": "demo-member-4", "order": 4, "name": "Jessica Wu", "role": "Afternoon Chill", "image": "https://placehold.co/300x300.png", "hint": "female portrait glasses", "facebookUrl": "https://facebook.com", "instagramUrl": "https://instagram.com", "twitterUrl": "https://x.com" },
    { "id": "demo-member-5", "order": 5, "name": "Chris Green", "role": "Drive Time Power Mix", "image": "https://placehold.co/300x300.png", "hint": "male portrait headphones", "facebookUrl": "https://facebook.com", "instagramUrl": "https://instagram.com", "twitterUrl": "https://x.com" },
    { "id": "demo-member-6", "order": 6, "name": "Maria Garcia", "role": "Sunrise Sessions", "image": "https://placehold.co/300x300.png", "hint": "female portrait smiling", "facebookUrl": "https://facebook.com", "instagramUrl": "https://instagram.com", "twitterUrl": "https://x.com" }
  ],
  "recordedShows": [
    { "id": "demo-show-1", "date": "July 14, 2024", "title": "Indie Vibes Ep. 12: Summer Sounds", "host": "Samantha Bee", "duration": "45 min", "description": "A mix of the best new indie tracks perfect for a summer day. Featuring interviews with upcoming artists.", "imageUrl": "https://placehold.co/600x400.png", "imageHint": "indie music" },
    { "id": "demo-show-2", "date": "July 12, 2024", "title": "Tech Talk Ep. 8: The Future of AI", "host": "David Chen", "duration": "60 min", "description": "Exploring the latest advancements in Artificial Intelligence and its impact on our daily lives.", "imageUrl": "https://placehold.co/600x400.png", "imageHint": "tech podcast" },
    { "id": "demo-show-3", "date": "July 10, 2024", "title": "Global Grooves Ep. 5: Rhythms of Brazil", "host": "Fatima Khan", "duration": "55 min", "description": "A journey through the vibrant and diverse music of Brazil, from Samba to Bossa Nova.", "imageUrl": "https://placehold.co/600x400.png", "imageHint": "brazil carnival" },
    { "id": "demo-show-4", "date": "July 8, 2024", "title": "Throwback Thursday: 90s Hip-Hop Special", "host": "David Chen", "duration": "90 min", "description": "Revisiting the golden age of Hip-Hop with classic tracks and forgotten gems from the 1990s.", "imageUrl": "https://placehold.co/600x400.png", "imageHint": "hip hop" }
  ],
  "invitationCodes": [
    { "code": "KUSFM2024", "used": false }
  ],
  "sponsors": [
    { "id": "demo-sponsor-1", "order": 1, "name": "Café del Sol", "imageUrl": "https://placehold.co/300x150.png", "hint": "coffee shop", "websiteUrl": "#", "level": "platinum" },
    { "id": "demo-sponsor-2", "order": 2, "name": "Vinilos & Más", "imageUrl": "https://placehold.co/300x150.png", "hint": "vinyl records", "websiteUrl": "#", "level": "gold" },
    { "id": "demo-sponsor-3", "order": 3, "name": "Tech Gadgets", "imageUrl": "https://placehold.co/300x150.png", "hint": "gadgets tech", "websiteUrl": "#", "level": "silver" }
  ],
  "campaigns": [
      { "id": "demo-campaign-1", "date": "July 30, 2024", "title": "Concurso de Verano", "description": "¡Gana entradas para el festival de música de verano! Sintoniza para saber cómo participar.", "icon": "Trophy" },
      { "id": "demo-campaign-2", "date": "August 15, 2024", "title": "Especial de Aniversario", "description": "Celebramos nuestro tercer aniversario con programas especiales y entrevistas exclusivas todo el día.", "icon": "Gift" },
      { "id": "demo-campaign-3", "date": "September 1, 2024", "title": "Maratón de Talento Local", "description": "Un día completo dedicado a la música de artistas emergentes de nuestra comunidad. ¡Apoya lo local!", "icon": "Mic" }
  ],
  "heroSlides": [
      { "id": "demo-slide-1", "order": 1, "title": "Tu Sonido, Tu Estación", "description": "Descubre la mejor música y programas en vivo, 24/7. Sintoniza ahora y únete a la comunidad.", "imageUrl": "https://placehold.co/1920x1080.png", "imageHint": "radio waves", "buttonText": "Escuchar en Vivo", "buttonLink": "#" },
      { "id": "demo-slide-2", "order": 2, "title": "Venos en Video", "description": "La experiencia completa, ahora en video. Mira nuestros programas en vivo desde el estudio.", "imageUrl": "https://placehold.co/1920x1080.png", "imageHint": "live studio", "buttonText": "Ver Stream", "buttonLink": "/video" },
      { "id": "demo-slide-3", "order": 3, "title": "Únete a Nuestro Equipo", "description": "¿Tienes una idea para un programa? Buscamos nuevas voces para unirse a nuestra familia.", "imageUrl": "https://placehold.co/1920x1080.png", "imageHint": "microphone professional", "buttonText": "Aplica Ahora", "buttonLink": "/unete" }
  ],
  "siteSettings": {
    "radioProvider": "azuracast",
    "streamUrl": "https://radio.trabullnetwork.pro/listen/estacionkusfm/radio.mp3",
    "azuracastBaseUrl": "https://radio.trabullnetwork.pro",
    "azuracastStationId": "estacionkusfm",
    "azuracastApiKey": "20489200b1699478:6e6ba9ff38fc0d8c6a19906244a5bbcb",
    "zenoStationUuid": "",
    "live365StationId": "",
    "showDocsLink": true,
    "hlsStreamUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    "streamServer": "stream.example.com",
    "streamPort": "8000",
    "streamPassword": "changeme",
    "learningSpaceAccessCode": "KUSFMLAB"
  }
};

async function clearCollection(collectionName: string) {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where('id', 'like', 'demo-%'));
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) return;
    
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        // Double-check to only delete demo data
        if (doc.id.startsWith('demo-')) {
            batch.delete(doc.ref);
        }
    });
    await batch.commit();
}

export async function POST() {
    try {
        const batch = writeBatch(db);

        // This operation is now idempotent. It uses specific IDs for demo content,
        // so running it again will just overwrite the same documents.
        
        firestoreData.blogPosts.forEach(post => {
            const { id, date, ...rest } = post;
            const docRef = doc(db, 'blogPosts', id);
            batch.set(docRef, {
                ...rest,
                publishDate: Timestamp.fromDate(parseDate(date)),
            });
        });

        firestoreData.topSongs.forEach(song => {
            const { id, ...rest } = song;
            const docRef = doc(db, 'topSongs', id);
            batch.set(docRef, rest);
        });

        firestoreData.weeklySchedule.forEach(daySchedule => {
            const docRef = doc(db, 'weeklySchedule', daySchedule.day);
            batch.set(docRef, { schedule: daySchedule.schedule });
        });
        
        firestoreData.teamMembers.forEach(member => {
            const { id, ...rest } = member;
            const docRef = doc(db, 'teamMembers', id);
            batch.set(docRef, rest);
        });

        firestoreData.recordedShows.forEach(show => {
            const { id, date, ...rest } = show;
            const docRef = doc(db, 'recordedShows', id);
            batch.set(docRef, {
                ...rest,
                publishDate: Timestamp.fromDate(parseDate(date)),
            });
        });

        // We only add the initial code if it doesn't exist, to avoid overwriting a used one
        const codeQuery = query(collection(db, "invitationCodes"), where("code", "==", "KUSFM2024"));
        const codeSnapshot = await getDocs(codeQuery);
        if (codeSnapshot.empty) {
            firestoreData.invitationCodes.forEach(code => {
                const docRef = doc(collection(db, 'invitationCodes'));
                batch.set(docRef, { 
                    ...code, 
                    createdAt: Timestamp.now(),
                    usedBy: null,
                    usedAt: null,
                });
            });
        }


        firestoreData.sponsors.forEach(sponsor => {
            const { id, ...rest } = sponsor;
            const docRef = doc(db, 'sponsors', id);
            batch.set(docRef, rest);
        });

        firestoreData.campaigns.forEach(campaign => {
            const { id, date, ...rest } = campaign;
            const docRef = doc(db, 'campaigns', id);
            batch.set(docRef, {
                ...rest,
                date: Timestamp.fromDate(parseDate(date)),
            });
        });

        firestoreData.heroSlides.forEach(slide => {
            const { id, ...rest } = slide;
            const docRef = doc(db, 'heroSlides', id);
            batch.set(docRef, rest);
        });

        const settingsRef = doc(db, 'siteSettings', 'config');
        batch.set(settingsRef, firestoreData.siteSettings);


        await batch.commit();

        return NextResponse.json({ message: "Base de datos inicializada con éxito." }, { status: 200 });

    } catch (error: any) {
        console.error("Error seeding database:", error);
        return NextResponse.json({ message: "Error interno del servidor al inicializar la base de datos.", error: error.message }, { status: 500 });
    }
}
