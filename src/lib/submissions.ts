
"use server";

import { z } from "zod";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const requestSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  songTitle: z.string().min(1, "El título de la canción es requerido."),
  songArtist: z.string().min(1, "El artista es requerido."),
});

const shoutoutSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  message: z.string().min(1, "El mensaje es requerido."),
});

export async function submitSongRequest(data: z.infer<typeof requestSchema>) {
  const validatedData = requestSchema.parse(data);

  try {
    await addDoc(collection(db, "userSubmissions"), {
      ...validatedData,
      type: "request",
      createdAt: Timestamp.now(),
      isRead: false,
    });
  } catch (error) {
    console.error("Error submitting song request:", error);
    throw new Error("No se pudo enviar la petición.");
  }
}

export async function submitShoutout(data: z.infer<typeof shoutoutSchema>) {
  const validatedData = shoutoutSchema.parse(data);

  try {
    await addDoc(collection(db, "userSubmissions"), {
      ...validatedData,
      type: "shoutout",
      createdAt: Timestamp.now(),
      isRead: false,
    });
  } catch (error) {
    console.error("Error submitting shoutout:", error);
    throw new Error("No se pudo enviar el saludo.");
  }
}
