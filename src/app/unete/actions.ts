
"use server";

import { z } from "zod";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const joinFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce una dirección de correo electrónico válida." }),
  showIdea: z.string().min(10, { message: "La idea del programa debe tener al menos 10 caracteres." }),
  message: z.string().optional(),
});

export async function submitJoinApplication(values: z.infer<typeof joinFormSchema>) {
  const validatedData = joinFormSchema.parse(values);

  try {
    await addDoc(collection(db, "joinSubmissions"), {
      ...validatedData,
      createdAt: Timestamp.now(),
      isReviewed: false,
    });

    return { success: true, message: "¡Solicitud Enviada! Gracias por tu interés. Nos pondremos en contacto pronto." };

  } catch (error) {
    console.error("Error submitting application:", error);
    return { success: false, message: "Ocurrió un error al enviar tu solicitud. Por favor, inténtalo de nuevo más tarde." };
  }
}
