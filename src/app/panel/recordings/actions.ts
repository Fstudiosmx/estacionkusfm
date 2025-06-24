"use server";

import { z } from "zod";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  host: z.string().min(2, "El presentador es requerido."),
  date: z.string().min(1, "La fecha es requerida."),
  duration: z.string().min(3, "La duración es requerida."),
  description: z.string().min(10, "La descripción es requerida."),
  imageUrl: z.string().url("Debe ser una URL válida."),
  imageHint: z.string().optional(),
});

export type RecordingFormValues = z.infer<typeof formSchema>;

export async function upsertRecording(data: RecordingFormValues) {
  const validatedData = formSchema.parse(data);
  const { id, ...recordingData } = validatedData;

  try {
    if (id) {
      const recordingRef = doc(db, "recordedShows", id);
      await updateDoc(recordingRef, recordingData);
    } else {
      await addDoc(collection(db, "recordedShows"), recordingData);
    }
    revalidatePath("/panel/recordings");
    revalidatePath("/grabaciones");
  } catch (error) {
    console.error("Error upserting recording:", error);
    throw new Error("No se pudo guardar la grabación en la base de datos.");
  }
}

export async function deleteRecording(id: string) {
    if (!id) {
        throw new Error("Se requiere un ID para eliminar la grabación.");
    }
    try {
        const recordingRef = doc(db, "recordedShows", id);
        await deleteDoc(recordingRef);
        revalidatePath("/panel/recordings");
        revalidatePath("/grabaciones");
    } catch (error) {
        console.error("Error deleting recording:", error);
        throw new Error("No se pudo eliminar la grabación de la base de datos.");
    }
}
