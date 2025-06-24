"use server";

import { z } from "zod";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  id: z.string().optional(),
  rank: z.coerce.number().min(1, "El ranking es requerido."),
  title: z.string().min(1, "El título es requerido."),
  artist: z.string().min(1, "El artista es requerido."),
  coverArt: z.string().url("Debe ser una URL válida."),
  coverArtHint: z.string().optional().default(""),
  youtubeVideoId: z.string().optional().default(""),
  spotifyLink: z.string().url("URL de Spotify no válida").optional().or(z.literal('')),
  appleMusicLink: z.string().url("URL de Apple Music no válida").optional().or(z.literal('')),
  youtubeMusicLink: z.string().url("URL de YouTube Music no válida").optional().or(z.literal('')),
});

export type SongFormValues = z.infer<typeof formSchema>;

export async function upsertTopSong(data: SongFormValues) {
  const validatedData = formSchema.parse(data);
  
  const { id, ...songData } = validatedData;
  const dataToSave = { ...songData, externalLink: "#" };

  try {
    if (id) {
      const songRef = doc(db, "topSongs", id);
      await updateDoc(songRef, dataToSave);
    } else {
      await addDoc(collection(db, "topSongs"), dataToSave);
    }
    revalidatePath("/panel/top-songs");
    revalidatePath("/");
  } catch (error) {
    console.error("Error upserting top song:", error);
    throw new Error("No se pudo guardar la canción en la base de datos.");
  }
}

export async function deleteTopSong(id: string) {
    if (!id) {
        throw new Error("Se requiere un ID para eliminar la canción.");
    }

    try {
        const postRef = doc(db, "topSongs", id);
        await deleteDoc(postRef);
        
        revalidatePath("/panel/top-songs");
        revalidatePath("/");
    } catch (error) {
        console.error("Error deleting top song:", error);
        throw new Error("No se pudo eliminar la canción de la base de datos.");
    }
}
