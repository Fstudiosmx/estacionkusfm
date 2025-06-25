
"use server";

import { z } from "zod";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre es requerido."),
  role: z.string().min(2, "El rol es requerido."),
  image: z.string().url("Debe ser una URL válida."),
  hint: z.string().optional(),
  order: z.coerce.number().min(1, "El orden es requerido."),
  facebookUrl: z.string().url("URL de Facebook no válida").optional().or(z.literal('')),
  instagramUrl: z.string().url("URL de Instagram no válida").optional().or(z.literal('')),
  twitterUrl: z.string().url("URL de Twitter/X no válida").optional().or(z.literal('')),
});

export type TeamMemberFormValues = z.infer<typeof formSchema>;

export async function upsertTeamMember(data: TeamMemberFormValues) {
  const validatedData = formSchema.parse(data);
  const { id, ...memberData } = validatedData;

  try {
    if (id) {
      const memberRef = doc(db, "teamMembers", id);
      await updateDoc(memberRef, memberData);
    } else {
      await addDoc(collection(db, "teamMembers"), memberData);
    }
    revalidatePath("/panel/team");
    revalidatePath("/nosotros");
    revalidatePath("/team/[id]", "layout");
  } catch (error) {
    console.error("Error upserting team member:", error);
    throw new Error("No se pudo guardar el miembro del equipo en la base de datos.");
  }
}

export async function deleteTeamMember(id: string) {
    if (!id) {
        throw new Error("Se requiere un ID para eliminar el miembro del equipo.");
    }
    try {
        const memberRef = doc(db, "teamMembers", id);
        await deleteDoc(memberRef);
        revalidatePath("/panel/team");
        revalidatePath("/nosotros");
    } catch (error) {
        console.error("Error deleting team member:", error);
        throw new Error("No se pudo eliminar el miembro del equipo de la base de datos.");
    }
}
