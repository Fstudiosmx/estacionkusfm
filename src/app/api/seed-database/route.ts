import { NextResponse } from 'next/server';
import { collection, getDocs, writeBatch, limit, query, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const firestoreData = {
  "blogPosts": [
    { "id": 1, "title": "Detrás del Micrófono: Una Entrevista con Alex Johnson", "author": "Jane Doe", "date": "15 de Julio, 2024", "excerpt": "Nos sentamos con el presentador de 'Morning Commute' para hablar sobre su trayectoria en la radio, su música favorita y lo que lo despierta por la mañana.", "content": "En esta charla exclusiva, Alex Johnson comparte sus inicios en el mundo de la radio, desde sus días en la radio universitaria hasta convertirse en una de las voces más reconocidas de las mañanas. Hablamos de los retos de la transmisión en vivo, la importancia de conectar con la audiencia y sus momentos más memorables al aire. Además, nos revela su proceso para descubrir nueva música y qué artistas no pueden faltar en su playlist personal. Una conversación íntima que te permitirá conocer al hombre detrás del micrófono.", "imageUrl": "https://placehold.co/600x400.png", "category": "Entrevistas" },
    { "id": 2, "title": "El Auge del Indie Pop: Una Mirada a la Escena Actual", "author": "John Smith", "date": "10 de Julio, 2024", "excerpt": "El indie pop ha conquistado las ondas de radio. Exploramos los artistas y sonidos que definen el género en la década de 2020.", "content": "Desde sus raíces alternativas hasta su actual dominio en las listas de popularidad, el indie pop ha demostrado ser más que una moda pasajera. En este artículo, analizamos las características que definen el sonido actual, la influencia de las plataformas de streaming en su difusión y cómo los artistas independientes están redefiniendo las reglas de la industria musical. Presentamos a algunos de los actos más prometedores y repasamos los álbumes que están marcando el pulso de esta vibrante escena musical.", "imageUrl": "https://placehold.co/600x400.png", "category": "Música" },
    { "id": 3, "title": "Nuestros 5 Álbumes Favoritos del Año (Hasta Ahora)", "author": "Staff de EstacionKusFM", "date": "5 de Julio, 2024", "excerpt": "El año ya va por la mitad, y estamos resumiendo los mejores álbumes que han estado en repetición en el estudio de EstacionKusFM.", "content": "La primera mitad del año nos ha regalado una increíble cantidad de música excepcional. El equipo de EstacionKusFM ha debatido, votado y compilado una lista de los cinco álbumes que consideramos imprescindibles. Desde debuts sorprendentes hasta trabajos consagrados de artistas reconocidos, nuestra selección abarca una variedad de géneros y estilos. Descubre cuáles son nuestros favoritos y por qué creemos que estos discos resistirán el paso del tiempo.", "imageUrl": "https://placehold.co/600x400.png", "category": "Reseñas" },
    { "id": 4, "title": "Cómo Apoyamos el Talento Local con Music Rally", "author": "Equipo Comunitario", "date": "28 de Junio, 2024", "excerpt": "Aprende más sobre nuestra campaña 'Local Music Rally' y los increíbles artistas que hemos presentado hasta ahora.", "content": "En EstacionKusFM, creemos firmemente en el poder de la comunidad y en la importancia de apoyar a los artistas locales. Nuestra iniciativa 'Local Music Rally' nació con el objetivo de dar visibilidad al talento emergente de nuestra ciudad. En este post, te contamos cómo funciona la campaña, compartimos algunas historias de éxito de músicos que han participado y te explicamos cómo puedes unirte, ya sea como artista o como oyente, para fortalecer nuestra escena musical local.", "imageUrl": "https://placehold.co/600x400.png", "category": "Campañas" }
  ],
  "topSongs": [
    { "id": 1, "rank": 1, "title": "Echoes of Tomorrow", "artist": "Starlight Sirens", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "abstract space", "externalLink": "#" },
    { "id": 2, "rank": 2, "title": "Midnight Drive", "artist": "Neon Bloom", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "neon city", "externalLink": "#" },
    { "id": 3, "rank": 3, "title": "Chasing the Sun", "artist": "The Voyagers", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "sunrise beach", "externalLink": "#" },
    { "id": 4, "rank": 4, "title": "Velvet Horizon", "artist": "Aurora Haze", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "purple sunset", "externalLink": "#" },
    { "id": 5, "rank": 5, "title": "Crystal Clear", "artist": "Glass Animals", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "crystal prism", "externalLink": "#" },
    { "id": 6, "rank": 6, "title": "Lost in the Sound", "artist": "Wanderlust", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "person headphones", "externalLink": "#" },
    { "id": 7, "rank": 7, "title": "Retrograde", "artist": "Cosmic Drift", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "retro wave", "externalLink": "#" },
    { "id": 8, "rank": 8, "title": "City Lights", "artist": "Urban Glow", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "city night", "externalLink": "#" },
    { "id": 9, "rank": 9, "title": "Ocean Deep", "artist": "Tidal Waves", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "deep ocean", "externalLink": "#" },
    { "id": 10, "rank": 10, "title": "Solar Flare", "artist": "Galaxy Runners", "coverArt": "https://placehold.co/100x100.png", "coverArtHint": "solar flare", "externalLink": "#", "youtubeVideoId": "jfKfPfyJRdk", "spotifyLink": "#", "appleMusicLink": "#", "youtubeMusicLink": "#" }
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
    { "order": 1, "name": "Alex Johnson", "role": "Morning Commute", "image": "https://placehold.co/300x300.png", "hint": "male portrait" },
    { "order": 2, "name": "Samantha Bee", "role": "Indie Vibes", "image": "https://placehold.co/300x300.png", "hint": "female portrait" },
    { "order": 3, "name": "Mike Richards", "role": "Lunchtime Classics", "image": "https://placehold.co/300x300.png", "hint": "male portrait smiling" },
    { "order": 4, "name": "Jessica Wu", "role": "Afternoon Chill", "image": "https://placehold.co/300x300.png", "hint": "female portrait glasses" },
    { "order": 5, "name": "Chris Green", "role": "Drive Time Power Mix", "image": "https://placehold.co/300x300.png", "hint": "male portrait headphones" },
    { "order": 6, "name": "Maria Garcia", "role": "Sunrise Sessions", "image": "https://placehold.co/300x300.png", "hint": "female portrait smiling" }
  ],
  "recordedShows": [
    { "date": "July 14, 2024", "title": "Indie Vibes Ep. 12: Summer Sounds", "host": "Samantha Bee", "duration": "45 min", "description": "A mix of the best new indie tracks perfect for a summer day. Featuring interviews with upcoming artists.", "imageUrl": "https://placehold.co/600x400.png", "imageHint": "indie music" },
    { "date": "July 12, 2024", "title": "Tech Talk Ep. 8: The Future of AI", "host": "David Chen", "duration": "60 min", "description": "Exploring the latest advancements in Artificial Intelligence and its impact on our daily lives.", "imageUrl": "https://placehold.co/600x400.png", "imageHint": "tech podcast" },
    { "date": "July 10, 2024", "title": "Global Grooves Ep. 5: Rhythms of Brazil", "host": "Fatima Khan", "duration": "55 min", "description": "A journey through the vibrant and diverse music of Brazil, from Samba to Bossa Nova.", "imageUrl": "https://placehold.co/600x400.png", "imageHint": "brazil carnival" },
    { "date": "July 8, 2024", "title": "Throwback Thursday: 90s Hip-Hop Special", "host": "David Chen", "duration": "90 min", "description": "Revisiting the golden age of Hip-Hop with classic tracks and forgotten gems from the 1990s.", "imageUrl": "https://placehold.co/600x400.png", "imageHint": "hip hop" }
  ],
  "invitationCodes": [
    { "code": "KUSFM2024", "used": false }
  ],
  "sponsors": [
    { "order": 1, "name": "Café del Sol", "imageUrl": "https://placehold.co/300x150.png", "hint": "coffee shop", "websiteUrl": "#", "level": "platinum" },
    { "order": 2, "name": "Vinilos & Más", "imageUrl": "https://placehold.co/300x150.png", "hint": "vinyl records", "websiteUrl": "#", "level": "gold" },
    { "order": 3, "name": "Tech Gadgets", "imageUrl": "https://placehold.co/300x150.png", "hint": "gadgets tech", "websiteUrl": "#", "level": "silver" }
  ]
};

export async function POST() {
    try {
        const checkQuery = query(collection(db, "blogPosts"), limit(1));
        const checkSnapshot = await getDocs(checkQuery);
        if (!checkSnapshot.empty) {
            return NextResponse.json({ message: "La base de datos ya contiene datos. La importación fue omitida para evitar duplicados." }, { status: 409 });
        }

        const batch = writeBatch(db);

        firestoreData.blogPosts.forEach(post => {
            const docRef = doc(collection(db, 'blogPosts'));
            batch.set(docRef, post);
        });

        firestoreData.topSongs.forEach(song => {
            const docRef = doc(collection(db, 'topSongs'));
            batch.set(docRef, song);
        });

        firestoreData.weeklySchedule.forEach(daySchedule => {
            const docRef = doc(db, 'weeklySchedule', daySchedule.day);
            batch.set(docRef, { schedule: daySchedule.schedule });
        });
        
        firestoreData.teamMembers.forEach(member => {
            const docRef = doc(collection(db, 'teamMembers'));
            batch.set(docRef, member);
        });

        firestoreData.recordedShows.forEach(show => {
            const docRef = doc(collection(db, 'recordedShows'));
            batch.set(docRef, show);
        });

        firestoreData.invitationCodes.forEach(code => {
            const docRef = doc(collection(db, 'invitationCodes'));
            batch.set(docRef, { 
                ...code, 
                createdAt: Timestamp.now(),
                usedBy: null,
                usedAt: null,
            });
        });

        firestoreData.sponsors.forEach(sponsor => {
            const docRef = doc(collection(db, 'sponsors'));
            batch.set(docRef, sponsor);
        });

        await batch.commit();

        return NextResponse.json({ message: "Base de datos inicializada con éxito." }, { status: 200 });

    } catch (error: any) {
        console.error("Error seeding database:", error);
        return NextResponse.json({ message: "Error interno del servidor al inicializar la base de datos.", error: error.message }, { status: 500 });
    }
}
