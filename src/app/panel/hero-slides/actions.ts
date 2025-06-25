
"use server";

import { z } from "zod";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "El título es requerido."),
  description: z.string().min(2, "La descripción es requerida."),
  imageUrl: z.string().url("Debe ser una URL de imagen válida."),
  imageHint: z.string().optional(),
  order: z.coerce.number().min(1, "El orden es requerido."),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
}).refine(data => (data.buttonText && data.buttonLink) || (!data.buttonText && !data.buttonLink), {
  message: "El texto y el enlace del botón deben ir juntos.",
  path: ["buttonText"],
});


export type SlideFormValues = z.infer<typeof formSchema>;

export async function upsertSlide(data: SlideFormValues) {
  const validatedData = formSchema.parse(data);
  const { id, ...slideData } = validatedData;

  try {
    if (id) {
      const slideRef = doc(db, "heroSlides", id);
      await updateDoc(slideRef, slideData);
    } else {
      await addDoc(collection(db, "heroSlides"), slideData);
    }
    revalidatePath("/panel/hero-slides");
    revalidatePath("/");
  } catch (error) {
    console.error("Error upserting slide:", error);
    throw new Error("No se pudo guardar la diapositiva en la base de datos.");
  }
}

export async function deleteSlide(id: string) {
    if (!id) {
        throw new Error("Se requiere un ID para eliminar la diapositiva.");
    }
    try {
        const slideRef = doc(db, "heroSlides", id);
        await deleteDoc(slideRef);
        revalidatePath("/panel/hero-slides");
        revalidatePath("/");
    } catch (error) {
        console.error("Error deleting slide:", error);
        throw new Error("No se pudo eliminar la diapositiva de la base de datos.");
    }
}
