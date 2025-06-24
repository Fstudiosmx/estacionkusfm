"use server";

import { z } from "zod";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre es requerido."),
  websiteUrl: z.string().url("Debe ser una URL válida."),
  imageUrl: z.string().url("Debe ser una URL de imagen válida."),
  hint: z.string().optional(),
  level: z.enum(["platinum", "gold", "silver"], {
    errorMap: () => ({ message: "Debes seleccionar un nivel." }),
  }),
  order: z.coerce.number().min(1, "El orden es requerido."),
});

export type SponsorFormValues = z.infer<typeof formSchema>;

export async function upsertSponsor(data: SponsorFormValues) {
  const validatedData = formSchema.parse(data);
  const { id, ...sponsorData } = validatedData;

  try {
    if (id) {
      const sponsorRef = doc(db, "sponsors", id);
      await updateDoc(sponsorRef, sponsorData);
    } else {
      await addDoc(collection(db, "sponsors"), sponsorData);
    }
    revalidatePath("/panel/sponsors");
    revalidatePath("/");
  } catch (error) {
    console.error("Error upserting sponsor:", error);
    throw new Error("No se pudo guardar el patrocinador en la base de datos.");
  }
}

export async function deleteSponsor(id: string) {
    if (!id) {
        throw new Error("Se requiere un ID para eliminar al patrocinador.");
    }
    try {
        const sponsorRef = doc(db, "sponsors", id);
        await deleteDoc(sponsorRef);
        revalidatePath("/panel/sponsors");
        revalidatePath("/");
    } catch (error) {
        console.error("Error deleting sponsor:", error);
        throw new Error("No se pudo eliminar al patrocinador de la base de datos.");
    }
}
